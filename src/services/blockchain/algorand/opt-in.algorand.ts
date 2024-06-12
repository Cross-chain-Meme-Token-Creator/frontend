import { SupportedNetwork } from "@common"
import { getAlgodClient } from "./constants.algorand"
import {
    Transaction,
    makeAssetTransferTxnWithSuggestedParamsFromObject,
} from "algosdk"

export type GetOptInAlgorandAssetTransactionParams = {
    fromAddress: string
    assetIndex: number
}

export const getOptInAlgorandAssetTransaction = async (
    {
        fromAddress,
        assetIndex
    }: GetOptInAlgorandAssetTransactionParams,
    network: SupportedNetwork = "Testnet"
): Promise<Transaction> => {
    const suggestedParams = await getAlgodClient(network)
        .getTransactionParams()
        .do()
    return makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: fromAddress,
        to: fromAddress,
        suggestedParams,
        assetIndex,
        amount: 0,
    })
      
}
