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
import { SignAndSendSigner, TxHash } from "@wormhole-foundation/sdk-definitions"
import { Algodv2, waitForConfirmation } from "algosdk"
import { getAlgodClient } from "../../algorand"

export class PeraWalletSigner<N extends Network, C extends AlgorandChains>
implements SignAndSendSigner<N, C>
{
    private _algodClient: Algodv2

    constructor(
        private _peraWallet: PeraWalletConnect,
        private _algorandAddress: string,
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
        return this._algorandAddress
    }

    async signAndSend(txns: UnsignedTransaction[]): Promise<SignedTx[]> {
        if (!this._peraWallet.isConnected)
            throw new Error("Pera Wallet is not connected")

        const txids: TxHash[] = []
        for (const txn of txns) {
            const { description, transaction } =
                txn as AlgorandUnsignedTransaction<N, C>
            if (this._debug)
                console.log(`Signing ${description} for ${this.address()}`)

            const { tx } = transaction
            const signedTxns = await this._peraWallet.signTransaction([
                [
                    {
                        txn: tx,
                        //signers: [this.address()],
                    },
                ],
            ])
            const { txId } = await this._algodClient
                .sendRawTransaction(signedTxns)
                .do()

            await waitForConfirmation(this._algodClient, txId, 3)

            txids.push(txId)
        }

        return txids
    }
}
