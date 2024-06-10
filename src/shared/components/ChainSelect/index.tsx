"use client"
import React, { useEffect, useRef } from "react"
import { Select, SelectItem, Image } from "@nextui-org/react"
import { SupportedChainName, supportedChains } from "@services"

interface ChainSelectProps {
    firstAsDefault?: boolean
    className?: string
    chainName: SupportedChainName,
    setChainName: (chainName: SupportedChainName) => void
    label?: string
    excludes?: Array<SupportedChainName>
}

export const ChainSelect = (props: ChainSelectProps) => {
    const {
        firstAsDefault,
        chainName,
        setChainName,
        className,
        label,
        excludes,
    } = props

    const hasMounted = useRef(false)
    
    const _chainName =
        firstAsDefault && !hasMounted.current
            ? Object.entries(supportedChains)
                .filter(
                    ([supportedChainName]) =>
                        !excludes?.includes(
                              supportedChainName as SupportedChainName
                        )
                )
                .at(0)?.[0] as SupportedChainName
            : chainName

    useEffect(() => {
        hasMounted.current = true
    }, [])

    return (
        <Select
            className={className}
            selectedKeys={[_chainName]}
            showScrollIndicators
            startContent={
                <Image
                    alt="chain-logo"
                    removeWrapper
                    className="w-3.5 h-3.5"
                    src={supportedChains[_chainName].imageUrl}
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
            {Object.entries(supportedChains)
                .filter(([key]) => {
                    return !excludes?.includes(key as SupportedChainName)
                })
                .map(([chainName, { imageUrl, name }]) => (
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
                ))}
        </Select>
    )
}
