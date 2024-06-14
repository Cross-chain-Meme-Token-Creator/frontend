import {
    BridgedChainInfo,
    SupportedChainName,
    getBridgedChainInfos,
    mapChainNameToSupportedChainName,
} from "@services"
import { RootContext } from "../../../_hooks"
import { useContext, useEffect } from "react"
import { TokenContext } from "./TokenProvider"

export const useBridgedTokenInfos = () => {
    const { reducer } = useContext(TokenContext)!
    const [state, dispatch] = reducer
    const { tokenAddress, tokenInfo, keys } = state
    const { objectId } = { ...tokenInfo }

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
                payload: true,
            })

            let _bridgedChainInfos: Array<BridgedChainInfo>

            switch (selectedChainName) {
            case SupportedChainName.Sui: {
                if (!objectId) return
                    
                _bridgedChainInfos = await getBridgedChainInfos({
                    network,
                    mainChainName: selectedChainName,
                    tokenAddress: objectId,
                })
                    
                break
            } 
            default: {
                _bridgedChainInfos = await getBridgedChainInfos({
                    network,
                    mainChainName: selectedChainName,
                    tokenAddress,
                })
            }
            }

            const bridgedChainInfos = _bridgedChainInfos.map(
                ({ nativeWrappedAddress, chainName }) => ({
                    chainName: mapChainNameToSupportedChainName(chainName),
                    wrappedAddress: nativeWrappedAddress.address as string,
                })
            )

            dispatch({
                type: "SET_BRIDGED_CHAIN_INFOS",
                payload: bridgedChainInfos,
            })
            dispatch({
                type: "SET_IS_WRAPPED_TOKENS_FETCH_LOADING",
                payload: false,
            })
        }
        handleEffect()
    }, [tokenAddress, refreshWrappedTokensKey, objectId])
}
