"use client"
import { createContext, useContext } from "react"
import { useEvmSigner } from "./useEvmSigner"
import { useWallet } from "@suiet/wallet-kit"
import { useAlgorandSigner } from "./useAlgorandSigner"
import {
    MetamaskWalletSigner,
    PeraWalletSigner,
    SuiWalletSigner,
    SupportedPlatform,
} from "@services"
import { peraWallet } from "./AlgorandSignerProvider"
import { EvmChains } from "@wormhole-foundation/sdk-evm"
import { RootContext } from "./RootProvider"
import { Chain, Network, chainToPlatform } from "@wormhole-foundation/sdk-base"
import { SignAndSendSigner } from "@wormhole-foundation/sdk-definitions"

export interface AllSignersContextValue {}

export const AllSignersContext = createContext<AllSignersContextValue | null>(
    null
)

export const useGenericSigner = () => {
    const suiWallet = useWallet()
    const {
        selectedSigner: algorandSelectedSigner,
        address: algorandAddress,
    } = useAlgorandSigner()
    const {
        selectedSigner: evmSelectedSigner,
        address: evmAddress,
        metamaskWallet,
    } = useEvmSigner()
    const { reducer } = useContext(RootContext)!
    const [state] = reducer
    const { network } = state

    const _network = network as Network

    const getAlgorandSigner = () => {
        switch (algorandSelectedSigner) {
        case "pera": {
            const address = algorandAddress
            if (!address) return
            return new PeraWalletSigner(peraWallet, address, _network)
        }
        default:
            return
        }
    }

    const getEvmSigner = <C extends EvmChains>(chainName: C) => {
        switch (evmSelectedSigner) {
        case "metaMask": {
            const address = evmAddress
            if (!address || !metamaskWallet) return
            return new MetamaskWalletSigner(
                chainName,
                metamaskWallet,
                _network
            )
        }
        default:
            return
        }
    }

    const getSuiSigner = () => new SuiWalletSigner(suiWallet, _network)

    const getGenericSigner = <N extends Network, C extends Chain>(
        chainName: C
    ) => {
        const evmSigner = getEvmSigner(chainName as EvmChains)
        const algorandSigner = getAlgorandSigner()

        const chainToSigner: Record<
            SupportedPlatform,
            SignAndSendSigner<N, C>
        > = {
            Evm: evmSigner as unknown as SignAndSendSigner<N, C>,
            Algorand: algorandSigner as unknown as SignAndSendSigner<N, C>,
            Sui: getSuiSigner() as unknown as SignAndSendSigner<N, C>,
            Solana: getSuiSigner() as unknown as SignAndSendSigner<N, C>,
        }
        return chainToSigner[chainToPlatform(chainName) as SupportedPlatform]
    }

    return {
        getGenericSigner,
    }
}
