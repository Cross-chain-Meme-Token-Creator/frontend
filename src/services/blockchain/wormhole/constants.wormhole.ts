import { Chain, Platform, chainToPlatform } from "@wormhole-foundation/sdk-base"

export enum SupportedChainName {
    Sui = "Sui",
    Celo = "Celo",
    Bsc = "Bsc",
    Algorand = "Algorand",
    Solana = "Solana",
}

export const defaultSupportedChainName = SupportedChainName.Sui

export const tryMapChainNameToSupportedChainName = (
    chainName: Chain
): SupportedChainName => {
    const supportedChainNames: Array<SupportedChainName> =
        Object.values(SupportedChainName)
    const _chainName = chainName as SupportedChainName
    if (supportedChainNames.includes(_chainName)) {
        return _chainName
    } else {
        return defaultSupportedChainName
    }
}

export enum SupportedPlatform {
    Evm = "Evm",
    Sui = "Sui",
    Algorand = "Algorand",
    Solana = "Solana",
}

export const mapChainToSupportedPlatform = (
    platform: Platform
): SupportedPlatform => {
    const supportedPlatforms: Array<SupportedPlatform> =
        Object.values(SupportedPlatform)
    const _platform = platform as SupportedPlatform
    if (supportedPlatforms.includes(_platform)) {
        return _platform
    } else {
        throw new Error("Platform is not supported")
    }
}

export interface SupportedChainInfo {
    name: string
    imageUrl: string
    chainId: number
    platform: SupportedPlatform
}

export const chainNameToTokenIdName: Record<SupportedChainName, string> = {
    [SupportedChainName.Sui]: "Object ID",
    [SupportedChainName.Algorand]: "Asset Id",
    [SupportedChainName.Solana]: "Contract Address",
    [SupportedChainName.Bsc]: "Contract Address",
    [SupportedChainName.Celo]: "Contract Address",
}

export const supportedChains: Record<SupportedChainName, SupportedChainInfo> = {
    [SupportedChainName.Sui]: {
        name: "Sui",
        imageUrl: "/icons/sui.png",
        chainId: 21,
        platform: chainToPlatform("Sui") as SupportedPlatform,
    },
    [SupportedChainName.Celo]: {
        name: "Celo",
        imageUrl: "/icons/celo.png",
        chainId: 14,
        platform: chainToPlatform("Celo") as SupportedPlatform,
    },
    [SupportedChainName.Bsc]: {
        name: "Bsc",
        imageUrl: "/icons/bsc.png",
        chainId: 4,
        platform: chainToPlatform("Bsc") as SupportedPlatform,
    },
    [SupportedChainName.Algorand]: {
        name: "Algorand",
        imageUrl: "/icons/algorand.webp",
        chainId: 8,
        platform: chainToPlatform("Algorand") as SupportedPlatform,
    },
    [SupportedChainName.Solana]: {
        name: "Solana",
        imageUrl: "/icons/solana.png",
        chainId: 1,
        platform: chainToPlatform("Solana") as SupportedPlatform,
    },
}

export const WORMHOLE_HOST_1 = "https://api.testnet.wormholescan.io"
export const wormholeHosts = [WORMHOLE_HOST_1]
