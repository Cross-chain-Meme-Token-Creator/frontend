"use client"
import React, { ReactNode, createContext, useCallback, useMemo } from "react"
import toast, { Toaster } from "react-hot-toast"

import {
    ErrorToastAction,
    ErrorToastState,
    useErrorToastReducer,
} from "./useErrorToastReducer"

export interface ErrorToastContextValue {
    reducer: [ErrorToastState, React.Dispatch<ErrorToastAction>]
    functions: {
        notify: () => string
    }
}

export const ErrorToastContext = createContext<ErrorToastContextValue | null>(
    null
)

export const ErrorToastProvider = ({ children }: { children: ReactNode }) => {
    const reducer = useErrorToastReducer()

    const notify = useCallback(() => toast("Here is your toast."), [])

    const errorToastContextValue: ErrorToastContextValue = useMemo(
        () => ({
            reducer,
            functions: {
                notify,
            },
        }),
        [reducer, notify]
    )

    return (
        <ErrorToastContext.Provider value={errorToastContextValue}>
            <Toaster />
            {children}
        </ErrorToastContext.Provider>
    )
}
