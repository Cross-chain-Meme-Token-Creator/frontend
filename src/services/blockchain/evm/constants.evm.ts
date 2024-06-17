import { SupportedNetwork } from "@common"
import Web3, { HttpProvider } from "web3"

export const CELO_MAINNET_RPC_URL = "https://forno.celo.org/"
export const CELO_TESTNET_RPC_URL = "https://alfajores-forno.celo-testnet.org"

export const BSC_MAINNET_RPC_URL = "https://bsc-dataseed1.binance.org/"
export const BSC_TESTNET_RPC_URL =
    "https://data-seed-prebsc-1-s1.binance.org:8545/"

type Networks = {
    mainnet: string
    testnet: string
}

export type SupportedEvmChains = "Bsc" | "Celo"

export const evmChainToRpc: Record<SupportedEvmChains, Networks> = {
    Celo: {
        mainnet: CELO_MAINNET_RPC_URL,
        testnet: CELO_TESTNET_RPC_URL,
    },
    Bsc: {
        mainnet: BSC_MAINNET_RPC_URL,
        testnet: BSC_TESTNET_RPC_URL,
    },
}

export const httpProvider = <C extends SupportedEvmChains>(
    network: SupportedNetwork = "Testnet",
    chainName: C
) =>
        new HttpProvider(
            network == "Testnet"
                ? evmChainToRpc[chainName].testnet
                : evmChainToRpc[chainName].mainnet
        )

export const web3HttpObject = <C extends SupportedEvmChains>(
    network: SupportedNetwork = "Testnet",
    chainName: C
) => new Web3(httpProvider(network, chainName))

export const TESTNET_TOKEN_FACTORY_CONTRACT_ADDRESS =
    "0x98b01f5269104E5acae6F3440ca785D043d76c79"
export const MAINNET_TOKEN_FACTORY_CONTRACT_ADDRESS = ""

export const factoryContractAddress = (network: SupportedNetwork) =>
    network === "Testnet"
        ? TESTNET_TOKEN_FACTORY_CONTRACT_ADDRESS
        : MAINNET_TOKEN_FACTORY_CONTRACT_ADDRESS
