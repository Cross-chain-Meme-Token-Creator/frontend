"use client"
import { useContext, useEffect } from "react"
import { SupportedChainName } from "@services"
import { appConfig } from "@config"
import { TokenContext } from "./TokenProvider"
import { RootContext } from "../../../_hooks"
import { getAlgorandTokenInfo } from "@services"

export const useAlgorandToken = () => {
    const { reducer } = useContext(RootContext)!
    const [state] = reducer
    const { selectedChainName, network } = state

    const { reducer: tokenReducer } = useContext(TokenContext)!
    const [tokenState, tokenDispatch] = tokenReducer

    const { tokenAddress } = tokenState

    useEffect(() => {
        if (selectedChainName !== SupportedChainName.Algorand) return
        if (!tokenAddress) return

        tokenDispatch({
            type: "SET_IS_LOADING",
            payload: true,
        })

        const handleEffect = async () => {
            try {
                const { decimals, name, iconUrl, symbol } =
                    await getAlgorandTokenInfo({
                        assetId: Number.parseInt(tokenAddress),
                        network,
                    })

                tokenDispatch({
                    type: "SET_TOKEN_INFO",
                    payload: {
                        decimals,
                        name,
                        iconUrl,
                        symbol,
                    },
                })
                tokenDispatch({
                    type: "SET_IS_NOT_FOUND",
                    payload: false,
                })
            } catch (ex) {
                tokenDispatch({
                    type: "SET_TOKEN_INFO",
                })
                tokenDispatch({
                    type: "SET_IS_NOT_FOUND",
                    payload: true,
                })
            } finally {
                tokenDispatch({
                    type: "SET_IS_LOADING",
                    payload: false,
                })
            }
        }

        const delayedFunction = setTimeout(
            handleEffect,
            appConfig.timeOuts.searchTimeout
        )

        return () => clearTimeout(delayedFunction)
    }, [tokenAddress, selectedChainName])
}
