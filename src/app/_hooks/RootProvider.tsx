"use client"
import React, { ReactNode, createContext, useMemo } from "react"
import { RootAction, RootState, useRootReducer } from "./useRootReducer"
export interface RootContextValue {
    reducer: [RootState, React.Dispatch<RootAction>]
}

export const RootContext = createContext<RootContextValue | null>(null)

export const RootProvider = ({ children }: { children: ReactNode }) => {
    const reducer = useRootReducer()

    const rootContextValue: RootContextValue = useMemo(
        () => ({
            reducer,
        }),
        [reducer]
    )

    return (
        <RootContext.Provider value={rootContextValue}>
            {children}
        </RootContext.Provider>
    )
}
