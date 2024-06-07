import { SupportedNetwork } from "@common"
import { getAlgodClient } from "./constants.algorand"
import {
    Transaction,
    makeAssetCreateTxnWithSuggestedParamsFromObject,
} from "algosdk"

export type CreateAlgorandTokenParams = {
    fromAddress: string
    decimals: number
    name: string
    symbol: string
    iconUrl: string
    totalSupply: bigint
}

export const getMakeAlgorandAssetTransaction = async (
    {
        fromAddress,
        decimals,
        name,
        symbol,
        totalSupply,
        iconUrl,
    }: CreateAlgorandTokenParams,
    network: SupportedNetwork = "Testnet"
): Promise<Transaction> => {
    const suggestedParams = await getAlgodClient(network)
        .getTransactionParams()
        .do()
    return makeAssetCreateTxnWithSuggestedParamsFromObject({
        from: fromAddress,
        suggestedParams,
        defaultFrozen: false,
        unitName: symbol,
        assetName: name,
        assetURL: iconUrl,
        total: totalSupply,
        decimals,
    })
}
