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
import { getBridgedChainInfos, getSuiClient } from "@services"

export interface ExplorerSuiIdContextValue {
    reducer: [ExplorerSuiIdState, React.Dispatch<ExplorerSuiIdAction>]
    functions: {
        triggerFetchBalance: () => void
    }
}

export const ExplorerSuiIdContext =
    createContext<ExplorerSuiIdContextValue | null>(null)

export interface SuiObjectContentFields {
    decimals: number
    name: string
    description: string
    icon_url: string
    symbol: string
}

export interface SuiObjectContent {
    fields: SuiObjectContentFields,
    type: string
}
export const ExplorerSuiIdProvider = ({
    children,
}: {
    children: ReactNode
}) => {
    const reducer = useExplorerSuiIdReducer()
    const [, dispatch] = reducer

    const params = useParams()
    const id = params.id as string
    console.log(id)
    
    const suiClient = getSuiClient()

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

            const { fields, type: tokenType } = content as unknown as SuiObjectContent

            const {
                decimals,
                name,
                description,
                icon_url: iconUrl,
                symbol,
            } = fields

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
