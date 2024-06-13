import { SupportedNetwork, getInnerType } from "@common"
import { getSuiClient } from "./constants.sui"

interface GetSuiBalanceParams {
    network: SupportedNetwork
    accountAddress: string
    tokenType: string
}

export const getSuiBalance = async ({
    network,
    accountAddress,
    tokenType,
}: GetSuiBalanceParams) => {
    const suiClient = getSuiClient(network)
    const coins = await suiClient.getCoins({
        owner: accountAddress,
        coinType: getInnerType(tokenType)
    })
    console.log(coins)
    return 0
}
