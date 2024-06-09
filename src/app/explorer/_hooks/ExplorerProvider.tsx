"use client"
import React, {
    ReactNode,
    createContext,
    useEffect,
    useMemo,
} from "react"
import { useSearchParams } from "next/navigation"
import {
    SupportedChainName,
    defaultSupportedChainName,
    tryMapChainNameToSupportedChainName,
} from "@services"
import { Chain, isChain } from "@wormhole-foundation/sdk-base"
import {
    ExplorerAction,
    ExplorerState,
    useExplorerReducer,
} from "./useExplorerReducer"

export interface ExplorerContextValue {
    searchParams: {
        contractAddress: string
        chainName: SupportedChainName
    }
    reducer: [ExplorerState, React.Dispatch<ExplorerAction>]
}

export const ExplorerContext = createContext<ExplorerContextValue | null>(null)

export const ExplorerProvider = ({ children }: { children: ReactNode }) => {
    const reducer = useExplorerReducer()
    const [, dispatch] = reducer

    const searchParams = useSearchParams()

    const contractAddress = searchParams.get("contractAddress") ?? ""

    let _chainName =
        (searchParams.get("chainName") as Chain) ?? defaultSupportedChainName
    if (!isChain(_chainName)) _chainName = defaultSupportedChainName
    const chainName = tryMapChainNameToSupportedChainName(_chainName)

    useEffect(() => {
        if (chainName) {
            dispatch({
                type: "SET_CHAIN_NAME",
                payload: chainName,
            })
        }
    }, [chainName])

    useEffect(() => {
        if (contractAddress) {
            dispatch({
                type: "SET_CONTRACT_ADDRESS",
                payload: contractAddress,
            })
        }
    }, [contractAddress])

    const explorerContextValue: ExplorerContextValue = useMemo(
        () => ({
            reducer,
            searchParams: {
                chainName,
                contractAddress,
            },
        }),
        [reducer, chainName, contractAddress]
    )

    return (
        <ExplorerContext.Provider value={explorerContextValue}>
            {children}
        </ExplorerContext.Provider>
    )
}
