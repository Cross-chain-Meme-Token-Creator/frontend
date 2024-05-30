"use  client"
import React, { useContext } from "react"
import { ExplorerSuiIdContext } from "../../_hooks"
import { Avatar, Snippet, Spacer } from "@nextui-org/react"
export const DisplayTokenInfo = () => {
    const { reducer } = useContext(ExplorerSuiIdContext)!
    const [state] = reducer
    const { token } = state
    const { decimals, description, iconUrl, name, symbol, type } = token

    return (
        <div>
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex gap-2 items-center">
                        <Avatar src={iconUrl} />
                        <div className="text-4xl font-semibold">{name}</div>
                    </div>
                    <Spacer y={4}/>
                    <Snippet size="sm">{`Type: ${type}`}</Snippet>
                </div>
            </div>
        </div>
    )
}
