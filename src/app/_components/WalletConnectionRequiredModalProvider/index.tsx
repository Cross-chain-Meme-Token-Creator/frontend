"use client"
import React, { ReactNode, createContext, useCallback, useMemo } from "react"
import { useDisclosure } from "@nextui-org/react"
import { DisclosureType } from "@common"
import { WalletConnectionRequiredModal } from "./WalletConnectionRequiredModal"
import {
    WalletConnectionRequiredModalAction,
    WalletConnectionRequiredModalState,
    useWalletConnectionRequiredModalReducer,
} from "./useWalletConnectionRequiredModalReducer"

export interface WalletConnectionRequiredModalContextValue {
    reducer: [
        WalletConnectionRequiredModalState,
        React.Dispatch<WalletConnectionRequiredModalAction>
    ]
    discloresures: {
        baseDiscloresure: DisclosureType
    }
    functions: {
        openModal: (params?: WalletConnectionRequiredModalState) => void
    }
}

export const WalletConnectionRequiredModalContext =
    createContext<WalletConnectionRequiredModalContextValue | null>(null)

export const WalletConnectionRequiredModalProvider = ({
    children,
}: {
    children: ReactNode
}) => {
    const reducer = useWalletConnectionRequiredModalReducer()
    const [, dispatch] = reducer

    const baseDiscloresure = useDisclosure()
    const { onOpen } = baseDiscloresure

    const openModal = useCallback(
        (params?: WalletConnectionRequiredModalState) => {
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

    const walletConnectionRequiredModalContextValue: WalletConnectionRequiredModalContextValue =
        useMemo(
            () => ({
                reducer,
                discloresures: {
                    baseDiscloresure,
                },
                functions: {
                    openModal,
                },
            }),
            [baseDiscloresure]
        )

    return (
        <WalletConnectionRequiredModalContext.Provider
            value={walletConnectionRequiredModalContextValue}
        >
            <WalletConnectionRequiredModal />
            {children}
        </WalletConnectionRequiredModalContext.Provider>
    )
}
