"use client"
import React from "react"
import { ExplorerSuiIdProvider } from "./_hooks"

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (<ExplorerSuiIdProvider> {children} </ExplorerSuiIdProvider>)
}
export default Layout
