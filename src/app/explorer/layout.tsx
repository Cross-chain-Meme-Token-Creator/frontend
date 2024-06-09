"use client"
import React from "react"
import { ExplorerProvider } from "./_hooks"

const Layout = ({ children }: { children: React.ReactNode }) => {
    return <ExplorerProvider> {children} </ExplorerProvider>
}
export default Layout
