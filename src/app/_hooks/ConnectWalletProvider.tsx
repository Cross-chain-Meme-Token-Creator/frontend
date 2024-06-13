"use client"
import React, { ReactNode, createContext, useCallback, useMemo } from "react"
import {
    ConnectWalletAction,
    ConnectWalletState,
    useConnectWalletReducer,
} from "./useConnectWalletReducer"
import { useDisclosure } from "@nextui-org/react"
import { DisclosureType } from "@common"
import { SupportedPlatform } from "@services"
export interface ConnectWalletContextValue {
    reducer: [
        ConnectWalletState,
        React.Dispatch<ConnectWalletAction>
    ]
    discloresures: {
        baseDiscloresure: DisclosureType
    }
    functions: {
        connectWallet: (params?: ConnectWalletParams) => void
    }
}

export const ConnectWalletContext =
    createContext<ConnectWalletContextValue | null>(null)

interface ConnectWalletParams {
    platform: SupportedPlatform
}

export const ConnectWalletProvider = ({
    children,
}: {
    children: ReactNode
}) => {
    const reducer = useConnectWalletReducer()
    const [, dispatch] = reducer

    const baseDiscloresure = useDisclosure()
    const { onOpen } = baseDiscloresure

    const connectWallet = useCallback(
        (params?: ConnectWalletParams) => {
            if (params) {
                dispatch({
                    type: "SET_PLATFORM",
                    payload: params.platform
                })
            }
            onOpen()
        },
        [ baseDiscloresure ]
    )
    const connectWalletContextValue: ConnectWalletContextValue =
        useMemo(
            () => ({
                reducer,
                discloresures: {
                    baseDiscloresure,
                },
                functions: {
                    connectWallet,
                },
            }),
            [reducer, baseDiscloresure]
        )

    return (
        <ConnectWalletContext.Provider
            value={connectWalletContextValue}
        >
            {children}
        </ConnectWalletContext.Provider>
    )
}
