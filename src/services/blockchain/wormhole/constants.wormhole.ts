import { appConfig } from "@config"

export enum SupportedChainName {
    Sui = "Sui",
    Celo = "Celo",
    Bsc = "Bsc",
    Algorand = "Algorand",
    Solana = "Solana"
}

export type SupportedChainType = "evm" | "sui" | "algorand" | "solana"

export interface SupportedChainInfo {
    rpcUrl: string,
    name: string,
    imageUrl: string,
    chainId: number,
    chainType: SupportedChainType,
}

const SUI_MAINNET_RPC_URL = "https://fullnode.mainnet.sui.io:443"
const SUI_TESTNET_RPC_URL = "https://fullnode.testnet.sui.io:443"

const CELO_MAINNET_RPC_URL = "https://forno.celo.org/"
const CELO_TESTNET_RPC_URL = "https://alfajores-forno.celo-testnet.org"

const BSC_MAINNET_RPC_URL = "https://bsc-dataseed1.binance.org/"
const BSC_TESTNET_RPC_URL = "https://data-seed-prebsc-1-s1.binance.org:8545/"

const ALGORAND_MAINNET_RPC_URL = ""
const ALGORAND_TESTNET_RPC_URL = "https://api.tatum.io/v3/blockchain/node/algorand-testnet-algod"

const SOLANA_MAINNET_RPC_URL = "https://api.mainnet-beta.solana.com"
const SOLANA_TESTNET_RPC_URL = "https://api.testnet.solana.com"


export const supportedChains: Record<SupportedChainName, SupportedChainInfo> = {
    [SupportedChainName.Sui]: {
        rpcUrl: appConfig.inProduction ? SUI_MAINNET_RPC_URL : SUI_TESTNET_RPC_URL,
        name: "Sui",
        imageUrl: "/icons/sui.png",
        chainId: 21,
        chainType: "sui",
    },
    [SupportedChainName.Celo]: {
        rpcUrl: appConfig.inProduction ? CELO_MAINNET_RPC_URL : CELO_TESTNET_RPC_URL,
        name: "Celo",
        imageUrl: "/icons/celo.png",
        chainId: 14,
        chainType: "evm",
    },
    [SupportedChainName.Bsc]: {
        rpcUrl: appConfig.inProduction ? BSC_MAINNET_RPC_URL : BSC_TESTNET_RPC_URL,
        name: "Bsc",
        imageUrl: "/icons/bsc.png",
        chainId: 4,
        chainType: "evm",
    },
    [SupportedChainName.Algorand]: {
        rpcUrl: appConfig.inProduction ? ALGORAND_MAINNET_RPC_URL : ALGORAND_TESTNET_RPC_URL,
        name: "Algorand",
        imageUrl: "/icons/algorand.webp",
        chainId: 8,
        chainType: "algorand",
    },
    [SupportedChainName.Solana]: {
        rpcUrl: appConfig.inProduction ? SOLANA_MAINNET_RPC_URL : SOLANA_TESTNET_RPC_URL,
        name: "Solana",
        imageUrl: "/icons/solana.png",
        chainId: 1,
        chainType: "solana",
    }
}

export const WORMHOLE_HOST_1 = "https://api.testnet.wormholescan.io"
export const wormholeHosts = [ WORMHOLE_HOST_1 ]