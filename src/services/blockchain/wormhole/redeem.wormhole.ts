import { Chain } from "@wormhole-foundation/sdk-base"
import {
    SignAndSendSigner,
    deserialize,
    toNative,
} from "@wormhole-foundation/sdk-definitions"
import { getWormhole } from "./base.wormhole"
import { signSendWait } from "@wormhole-foundation/sdk"

export interface RedeemParams<
    RedeemChainName extends Chain,
    SenderChainName extends Chain
> {
    serializedVaa: string
    senderChainName: SenderChainName
    redeemChainName: RedeemChainName
    signer: SignAndSendSigner<"Testnet", RedeemChainName>
}

export const redeem = async <
    RedeemChainName extends Chain,
    SenderChainName extends Chain
>({
    serializedVaa,
    redeemChainName,
    signer,
}: RedeemParams<RedeemChainName, SenderChainName>) => {
    const wormhole = await getWormhole()
    const redeemChain = wormhole.getChain(redeemChainName)

    const claimTokenBridge = await redeemChain.getTokenBridge()

    const txGenerator = claimTokenBridge.redeem(
        toNative(redeemChainName, signer.address()),
        deserialize(
            "TokenBridge:Transfer",
            Uint8Array.from(Buffer.from(serializedVaa, "base64"))
        )
    )

    const transactionIds = await signSendWait(redeemChain, txGenerator, signer)


    const { txid } = transactionIds.at(0)!

    return txid
}
