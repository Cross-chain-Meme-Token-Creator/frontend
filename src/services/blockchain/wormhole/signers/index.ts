import { SDKState } from "@metamask/sdk-react"
import { MetaMaskWalletSigner } from "../signers"
import { WalletContextState } from "@suiet/wallet-kit"
import { Chain, chainToPlatform } from "@wormhole-foundation/sdk-base"
import {
    SignAndSendSigner,
} from "@wormhole-foundation/sdk-definitions"
import { EvmChains } from "@wormhole-foundation/sdk-evm"
import { SuiWalletSigner } from "./sui-wallet.signer"

export * from "./metamask.signer"
export * from "./sui-wallet.signer"

export const getSigner = <ChainName extends Chain>(
    chainName: ChainName,
    providers: {
        metamaskWallet?: SDKState
        suiWallet?: WalletContextState
    }
): SignAndSendSigner<"Testnet", ChainName> | null => {
    let signer: SignAndSendSigner<"Testnet", ChainName>
    const platform = chainToPlatform(chainName)
    console.log(platform)
    switch (platform) {
        case "Evm": {
            const { metamaskWallet } = providers
            if (!metamaskWallet) return null
            signer = new MetaMaskWalletSigner(
                chainName as EvmChains,
                metamaskWallet
            ) as unknown as SignAndSendSigner<"Testnet", ChainName>
            break
        }
        default: {
            const { suiWallet } = providers
            if (!suiWallet) return null
            signer = new SuiWalletSigner(
                suiWallet
            ) as unknown as SignAndSendSigner<"Testnet", ChainName>
        }
    }
    return signer
}
