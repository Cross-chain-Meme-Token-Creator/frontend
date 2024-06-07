"use client"
import React from "react"
import {
    Navbar as NextUINavbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Link,
} from "@nextui-org/react"
import { ConnectWalletsModal } from "./ConnectWalletsModal"
import { useRouter } from "next/navigation"
import { NetworkSelect } from "./NetworkSelect"

export const Navbar = () => {
    const { push } = useRouter()
    return (
        <NextUINavbar isBordered classNames={{
            wrapper: "max-w-full"
        }}>
            <NavbarBrand>
                <p className="font-bold text-inherit">Cross-chain Meme Creator</p>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem>
                    <Link color="foreground" onPress={() => push("/create-token")}>
                        Create Token
                    </Link>
                </NavbarItem>
                <NavbarItem isActive>
                    <Link href="#" aria-current="page">
                        Explorer
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="foreground" href="#">
                        More
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                <NetworkSelect/>
                <NavbarItem>
                    <ConnectWalletsModal />
                </NavbarItem>
            </NavbarContent>
        </NextUINavbar>
    )
}
