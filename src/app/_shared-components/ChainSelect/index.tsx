"use client"
import React, { useEffect } from "react"
import { Select, SelectItem, Image } from "@nextui-org/react"
import { SupportedChainName, supportedChains } from "@services"

interface ChainSelectProps {
    firstAsDefault?: boolean
    className?: string
    chainName: SupportedChainName
    setChainName: (chainName: SupportedChainName) => void
    label?: string
    excludes?: Array<SupportedChainName>
    //cannot use both excludes and includes
    includes?: Array<SupportedChainName>
    selectedChainName: SupportedChainName
}

export const ChainSelect = (props: ChainSelectProps) => {
    const {
        firstAsDefault,
        chainName,
        setChainName,
        className,
        label,
        excludes,
        includes,
        selectedChainName
    } = props

    const remainingSupportedChainNames =
        includes ??
        (Object.entries(supportedChains)
            .filter(
                ([supportedChainName]) =>
                    !excludes?.includes(
                        supportedChainName as SupportedChainName
                    )
            )
            ?.map(([key]) => key) as Array<SupportedChainName>)
   
    useEffect(() => {
        if (!firstAsDefault) return
        const _chainName = remainingSupportedChainNames.at(0) as SupportedChainName
        setChainName(_chainName)
    }, [selectedChainName])

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
            {remainingSupportedChainNames.map((chainName) => (
                <SelectItem
                    startContent={
                        <Image
                            alt="chain-logo"
                            className="w-3.5 h-3.5"
                            src={supportedChains[chainName].imageUrl}
                        />
                    }
                    key={chainName}
                >
                    {supportedChains[chainName].name}
                </SelectItem>
            ))}
        </Select>
    )
}
