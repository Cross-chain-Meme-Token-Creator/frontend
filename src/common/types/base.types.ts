import { useDisclosure } from "@nextui-org/react"

export type DisclosureType = ReturnType<typeof useDisclosure>

export type SupportedNetwork = "Testnet" | "Mainnet"

export type SizeType = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full" | undefined

export type NotifyFunction = () => void