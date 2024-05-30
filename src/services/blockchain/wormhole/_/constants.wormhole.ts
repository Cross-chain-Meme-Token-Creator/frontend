import { appConfig } from "@config"

export enum SupportedChainName {
    Sui = "Sui",
    Celo = "Celo",
    Algorand = "Algorand",
    Solana = "Solana"
}

export interface SupportedChainInfo {
    rpcUrl: string,
    name: string,
    imageUrl: string,
    chainId: number,
    chainType: "evm" | "sui" | "algorand" | "solana",
    wormholeCoreContract: string,
    wormholeTokenBridgeContract: string
}

const SUI_MAINNET_RPC_URL = "https://fullnode.mainnet.sui.io:443"
const SUI_TESTNET_RPC_URL = "https://fullnode.testnet.sui.io:443"

const SUI_MAINNET_WORMHOLE_CORE_CONTRACT = "0xaeab97f96cf9877fee2883315d459552b2b921edc16d7ceac6eab944dd88919c"
const SUI_TESTNET_WORMHOLE_CORE_CONTRACT = "0x31358d198147da50db32eda2562951d53973a0c0ad5ed738e9b17d88b213d790"

const SUI_MAINNET_WORMHOLE_TOKEN_BRIDGE_CONTRACT = "0xc57508ee0d4595e5a8728974a4a93a787d38f339757230d441e895422c07aba9"
const SUI_TESTNET_WORMHOLE_TOKEN_BRIDGE_CONTRACT = "0x6fb10cdb7aa299e9a4308752dadecb049ff55a892de92992a1edbd7912b3d6da"

const CELO_MAINNET_WORMHOLE_CORE_CONTRACT = "0xa321448d90d4e5b0A732867c18eA198e75CAC48E"
const CELO_TESTNET_WORMHOLE_CORE_CONTRACT = "0x88505117CA88e7dd2eC6EA1E13f0948db2D50D56"

const CELO_MAINNET_WORMHOLE_TOKEN_BRIDGE_CONTRACT = "0x796Dff6D74F3E27060B71255Fe517BFb23C93eed"
const CELO_TESTNET_WORMHOLE_TOKEN_BRIDGE_CONTRACT = "0x05ca6037eC51F8b712eD2E6Fa72219FEaE74E153"

const ALGORAND_MAINNET_WORMHOLE_CORE_CONTRACT = "842125965"
const ALGORAND_TESTNET_WORMHOLE_CORE_CONTRACT = "86525623"

const ALGORAND_MAINNET_WORMHOLE_TOKEN_BRIDGE_CONTRACT = "842126029"
const ALGORAND_TESTNET_WORMHOLE_TOKEN_BRIDGE_CONTRACT = "86525641"

const SOLANA_MAINNET_WORMHOLE_CORE_CONTRACT = "worm2ZoG2kUd4vFXhvjh93UUH596ayRfgQ2MgjNMTth"
const SOLANA_TESTNET_WORMHOLE_CORE_CONTRACT = "3u8hJUVTA4jH1wYAyUur7FFZVQ8H635K3tSHHF4ssjQ5"

const SOLANA_MAINNET_WORMHOLE_TOKEN_BRIDGE_CONTRACT = "wormDTUJ6AWPNvk59vGQbDvGJmqbDTdgWgAqcLBCgUb"
const SOLANA_TESTNET_WORMHOLE_TOKEN_BRIDGE_CONTRACT = "DZnkkTmCiFWfYTfT41X3Rd1kDgozqzxWaHqsw6W4x2oe"

const CELO_MAINNET_RPC_URL = "https://forno.celo.org/"
const CELO_TESTNET_RPC_URL = "https://alfajores-forno.celo-testnet.org"

const ALGORAND_MAINNET_RPC_URL = ""
const ALGORAND_TESTNET_RPC_URL = "https://api.tatum.io/v3/blockchain/node/algorand-testnet-algod"

export const supportedChains: Record<SupportedChainName, SupportedChainInfo> = {
    [SupportedChainName.Sui]: {
        rpcUrl: appConfig.inProduction ? SUI_MAINNET_RPC_URL : SUI_TESTNET_RPC_URL,
        name: "Sui",
        imageUrl: "/icons/sui.png",
        chainId: 21,
        chainType: "sui",
        wormholeCoreContract: appConfig.inProduction ? SUI_MAINNET_WORMHOLE_CORE_CONTRACT : SUI_TESTNET_WORMHOLE_CORE_CONTRACT,
        wormholeTokenBridgeContract: appConfig.inProduction ? SUI_MAINNET_WORMHOLE_TOKEN_BRIDGE_CONTRACT : SUI_TESTNET_WORMHOLE_TOKEN_BRIDGE_CONTRACT
    },
    [SupportedChainName.Celo]: {
        rpcUrl: appConfig.inProduction ? CELO_MAINNET_RPC_URL : CELO_TESTNET_RPC_URL,
        name: "Celo",
        imageUrl: "/icons/celo.png",
        chainId: 14,
        chainType: "evm",
        wormholeCoreContract: appConfig.inProduction ? CELO_MAINNET_WORMHOLE_CORE_CONTRACT : CELO_TESTNET_WORMHOLE_CORE_CONTRACT,
        wormholeTokenBridgeContract: appConfig.inProduction ? CELO_MAINNET_WORMHOLE_TOKEN_BRIDGE_CONTRACT : CELO_TESTNET_WORMHOLE_TOKEN_BRIDGE_CONTRACT
    },
    [SupportedChainName.Algorand]: {
        rpcUrl: appConfig.inProduction ? ALGORAND_MAINNET_RPC_URL : ALGORAND_TESTNET_RPC_URL,
        name: "Algorand",
        imageUrl: "/icons/algorand.webp",
        chainId: 8,
        chainType: "algorand",
        wormholeCoreContract: appConfig.inProduction ? ALGORAND_MAINNET_WORMHOLE_CORE_CONTRACT : ALGORAND_TESTNET_WORMHOLE_CORE_CONTRACT,
        wormholeTokenBridgeContract: appConfig.inProduction ? ALGORAND_MAINNET_WORMHOLE_TOKEN_BRIDGE_CONTRACT : ALGORAND_TESTNET_WORMHOLE_TOKEN_BRIDGE_CONTRACT
    },
    [SupportedChainName.Solana]: {
        rpcUrl: appConfig.inProduction ? "" : "",
        name: "Solana",
        imageUrl: "",
        chainId: 2,
        chainType: "solana",
        wormholeCoreContract: appConfig.inProduction ? SOLANA_MAINNET_WORMHOLE_CORE_CONTRACT : SOLANA_TESTNET_WORMHOLE_CORE_CONTRACT,
        wormholeTokenBridgeContract: appConfig.inProduction ? SOLANA_MAINNET_WORMHOLE_TOKEN_BRIDGE_CONTRACT : SOLANA_TESTNET_WORMHOLE_TOKEN_BRIDGE_CONTRACT
    }
}

export const wormholeHosts = ["https://api.testnet.wormholescan.io"]