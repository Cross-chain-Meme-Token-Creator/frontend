import type {
    Network,
    SignedTx,
    UnsignedTransaction,
} from "@wormhole-foundation/sdk-connect"
import { PeraWalletConnect } from "@perawallet/connect"
import {
    AlgorandChains,
    TransactionSignerPair,
} from "@wormhole-foundation/sdk-algorand"
import { SignAndSendSigner } from "@wormhole-foundation/sdk-definitions"
import { Algodv2, Transaction, assignGroupID, mnemonicToSecretKey, waitForConfirmation } from "algosdk"
import { getAlgodClient } from "../../algorand"

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
        return "ZLNCYK6I3PAOB74KDAPKFUKQPVNVYTUANAYJDIB3GJS6FYAC6XTZ3QL7GY"
        //return this._address
    }
    
    async signAndSend(txns: UnsignedTransaction[]): Promise<SignedTx[]> {
    //     if (!this._peraWallet.isConnected)
    //         throw new Error("Pera Wallet is not connected")

        //     const txids: TxHash[] = []

        //     const ungrouped = txns.map((txn) => {
        //         const { transaction } = txn as AlgorandUnsignedTransaction<N, C>
        //         return transaction.tx
        //     })
        //     const grouped = assignGroupID(ungrouped)

        //     const groupedUnsignedTxns = txns.map((txn, idx) => {
        //         txn.transaction.tx = grouped[idx]
        //         return txn
        //     }) as  Array<AlgorandUnsignedTransaction<N, C>>

        //     const txGroups: Array<SignerTransaction> = groupedUnsignedTxns.map(({transaction}) => ({
        //         txn: transaction.tx
        //     }))

        //     const signedTxns = await this._peraWallet.signTransaction([ txGroups ])

        //     const { txId } = await this._algodClient
        //         .sendRawTransaction(signedTxns)
        //         .do()

        //     await waitForConfirmation(this._algodClient, txId, 3)

        //     return txids
        const signed: Uint8Array[] = []
        const ungrouped = txns.map((val, idx) => {
            return val.transaction.tx
        })
        const grouped = assignGroupID(ungrouped)

        // Replace the ungrouped Transactions with grouped Transactions
        const groupedAlgoUnsignedTxns = txns.map((val, idx) => {
            val.transaction.tx = grouped[idx]
            return val
        })

        let lastTx: Transaction | undefined

        for (const algoUnsignedTxn of groupedAlgoUnsignedTxns) {
            const { description, transaction: tsp } = algoUnsignedTxn
            const { tx, signer } = tsp as TransactionSignerPair

            if (this._debug) {
                console.log(tx._getDictForDisplay())
                console.log(tx.txID())
            }

            const _aaa = mnemonicToSecretKey("solve youth payment gasp swallow document spoil just aim ancient control cotton anger miss multiply siren laugh shoulder lonely embody penalty term comic abstract between")
            if (signer) {
                if (this._debug)
                    console.log(
                        `Signing: ${description} with signer ${signer.address} for address ${this.address()}`,
                    )
                signed.push(await signer.signTxn(tx))
            } else {
                if (this._debug)
                    console.log(`Signing: ${description} without signer for address ${this.address()}`)
                signed.push(tx.signTxn(_aaa.sk))
            }

            lastTx = tx
        }

        if (!lastTx) throw new Error("No transaction signed")
        const txId = lastTx.txID()

        console.log(groupedAlgoUnsignedTxns.length)

        await this._algodClient
            .sendRawTransaction(signed)
            .do()

        await waitForConfirmation(this._algodClient, txId, 3)

        return [ txId ]
    }
}

