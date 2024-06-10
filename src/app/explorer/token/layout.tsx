"use client"
import React from "react"
import { TokenProvider } from "./_hooks"

const Layout = ({ children }: { children: React.ReactNode }) => {
    return <TokenProvider> {children} </TokenProvider>
}

export default Layout
