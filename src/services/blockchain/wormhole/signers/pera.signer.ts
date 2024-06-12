import type {
    Network,
    SignedTx,
    UnsignedTransaction,
} from "@wormhole-foundation/sdk-connect"
import { PeraWalletConnect } from "@perawallet/connect"
import {
    AlgorandChains,
    AlgorandUnsignedTransaction,
} from "@wormhole-foundation/sdk-algorand"
import { SignAndSendSigner } from "@wormhole-foundation/sdk-definitions"
import {
    Algodv2,
    Transaction,
    assignGroupID,
    waitForConfirmation,
} from "algosdk"
import { getAlgodClient } from "../../algorand"
import { SignerTransaction } from "@perawallet/connect/dist/util/model/peraWalletModels"

export class PeraWalletSigner<N extends Network, C extends AlgorandChains>
implements SignAndSendSigner<N, C>
{
    private _algodClient: Algodv2

    constructor(
        private _peraWallet: PeraWalletConnect,
        private _address: string,
        private _network: N,
        private _debug: boolean = false
    ) {
        switch (this._network) {
        case "Testnet": {
            this._algodClient = getAlgodClient("Testnet")
            return
        }
        case "Mainnet": {
            this._algodClient = getAlgodClient("Mainnet")
            return
        }
        default: {
            throw new Error("Devnet is not supported")
        }
        }
    }

    chain(): C {
        return "Algorand" as C
    }

    address(): string {
        //return "ZLNCYK6I3PAOB74KDAPKFUKQPVNVYTUANAYJDIB3GJS6FYAC6XTZ3QL7GY"
        return this._address
    }

    async signAndSend(txns: UnsignedTransaction[]): Promise<SignedTx[]> {
        const txids: Array<SignedTx> = []

        const ungrouped = txns.map((txn) => {
            return txn.transaction.tx
        }) as Array<Transaction>

        const grouped = assignGroupID(ungrouped)

        const groupedUnsignedTxns = txns.map((txn, idx) => {
            txn.transaction.tx = grouped[idx]
            return txn
        }) as Array<AlgorandUnsignedTransaction<N, C>>

        const unsignedTxns: Array<SignerTransaction> = []

        for (const unsignedTxn of groupedUnsignedTxns) {
            const { transaction: tsp } = unsignedTxn
            const { tx } = tsp
            const txId = tx.txID()
            txids.push(txId)

            if (this._debug) {
                console.log(tx._getDictForDisplay())
                console.log(txId)
            }

            unsignedTxns.push({
                txn: tx,
                signers: [this.address()]
            })
        }

        const signedTxns = await this._peraWallet.signTransaction([unsignedTxns])
        const { txId } = await this._algodClient.sendRawTransaction(signedTxns).do()

        await waitForConfirmation(this._algodClient, txId, 15)

        return txids
    }
}
