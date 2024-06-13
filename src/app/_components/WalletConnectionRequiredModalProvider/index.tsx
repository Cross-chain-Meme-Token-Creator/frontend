"use client"
import React, { ReactNode, createContext, useCallback, useMemo } from "react"
import { useDisclosure } from "@nextui-org/react"
import { DisclosureType } from "@common"
import { WalletConnectionRequiredModal } from "./WalletConnectionRequiredModal"

export interface WalletConnectionRequiredModalContextValue {
    discloresures: {
        baseDiscloresure: DisclosureType
    }
    functions: {
        openModal: () => void
    }
}

export const WalletConnectionRequiredModalContext =
    createContext<WalletConnectionRequiredModalContextValue | null>(null)

export const WalletConnectionRequiredModalProvider = ({
    children,
}: {
    children: ReactNode
}) => {
    const baseDiscloresure = useDisclosure()
    const { onOpen } = baseDiscloresure

    const openModal = useCallback(() => {
        onOpen()
    }, [baseDiscloresure])
    
    const WalletConnectionRequiredModalContextValue: WalletConnectionRequiredModalContextValue =
        useMemo(
            () => ({
                discloresures: {
                    baseDiscloresure,
                },
                functions: {
                    openModal
                },
            }),
            [baseDiscloresure]
        )

    return (
        <WalletConnectionRequiredModalContext.Provider
            value={WalletConnectionRequiredModalContextValue}
        >
            <WalletConnectionRequiredModal />
            {children}
        </WalletConnectionRequiredModalContext.Provider>
    )
}
