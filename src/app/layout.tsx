"use client"

import { Open_Sans } from "next/font/google"
import "./globals.css"
import React, { Suspense } from "react"
import { NextUIProvider, Spinner } from "@nextui-org/react"
import { SuietWallet, WalletProvider } from "@suiet/wallet-kit"
import { Header, Navbar } from "./_components"
import { MetaMaskProvider } from "@metamask/sdk-react-ui"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { GoogleAnalytics } from "@next/third-parties/google"

import {
    AlgorandSignerProvider,
    EvmSignerProvider,
    RootProvider,
} from "./_hooks"

import { NotificationModal, NotificationModalProvider } from "./_components"

const font = Open_Sans({ subsets: ["latin"] })

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="en" className={font.className}>
            <body>
                <Suspense fallback={<Spinner/>}>
                    <RootProvider>
                        <NextUIProvider>
                            <NextThemesProvider
                                attribute="class"
                                defaultTheme="light"
                            >
                                <EvmSignerProvider>
                                    <AlgorandSignerProvider>
                                        <WalletProvider
                                            defaultWallets={[SuietWallet]}
                                        >
                                            <MetaMaskProvider
                                                sdkOptions={{
                                                    dappMetadata: {
                                                        name: "Example React UI Dapp",
                                                    },
                                                }}
                                            >
                                                <NotificationModalProvider>
                                                    <GoogleAnalytics gaId="G-XYZ" />
                                                    <NotificationModal />
                                                    <Header />
                                                    <Navbar />
                                                    {children}
                                                </NotificationModalProvider>
                                            </MetaMaskProvider>
                                        </WalletProvider>
                                    </AlgorandSignerProvider>
                                </EvmSignerProvider>
                            </NextThemesProvider>
                        </NextUIProvider>
                    </RootProvider>
                </Suspense>
            </body>
        </html>
    )
}

export default Layout
