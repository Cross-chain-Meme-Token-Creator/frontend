"use client"
import React from "react"
import { Select, SelectItem, Image } from "@nextui-org/react"
import { SupportedChainName, supportedChains } from "@services"

interface SharedChainSelectProps {
    className?: string
    chainName: SupportedChainName
    setChainName: (chainName: SupportedChainName) => void
    label?: string
}

export const ChainSelect = (props: SharedChainSelectProps) => {
    const { chainName, setChainName, className, label } = props
    return (
        <Select
            className={className}
            selectedKeys={[chainName]}
            showScrollIndicators
            startContent={
                <Image
                    alt="chain-logo"
                    removeWrapper
                    className="w-3.5 h-3.5"
                    src={supportedChains[chainName].imageUrl}
                />
            }
            labelPlacement="outside"
            onSelectionChange={(key) => {
                if (key === "all") return
                const currentChainName = Array.from(key.keys()).at(
                    0
                ) as SupportedChainName

                if (!currentChainName) return 
                setChainName(currentChainName)
            }}
            selectionMode="single"
            label={label ?? ""}
        >
            {Object.entries(supportedChains).map(
                ([chainName, { imageUrl, name }]) => (
                    <SelectItem
                        startContent={
                            <Image
                                alt="chain-logo"
                                className="w-3.5 h-3.5"
                                src={imageUrl}
                            />
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
