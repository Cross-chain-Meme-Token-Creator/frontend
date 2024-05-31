import { TransactionBlock } from "@mysten/sui.js/transactions";
import { WalletContextState } from "@suiet/wallet-kit";
import { Network, PlatformToChains, SignAndSendSigner, TxHash } from "@wormhole-foundation/sdk";
import { UnsignedTransaction, } from "@wormhole-foundation/sdk"

export const _platform: "Sui" = "Sui";
export type SuiPlatformType = typeof _platform;
export type SuiChains = PlatformToChains<SuiPlatformType>;

export class SuiUnsignedTransaction<N extends Network, C extends SuiChains>
    implements UnsignedTransaction<N, C> {
    constructor(
        readonly transaction: TransactionBlock,
        readonly network: N,
        readonly chain: C,
        readonly description: string,
        readonly parallelizable: boolean = false,
    ) { }
}

export class SuiWalletSigner<N extends Network, C extends SuiChains> implements SignAndSendSigner<N, C> {
    constructor(
        private _suiWallet: WalletContextState,
        private _debug?: boolean,
    ) { }

    chain(): C {
        return "Sui" as C
    }

    address(): string {
        return this._suiWallet.address ?? "";
    }

    async signAndSend(txns: UnsignedTransaction[]): Promise<TxHash[]> {
        const txids: TxHash[] = [];
        for (const tx of txns) {
            const { description, transaction } = tx as SuiUnsignedTransaction<N, C>;
            if (this._debug) console.log(`Signing ${description} for ${this.address()}`);

            const result = await this._suiWallet.signAndExecuteTransactionBlock({
                transactionBlock: transaction,
            });

            txids.push(result.digest);
        }
        return txids;
    }
}