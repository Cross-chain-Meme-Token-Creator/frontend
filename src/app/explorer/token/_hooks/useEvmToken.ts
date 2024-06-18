"use client"
import { useContext, useEffect } from "react"
import { SupportedEvmChainName, getEvmTokenInfo, mapSupportedChainNameToSupportedEvmChainName } from "@services"
import { appConfig } from "@config"
import { TokenContext } from "./TokenProvider"
import { RootContext } from "../../../_hooks"

export const useEvmToken = () => {
    const { reducer } = useContext(RootContext)!
    const [state] = reducer
    const { selectedChainName, network } = state

    const { reducer: tokenReducer } = useContext(TokenContext)!
    const [tokenState, tokenDispatch] = tokenReducer

    const { tokenAddress } = tokenState

    useEffect(() => {
        if (!Object.keys(SupportedEvmChainName).includes(selectedChainName as unknown as string)) return
        if (!tokenAddress) return

        tokenDispatch({
            type: "SET_IS_LOADING",
            payload: true,
        })

        const handleEffect = async () => {
            try {
                const { decimals, name, symbol } =
                    await getEvmTokenInfo({
                        tokenAddress,
                        chainName: mapSupportedChainNameToSupportedEvmChainName(selectedChainName),
                        network,
                    })

                tokenDispatch({
                    type: "SET_TOKEN_INFO",
                    payload: {
                        decimals,
                        name,
                        symbol,
                    },
                })
                tokenDispatch({
                    type: "SET_IS_NOT_FOUND",
                    payload: false,
                })
            } catch (ex) {
                console.log(ex)
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
