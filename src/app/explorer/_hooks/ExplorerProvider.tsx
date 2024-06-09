"use client"
import React, {
    ReactNode,
    createContext,
    useCallback,
    useEffect,
    useMemo,
} from "react"
import { useSearchParams } from "next/navigation"
import { getBridgedChainInfos, getSuiClient } from "@services"
import { Chain, isChain } from "@wormhole-foundation/sdk-base"
import { ExplorerAction, ExplorerState, useExplorerReducer } from "./useExplorerReducer"

export interface ExplorerContextValue {
    reducer: [ExplorerState, React.Dispatch<ExplorerAction>]
}

export const ExplorerContext =
    createContext<ExplorerContextValue | null>(null)

export const ExplorerProvider = ({
    children,
}: {
    children: ReactNode
}) => {
    const reducer = useExplorerReducer()
    const [, dispatch] = reducer

    useEffect(() => {
        
    }, [])

    const searchParams = useSearchParams()

    const contractAddress = searchParams.get("contractAddress")

    let chainName = (searchParams.get("chainName") as Chain) ?? "Sui"
    if (!isChain(chainName)) chainName = "Sui"

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

            const { fields, type: tokenType } =
                content as unknown as SuiObjectContent

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
