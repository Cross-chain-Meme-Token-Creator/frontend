import type {
    Network,
    SignOnlySigner,
    SignedTx,
    Signer,
    UnsignedTransaction,
} from "@wormhole-foundation/sdk-connect"
import { PeraWalletConnect } from "@perawallet/connect"
import { AlgorandChains, AlgorandUnsignedTransaction } from "@wormhole-foundation/sdk-algorand"
import { TxHash } from "@wormhole-foundation/sdk-definitions"
import { Algodv2 } from "algosdk"

export class AlgorandSigner<N extends Network, C extends AlgorandChains>
    implements SignOnlySigner<N, C>
{
    private algod : Algodv2

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

    async sign(txns: UnsignedTransaction[]): Promise<SignedTx[]> {
        const txids: TxHash[] = [];
        for (const txn of txns) {
            const { description, transaction } = txn as AlgorandUnsignedTransaction<N, C>;
            if (this._debug) console.log(`Signing ${description} for ${this.address()}`);
            
            const { tx } = transaction
            const signedTxGroups = await this._peraWallet.signTransaction([[
                {
                    txn: tx,
                    signers: [ this.address() ]
                }
            ]])
            const {txId} = await sendRawTransaction(signedTxnGroup).do();
        }
        
    }
}
