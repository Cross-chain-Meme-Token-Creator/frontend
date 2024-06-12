"use client"
import React, { useContext } from "react"
import { useAlgorandSigner } from "../../../../../../_hooks"
import { Button } from "@nextui-org/button"
import { TokenContext } from "../../../../_hooks"
import { getOptInAlgorandAssetTransaction } from "../../../../../../../services/blockchain"

export const OptInButton = () => {
    const { reducer } = useContext(TokenContext)!
    const [state] = reducer
    const { tokenAddress } = state

    const { signAndSend, address } = useAlgorandSigner()

    return (
        <Button color="primary"
            onPress={async () => {
                if (!tokenAddress || !address) return
                const txn = await getOptInAlgorandAssetTransaction({
                    assetIndex: Number.parseInt(tokenAddress),
                    fromAddress: address,
                })
                await signAndSend(txn)
            }}
        >
            Opt-In
        </Button>
    )
}
