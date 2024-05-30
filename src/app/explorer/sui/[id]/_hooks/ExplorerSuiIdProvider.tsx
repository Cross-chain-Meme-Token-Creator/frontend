"use client"
import React, { ReactNode, createContext, useEffect, useMemo } from "react"
import {
    ExplorerSuiIdAction,
    ExplorerSuiIdState,
    useExplorerSuiIdReducer,
} from "./useExplorerSuiIdReducer"
import { useParams } from "next/navigation"
import { SuiClient } from "@mysten/sui.js/client"
import { SupportedChainName, supportedChains } from "@services"
import { useWallet } from "@suiet/wallet-kit"

export interface ExplorerSuiIdContextValue {
    reducer: [ExplorerSuiIdState, React.Dispatch<ExplorerSuiIdAction>]
}

export const ExplorerSuiIdContext =
    createContext<ExplorerSuiIdContextValue | null>(null)

export const ExplorerSuiIdProvider = ({
    children,
}: {
    children: ReactNode
}) => {
    const reducer = useExplorerSuiIdReducer()
    const [state, dispatch] = reducer

    const params = useParams()
    const id = params.id as string

    const suiClient = new SuiClient({
        url: supportedChains[SupportedChainName.Sui].rpcUrl,
    })

    const { address } = useWallet()

    useEffect(() => {
        const handleEffect = async () => {
            const { data } = await suiClient.getObject({
                id,
                options: {
                    showContent: true,
                },
            })
            if (!data) return
            const { content } = data
            if (!content) return

            const {
                decimals,
                name,
                description,
                icon_url: iconUrl,
                symbol,
            } = (content as any).fields

            const {
                type
            } = content as any

            dispatch({
                type: "SET_TOKEN_ALL",
                payload: { decimals, name, description, iconUrl, symbol, type },
            })

            console.log(content)

            if (!address) return
            // const balance = suiClient.getBalance()
        }
        handleEffect()
    }, [])

    console.log(state)

    const ExplorerSuiIdContextValue: ExplorerSuiIdContextValue = useMemo(
        () => ({
            reducer,
        }),
        [reducer]
    )

    return (
        <ExplorerSuiIdContext.Provider value={ExplorerSuiIdContextValue}>
            {children}
        </ExplorerSuiIdContext.Provider>
    )
}
