"use client"
import React, {
    ReactNode,
    createContext,
    useCallback,
    useEffect,
    useMemo,
} from "react"
import {
    ExplorerSuiIdAction,
    ExplorerSuiIdState,
    useExplorerSuiIdReducer,
} from "./useExplorerSuiIdReducer"
import { useParams } from "next/navigation"
import { SuiClient } from "@mysten/sui.js/client"
import {
    SupportedChainName,
    getBridgedChainInfos,
    supportedChains,
} from "@services"

export interface ExplorerSuiIdContextValue {
    reducer: [ExplorerSuiIdState, React.Dispatch<ExplorerSuiIdAction>]
    functions: {
        triggerFetchBalance: () => void
    }
}

export const ExplorerSuiIdContext =
    createContext<ExplorerSuiIdContextValue | null>(null)

export const ExplorerSuiIdProvider = ({
    children,
}: {
    children: ReactNode
}) => {
    const reducer = useExplorerSuiIdReducer()
    const [, dispatch] = reducer

    const params = useParams()
    const id = params.id as string

    const suiClient = new SuiClient({
        url: supportedChains[SupportedChainName.Sui].rpcUrl,
    })

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

            const { type: tokenType } = content as any

            dispatch({
                type: "SET_TOKEN_ALL",
                payload: {
                    decimals,
                    name,
                    description,
                    iconUrl,
                    symbol,
                    tokenType,
                },
            })

            dispatch({
                type: "SET_ID",
                payload: id,
            })
        }
        handleEffect()
    }, [])

    const triggerFetchBalance = useCallback(
        () =>
            dispatch({
                type: "TRIGGER_FETCH_BALANCE",
            }),
        []
    )

    const ExplorerSuiIdContextValue: ExplorerSuiIdContextValue = useMemo(
        () => ({
            reducer,
            functions: {
                triggerFetchBalance,
            },
        }),
        [reducer]
    )

    useEffect(() => {
        const handleEffect = async () => {
            const bridgedChainInfos = await getBridgedChainInfos({
                mainChainName: "Sui",
                tokenAddress: id,
            })
            dispatch({
                type: "SET_BRIDGED_CHAINS_INFO",
                payload: bridgedChainInfos,
            })
        }
        handleEffect()
    }, [])

    return (
        <ExplorerSuiIdContext.Provider value={ExplorerSuiIdContextValue}>
            {children}
        </ExplorerSuiIdContext.Provider>
    )
}
