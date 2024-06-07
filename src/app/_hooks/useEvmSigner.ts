import { useContext, useEffect, useState } from "react"
import { EvmSignerContext } from "./EvmSignerProvider"
import { useSDK } from "@metamask/sdk-react-ui"

export const useEvmSigner = () => {
    const { reducer } = useContext(EvmSignerContext)!
    const [state, dispatch] = reducer

    const [ address, setAddress ] = useState<string | undefined>(undefined)

    const metamaskWallet = useSDK()
    const { sdk, account } = metamaskWallet

    const { selectedSigner } = state

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
        metamaskWallet
    }
}
