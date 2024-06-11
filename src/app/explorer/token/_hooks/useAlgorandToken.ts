"use client"
import { useContext, useEffect } from "react"
import { AlgorandAsset, SupportedChainName, getAlgodClient } from "@services"
import { appConfig } from "@config"
import { TokenContext } from "./TokenProvider"
import { RootContext } from "../../../_hooks"

export const useAlgorandToken = () => {
    const { reducer } = useContext(RootContext)!
    const [state] = reducer
    const { selectedChainName, network } = state

    const algodClient = getAlgodClient(network)

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
                const asset = (await algodClient
                    .getAssetByID(Number.parseInt(tokenAddress))
                    .do()) as AlgorandAsset
                const { params } = asset
                const {
                    decimals,
                    name,
                    "unit-name": symbol,
                    url: iconUrl,
                } = params

                tokenDispatch({
                    type: "SET_TOKEN_INFO",
                    payload: {
                        decimals,
                        name,
                        iconUrl,
                        symbol,
                    },
                })
            } catch (ex) {
                tokenDispatch({
                    type: "SET_TOKEN_INFO",
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
    }, [tokenAddress])
}
