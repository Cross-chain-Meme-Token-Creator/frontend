import { Link } from "@nextui-org/react"
import { Chain, chainToPlatform } from "@wormhole-foundation/sdk-base"
import { ERC20Contract, SupportedEvmChains, httpProvider } from "@services"
import React, { useContext, useEffect, useState } from "react"
import { ExplorerSuiIdContext } from "../../../_hooks"
import { RootContext, useEvmSigner } from "../../../../_hooks"

interface BalanceInfoProps {
    chainName: Chain
    wrappedAddress: string
}

export const BalanceInfo = (props: BalanceInfoProps) => {
    const { chainName, wrappedAddress } = props

    const { reducer } = useContext(ExplorerSuiIdContext)!
    const [state] = reducer
    const { keys } = state
    const { fetchBalanceKey } = keys

    const [balance, setBalance] = useState(0)
    const [isConnected, setIsConnected] = useState(false)

    const { reducer: rootReducer } = useContext(RootContext)!
    const [rootState] = rootReducer
    const { network } = rootState

    const { address: evmAddress } = useEvmSigner()

    useEffect(() => {
        const handleEffect = async () => {
            switch (chainToPlatform(chainName)) {
            case "Evm": {
                const erc20Contract = new ERC20Contract(
                    wrappedAddress,
                    httpProvider(network, chainName as SupportedEvmChains)
                )

                if (!evmAddress) return
                const balance = await erc20Contract
                    .balanceOf(evmAddress)
                    .call()
                const decimals = await erc20Contract.decimals().call()
                setIsConnected(true)
                setBalance(Number(balance) / Math.pow(10, decimals))
                return
            }
            default:
                return
            }
        }
        handleEffect()
    }, [fetchBalanceKey, evmAddress])

    return isConnected ? (
        <div> {balance} </div>
    ) : (
        <Link size="sm" as="button">
            Connect Wallet
        </Link>
    )
}
