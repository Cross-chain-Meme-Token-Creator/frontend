"use client"
import { PeraWalletConnect } from "@perawallet/connect"
import {
    AlgorandSignerAction,
    AlgorandSignerState,
    useAlgorandSignerReducer,
} from "./useAlgorandSignerReducer"
import React, { ReactNode, createContext, useEffect, useMemo } from "react"

export const peraWallet = new PeraWalletConnect({
    shouldShowSignTxnToast: true,
})

export interface AlgorandSignerContextValue {
    reducer: [AlgorandSignerState, React.Dispatch<AlgorandSignerAction>]
}

export const AlgorandSignerContext =
    createContext<AlgorandSignerContextValue | null>(null)

export const AlgorandSignerProvider = ({
    children,
}: {
    children: ReactNode
}) => {
    const reducer = useAlgorandSignerReducer()
    const [, dispatch] = reducer

    useEffect(() => {
        peraWallet.reconnectSession().then(([address]) => {
            dispatch({
                type: "SET_PERA_WALLET_ADDRESS",
                payload: address,
            })
            dispatch({
                type: "SET_ALGORAND_SELECTED_SIGNER",
                payload: "pera",
            })
        })
    }, [])

    const algorandSignerContextValue: AlgorandSignerContextValue = useMemo(
        () => ({
            reducer,
        }),
        [reducer]
    )

    return (
        <AlgorandSignerContext.Provider value={algorandSignerContextValue}>
            {children}
        </AlgorandSignerContext.Provider>
    )
}
