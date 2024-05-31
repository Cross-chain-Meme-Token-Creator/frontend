"use client"
import React, { ReactNode, createContext, useMemo } from "react"
import { RootAction, RootState, useRootReducer } from "./useRootReducer"
import { PeraWalletConnect } from "@perawallet/connect"

export interface RootContextValue {
    wallets: {
        peraWallet: PeraWalletConnect
    }
    reducer: [RootState, React.Dispatch<RootAction>]
}

export const RootContext = createContext<RootContextValue | null>(null)

export const RootProvider = ({ children }: { children: ReactNode }) => {
    const reducer = useRootReducer()

    const peraWallet = new PeraWalletConnect({
        shouldShowSignTxnToast: true,
    })


    const rootContextValue: RootContextValue = useMemo(
        () => ({
            wallets: {
                peraWallet,
            },
            reducer,
        }),
        [reducer, peraWallet]
    )

    return (
        <RootContext.Provider value={rootContextValue}>
            {children}
        </RootContext.Provider>
    )
}
