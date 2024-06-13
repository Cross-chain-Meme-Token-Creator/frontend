import { SupportedNetwork, computeDenomination } from "@common"
import { getSuiClient } from "./constants.sui"
import { getSuiTokenInfo } from "./get-token-info.sui"

interface GetSuiBalanceParams {
    network: SupportedNetwork
    accountAddress: string
    coinType: string
}

export const getSuiBalance = async ({
    network,
    accountAddress,
    coinType,
}: GetSuiBalanceParams) => {
    const suiClient = getSuiClient(network)
    const { data } = await suiClient.getCoins({
        owner: accountAddress,
        coinType
    })

    let totalBalance: bigint = BigInt(0)
    for (const { balance } of data) {
        totalBalance += BigInt(balance)
    }

    const { decimals } = await getSuiTokenInfo({
        network,
        coinType
    })
    return computeDenomination(totalBalance, decimals)
}
