import { SupportedNetwork } from "@common"
import { SuiClient } from "@mysten/sui.js/client"

export const SUI_MAINNET_RPC_URL = "https://fullnode.mainnet.sui.io:443"
export const SUI_TESTNET_RPC_URL = "https://fullnode.testnet.sui.io:443"

export const getSuiClient = (network: SupportedNetwork = "Testnet") =>
    new SuiClient({
        url: network === "Testnet" ? SUI_TESTNET_RPC_URL : SUI_MAINNET_RPC_URL,
    })
