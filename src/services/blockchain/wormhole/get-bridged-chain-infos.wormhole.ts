import { Chain, Network } from "@wormhole-foundation/sdk-base"
import { getWormhole } from "./base.wormhole"
import {

    NativeAddress,
    TokenAddress,
    toNative
} from "@wormhole-foundation/sdk-definitions"
import { supportedChains } from "./constants.wormhole"

export interface BridgedChainInfo<ChainName extends Chain = Chain> {
    chainName: ChainName
    nativeWrappedAddress: NativeAddress<ChainName>
}

export interface GetBridgeChainsParams<N extends Network, ChainName extends Chain> {
    network: N,
    mainChainName: ChainName
    tokenAddress: TokenAddress<ChainName>
}

export const getBridgedChainInfos = async <N extends Network, ChainName extends Chain>({
    network,
    mainChainName,
    tokenAddress,
}: GetBridgeChainsParams<N, ChainName>): Promise<Array<BridgedChainInfo>> => {
    const bridgedChains: Array<BridgedChainInfo> = []

    const wormhole = await getWormhole(network)
    const allSupportedChainNamesExceptMainChain: Array<Chain> = (
        Object.keys(supportedChains) as Array<Chain>
    ).filter((chain) => chain !== mainChainName)

    const promises: Array<Promise<void>> = []
    for (const chainName of allSupportedChainNamesExceptMainChain) {
        promises.push(
            (async () => {
                try {
                    const chain = wormhole.getChain(chainName)
                    const tokenBridge = await chain.getTokenBridge()

                    const { address: nativeWrappedAddress } =
                        await tokenBridge.getWrappedAsset({
                            chain: mainChainName,
                            address: tokenAddress,
                        })

                    const bridgedChain: BridgedChainInfo<typeof chainName> = {
                        chainName,
                        nativeWrappedAddress: toNative(
                            chainName,
                            nativeWrappedAddress as string
                        ),
                    }
                    bridgedChains.push(bridgedChain)
                } catch (ex) {
                    // do nothing
                }
            })()
        )
    }
    await Promise.all(promises)

    return bridgedChains
}
