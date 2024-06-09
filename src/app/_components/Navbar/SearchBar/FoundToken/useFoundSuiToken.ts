"use client"
import { useContext, useEffect } from "react"
import { RootContext } from "../../../../_hooks"
import {
    SuiObjectTokenContent,
    SupportedChainName,
    getSuiClient,
} from "@services"
import { appConfig } from "@config"

export const useFoundSuiToken = () => {
    const { reducer } = useContext(RootContext)!
    const [state] = reducer
    const { selectedChainName, network, searchValue } = state

    if (selectedChainName !== SupportedChainName.Sui) return null

    const suiClient = getSuiClient(network)

    useEffect(() => {
        const handleEffect = async () => {
            try {
                const { data } = await suiClient.getObject({
                    id: searchValue,
                    options: {
                        showContent: true,
                    },
                })
                if (!data) return
                const { content } = data
                if (!content) return

                const { fields, type: tokenType } =
                    content as unknown as SuiObjectTokenContent

                const {
                    decimals,
                    name,
                    description,
                    icon_url: iconUrl,
                    symbol,
                } = fields

                console.log(name)
            } catch (ex) {
                console.log("Token not found")
            }
        }

        const delayedFunction = setTimeout(
            handleEffect,
            appConfig.timeOuts.searchTimeout
        )
        return () => clearTimeout(delayedFunction)
    }, [searchValue])
}
