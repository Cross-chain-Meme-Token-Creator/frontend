import { SupportedNetwork } from "@common"
import algosdk from "algosdk"

export const TESTNET_ALGOD_SERVER_URL = "https://testnet-api.algonode.cloud"
export const TESTNET_INDEXER_SERVER_URL = "https://testnet-idx.algonode.cloud"

export const MAINNET_ALGOD_SERVER_URL = "https://mainnet-api.algonode.cloud"
export const MAINNET_INDEXER_SERVER_URL = "https://mainnet-idx.algonode.cloud"

export const getAlgodClient = (network: SupportedNetwork = "Testnet") => {
    const algodServerUrl = network == "Testnet" ? TESTNET_ALGOD_SERVER_URL : MAINNET_ALGOD_SERVER_URL
    return new algosdk.Algodv2("", algodServerUrl)
} 