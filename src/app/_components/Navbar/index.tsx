"use client"
import React from "react"
import {
    Navbar as NextUINavbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Link,
} from "@nextui-org/react"
import { useRouter } from "next/navigation"
import { SearchBar } from "./SearchBar"
import { DarkModeSwitch } from "./DarkModeSwitch"

export const Navbar = () => {
    const { push } = useRouter()
    return (
        <NextUINavbar
            isBlurred={false}
            isBordered
            classNames={{
                wrapper: "max-w-[1280px]",
            }}
        >
            <NavbarBrand>
                <p className="font-bold text-inherit">
                    Cross-chain Meme Creator
                </p>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem>
                    <Link
                        as="button"
                        color="foreground"
                        onPress={() => push("/create-token")}
                        size="sm"
                    >
                        Create Token
                    </Link>
                </NavbarItem>
                <NavbarItem isActive>
                    <Link as="button" href="#" aria-current="page" size="sm">
                        Explorer
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link as="button" color="foreground" href="#" size="sm">
                        More
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem>
                    <DarkModeSwitch />
                </NavbarItem>
                <NavbarItem>
                    <SearchBar />
                </NavbarItem>
            </NavbarContent>
        </NextUINavbar>
    )
}

export interface FoundTokenInfo {
    decimals: number
    name: string
    description: string
    iconUrl: string
    symbol: string
}
