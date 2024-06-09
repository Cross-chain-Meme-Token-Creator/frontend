"use client"
import { Spacer } from "@nextui-org/react"
import React from "react"
import { FoundSuiToken } from "./FoundSuiToken"

export const FoundToken = () => {
    return (
        <div>
            <div className="text-primary font-semibold text-sm"> Found Token </div>
            <Spacer y={4}/>
            <FoundSuiToken/>
        </div>
    )
}