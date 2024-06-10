"use client"
import React, { useContext } from "react"
import { ConnectWalletsModal } from "./ConnectWalletsModal"
import { NetworkSelect } from "./NetworkSelect"
import {
    NavbarContent,
    NavbarItem,
    Navbar as NextUINavbar,
} from "@nextui-org/react"
import { ChainSelect } from "@shared"
import { RootContext } from "../../_hooks"

export const Header = () => {
    const { reducer } = useContext(RootContext)!
    const [state, dispatch] = reducer
    const { selectedChainName } = state

    return (
        <NextUINavbar
            className="bg-primary-100"
            classNames={{
                wrapper: "max-w-[1280px]",
            }}
        >
            <NavbarContent justify="start">
                <NavbarItem className="w-40">
                    <ChainSelect
                        chainName={selectedChainName}
                        setChainName={(chainName) =>
                            dispatch({
                                type: "SET_CHAIN_NAME",
                                payload: chainName,
                            })
                        }
                        selectedChainName={selectedChainName}
                    />
                </NavbarItem>
                <NavbarItem>
                    <NetworkSelect />
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem>
                    <ConnectWalletsModal />
                </NavbarItem>
            </NavbarContent>
        </NextUINavbar>
    )
}
