import { bcs } from "@mysten/sui.js/bcs"
import { getTokenByteCode } from "../../../backend"
import { TransactionBlock } from "@mysten/sui.js/transactions"

export type CreateTokenParams = {
    decimals: number
    name: string
    symbol: string
    description: string
    iconUrl: string
    totalSupply: string
}

export const getCreateSuiTokenTransactionBlock = async (
    params: CreateTokenParams
): Promise<TransactionBlock> => {
    const { dependencies, modules } = await getTokenByteCode(params)
    const tx = new TransactionBlock()
    const [upgradeCap] = tx.publish({
        modules,
        dependencies,
    })
    tx.transferObjects([upgradeCap], bcs.Address.serialize("0x0"))
    return tx
}
