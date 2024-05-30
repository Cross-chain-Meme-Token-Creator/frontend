import { Divider, Input } from "@nextui-org/react"
import React, { useContext } from "react"
import { SendToEvmButtonContext } from "../SendToEvmButtonProvider"
import { EvmChainSelect } from "./EvmChainSelect"

export const Step1 = () => {
    const { formik } = useContext(SendToEvmButtonContext)!
    return (
        <>
            <div>
                <div className="flex items-center gap-2">
                    <div className="font-semibold whitespace-nowrap">
                        Step 1
                    </div>
                    <Divider className="flex-1" />
                </div>
                <div className="text-xs text-foreground-500">
                    In Sui, transfer tokens to recipient address in different
                    chainn
                </div>
            </div>
            <div className="gap-4 grid">
                <Input
                    id="targetEvmAddress"
                    placeholder="EVM address"
                    labelPlacement="outside"
                    label="Receive Address"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.targetEvmAddress}
                    isRequired
                />
                <EvmChainSelect />
            </div>
        </>
    )
}
