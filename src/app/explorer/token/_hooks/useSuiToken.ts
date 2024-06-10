"use client"
import { useContext, useEffect } from "react"
import { RootContext } from "../../../_hooks"
import {
    SuiObjectTokenContent,
    SupportedChainName,
    getSuiClient,
} from "@services"
import { TokenContext } from "."

export const useSuiToken = () => {
    const { reducer } = useContext(RootContext)!
    const [state] = reducer
    const { selectedChainName, network } = state

    const suiClient = getSuiClient(network)

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
                const { data } = await suiClient.getObject({
                    id: tokenAddress.toString(),
                    options: {
                        showContent: true,
                    },
                })
                if (!data) throw Error()

                const { content } = data
                if (!content) throw Error()

                const { fields, type : tokenType } =
                    content as unknown as SuiObjectTokenContent

                const {
                    decimals,
                    name,
                    description,
                    icon_url: iconUrl,
                    symbol,
                } = fields

                tokenDispatch({
                    type: "SET_TOKEN_INFO",
                    payload: {
                        decimals,
                        name,
                        description,
                        iconUrl,
                        symbol,
                        tokenType
                    },
                })
            } catch (ex) {
                tokenDispatch({
                    type: "SET_TOKEN_INFO",
                })
            } finally {
                tokenDispatch({
                    type: "SET_IS_LOADING",
                    payload: false
                })
            }
        }
        handleEffect()
    }, [tokenAddress])
}
