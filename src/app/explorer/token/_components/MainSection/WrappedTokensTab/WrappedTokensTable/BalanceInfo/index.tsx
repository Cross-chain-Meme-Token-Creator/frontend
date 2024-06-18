import { Link } from "@nextui-org/react"
import { chainToPlatform } from "@wormhole-foundation/sdk-base"
import {
    ERC20Contract,
    SupportedChainName,
    SupportedEvmChainName,
    getHttpProvider,
    mapSupportedChainNameToSupportedEvmChainName,
} from "@services"
import React, { useContext, useEffect } from "react"
import { TokenContext } from "../../../../../_hooks"
import { RootContext, useEvmSigner } from "../../../../../../../_hooks"
import { computeDenomination } from "@common"

interface BalanceInfoProps {
    chainName: SupportedChainName
}

export const BalanceInfo = (props: BalanceInfoProps) => {
    const { chainName } = props

    const { reducer, functions } = useContext(TokenContext)!
    const { getBridgedChainInfo } = functions
    const [state, dispatch] = reducer
    const { keys } = state
    const { refreshWrappedTokensKey } = keys

    const { reducer: rootReducer } = useContext(RootContext)!
    const [rootState] = rootReducer
    const { network } = rootState

    const { address: evmAddress } = useEvmSigner()

    const { balance, wrappedAddress } = { ...getBridgedChainInfo(chainName) }

    useEffect(() => {
        if (!wrappedAddress) return

        const handleEffect = async () => {
            switch (chainToPlatform(chainName)) {
                case "Evm": {
                    const erc20Contract = new ERC20Contract(
                        wrappedAddress,
                        getHttpProvider(
                            network,
                            mapSupportedChainNameToSupportedEvmChainName(
                                chainName
                            )
                        )
                    )

                    if (!evmAddress) return
                    const balance = await erc20Contract
                        .balanceOf(evmAddress)
                        .call()
                    const decimals = await erc20Contract.decimals().call()

                    dispatch({
                        type: "UPDATE_BALANCE",
                        payload: {
                            chainName,
                            balance: computeDenomination(balance, decimals),
                        },
                    })

                    return
                }
            }
        }
        handleEffect()
    }, [evmAddress, refreshWrappedTokensKey])

    return balance ? (
        <div> {balance} </div>
    ) : (
        <Link size="sm" as="button">
            Connect Wallet
        </Link>
    )
}
