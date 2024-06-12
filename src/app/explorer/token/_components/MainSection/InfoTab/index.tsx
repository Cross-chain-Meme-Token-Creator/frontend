"use client"
import { Avatar, Card, CardBody, Spacer, Link } from "@nextui-org/react"
import React, { useContext } from "react"
import { TokenContext } from "../../../_hooks"
import { RootContext } from "../../../../../_hooks"
import { SupportedChainName, chainNameToTokenIdName } from "@services"
import { OptInButton } from "./OpInButton"
import { formatNumber } from "@common"

export const InfoTab = () => {
    const { reducer } = useContext(TokenContext)!
    const [state] = reducer
    const { tokenInfo, tokenAddress } = state
    const { iconUrl, name, symbol } = { ...tokenInfo }

    const { reducer: rootReducer } = useContext(RootContext)!
    const [rootState] = rootReducer
    const { selectedChainName } = rootState

    const items = [
        {
            key: 0,
            name: "Name",
            value: name,
        },
        {
            key: 1,
            name: "Symbol",
            value: symbol,
        },
        {
            key: 2,
            name: "Decimals",
            value: 8,
        },
        {
            key: 3,
            name: "Total Supply",
            value: formatNumber(10_000_000_000),
        },
    ]

    return (
        <div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Avatar className="w-20 h-20" src={iconUrl} />
                    <Spacer y={4} />
                    <div>
                        <div className="font-semibold text-4xl"> {symbol} </div>
                        <div className="text-foreground-500 text-sm">
                            {name}
                        </div>
                    </div>
                    {}
                    <Spacer y={4} />
                    {selectedChainName === SupportedChainName.Algorand ? (
                        <OptInButton />
                    ) : null}
                </div>
                <div>
                    <Card shadow="none" className="border border-divider">
                        <CardBody className="p-4 gap-1">
                            <div className="text-foreground-500 text-sm font-semibold">
                                {chainNameToTokenIdName[selectedChainName]}
                            </div>
                            <Link
                                color="foreground"
                                showAnchorIcon
                                isExternal
                                className="font-semibold"
                                as="button"
                            >
                                
                                {tokenAddress}
                            </Link>
                        </CardBody>
                    </Card>
                    <Spacer y={4} />
                    <div className="grid gap-4">
                        {items.map(({ key, name, value }) => (
                            <div key={key} className="flex gap-4 text-sm">
                                <div className="text-foreground-500  min-w-[120px] font-semibold">
                                    {name}
                                </div>
                                <div>{value} </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
