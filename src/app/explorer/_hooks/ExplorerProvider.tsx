"use client"
import React, {
    ReactNode,
    createContext,
    useMemo,
} from "react"
import {
    ExplorerAction,
    ExplorerState,
    useExplorerReducer,
} from "./useExplorerReducer"

export interface ExplorerContextValue {
    reducer: [ExplorerState, React.Dispatch<ExplorerAction>]
}

export const ExplorerContext = createContext<ExplorerContextValue | null>(null)

export const ExplorerProvider = ({ children }: { children: ReactNode }) => {
    const reducer = useExplorerReducer()

    const explorerContextValue: ExplorerContextValue = useMemo(
        () => ({
            reducer,
        }),
        [reducer]
    )

    return (
        <ExplorerContext.Provider value={explorerContextValue}>
            {children}
        </ExplorerContext.Provider>
    )
}
