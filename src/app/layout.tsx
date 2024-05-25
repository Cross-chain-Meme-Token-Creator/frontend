"use client"

import { Open_Sans } from "next/font/google"
import "./globals.css"
import React from "react"
import { NextUIProvider } from "@nextui-org/react"
import { SuietWallet, WalletProvider } from "@suiet/wallet-kit"
import { Navbar } from "./_components"

const font = Open_Sans({ subsets: ["latin"] })

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="en" className={font.className}>
            <body> 
                <NextUIProvider>
                    <WalletProvider defaultWallets={[
                        SuietWallet
                    ]}>
                        <Navbar />
                        {children}
                    </WalletProvider>
                </NextUIProvider>
            </body>
        </html>
      
    )
}

export default Layout
