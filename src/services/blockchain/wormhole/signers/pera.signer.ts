import type {
    Network,
    SignOnlySigner,
    SignedTx,
    Signer,
    UnsignedTransaction,
} from "@wormhole-foundation/sdk-connect"
import algosdk from "algosdk"
import { assignGroupID, mnemonicToSecretKey } from "algosdk"
import { PlatformToChains } from "@wormhole-foundation/sdk-base"
import type { Transaction } from "algosdk"
import { PeraWalletConnect } from "@perawallet/connect"

export const _platform: "Algorand" = "Algorand"
export type AlgorandPlatformType = typeof _platform
export type AlgorandChains = PlatformToChains<AlgorandPlatformType>

export type LsigSigner = {
    address: string
    signTxn(txn: Transaction): Promise<Uint8Array>
}

export type TransactionSignerPair = {
    tx: Transaction
    signer?: LsigSigner
}

export class AlgorandSigner<N extends Network, C extends AlgorandChains>
    implements SignOnlySigner<N, C>
{
    constructor(
        private _peraWallet: PeraWalletConnect,
        private _algorandAddress: string,
        private _debug: boolean = false
    ) {
    }

    chain(): C {
        return "Algorand" as C
    }

    address(): string {
        return this._algorandAddress
    }

    async sign(unsignedTxns: UnsignedTransaction[]): Promise<SignedTx[]> {
        if (!this._peraWallet.isConnected) throw new Error("Please connect to Pera Wallet first")
        const signed: Uint8Array[] = []
        const ungrouped = unsignedTxns.map((val, idx) => {
            return val.transaction.tx
        })
        const grouped = assignGroupID(ungrouped)

        const groupedAlgoUnsignedTxns = unsignedTxns.map((val, idx) => {
            val.transaction.tx = grouped[idx]
            return val
        })

        for (const algoUnsignedTxn of groupedAlgoUnsignedTxns) {
            const { description, transaction: tsp } = algoUnsignedTxn
            const { tx, signer } = tsp as TransactionSignerPair

            if (this._debug) {
                console.log(tx._getDictForDisplay())
                console.log(tx.txID())
            }

            // if (signer) {
            //     if (this._debug)
            //         console.log(
            //             `Signing: ${description} with signer ${
            //                 signer.address
            //             } for address ${this.address()}`
            //         )
            //     signed.push(await signer.signTxn(tx))
            // } else {
            //     if (this._debug)
            //         console.log(
            //             `Signing: ${description} without signer for address ${this.address()}`
            //         )
            //     signed.push(tx.signTxn(this._account.sk))
            // }
        }

        return signed
    }
}
