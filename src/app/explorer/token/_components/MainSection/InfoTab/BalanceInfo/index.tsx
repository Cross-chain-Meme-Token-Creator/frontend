"use client"

import React, { useContext, useEffect } from "react"
import { TokenContext } from "../../../../_hooks"
import { RootContext, useAlgorandSigner } from "../../../../../../_hooks"
import {
    getAlgorandBalance,
    getSuiBalance,
} from "@services"
import { useWallet } from "@suiet/wallet-kit"
import { Link } from "@nextui-org/react"
import { formatNumber } from "@common"

export const BalanceInfo = () => {
    const { reducer } = useContext(TokenContext)!
    const [state, dispatch] = reducer
    const { tokenAddress, balance, tokenInfo, keys } = state
    const { tokenType } = { ...tokenInfo }
    const { refreshBalanceKey } = keys

    const { reducer: rootReducer } = useContext(RootContext)!
    const [rootState] = rootReducer
    const { selectedChainName, network } = rootState

    const { address: suiAddress } = useWallet()
    const { address: algorandAddress } = useAlgorandSigner()

    useEffect(() => {
        const handleEffect = async () => {
            if (!algorandAddress) return
            if (!tokenAddress) return

            const _balance = await getAlgorandBalance({
                network,
                accountAddress: algorandAddress,
                assetId: Number.parseInt(tokenAddress),
            })

            dispatch({
                type: "SET_BALANCE",
                payload: _balance,
            })  
        }
        handleEffect()
    }, [selectedChainName, tokenAddress, algorandAddress, refreshBalanceKey])

    useEffect(() => {
        const handleEffect = async () => {
            if (!algorandAddress) return
            if (!tokenAddress) return

            if (!suiAddress) return
            if (!tokenAddress) return
            if (!tokenType) return
            const _balance = await getSuiBalance({
                network,
                accountAddress: suiAddress,
                tokenType,
            })
            dispatch({
                type: "SET_BALANCE",
                payload: _balance,
            })
        }
        handleEffect()
    }, [selectedChainName, tokenAddress, suiAddress, refreshBalanceKey])

    return balance !== undefined ? (
        <div> {formatNumber(balance)} </div>
    ) : (
        <Link size="sm" as="button">
            Connect Wallet
        </Link>
    )
}
