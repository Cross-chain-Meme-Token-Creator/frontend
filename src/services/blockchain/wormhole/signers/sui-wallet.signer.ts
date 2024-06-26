import { TransactionBlock } from "@mysten/sui.js/transactions"
import { WalletContextState } from "@suiet/wallet-kit"
import { Network, SignAndSendSigner, TxHash, UnsignedTransaction } from "@wormhole-foundation/sdk"
import { SuiChains, SuiUnsignedTransaction } from "@wormhole-foundation/sdk-sui"


export class SuiWalletSigner<N extends Network, C extends SuiChains> implements SignAndSendSigner<N, C> {
    constructor(
        private _suiWallet: WalletContextState,
        private _network: N,
        private _debug?: boolean,
    ) { }

    chain(): C {
        return "Sui" as C
    }

    address(): string {
        return this._suiWallet.address ?? ""
    }

    async signAndSend(txns: Array<UnsignedTransaction>): Promise<Array<TxHash>> {
        const txids: TxHash[] = []
        for (const tx of txns) {
            const { description, transaction } = tx as SuiUnsignedTransaction<N, C>
            if (this._debug) console.log(`Signing ${description} for ${this.address()}`)

            const result = await this._suiWallet.signAndExecuteTransactionBlock({
                transactionBlock: transaction as unknown as TransactionBlock,
            })

            txids.push(result.digest)
        }
        return txids
    }
}