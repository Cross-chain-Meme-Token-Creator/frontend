"use client"
import React from "react"
import { SendToEvmButton, DisplayTokenInfo } from "./_components"
import { Spacer } from "@nextui-org/react"

const Page = () => {
    return (
        <div className="p-6">
            <DisplayTokenInfo />
            <Spacer y={12}/>
            <SendToEvmButton/>
        </div>
    )
}

export default Page
