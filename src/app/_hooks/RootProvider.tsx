"use client"
import React, { ReactNode, createContext, useMemo } from "react"
import { RootAction, RootState, useRootReducer } from "./useRootReducer"
import { PeraWalletConnect } from "@perawallet/connect"

export interface RootContextValue {
    wallets: {
        pera: PeraWalletConnect
    }
    reducer: [RootState, React.Dispatch<RootAction>]
}

export const RootContext = createContext<RootContextValue | null>(null)

export const RootProvider = ({ children }: { children: ReactNode }) => {
    const reducer = useRootReducer()

    const pera = new PeraWalletConnect({
        shouldShowSignTxnToast: true,
    })

    const rootContextValue: RootContextValue = useMemo(
        () => ({
            wallets: {
                pera,
            },
            reducer,
        }),
        [reducer, pera]
    )

    return (
        <RootContext.Provider value={rootContextValue}>
            {children}
        </RootContext.Provider>
    )
}
