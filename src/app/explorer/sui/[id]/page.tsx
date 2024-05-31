"use client"
import React from "react"
import { TransferSection, DisplayTokenInfo } from "./_components"
import { Spacer } from "@nextui-org/react"
import { BridgedChainsTable } from "./_components"

const Page = () => {
    return (
        <div className="p-6">
            <DisplayTokenInfo />
            <Spacer y={12} />
            <TransferSection />
            <Spacer y={12} />
            <BridgedChainsTable />
        </div>
    )
}

export default Page
