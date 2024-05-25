import { Currency, intoBase64 } from "./pkg.sui.feature"
import { TransactionBlock } from "@mysten/sui.js/transactions"

export type CreateCurrencyTxParams = {
    currentAddr: string
    currency: Currency
}

export const createCurrencyTx = ({
    currentAddr,
    currency,
}: CreateCurrencyTxParams) => {
    try {
        const pkg = intoBase64(currency)
        const dependencies = [
            "0x0000000000000000000000000000000000000000000000000000000000000001",
            "0x0000000000000000000000000000000000000000000000000000000000000002",
        ]
        const tx = new TransactionBlock()
        const [upgradeCap] = tx.publish({
            modules: [pkg],
            dependencies,
        })
        tx.transferObjects([upgradeCap], tx.pure(currentAddr))
        return tx
    }
    catch (error) {
        console.log(error)
    }
}
