import { Chain, Network } from "@wormhole-foundation/sdk-base"
import { getWormhole } from "./base.wormhole"
import {
    NativeAddress,
    UniversalAddress,
    toNative,
    toUniversal,
} from "@wormhole-foundation/sdk-definitions"
import { supportedChains } from "./constants.wormhole"
import { AlgorandAddress } from "@wormhole-foundation/sdk-algorand"
import { SuiAddress } from "@wormhole-foundation/sdk-sui"

export interface BridgedChainInfo<ChainName extends Chain = Chain> {
    chainName: ChainName
    nativeWrappedAddress: NativeAddress<ChainName>
}

export interface GetBridgeChainsParams<
    N extends Network,
    ChainName extends Chain
> {
    network: N
    mainChainName: ChainName
    tokenAddress: string
}

export const getBridgedChainInfos = async <
    N extends Network,
    ChainName extends Chain
>({
    network,
    mainChainName,
    tokenAddress,
}: GetBridgeChainsParams<N, ChainName>): Promise<Array<BridgedChainInfo>> => {
    const bridgedChains: Array<BridgedChainInfo> = []

    const wormhole = await getWormhole(network)
    const allSupportedChainNamesExceptMainChain: Array<Chain> = (
        Object.keys(supportedChains) as Array<Chain>
    ).filter((chain) => chain !== mainChainName)

    let universalAddress: UniversalAddress
    switch (mainChainName) {
    case "Algorand": {
        universalAddress = new AlgorandAddress(
            tokenAddress
        ).toUniversalAddress()
        break
    }
    case "Sui": {
        universalAddress = new SuiAddress(tokenAddress).toUniversalAddress()
        break
    }
    default: {
        universalAddress = toUniversal(mainChainName, tokenAddress)
        break
    }
    }

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
                            address: universalAddress,
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
                    console.log(ex)
                    // do nothing
                }
            })()
        )
    }
    await Promise.all(promises)

    return bridgedChains
}
