import { Chain, Platform, chainToPlatform } from "@wormhole-foundation/sdk-base"
import { number } from "yup"

export enum SupportedEvmChainName {
    Celo = "Celo",
    Bsc = "Bsc",
    Klaytn = "Klaytn",
}

export enum SupportedChainName {
    Sui = "Sui",
    Celo = "Celo",
    Bsc = "Bsc",
    Algorand = "Algorand",
    Solana = "Solana",
    Klaytn = "Klaytn",
}

export const defaultSupportedChainName = SupportedChainName.Sui
export const defaultSupportedPlatform = chainToPlatform(
    defaultSupportedChainName
) as SupportedPlatform

export const mapChainNameToSupportedChainName = (
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

export const mapPlatformToSupportedPlatform = (
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

export const mapSupportedChainNameToSupportedEvmChainName = (
    supportedChainName: SupportedChainName
): SupportedEvmChainName => {
    const supportedEvmChainNames: Array<SupportedEvmChainName> = Object.values(
        SupportedEvmChainName
    )
    const _supportedChainName =
        supportedChainName as unknown as SupportedEvmChainName
    if (supportedEvmChainNames.includes(_supportedChainName)) {
        return _supportedChainName
    } else {
        throw new Error("Evm chain is not supported")
    }
}

export const isSupportedEvmChainName = (
    supportedChainName: SupportedChainName
): boolean => {
    const supportedEvmChainNames: Array<SupportedEvmChainName> = Object.values(
        SupportedEvmChainName
    )
    const _supportedChainName =
        supportedChainName as unknown as SupportedEvmChainName
    return supportedEvmChainNames.includes(_supportedChainName)
}

export interface EvmProps {
    chainId: number
    rpcUrl: string
    nativeCurrency: {
        name: string
        symbol: string
        decimals: number
    }
    blockExplorerUrls: Array<string>
}
export interface SupportedChainInfo {
    name: string
    imageUrl: string
    chainId: number
    platform: SupportedPlatform
    evmProps?: {
        testnet: EvmProps
        mainnet: EvmProps
    }
}

export const chainNameToTokenIdName: Record<SupportedChainName, string> = {
    [SupportedChainName.Sui]: "Coin Type",
    [SupportedChainName.Algorand]: "Asset Id",
    [SupportedChainName.Solana]: "Contract Address",
    [SupportedChainName.Bsc]: "Contract Address",
    [SupportedChainName.Celo]: "Contract Address",
    [SupportedChainName.Klaytn]: "Contract Address",
}

export const TESTNET_CELO_RPC_URL = "https://alfajores-forno.celo-testnet.org"
export const MAINNET_CELO_RPC_URL = "https://forno.celo.org"

export const TESTNET_KLAYTN_RPC_URL = "https://public-en-baobab.klaytn.net"
export const MAINNET_KLAYTN_RPC_URL = "https://public-en-cypress.klaytn.net"

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
        evmProps: {
            testnet: {
                chainId: 44787,
                rpcUrl: TESTNET_CELO_RPC_URL,
                nativeCurrency: {
                    decimals: 18,
                    name: "CELO",
                    symbol: "CELO",
                },
                blockExplorerUrls: [
                    "https://alfajores-blockscout.celo-testnet.org",
                    "https://alfajores.celoscan.io",
                ],
            },
            mainnet: {
                chainId: 42220,
                rpcUrl: MAINNET_CELO_RPC_URL,
                nativeCurrency: {
                    decimals: 18,
                    name: "CELO",
                    symbol: "CELO",
                },
                blockExplorerUrls: [
                    "https://explorer.celo.org",
                    "https://celoscan.io",
                ],
            },
        },
    },
    [SupportedChainName.Bsc]: {
        name: "Binance Smart Chain",
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
    [SupportedChainName.Klaytn]: {
        name: "Klaytn",
        imageUrl: "/icons/klaytn.png",
        chainId: 13,
        platform: chainToPlatform("Klaytn") as SupportedPlatform,
        evmProps: {
            testnet: {
                chainId: 1001,
                rpcUrl: TESTNET_KLAYTN_RPC_URL,
                nativeCurrency: {
                    decimals: 18,
                    name: "KLAY",
                    symbol: "KLAY",
                },
                blockExplorerUrls: ["https://baobab.klaytnscope.com/"],
            },
            mainnet: {
                chainId: 8217,
                rpcUrl: MAINNET_KLAYTN_RPC_URL,
                nativeCurrency: {
                    decimals: 18,
                    name: "KLAY",
                    symbol: "KLAY",
                },
                blockExplorerUrls: ["https://klaytnscope.com/"],
            },
        },
    },
}

export const WORMHOLE_HOST_1 = "https://api.testnet.wormholescan.io"
export const wormholeHosts = [WORMHOLE_HOST_1]
