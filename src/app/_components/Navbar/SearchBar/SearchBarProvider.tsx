"use client"
import React, { ReactNode, createContext, useMemo } from "react"

import { DisclosureType } from "@common"
import { useDisclosure } from "@nextui-org/react"

export interface SearchBarContextValue {
    discloresures: {
        originDiscloresure: DisclosureType
    }
}

export const SearchBarContext = createContext<SearchBarContextValue | null>(
    null
)

export const SearchBarProvider = ({ children }: { children: ReactNode }) => {
    const originDiscloresure = useDisclosure()

    const searchBarContextValue: SearchBarContextValue = useMemo(
        () => ({
            discloresures: {
                originDiscloresure,
            },
        }),
        [originDiscloresure]
    )
    return (
        <SearchBarContext.Provider value={searchBarContextValue}>
            {children}
        </SearchBarContext.Provider>
    )
}
