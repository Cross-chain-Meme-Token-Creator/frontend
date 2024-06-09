import React from "react"
import { CreateAttestationModal } from "./CreateAttestationModal"
import { TransferModal } from "./TransferModal"
import { RedeemModal } from "./RedeemModal"

export const TransferSection = () => {
    return (
        <div className="flex gap-4">
            <CreateAttestationModal />
            <TransferModal />
            <RedeemModal />
        </div>
    )
}
