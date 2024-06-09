"use client"

import { ChainSelect } from "@shared"
import React, { useContext } from "react"
import { ExplorerContext } from "../../_hooks"
import { SearchBar } from "./SearchBar"

export const Heading = () => {
    const { reducer } = useContext(ExplorerContext)!
    const [state, dispatch] = reducer

    const { chainName } = state

    return (
        <div className="bg-content2">
            <SearchBar/>
            <ChainSelect
                chainName={chainName}
                setChainName={(chainName) =>
                    dispatch({
                        type: "SET_CHAIN_NAME",
                        payload: chainName,
                    })
                }
            />
        </div>
    )
}
