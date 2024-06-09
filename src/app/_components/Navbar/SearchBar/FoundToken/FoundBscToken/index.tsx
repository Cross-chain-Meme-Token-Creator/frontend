"use client"
import { SupportedChainName } from "@services"
import React, { useContext } from "react"
import { RootContext } from "../../../../../_hooks"

export const FoundBscToken = () => {
    const { reducer } = useContext(RootContext)!
    const [ state ] = reducer
    const { selectedChainName, network } = state

    if (selectedChainName !== SupportedChainName.Bsc) return null
}