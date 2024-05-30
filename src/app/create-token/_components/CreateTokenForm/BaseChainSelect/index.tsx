"use client"
import React, { useContext } from "react"
import { Select, SelectItem, Image, CheckboxIcon } from "@nextui-org/react"
import { SupportedChainName, supportedChains } from "@services"
import { CreateTokenContext } from "../../../_hooks"
import { CheckIcon } from "@heroicons/react/24/outline"

export const BaseChainSelect = () => {
    const { reducer } = useContext(CreateTokenContext)!
    const [state, dispatch] = reducer
    const { selectedChainName } = state

    return (
        <Select
            selectedKeys={[selectedChainName]}
            showScrollIndicators
            labelPlacement="outside"
            onSelectionChange={(key) => {
                if (key === "all") return
                const currentChainId = Array.from(key.keys()).at(0) as SupportedChainName
                dispatch({
                    type: "SET_SELECTED_CHAIN_ID",
                    payload: currentChainId,
                })
            }}
            selectionMode="single"
            label="Select chain"
        >
            {Object.entries(supportedChains).map(
                ([chainName, { imageUrl, name }]) => (
                    <SelectItem
                        startContent={
                            <Image
                                alt="chain-logo"
                                removeWrapper
                                className="w-3.5 h-3.5"
                                src={imageUrl}
                            />
                        }
                        endContent={
                            chainName === selectedChainName ? (
                                <CheckIcon className="w-3.5 h-3.5" />
                            ) : null
                        }
                        key={chainName}
                    >
                        {name}      
                    </SelectItem>
                )
            )}
        </Select>
    )
}
