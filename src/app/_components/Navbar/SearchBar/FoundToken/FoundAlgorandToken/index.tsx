"use client"
import React, { useContext } from "react"
import { SupportedChainName } from "../../../../../../services/blockchain"
import { RootContext } from "../../../../../_hooks"

export const FoundAlgorandToken = () => {
    const { reducer } = useContext(RootContext)!
    const [ state ] = reducer
    const { selectedChainName, network } = state

    if (selectedChainName !== SupportedChainName.Bsc) return null
}