"use client"
import { Card, CardBody, Spacer, Spinner, User } from "@nextui-org/react"
import React, { useContext } from "react"
import { FoundTokenContext, FoundTokenProvider } from "./FoundTokenProvider"
import { useFoundSuiToken } from "./useFoundSuiToken"

const WrappedFoundToken = () => {
    const { reducer } = useContext(FoundTokenContext)!
    const [state] = reducer
    const { tokenInfo, isLoading } = state

    useFoundSuiToken()

    return (
        <div>
            <div className="text-primary font-semibold text-sm">
                Found Token
            </div>
            <Spacer y={3} />
            {
                isLoading ? (
                    <div className="flex gap-2 items-center">
                        <Spinner color="default" size="sm" />
                        <div className="text-sm text-foreground-500"> Loading </div>
                    </div>
                 
                ) :   (
                    tokenInfo ? (
                        <Card isPressable className="w-full bg-content2" shadow="none">
                            <CardBody className="p-3">
                                <div className="flex gap-2 items-center">
                                    <User
                                        avatarProps={{ src: tokenInfo.iconUrl }}
                                        name={tokenInfo.name}
                                        description={tokenInfo.symbol}
                                    />
                                </div>
                            </CardBody>
                        </Card>
                    ) : <div className="text-foreground-500 text-sm"> No result </div>
                ) }
        </div>
    )
}

export const FoundToken = () => {
    return (
        <FoundTokenProvider>
            <WrappedFoundToken />
        </FoundTokenProvider>
    )
}
