"use client"
import { Avatar, Spacer, Link } from "@nextui-org/react"
import React, { useContext } from "react"
import { TokenContext } from "../../../_hooks"
import { RootContext } from "../../../../../_hooks"
import { SupportedChainName, chainNameToTokenIdName } from "@services"
import { OptInButton } from "./OpInButton"
import { formatNumber, truncateString } from "@common"
import { ArrowPathIcon } from "@heroicons/react/24/outline"
import { BalanceInfo } from "./BalanceInfo"

export const InfoTab = () => {
    const { reducer } = useContext(TokenContext)!
    const [state, dispatch ] = reducer
    const { tokenInfo, tokenAddress } = state
    const { iconUrl, name, symbol } = { ...tokenInfo }

    const { reducer: rootReducer } = useContext(RootContext)!
    const [rootState] = rootReducer
    const { selectedChainName } = rootState

    const items = [
        {
            key: 0,
            name: chainNameToTokenIdName[selectedChainName],
            value: (
                <Link color="foreground" isExternal showAnchorIcon size="sm">
                    {truncateString(tokenAddress)}
                </Link>
            ),
        },
        {
            key: 1,
            name: "Name",
            value: <div className="text-sm">{name}</div>,
        },
        {
            key: 2,
            name: "Symbol",
            value: <div className="text-sm">{symbol}</div>,
        },
        {
            key: 3,
            name: "Decimals",
            value: <div className="text-sm">{8}</div>,
        },
        {
            key: 4,
            name: "Total Supply",
            value: (
                <div className="text-sm">{formatNumber(10_000_000_000)}</div>
            ),
        },
    ]

    return (
        <div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Avatar
                        showFallback
                        name={symbol}
                        className="w-20 h-20"
                        src={iconUrl}
                    />
                    <Spacer y={4} />
                    <div>
                        <div className="font-semibold text-2xl"> {symbol} </div>
                        <div className="text-foreground-500 text-sm">
                            {name}
                        </div>
                    </div>
                    <Spacer y={4} />
                    <div className="flex gap-2 items-center">
                        <div className="text-sm font-semibold">Balance</div>
                        <div className="flex gap-2 text-sm">
                            <BalanceInfo/>
                            <Link as="button" size="sm" onPress={() => dispatch({
                                type: "SET_REFRESH_BALANCE_KEY"
                            })}> <ArrowPathIcon className="w-3.5 h-3.5"/> </Link>
                        </div>   
                    </div>
                    {selectedChainName === SupportedChainName.Algorand ? (
                        <>
                            <Spacer y={4} />
                            <OptInButton />
                        </>
                            
                    ) : null}
                </div>
                <div>
                    <div className="grid gap-4">
                        {items.map(({ key, name, value }) => (
                            <div key={key} className="flex gap-4 text-sm">
                                <div className="min-w-[120px] font-semibold">
                                    {name}
                                </div>
                                {value}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
