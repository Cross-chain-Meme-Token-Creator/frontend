"use client"
import React from "react"
import { AttestedTable } from "./AttestedTable"
import { Spacer } from "@nextui-org/react"
import { CreateAndSubmitAttestationModal } from "./CreateAndSubmitAttestationModal"

export const CreateAndSubmitAttestationTab = () => {
    return (
        <div>
            <AttestedTable/>
            <Spacer y={4}/>
            <CreateAndSubmitAttestationModal/>
        </div>
    )
}
