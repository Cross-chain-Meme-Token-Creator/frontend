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
import { WithIdx, pushPositionedElementsToArray } from "@common"

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
        return this._address
    }

    async signAndSend(
        txns: Array<UnsignedTransaction>
    ): Promise<Array<SignedTx>> {
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

        const signedTxnWithIdxs: Array<WithIdx<Uint8Array>> = []

        for (let i = 0; i < groupedUnsignedTxns.length; i++) {
            const unsignedTxn = groupedUnsignedTxns.at(i)!

            const { description, transaction: tsp } = unsignedTxn
            const { tx, signer } = tsp
            const txId = tx.txID()
            txids.push(txId)

            if (this._debug) {
                console.log(`Signing ${description} for ${this.address()}`)
            }

            if (signer) {
                const signedTxn = await signer.signTxn(tx)
                signedTxnWithIdxs.push({
                    idx: i,
                    data: signedTxn,
                })
            }

            unsignedTxns.push({
                txn: tx,
                signers: signer ? [signer.address] : [],
            })
        }

        const signedTxns = await this._peraWallet.signTransaction([
            unsignedTxns,
        ])

        const { txId } = await this._algodClient
            .sendRawTransaction(
                pushPositionedElementsToArray(signedTxnWithIdxs, signedTxns)
            )
            .do()

        await waitForConfirmation(this._algodClient, txId, 15)

        return txids
    }
}
