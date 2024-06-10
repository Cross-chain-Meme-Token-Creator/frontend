"use client"
import { useContext, useEffect } from "react"
import { RootContext } from "../../../../_hooks"
import {
    SuiObjectTokenContent,
    SupportedChainName,
    getSuiClient,
} from "@services"
import { appConfig } from "@config"
import { FoundTokenContext } from "./FoundTokenProvider"

export const useFoundSuiToken = () => {
    const { reducer } = useContext(RootContext)!
    const [state] = reducer
    const { selectedChainName, network, searchValue } = state

    const suiClient = getSuiClient(network)

    const { reducer: foundTokenReducer } = useContext(FoundTokenContext)!
    const [, foundTokenDispatch] = foundTokenReducer

    useEffect(() => { 
        if (selectedChainName !== SupportedChainName.Sui) return
        if (searchValue) {
            foundTokenDispatch({
                type: "SET_IS_LOADING",
                payload: true
            })
        }

        const handleEffect = async () => {
            try {
                const { data } = await suiClient.getObject({
                    id: searchValue,
                    options: {
                        showContent: true,
                    },
                })
                if (!data) throw Error()

                const { content } = data
                if (!content) throw Error()

                const { fields } =
                    content as unknown as SuiObjectTokenContent

                const {
                    decimals,
                    name,
                    description,
                    icon_url: iconUrl,
                    symbol,
                } = fields

                console.log(decimals)

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
                    payload: false
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