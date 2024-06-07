import { bcs } from "@mysten/sui.js/bcs"
import { getTokenByteCode } from "../../backend"
import { TransactionBlock } from "@mysten/sui.js/transactions"

export type CreateSuiTokenParams = {
    decimals: number
    name: string
    symbol: string
    description: string
    iconUrl: string
    totalSupply: bigint
}

export const getCreateSuiTokenTransactionBlock = async ({
    decimals,
    description,
    iconUrl,
    name,
    symbol,
    totalSupply,
}: CreateSuiTokenParams): Promise<TransactionBlock> => {
    const { dependencies, modules } = await getTokenByteCode({
        decimals,
        description,
        iconUrl,
        name,
        symbol,
        totalSupply: totalSupply.toString(),
    })
    const tx = new TransactionBlock()
    const [upgradeCap] = tx.publish({
        modules,
        dependencies,
    })
    tx.transferObjects([upgradeCap], bcs.Address.serialize("0x0"))
    return tx
}
