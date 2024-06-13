import { getWormhole } from "./base.wormhole"
import {
    Chain,
    Network,
    SignAndSendSigner,
    VAA,
    signSendWait,
    toNative,
} from "@wormhole-foundation/sdk"

export interface CreateAttestationParams<N extends Network, ChainName extends Chain> {
    network: N,
    chainName: ChainName
    tokenAddress: string
    signer: SignAndSendSigner<N, ChainName>
}

interface CreateAttestationResult {
    vaa: VAA<"TokenBridge:AttestMeta"> | null,
    txHash: string
}

export const createAttestation = async <N extends Network, ChainName extends Chain>({
    network,
    chainName,
    tokenAddress,
    signer,
}: CreateAttestationParams<N, ChainName>): Promise<CreateAttestationResult> => {
    const wormhole = await getWormhole(network)
    const chain = wormhole.getChain(chainName)

    const nativeTokenAddress = toNative(chainName, tokenAddress)
    const tokenBridge = await chain.getTokenBridge()

    const txGenerator = tokenBridge.createAttestation(nativeTokenAddress, toNative(chainName, signer.address()))

    const transactionIds = await signSendWait(chain, txGenerator, signer)

    const { txid } = transactionIds.at(-1)!

    const [wormholeMessage] = await chain.parseTransaction(txid)

    const vaa = await wormhole.getVaa(
        wormholeMessage,
        "TokenBridge:AttestMeta",
        60_000
    )
    return {
        vaa, txHash: txid
    }
}