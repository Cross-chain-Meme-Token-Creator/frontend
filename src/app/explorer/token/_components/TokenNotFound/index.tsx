"use client"
import { Spacer } from "@nextui-org/react"
import React from "react"

export const TokenNotFound = () => {
    return (
        <div className="w-full h-[300px] grid place-content-center">
            <div className="text-4xl font-bold text-center text-primary">Opps! Token not found</div>
            <Spacer y={2}/>
            <div className="text-foreground-500 text-sm"> Please consider providing an alternative chain name or updating the token address. </div>
        </div>
    )
}