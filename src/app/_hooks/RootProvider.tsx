"use client"
import React, { ReactNode, createContext, useEffect, useMemo } from "react"
import { RootAction, RootState, useRootReducer } from "./useRootReducer"
import { useSearchParams } from "next/navigation"
import { Chain, isChain } from "@wormhole-foundation/sdk-base"
import { defaultSupportedChainName, tryMapChainNameToSupportedChainName } from "@services"

export interface RootContextValue {
    reducer: [RootState, React.Dispatch<RootAction>]
}

export const RootContext = createContext<RootContextValue | null>(null)

export const RootProvider = ({ children }: { children: ReactNode }) => {
    const reducer = useRootReducer()
    const [, dispatch] = reducer

    const rootContextValue: RootContextValue = useMemo(
        () => ({
            reducer,
        }),
        [reducer]
    )

    const searchParams = useSearchParams()

    const _chainName = searchParams.get("chainName") as Chain ?? defaultSupportedChainName
    const chainName = isChain(_chainName) ? tryMapChainNameToSupportedChainName(_chainName) : defaultSupportedChainName

    useEffect(() => {
        dispatch({
            type: "SET_CHAIN_NAME",
            payload: chainName
        })

    }, [chainName])

    return (
        <RootContext.Provider value={rootContextValue}>
            {children}
        </RootContext.Provider>
    )
}
