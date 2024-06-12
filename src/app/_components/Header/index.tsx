"use client"
import React, { useContext } from "react"
import { ConnectWalletsModal } from "./ConnectWalletsModal"
import { NetworkSelect } from "./NetworkSelect"
import {
    NavbarContent,
    NavbarItem,
    Navbar as NextUINavbar,
} from "@nextui-org/react"
import { ChainSelect } from "../../_shared-components"
import { RootContext } from "../../_hooks"
import { usePathname, useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"

export const Header = () => {
    const { reducer } = useContext(RootContext)!
    const [state, dispatch] = reducer
    const { selectedChainName } = state

    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()

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
                        setChainName={(chainName) => {
                            const params = new URLSearchParams(searchParams)
                            
                            params.set("chainName", selectedChainName)
                            router.push(`${pathname}?${params.toString()}`, {
                                scroll: false,
                            })

                            dispatch({
                                type: "SET_CHAIN_NAME",
                                payload: chainName,
                            })
                        }}
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
