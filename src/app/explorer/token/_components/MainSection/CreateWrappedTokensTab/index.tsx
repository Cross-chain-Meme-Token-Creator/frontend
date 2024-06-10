"use client"
import React from "react"
import { WrappedTokensTable } from "./WrappedTokensTable"
import { Spacer } from "@nextui-org/react"
import { CreateWrappedTokenModal } from "./CreateWrappedTokenModal"

export const CreateWrappedTokensTab = () => {
    return (
        <div>
            <WrappedTokensTable/>
            <Spacer y={4}/>
            <CreateWrappedTokenModal/>
        </div>
    )
}
