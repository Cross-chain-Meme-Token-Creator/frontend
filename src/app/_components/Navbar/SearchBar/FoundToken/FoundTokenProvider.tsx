"use client"
import React, { ReactNode, createContext, useMemo } from "react"
import {
    FoundTokenAction,
    FoundTokenState,
    useFoundTokenReducer,
} from "./useFoundTokenReducer"

export interface FoundTokenContextValue {
    reducer: [FoundTokenState, React.Dispatch<FoundTokenAction>]
}

export const FoundTokenContext = createContext<FoundTokenContextValue | null>(
    null
)

export const FoundTokenProvider = ({ children }: { children: ReactNode }) => {
    const reducer = useFoundTokenReducer()

    const foundTokenContextValue: FoundTokenContextValue = useMemo(
        () => ({
            reducer,
        }),
        [reducer]
    )

    return (
        <FoundTokenContext.Provider value={foundTokenContextValue}>
            {children}
        </FoundTokenContext.Provider>
    )
}
