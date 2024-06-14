import { SupportedNetwork } from "@common"
import { getAlgodClient } from "./constants.algorand"

export interface AlgorandAsset {
    id: string
    params: {
        decimals: number
        name: string
        total: number
        "unit-name": string
        url: string 
    }
}

export interface GetAlgorandTokenInfoParams {
    network: SupportedNetwork
    assetId: number
}

interface AlgorandTokenInfo {
    name: string
    symbol: string
    decimals: number
    description?: string
    iconUrl?: string
}

export const getAlgorandTokenInfo = async ({
    network,
    assetId,
}: GetAlgorandTokenInfoParams): Promise<AlgorandTokenInfo> => {
    const algodClient = getAlgodClient(network)

    const asset = (await algodClient
        .getAssetByID(assetId)
        .do()) as AlgorandAsset
    const { params } = asset

    const { decimals, name, "unit-name": symbol, url: iconUrl } = params

    return {
        decimals,
        name,
        iconUrl,
        symbol,
    }
}
