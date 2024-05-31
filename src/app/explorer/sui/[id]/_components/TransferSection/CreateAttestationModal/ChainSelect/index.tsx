"use client"
import React, { useContext } from "react"
import { Select, SelectItem, Image } from "@nextui-org/react"
import { SupportedChainName, supportedChains } from "@services"
import { CheckIcon } from "@heroicons/react/24/outline"
import { CreateAttestationModalContext } from "../CreateAttestationModalProvider"

export const ChainSelect = () => {
    const { formik } = useContext(CreateAttestationModalContext)!

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
                        key={chainName}
                    >
                        {name}
                    </SelectItem>
                )
            )}
        </Select>
    )
}
