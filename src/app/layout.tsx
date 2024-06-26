"use client"

import { Open_Sans } from "next/font/google"
import "./globals.css"
import React, { Suspense } from "react"
import { NextUIProvider } from "@nextui-org/react"
import { SuietWallet, WalletProvider } from "@suiet/wallet-kit"
import {
    Header,
    Navbar,
    SuspenseScreen,
    SignTransactionModalProvider,
    ErrorToastProvider,
    NotificationModalProvider,
    WalletConnectionRequiredModalProvider,
    TransactionToastProvider,
} from "./_components"
import { MetaMaskProvider } from "@metamask/sdk-react-ui"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { GoogleAnalytics } from "@next/third-parties/google"

import {
    AlgorandSignerProvider,
    EvmSignerProvider,
    RootProvider,
    ConnectWalletProvider
} from "./_hooks"
import { PassphraseAndQRCodeModalProvider } from "./_components/PassphraseAndQRCodeModalProvider"

const font = Open_Sans({ subsets: ["latin"] })

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="en" className={font.className}>
            <body className="min-h-screen grid">
                <Suspense fallback={<SuspenseScreen />}>
                    <RootProvider>
                        <NextUIProvider className="h-full">
                            <NextThemesProvider
                                attribute="class"
                                defaultTheme="light"
                            >
                                <ConnectWalletProvider>
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
                                                    <TransactionToastProvider>
                                                        <SignTransactionModalProvider>
                                                            <WalletConnectionRequiredModalProvider>
                                                                <PassphraseAndQRCodeModalProvider>
                                                                    <NotificationModalProvider>
                                                                        <ErrorToastProvider>
                                                                            <GoogleAnalytics gaId="G-XYZ" />

                                                                            <Header />
                                                                            <Navbar />
                                                                            {children}
                                                                        </ErrorToastProvider>
                                                                    </NotificationModalProvider>
                                                                </PassphraseAndQRCodeModalProvider>
                                                            </WalletConnectionRequiredModalProvider>
                                                        </SignTransactionModalProvider>
                                                    </TransactionToastProvider>
                                                </MetaMaskProvider>
                                            </WalletProvider>
                                        </AlgorandSignerProvider>
                                    </EvmSignerProvider>
                                </ConnectWalletProvider>
                            </NextThemesProvider>
                        </NextUIProvider>
                    </RootProvider>
                </Suspense>
            </body>
        </html>
    )
}

export default Layout
