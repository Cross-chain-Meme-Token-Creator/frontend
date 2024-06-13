"use client"
import React, { ReactNode, createContext, useCallback, useMemo } from "react"
import {
    PassphraseAndQRCodeModalAction,
    PassphraseAndQRCodeModalState,
    usePassphraseAndQRCodeModalReducer,
} from "./usePassphraseAndQRCodeReducer"
import { useDisclosure } from "@nextui-org/react"
import { DisclosureType } from "@common"
import { PassphraseAndQRCodeModal } from "./PassphraseAndQRCodeModal"

export interface PassphraseAndQRCodeModalContextValue {
    reducer: [
        PassphraseAndQRCodeModalState,
        React.Dispatch<PassphraseAndQRCodeModalAction>
    ]
    discloresures: {
        baseDiscloresure: DisclosureType
    }
    functions: {
        openModal: (params?: PassphraseAndQRCodeModalState) => void
        closeModal: () => void
    }
}

export const PassphraseAndQRCodeModalContext =
    createContext<PassphraseAndQRCodeModalContextValue | null>(null)

export const PassphraseAndQRCodeModalProvider = ({
    children,
}: {
    children: ReactNode
}) => {
    const reducer = usePassphraseAndQRCodeModalReducer()
    const [, dispatch] = reducer

    const baseDiscloresure = useDisclosure()
    const { onOpen, onClose } = baseDiscloresure

    const openModal = useCallback(
        (params?: PassphraseAndQRCodeModalState) => {
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

    const PassphraseAndQRCodeModalContextValue: PassphraseAndQRCodeModalContextValue =
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
        <PassphraseAndQRCodeModalContext.Provider
            value={PassphraseAndQRCodeModalContextValue}
        >
            <PassphraseAndQRCodeModal />
            {children}
        </PassphraseAndQRCodeModalContext.Provider>
    )
}
