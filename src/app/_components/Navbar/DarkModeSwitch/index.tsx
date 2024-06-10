"use client"

import { MoonIcon, SunIcon } from "@heroicons/react/24/solid"
import { Switch } from "@nextui-org/react"
import { useTheme } from "next-themes"
import React from "react"

export const DarkModeSwitch = () => {
    const { theme, setTheme } = useTheme()

    return (
        <Switch
            isSelected={theme === "dark"}
            onValueChange={(isSelected) => setTheme(isSelected ? "dark" : "light")}
            size="lg"
            thumbIcon={({ isSelected, className }) =>
                isSelected ? (
                    <MoonIcon className={`${className} w-5 h-5`} />
                ) : (
                    <SunIcon className={`${className} w-5 h-5`} />
                )
            }
        />      
    )
}
