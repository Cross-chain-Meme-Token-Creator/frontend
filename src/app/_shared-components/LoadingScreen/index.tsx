"use client"
import { Spinner } from "@nextui-org/react"
import React from "react"

interface LoadingScreenProps {
    height?: number
}

export const LoadingScreen = (props: LoadingScreenProps) => {
    let { height } = props
    height = height ?? 300

    const className = `"w-full h-[${height}px] grid place-content-center"`
    return (
        <div className={className}>
            <Spinner size="lg"/>
        </div>
    )
}