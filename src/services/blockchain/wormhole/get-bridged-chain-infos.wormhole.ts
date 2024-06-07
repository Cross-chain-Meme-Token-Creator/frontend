import { Chain } from "@wormhole-foundation/sdk-base"
import { getWormhole } from "./base.wormhole"
import { NativeAddress, toNative, toUniversal } from "@wormhole-foundation/sdk-definitions"
import { supportedChains } from "./constants.wormhole"

export interface BridgedChainInfo<ChainName extends Chain = Chain> {
    chainName: ChainName
    chainAddress: NativeAddress<ChainName>
}

export interface GetBridgeChainsParams<ChainName extends Chain> {
    mainChainName: ChainName
    tokenAddress: string
}

export const getBridgedChainInfos = async <ChainName extends Chain>({
    mainChainName,
    tokenAddress,
}: GetBridgeChainsParams<ChainName>): Promise<Array<BridgedChainInfo>> => {
    const bridgedChains: Array<BridgedChainInfo> = []

    const wormhole = await getWormhole()
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

                    const { address: wrappedAddress } = await tokenBridge.getWrappedAsset({
                        chain: mainChainName,
                        address: toUniversal(chainName, tokenAddress),
                    })

                    const bridgedChain: BridgedChainInfo<typeof chainName> = {
                        chainName,
                        chainAddress: toNative(chainName, wrappedAddress as string)
                    }
                    bridgedChains.push(bridgedChain)
                } catch (ex) {
                    // do nothing
                }
            }) ()
        )
    }
    await Promise.all(promises)

    return bridgedChains
}
