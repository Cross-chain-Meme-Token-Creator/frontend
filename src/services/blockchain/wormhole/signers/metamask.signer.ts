import { SDKState } from "@metamask/sdk-react-ui"
import { Network } from "@wormhole-foundation/sdk-base"
import {
    SignAndSendSigner,
    TxHash,
    UnsignedTransaction,
} from "@wormhole-foundation/sdk-definitions"
import { EvmChains, EvmUnsignedTransaction } from "@wormhole-foundation/sdk-evm"
import { ethers } from "ethers"

export class MetamaskWalletSigner<N extends Network, C extends EvmChains>
implements SignAndSendSigner<N, C> {
    constructor(
        private _chain: C,
        private _metamaskWallet: SDKState,
        private _network: N,
        private _debug?: boolean
    ) { }

    chain(): C {
        return this._chain
    }

    address(): string {
        return this._metamaskWallet.account ?? ""
    }

    async signAndSend(txns: UnsignedTransaction[]): Promise<TxHash[]> {
        const txids: TxHash[] = []
        for (const tx of txns) {
            const { description, transaction } = tx as EvmUnsignedTransaction<
                N,
                C
            >
            if (this._debug)
                console.log(`Signing ${description} for ${this.address()}`)
            const provider = this._metamaskWallet.sdk?.getProvider()
            if (!provider) throw new Error("Connect to MetaMask first")

            const ethersProvider = new ethers.BrowserProvider(provider)
            const signer = await ethersProvider.getSigner()
            const { hash } = await signer.sendTransaction(transaction)
            txids.push(hash)
        }
        return txids
    }
}
