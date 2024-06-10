"use client"
import React, {
    ReactNode,
    createContext,
    useCallback,
    useEffect,
    useMemo,
} from "react"
import {
    BridgedChainInfo,
    TokenAction,
    TokenState,
    useTokenReducer,
} from "./useTokenReducer"
import { useSearchParams } from "next/navigation"
import { useBridgedTokenInfos } from "./useBridgedTokenInfos"
import { useSuiToken } from "./useSuiToken"
import { SupportedChainName } from "@services"

export interface TokenContextValue {
    reducer: [TokenState, React.Dispatch<TokenAction>]
    functions: {
        getBridgedChainInfo: (
            chainName: SupportedChainName
        ) => BridgedChainInfo | undefined
    }
}

export const TokenContext = createContext<TokenContextValue | null>(null)

const WrappedTokenProvider = ({ children }: { children: ReactNode }) => {
    useSuiToken()
    useBridgedTokenInfos()

    return <>{children}</>
}

export const TokenProvider = ({ children }: { children: ReactNode }) => {
    const reducer = useTokenReducer()
    const [state, dispatch] = reducer
    const { bridgedChainInfos } = state

    const searchParams = useSearchParams()

    const tokenAddress = searchParams.get("tokenAddress") ?? ""

    useEffect(() => {
        if (!tokenAddress) return
        dispatch({
            type: "SET_TOKEN_ADDRESS",
            payload: tokenAddress,
        })
    }, [tokenAddress])

    const getBridgedChainInfo = useCallback(
        (chainName: SupportedChainName) => {
            return bridgedChainInfos.find(
                ({ chainName: _chainName }) => _chainName === chainName
            )
        },
        [bridgedChainInfos]
    )

    const tokenContextValue: TokenContextValue = useMemo(
        () => ({
            reducer,
            functions: {
                getBridgedChainInfo,
            },
        }),
        [reducer]
    )
    return (
        <TokenContext.Provider value={tokenContextValue}>
            <WrappedTokenProvider>{children}</WrappedTokenProvider>
        </TokenContext.Provider>
    )
}
