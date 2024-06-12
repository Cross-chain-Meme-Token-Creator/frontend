import { Spinner } from "@nextui-org/react"
import React from "react"

export const SuspenseScreen = () => {
    return (
        <div className="w-screen h-screen grid">
            <Spinner size="lg" />
        </div>
    )
}
