import { useContext, useEffect, useState } from "react"
import { EvmSignerContext } from "./EvmSignerProvider"
import { useSDK } from "@metamask/sdk-react-ui"
import { RootContext } from "."
import {
    MetamaskApi,
    SupportedEvmChainName,
    isSupportedEvmChainName,
    mapSupportedChainNameToSupportedEvmChainName,
} from "@services"

export const useEvmSigner = () => {
    const { reducer } = useContext(EvmSignerContext)!
    const [state, dispatch] = reducer

    const [address, setAddress] = useState<string | undefined>(undefined)

    const metamaskWallet = useSDK()
    const { sdk, account, provider, connected } = metamaskWallet

    const { selectedSigner } = state

    const { reducer: rootReducer } = useContext(RootContext)!
    const [rootState] = rootReducer
    const { selectedChainName, network } = rootState

    useEffect(() => {
        switch (selectedSigner) {
            case "metaMask": {
                setAddress(account)
                break
            }
            default:
                break
        }
    }, [selectedSigner, account])

    useEffect(() => {
        if (
            !connected ||
            !provider ||
            !isSupportedEvmChainName(selectedChainName)
        ) {
            return
        }
        
        const handleEffect = async () => {
            const metamaskApi = new MetamaskApi(provider, network)
            await metamaskApi.switchEthereumChain(
                mapSupportedChainNameToSupportedEvmChainName(selectedChainName)
            )
        }
        handleEffect()
    }, [selectedChainName, network, provider, connected])

    const connectMetaMask = async () => {
        await sdk?.connect()
        dispatch({
            type: "SET_EVM_SELECTED_SIGNER",
            payload: "metaMask",
        })
    }

    const disconnectMetaMask = () => {
        sdk?.terminate()
        dispatch({
            type: "SET_EVM_SELECTED_SIGNER",
        })
    }

    return {
        selectedSigner,
        address,
        connectMetaMask,
        disconnectMetaMask,
        metamaskWallet,
    }
}
