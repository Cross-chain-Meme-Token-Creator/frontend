import { SupportedNetwork } from "@common"
import { getAlgodClient } from "./constants.algorand"

interface GetAlgorandBalanceParams {
    network: SupportedNetwork
    accountAddress: string
    assetId: number
}

type AlgorandAsset = {
    amount: number
    "asset-id": number
    "is-frozen": boolean
}

export const getAlgorandBalance = async ({
    network,
    accountAddress,
    assetId,
}: GetAlgorandBalanceParams) => {
    const algodClient = getAlgodClient(network)
    const accountInfo = await algodClient
        .accountInformation(accountAddress)
        .do()
    const assets = accountInfo.assets as Array<AlgorandAsset>
    const foundAsset = assets.find((asset) => asset["asset-id"] === assetId)
    return foundAsset?.amount ?? 0
}
