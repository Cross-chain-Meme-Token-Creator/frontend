import { Chain, Network } from "@wormhole-foundation/sdk-base"
import {
    SignAndSendSigner,
    VAA,
    toNative,
} from "@wormhole-foundation/sdk-definitions"
import { getWormhole } from "./base.wormhole"
import { signSendWait } from "@wormhole-foundation/sdk"

export interface RedeemParams<
    N extends Network,
    RedeemChainName extends Chain,
    SenderChainName extends Chain
> {
    network: N,
    vaa: VAA<"TokenBridge:Transfer">
    senderChainName: SenderChainName
    redeemChainName: RedeemChainName
    signer: SignAndSendSigner<N, RedeemChainName>
}

export const redeem = async <
    N extends Network,
    RedeemChainName extends Chain,
    SenderChainName extends Chain
>({
    network,
    vaa,
    redeemChainName,
    signer,
}: RedeemParams<N, RedeemChainName, SenderChainName>) => {

    const wormhole = await getWormhole(network)
    const redeemChain = wormhole.getChain(redeemChainName)

    const claimTokenBridge = await redeemChain.getTokenBridge()

    const txGenerator = claimTokenBridge.redeem(
        toNative(redeemChainName, signer.address()),
        vaa
        // deserialize(
        //     "TokenBridge:Transfer",
        //     Uint8Array.from(Buffer.from(serializedVaa, "base64"))
        // )
    )

    const transactionIds = await signSendWait(redeemChain, txGenerator, signer)
    const { txid } = transactionIds.at(0)!
    return txid
}
