"use client"
import { useContext, useEffect } from "react"
import { RootContext } from "../../../../_hooks"
import { AlgorandAsset, SupportedChainName, getAlgodClient } from "@services"
import { appConfig } from "@config"
import { FoundTokenContext } from "./FoundTokenProvider"

export const useFoundAlgorandToken = () => {
    const { reducer } = useContext(RootContext)!
    const [state] = reducer
    const { selectedChainName, network, searchValue } = state

    const algodClient = getAlgodClient(network)

    const { reducer: foundTokenReducer } = useContext(FoundTokenContext)!
    const [, foundTokenDispatch] = foundTokenReducer

    useEffect(() => {
        if (selectedChainName !== SupportedChainName.Algorand) return
        if (searchValue) {
            foundTokenDispatch({
                type: "SET_IS_LOADING",
                payload: true,
            })
        }

        const handleEffect = async () => {
            try {
                const asset = (await algodClient
                    .getAssetByID(Number.parseInt(searchValue))
                    .do()) as AlgorandAsset
                const { params } = asset
                const {
                    decimals,
                    name,
                    "unit-name": symbol,
                    url: iconUrl,
                } = params

                foundTokenDispatch({
                    type: "SET_FOUND_TOKEN_INFO",
                    payload: {
                        decimals,
                        name,
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
