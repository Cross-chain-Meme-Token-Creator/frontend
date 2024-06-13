"use client"
import React, { ReactNode, createContext, useMemo } from "react"

import { DisclosureType } from "@common"
import { useDisclosure } from "@nextui-org/react"

export interface SearchBarContextValue {
    discloresures: {
        baseDiscloresure: DisclosureType
    }
}

export const SearchBarContext = createContext<SearchBarContextValue | null>(
    null
)

export const SearchBarProvider = ({ children }: { children: ReactNode }) => {
    const baseDiscloresure = useDisclosure()

    const searchBarContextValue: SearchBarContextValue = useMemo(
        () => ({
            discloresures: {
                baseDiscloresure,
            },
        }),
        [baseDiscloresure]
    )
    return (
        <SearchBarContext.Provider value={searchBarContextValue}>
            {children}
        </SearchBarContext.Provider>
    )
}
