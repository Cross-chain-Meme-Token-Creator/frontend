"use client"
import React, { ReactNode, createContext, useMemo } from "react"
import {
    CreateTokenAction,
    CreateTokenState,
    useCreateTokenReducer,
} from "./useCreateTokenReducer"

export interface CreateTokenContextValue {
    reducer: [CreateTokenState, React.Dispatch<CreateTokenAction>]
}

export const CreateTokenContext = createContext<CreateTokenContextValue | null>(
    null
)

export const CreateTokenProvider = ({ children }: { children: ReactNode }) => {
    const reducer = useCreateTokenReducer()
    
    const createTokenContextValue: CreateTokenContextValue = useMemo(
        () => ({
            reducer,
        }),
        [reducer]
    )

    return (
        <CreateTokenContext.Provider value={createTokenContextValue}>
            {children}
        </CreateTokenContext.Provider>
    )
}
