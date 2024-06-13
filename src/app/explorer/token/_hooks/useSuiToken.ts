"use client"
import { useContext, useEffect } from "react"
import { RootContext } from "../../../_hooks"
import {
    SupportedChainName,
    getSuiTokenInfo,
} from "@services"
import { TokenContext } from "."

export const useSuiToken = () => {
    const { reducer } = useContext(RootContext)!
    const [state] = reducer
    const { selectedChainName, network } = state

    const { reducer: tokenReducer } = useContext(TokenContext)!
    const [ tokenState, tokenDispatch ] = tokenReducer

    const { tokenAddress } = tokenState

    useEffect(() => {  
        if (selectedChainName !== SupportedChainName.Sui) return
        if (!tokenAddress) return
        
        tokenDispatch({
            type: "SET_IS_LOADING",
            payload: true
        })

        const handleEffect = async () => {
            try {
                const { objectId, decimals, name, description, iconUrl, symbol } = await getSuiTokenInfo({
                    coinType: tokenAddress,
                    network
                })

                tokenDispatch({
                    type: "SET_TOKEN_INFO",
                    payload: {
                        decimals,
                        name,
                        description,
                        iconUrl,
                        symbol,
                        objectId,
                    },
                })
                tokenDispatch({
                    type: "SET_IS_NOT_FOUND",
                    payload: false
                })
            } catch (ex) {
                tokenDispatch({
                    type: "SET_TOKEN_INFO",
                })
                tokenDispatch({
                    type: "SET_IS_NOT_FOUND",
                    payload: true
                })
            } finally {
                tokenDispatch({
                    type: "SET_IS_LOADING",
                    payload: false
                })
            }
        }
        handleEffect()
    }, [tokenAddress, selectedChainName])
}
