"use client"
import { ReactNode } from "react"
import { CreateTokenProvider } from "./_hooks"

const Layout = ({ children }: { children: ReactNode }) => (
    <CreateTokenProvider>{children}</CreateTokenProvider>
)

export default Layout
