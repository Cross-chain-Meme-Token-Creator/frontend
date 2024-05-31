"use client"

import { Open_Sans } from "next/font/google"
import "./globals.css"
import React from "react"
import { NextUIProvider } from "@nextui-org/react"
import { SuiWallet, SuietWallet, WalletProvider } from "@suiet/wallet-kit"
import { Navbar } from "./_components"
import { MetaMaskProvider } from "@metamask/sdk-react"
import { RootProvider } from "./_hooks"
import { NotificationModal, NotificationModalProvider } from "./_components"

const font = Open_Sans({ subsets: ["latin"] })

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="en" className={font.className}>
            <body>
                <RootProvider>
                    <NextUIProvider>
                        <WalletProvider
                            defaultWallets={[SuietWallet, SuiWallet]}
                        >
                            <MetaMaskProvider
                                sdkOptions={{
                                    dappMetadata: {
                                        name: "Example React UI Dapp",
                                    },
                                }}
                            >
                                <NotificationModalProvider>
                                    <NotificationModal/>
                                    <Navbar />
                                    {children}
                                </NotificationModalProvider>
                            </MetaMaskProvider>
                        </WalletProvider>
                    </NextUIProvider>
                </RootProvider>
            </body>
        </html>
    )
}

export default Layout
