import { chainToPlatform } from "@wormhole-foundation/sdk-base"

export enum SupportedChainName {
    Sui = "Sui",
    Celo = "Celo",
    Bsc = "Bsc",
    Algorand = "Algorand",
    Solana = "Solana"
}

export type SupportedPlatform = "Evm" | "Sui" | "Algorand" | "Solana"

export interface SupportedChainInfo {
    name: string,
    imageUrl: string,
    chainId: number,
    platform: SupportedPlatform,
}

export const supportedChains: Record<SupportedChainName, SupportedChainInfo> = {
    [SupportedChainName.Sui]: {
        name: "Sui",
        imageUrl: "/icons/sui.png",
        chainId: 21,
        platform: chainToPlatform("Sui"),
    },
    [SupportedChainName.Celo]: {
        name: "Celo",
        imageUrl: "/icons/celo.png",
        chainId: 14,
        platform: chainToPlatform("Celo"),
    },
    [SupportedChainName.Bsc]: {
        name: "Bsc",
        imageUrl: "/icons/bsc.png",
        chainId: 4,
        platform: chainToPlatform("Bsc"),
    },
    [SupportedChainName.Algorand]: {
        name: "Algorand",
        imageUrl: "/icons/algorand.webp",
        chainId: 8,
        platform: chainToPlatform("Algorand"),
    },
    [SupportedChainName.Solana]: {
        name: "Solana",
        imageUrl: "/icons/solana.png",
        chainId: 1,
        platform: chainToPlatform("Solana"),
    }
}

export const WORMHOLE_HOST_1 = "https://api.testnet.wormholescan.io"
export const wormholeHosts = [ WORMHOLE_HOST_1 ]