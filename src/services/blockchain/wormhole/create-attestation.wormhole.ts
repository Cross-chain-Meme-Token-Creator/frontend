import { getWormhole } from "./base.wormhole"
import {
    Chain,
    Network,
    SignAndSendSigner,
    signSendWait,
    toNative,
} from "@wormhole-foundation/sdk"

export interface CreateAttestationParams<N extends Network, ChainName extends Chain> {
    network: N,
    chainName: ChainName
    tokenAddress: string
    signer: SignAndSendSigner<N, ChainName>
}

export const createAttestation = async <N extends Network, ChainName extends Chain>({
    network,
    chainName,
    tokenAddress,
    signer,
}: CreateAttestationParams<N, ChainName>) => {
    const wormhole = await getWormhole(network)
    const chain = wormhole.getChain(chainName)

    const nativeTokenAddress = toNative(chainName, tokenAddress)
    const tokenBridge = await chain.getTokenBridge()
   
    const txGenerator = tokenBridge.createAttestation(nativeTokenAddress, toNative(chainName, signer.address()))
    
    const transactionIds = await signSendWait(chain, txGenerator, signer)

    const { txid } = transactionIds.at(0)!
    
    const [ wormholeMessage ] = await chain.parseTransaction(txid)

    const vaa = await wormhole.getVaa(
        wormholeMessage,
        "TokenBridge:AttestMeta",
        60_000
    )
    return vaa
}