import {
    SignAndSendSigner,
    TokenAddress,
    toNative,
} from "@wormhole-foundation/sdk-definitions"
import { getWormhole } from "./base.wormhole"
import { Chain, Network } from "@wormhole-foundation/sdk-base"
import { signSendWait } from "@wormhole-foundation/sdk"

export interface TransferParams<
    N extends Network,
    SourceChainName extends Chain,
    TargetChainName extends Chain
> {
    network: N
    transferAmount: bigint
    recipientAddress: string
    tokenAddress: TokenAddress<SourceChainName>
    sourceChainName: SourceChainName
    targetChainName: TargetChainName
    signer: SignAndSendSigner<N, SourceChainName>
}

export const transfer = async <
    N extends Network,
    SourceChainName extends Chain,
    TargetChainName extends Chain
>({
    network,
    transferAmount,
    recipientAddress,
    tokenAddress,
    sourceChainName,
    targetChainName,
    signer,
}: TransferParams<N, SourceChainName, TargetChainName>) => {
    const wormhole = await getWormhole(network)

    const sourceChain = wormhole.getChain(sourceChainName)
    const sourceTokenBridge = await sourceChain.getTokenBridge()

    const txGenerator = sourceTokenBridge.transfer(
        toNative(sourceChainName, signer.address()),
        {
            chain: targetChainName,
            address: toNative(targetChainName, recipientAddress),
        },
        tokenAddress,
        transferAmount
    )

    const transactionIds = await signSendWait(sourceChain, txGenerator, signer)

    const { txid } = transactionIds.at(0)!

    const [wormholeMessage] = await sourceChain.parseTransaction(txid)

    const vaa = await wormhole.getVaa(
        wormholeMessage,
        "TokenBridge:Transfer",
        60_000
    )

    if (!vaa) return null

    return vaa
}
