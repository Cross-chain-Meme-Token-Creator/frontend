import { getWormhole } from "./base.wormhole"
import {
    Chain,
    SignAndSendSigner,
    signSendWait,
    toNative,
} from "@wormhole-foundation/sdk"

export interface CreateAttestationParams<ChainName extends Chain> {
    chainName: ChainName
    tokenAddress: string
    signer: SignAndSendSigner<"Testnet", ChainName>
}

export const createAttestation = async <ChainName extends Chain>({
    chainName,
    tokenAddress,
    signer,
}: CreateAttestationParams<ChainName>) => {
    const wormhole = await getWormhole()
    const chain = wormhole.getChain(chainName)

    const nativeTokenAddress = toNative(chainName, tokenAddress)

    const tokenBridge = await chain.getTokenBridge()

    const txGenerator = tokenBridge.createAttestation(nativeTokenAddress)

    const transactionIds = await signSendWait(chain, txGenerator, signer)

    const { txid } = transactionIds.at(0)!
    const sourceChain = wormhole.getChain("Sui")
    const [wormholeMessage] = await sourceChain.parseTransaction(txid)

    const vaa = await wormhole.getVaa(
        wormholeMessage,
        "TokenBridge:AttestMeta",
        60_000
    )
    return vaa
}

// const suiCoreStateObjectId =
//     supportedChains[SupportedChainName.Sui].wormholeCoreContract
// const suiTokenBridgeStateObjectId =
//     supportedChains[SupportedChainName.Sui].wormholeTokenBridgeContract

// const suiCoreBridgePackageId = await getPackageId(
//     suiProvider,
//     suiCoreStateObjectId
// )
// const suiTokenBridgePackageId = await getPackageId(
//     suiProvider,
//     suiTokenBridgeStateObjectId
// )

// const suiAttestTxPayload = await attestFromSui(
//     suiProvider,
//     suiCoreStateObjectId,
//     suiTokenBridgeStateObjectId,
//     suiTypeArg,
//     BigInt(0),
//     suiCoreBridgePackageId,
//     suiTokenBridgePackageId
// )

// const { transaction: attestTransaction } = await suiWallet.signAndExecuteTransactionBlock({
//     transactionBlock: suiAttestTxPayload as any,
// })

// if (!attestTransaction) return null

// const { sequence: attestSequence, emitterAddress: attestEmitterAddress } =
//     getEmitterAddressAndSequenceFromResponseSui(
//         suiCoreBridgePackageId,
//         attestTransaction as any
//     )
// const { vaaBytes: attestVAA } = await getSignedVAAWithRetry(
//     wormholeHosts,
//     CHAIN_ID_SUI,
//     attestEmitterAddress,
//     attestSequence
// )
// const { tokenAddress } = parseAttestMetaVaa(attestVAA)
// const coins = await suiProvider.getCoins({
//     owner: suiAddress,
// })

// const payload = Buffer.from("All your base are belong to us")
// const transferAmount = parseUnits("1", 8).toBigInt()

// // Transfer to Ethereum with payload
// const suiTransferTxPayload = await transferFromSui(
//     suiProvider,
//     suiCoreStateObjectId,
//     suiTokenBridgeStateObjectId,
//     coins.data,
//     suiTypeArg,
//     transferAmount,
//     targetChainId,
//     tryNativeToUint8Array(recipientAddress, targetChainId),
//     BigInt(0),
//     BigInt(0),
//     payload,
//     undefined,
//     undefined,
//     suiAddress
// )

// const result = await suiWallet.signAndExecuteTransactionBlock({
//     transactionBlock: suiTransferTxPayload as any,
// })
// const { transaction: transferTransaction } = result
// if (!transferTransaction) return null

// const { sequence, emitterAddress } =
//     getEmitterAddressAndSequenceFromResponseSui(
//         suiCoreBridgePackageId,
//         transferTransaction as any
//     )
// const { vaaBytes: transferVAA } = await getSignedVAAWithRetry(
//     wormholeHosts,
//     CHAIN_ID_SUI,
//     emitterAddress,
//     sequence!
// )

// return {
//     tokenAddress: tokenAddress.toString("utf-8"),
//     transferVAA,
// }
