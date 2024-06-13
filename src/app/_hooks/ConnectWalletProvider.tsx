"use client"
import React, { ReactNode, createContext, useCallback, useContext, useMemo } from "react"
import {
    ConnectWalletAction,
    ConnectWalletState,
    useConnectWalletReducer,
} from "./useConnectWalletReducer"
import { useDisclosure } from "@nextui-org/react"
import { DisclosureType } from "@common"
import { RootContext } from "."
import { chainToPlatform } from "@wormhole-foundation/sdk-base"
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
        connectWallet: () => void
    }
}

export const ConnectWalletContext =
    createContext<ConnectWalletContextValue | null>(null)

export const ConnectWalletProvider = ({
    children,
}: {
    children: ReactNode
}) => {
    const reducer = useConnectWalletReducer()
    const [, dispatch] = reducer

    const baseDiscloresure = useDisclosure()
    const { onOpen } = baseDiscloresure

    const { reducer: rootReducer } = useContext(RootContext)!
    const [ rootState ] = rootReducer
    const { selectedChainName } = rootState

    const connectWallet = useCallback(
        () => {
            dispatch({
                type: "SET_PLATFORM",
                payload: chainToPlatform(selectedChainName) as SupportedPlatform,
            })
            onOpen()
        },
        [reducer, baseDiscloresure]
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
