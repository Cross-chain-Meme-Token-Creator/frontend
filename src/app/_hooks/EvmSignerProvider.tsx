"use client"
import React, { ReactNode, createContext, useMemo } from "react"
import {
    EvmSignerAction,
    EvmSignerState,
    useEvmSignerReducer,
} from "./useEvmSignerReducer"

export interface EvmSignerContextValue {
    reducer: [EvmSignerState, React.Dispatch<EvmSignerAction>]
}

export const EvmSignerContext = createContext<EvmSignerContextValue | null>(
    null
)

export const EvmSignerProvider = ({ children }: { children: ReactNode }) => {
    const reducer = useEvmSignerReducer()

    const evmSignerContextValue: EvmSignerContextValue = useMemo(
        () => ({
            reducer,
        }),
        [reducer]
    )

    return (
        <EvmSignerContext.Provider value={evmSignerContextValue}>
            {children}
        </EvmSignerContext.Provider>
    )
}
