"use client"
import { useContext, useEffect } from "react"
import { RootContext } from "../../../../_hooks"
import { SupportedChainName, getSuiTokenInfo } from "@services"
import { appConfig } from "@config"
import { FoundTokenContext } from "./FoundTokenProvider"

export const useFoundSuiToken = () => {
    const { reducer } = useContext(RootContext)!
    const [state] = reducer
    const { selectedChainName, network, searchValue } = state

    const { reducer: foundTokenReducer } = useContext(FoundTokenContext)!
    const [, foundTokenDispatch] = foundTokenReducer

    useEffect(() => {
        if (selectedChainName !== SupportedChainName.Sui) return
        if (searchValue) {
            foundTokenDispatch({
                type: "SET_IS_LOADING",
                payload: true,
            })
        }

        const handleEffect = async () => {
            try {
                const { decimals, name, description, iconUrl, symbol } =
                    await getSuiTokenInfo({
                        coinType: searchValue,
                        network,
                    })

                foundTokenDispatch({
                    type: "SET_FOUND_TOKEN_INFO",
                    payload: {
                        decimals,
                        name,
                        description,
                        iconUrl,
                        symbol,
                    },
                })
            } catch (ex) {
                foundTokenDispatch({
                    type: "SET_FOUND_TOKEN_INFO",
                })
            } finally {
                foundTokenDispatch({
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
    }, [searchValue])
}
