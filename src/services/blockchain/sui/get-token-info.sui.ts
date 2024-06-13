import { SupportedNetwork } from "@common"
import { getSuiClient } from "./"

export interface GetSuiTokenInfoParams {
    network: SupportedNetwork
    coinType: string
}

interface SuiTokenInfo {
    objectId: string
    name: string
    symbol: string
    decimals: number
    description?: string
    iconUrl?: string
}

export const getSuiTokenInfo = async ({
    network,
    coinType,
}: GetSuiTokenInfoParams): Promise<SuiTokenInfo> => {
    const suiClient = getSuiClient(network)

    const metadata = await suiClient.getCoinMetadata({
        coinType,
    })

    if (!metadata) throw Error("Coin metadata not found")
    const { id, name, symbol, iconUrl, decimals, description } = metadata

    return {
        objectId: id ?? "",
        name,
        symbol,
        decimals,
        iconUrl: iconUrl ?? undefined,
        description,
    }
}
