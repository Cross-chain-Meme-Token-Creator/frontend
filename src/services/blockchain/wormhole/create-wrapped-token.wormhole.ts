import { getWormhole } from "./base.wormhole"
import {
    SignAndSendSigner,
    VAA,
    toNative,
} from "@wormhole-foundation/sdk-definitions"
import { Chain, Network, signSendWait } from "@wormhole-foundation/sdk"

export interface CreateWrappedParams<
    N extends Network,
    ChainName extends Chain
> {
    network: N
    targetChainName: ChainName
    vaa: VAA<"TokenBridge:AttestMeta">
    signer: SignAndSendSigner<N, ChainName>
}

export const createWrappedToken = async <
    N extends Network,
    ChainName extends Chain
>({
    network,
    targetChainName,
    vaa,
    signer,
}: CreateWrappedParams<N, ChainName>) => {
    const wormhole = await getWormhole(network)
    const targetChain = wormhole.getChain(targetChainName)

    const targetTokenBridge = await targetChain.getTokenBridge()
    const txGenerator = targetTokenBridge.submitAttestation(
        vaa,
        toNative(targetChainName, signer.address())
    )

    const transactionIds = await signSendWait(targetChain, txGenerator, signer)

    const { txid } = transactionIds.at(0)!
    return txid
}
