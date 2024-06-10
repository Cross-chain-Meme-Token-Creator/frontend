import {
    getBridgedChainInfos,
    tryMapChainNameToSupportedChainName,
} from "@services"
import { RootContext } from "../../../_hooks"
import { useContext, useEffect } from "react"
import { TokenContext } from "./TokenProvider"
import { toUniversal } from "@wormhole-foundation/sdk-definitions"
export const useBridgedTokenInfos = () => {
    const { reducer } = useContext(TokenContext)!
    const [state, dispatch] = reducer
    const { tokenAddress, keys } = state
    const { refreshWrappedTokensKey } = keys

    const { reducer: rootReducer } = useContext(RootContext)!
    const [rootState] = rootReducer
    const { selectedChainName, network } = rootState

    useEffect(() => {
        if (!tokenAddress) return

        const handleEffect = async () => {
            if (!tokenAddress) return
            dispatch({
                type: "SET_IS_WRAPPED_TOKENS_FETCH_LOADING",
                payload: true
            })
            const _bridgedChainInfos = await getBridgedChainInfos({
                network,
                mainChainName: selectedChainName,
                tokenAddress: toUniversal(selectedChainName, tokenAddress),
            })

            const bridgedChainInfos = _bridgedChainInfos.map(
                ({ nativeWrappedAddress, chainName }) => ({
                    chainName: tryMapChainNameToSupportedChainName(chainName),
                    wrappedAddress: nativeWrappedAddress.address as string,
                })
            )

            console.log(bridgedChainInfos)

            dispatch({
                type: "SET_BRIDGED_CHAIN_INFOS",
                payload: bridgedChainInfos,
            })
            dispatch({
                type: "SET_IS_WRAPPED_TOKENS_FETCH_LOADING",
                payload: false
            })
        }
        handleEffect()
    }, [tokenAddress, refreshWrappedTokensKey])
}
