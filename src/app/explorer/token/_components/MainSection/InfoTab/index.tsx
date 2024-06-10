"use client"
import { User } from "@nextui-org/react"
import React, { useContext } from "react"
import { TokenContext } from "../../../_hooks"

export const InfoTab = () => {
    const { reducer } = useContext(TokenContext)!
    const [state] = reducer
    const { tokenInfo } = state
    const { iconUrl, name, symbol } = { ...tokenInfo }


    return (
        <div className="">
            <User
                name={name}
                description={symbol}
                avatarProps={{ src: iconUrl }}
            />
        </div>
    )
}
