"use client"
import React, { ReactNode, createContext, useCallback, useMemo } from "react"
import {
    SigningTransactionModalAction,
    SigningTransactionModalState,
    useSigningTransactionModalReducer,
} from "./useSigningTransactionModalReducer"
import { useDisclosure } from "@nextui-org/react"
import { DisclosureType } from "@common"
import { SigningTransactionModal } from "./SigningTransactionModal"

export interface SigningTransactionModalContextValue {
    reducer: [
        SigningTransactionModalState,
        React.Dispatch<SigningTransactionModalAction>
    ]
    discloresures: {
        baseDiscloresure: DisclosureType
    }
    functions: {
        openModal: (params?: SigningTransactionModalState) => void
        closeModal: () => void
    }
}

export const SigningTransactionModalContext =
    createContext<SigningTransactionModalContextValue | null>(null)

export const SigningTransactionModalProvider = ({
    children,
}: {
    children: ReactNode
}) => {
    const reducer = useSigningTransactionModalReducer()
    const [, dispatch] = reducer

    const baseDiscloresure = useDisclosure()
    const { onOpen, onClose } = baseDiscloresure

    const openModal = useCallback(
        (params?: SigningTransactionModalState) => {
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

    const SigningTransactionModalContextValue: SigningTransactionModalContextValue =
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
        <SigningTransactionModalContext.Provider
            value={SigningTransactionModalContextValue}
        >
            <SigningTransactionModal />
            {children}
        </SigningTransactionModalContext.Provider>
    )
}
