import {
    SignAndSendSigner,
    TokenAddress,
    VAA,
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

interface TransferResult {
    vaa: VAA<"TokenBridge:Transfer"> | null,
    txHash: string
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
}: TransferParams<N, SourceChainName, TargetChainName>) : Promise<TransferResult> => {
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

    const { txid } = transactionIds.at(-1)!

    const [wormholeMessage] = await sourceChain.parseTransaction(txid)

    const vaa = await wormhole.getVaa(
        wormholeMessage,
        "TokenBridge:Transfer",
        60_000
    )

    return { vaa, txHash: txid }
}
