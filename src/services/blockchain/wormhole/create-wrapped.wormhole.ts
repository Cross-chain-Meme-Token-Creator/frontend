import { getWormhole } from "./base.wormhole"
import { SignAndSendSigner, VAA } from "@wormhole-foundation/sdk-definitions"
import { Chain, signSendWait } from "@wormhole-foundation/sdk"

export interface CreateWrappedParams<ChainName extends Chain> {
    chainName: ChainName
    vaa: VAA<"TokenBridge:AttestMeta">
    signer: SignAndSendSigner<"Testnet", ChainName>
}

export const createWrapped = async <ChainName extends Chain>({
    chainName,
    vaa,
    signer,
}: CreateWrappedParams<ChainName>) => {
    const wormhole = await getWormhole()
    const chain = wormhole.getChain(chainName)

    const tokenBridge = await chain.getTokenBridge()
    const txGenerator = tokenBridge.submitAttestation(vaa)

    const transactionIds = await signSendWait(chain, txGenerator, signer)

    const { txid } = transactionIds.at(0)!
    return txid
}
