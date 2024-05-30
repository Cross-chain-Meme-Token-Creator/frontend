"use client"
import React, { useContext } from "react"
import { Select, SelectItem, Image, CheckboxIcon } from "@nextui-org/react"
import { SupportedChainName, supportedChains } from "@services"
import { CheckIcon } from "@heroicons/react/24/outline"
import { SendToEvmButtonContext } from "../../SendToEvmButtonProvider"

export const EvmChainSelect = () => {
    const { formik } = useContext(SendToEvmButtonContext)!

    return (
        <Select
            selectedKeys={[formik.values.chainName]}
            showScrollIndicators
            labelPlacement="outside"
            onSelectionChange={(key) => {
                if (key === "all") return
                const currentChainId = Array.from(key.keys()).at(
                    0
                ) as SupportedChainName
                console.log(key)
                formik.setFieldValue("chainName", currentChainId)
            }}
            selectionMode="single"
            label="Select chain"
        >
            {Object.entries(supportedChains).filter(([, { chainType }]) => chainType === "evm").map(
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
                            chainName === formik.values.chainName ? (
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
