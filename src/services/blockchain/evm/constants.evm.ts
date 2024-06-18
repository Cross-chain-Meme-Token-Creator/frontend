import { SupportedNetwork } from "@common"
import web3, { HttpProvider } from "web3"
import {
    SupportedChainName,
    SupportedEvmChainName,
    supportedChains,
} from "../constants.blockchain"

export const getHttpProvider = <C extends SupportedEvmChainName>(
    network: SupportedNetwork = "Testnet",
    chainName: C
) =>
    new HttpProvider(
        network == "Testnet"
            ? (supportedChains[chainName as unknown as SupportedChainName]
                  .evmProps?.testnet.rpcUrl as string)
            : (supportedChains[chainName as unknown as SupportedChainName]
                  .evmProps?.mainnet.rpcUrl as string)
    )

export const web3HttpObject = <C extends SupportedEvmChainName>(
    network: SupportedNetwork = "Testnet",
    chainName: C
) => new web3(getHttpProvider(network, chainName))

export const TESTNET_KLAYTN_TOKEN_FACTORY_CONTRACT_ADDRESS =
    "0x195E769b6ac5C72dC9205a103eB02e13251a25d6"
export const MAINNET_KLAYTN_TOKEN_FACTORY_CONTRACT_ADDRESS = ""

export const TESTNET_CELO_TOKEN_FACTORY_CONTRACT_ADDRESS =
    "0xc6F8B932672AB4633Ce1918eeB97559E20Be0b6f"
export const MAINNET_CELO_TOKEN_FACTORY_CONTRACT_ADDRESS = ""

export const TESTNET_BSC_TOKEN_FACTORY_CONTRACT_ADDRESS = ""
export const MAINNET_BSC_TOKEN_FACTORY_CONTRACT_ADDRESS = ""

export const getTokenFactoryContractAddress = (
    network: SupportedNetwork,
    evmChainName: SupportedEvmChainName
) => {
    switch (evmChainName) {
        case SupportedEvmChainName.Klaytn: {
            return network === "Testnet"
                ? web3.utils.toChecksumAddress(
                      TESTNET_KLAYTN_TOKEN_FACTORY_CONTRACT_ADDRESS
                  )
                : web3.utils.toChecksumAddress(
                      MAINNET_KLAYTN_TOKEN_FACTORY_CONTRACT_ADDRESS
                  )
        }
        case SupportedEvmChainName.Celo: {
            return network === "Testnet"
                ? web3.utils.toChecksumAddress(
                      TESTNET_CELO_TOKEN_FACTORY_CONTRACT_ADDRESS
                  )
                : web3.utils.toChecksumAddress(
                      MAINNET_CELO_TOKEN_FACTORY_CONTRACT_ADDRESS
                  )
        }
        case SupportedEvmChainName.Bsc: {
            return network === "Testnet"
                ? web3.utils.toChecksumAddress(
                      TESTNET_BSC_TOKEN_FACTORY_CONTRACT_ADDRESS
                  )
                : web3.utils.toChecksumAddress(
                      MAINNET_BSC_TOKEN_FACTORY_CONTRACT_ADDRESS
                  )
        }
    }
}
