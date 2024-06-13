"use client"
import React, { ReactNode, createContext, useCallback, useMemo } from "react"
import {
    SignTransactionModalAction,
    SignTransactionModalState,
    useSignTransactionModalReducer,
} from "./useSignTransactionModalReducer"
import { useDisclosure } from "@nextui-org/react"
import { DisclosureType } from "@common"
import { SignTransactionModal } from "./SignTransactionModal"

export interface SignTransactionModalContextValue {
    reducer: [
        SignTransactionModalState,
        React.Dispatch<SignTransactionModalAction>
    ]
    discloresures: {
        baseDiscloresure: DisclosureType
    }
    functions: {
        openModal: (params?: SignTransactionModalState) => void
        closeModal: () => void
    }
}

export const SignTransactionModalContext =
    createContext<SignTransactionModalContextValue | null>(null)

export const SignTransactionModalProvider = ({
    children,
}: {
    children: ReactNode
}) => {
    const reducer = useSignTransactionModalReducer()
    const [, dispatch] = reducer

    const baseDiscloresure = useDisclosure()
    const { onOpen, onClose } = baseDiscloresure

    const openModal = useCallback(
        (params?: SignTransactionModalState) => {
            if (params) {
                dispatch({
                    type: "OPEN",
                    payload: params,
                })
            }
            onOpen()
        },
        [reducer, baseDiscloresure]
    )

    const closeModal = useCallback(() => {
        dispatch({
            type: "CLOSE",
        })
        onClose()
    }, [reducer, baseDiscloresure])

    const signTransactionModalContextValue: SignTransactionModalContextValue =
        useMemo(
            () => ({
                reducer,
                discloresures: {
                    baseDiscloresure,
                },
                functions: {
                    openModal,
                    closeModal,
                },
            }),
            [reducer, baseDiscloresure]
        )

    return (
        <SignTransactionModalContext.Provider
            value={signTransactionModalContextValue}
        >
            <SignTransactionModal />
            {children}
        </SignTransactionModalContext.Provider>
    )
}
