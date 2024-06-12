"use client"
import React, { useContext } from "react"
import { MainSection } from "./_components"
import { TokenContext } from "./_hooks"
import { TokenNotFound } from "./_components/TokenNotFound"
import { LoadingScreen } from "../../_shared-components"

const Page = () => {
    const { reducer } = useContext(TokenContext)!
    const [state] = reducer
    const { isNotFound, loadings } = state
    const { isLoading } = loadings

    return (
        <>
            {isLoading ? (
                <LoadingScreen />
            ) : (
                <div className="pt-6">
                    {isNotFound ? <TokenNotFound /> : <MainSection />}
                </div>
            )}
        </>
    )
}

export default Page
