import {
    CHAIN_ID_SUI,
    ChainId,
    attestFromSui,
    getSignedVAAWithRetry,
    parseAttestMetaVaa,
    transferFromSui,
    tryNativeToUint8Array,
} from "@certusone/wormhole-sdk"
import { SupportedChainName, supportedChains, wormholeHosts } from "../_"
import {
    getEmitterAddressAndSequenceFromResponseSui,
    getPackageId,
} from "@certusone/wormhole-sdk/lib/cjs/sui"
import { Connection, JsonRpcProvider } from "@certusone/wormhole-sdk/node_modules/@mysten/sui.js"
import { WalletContextState } from "@suiet/wallet-kit"
import { parseUnits } from "ethers/lib/utils"

export interface TransferCrossChainFromSuiParams {
    targetChainId: ChainId
    suiTypeArg: string
    suiWallet: WalletContextState
    recipientAddress: string,
}

export interface TransferCrossChainFromSuiResult {
    tokenAddress: string
    transferVAA: Uint8Array
}

export const transferCrossChainFromSui = async ({
    targetChainId,
    suiTypeArg,
    suiWallet,
    recipientAddress,
}: TransferCrossChainFromSuiParams): Promise<TransferCrossChainFromSuiResult | null> => {
    const suiAddress = suiWallet.address
    if (!suiAddress) return null

    const suiProvider = new JsonRpcProvider(
        new Connection({
            fullnode: supportedChains[SupportedChainName.Sui].rpcUrl,
        })
    )

    const suiCoreStateObjectId =
        supportedChains[SupportedChainName.Sui].wormholeCoreContract
    const suiTokenBridgeStateObjectId =
        supportedChains[SupportedChainName.Sui].wormholeTokenBridgeContract

    const suiCoreBridgePackageId = await getPackageId(
        suiProvider,
        suiCoreStateObjectId
    )
    const suiTokenBridgePackageId = await getPackageId(
        suiProvider,
        suiTokenBridgeStateObjectId
    )

    const suiAttestTxPayload = await attestFromSui(
        suiProvider,
        suiCoreStateObjectId,
        suiTokenBridgeStateObjectId,
        suiTypeArg,
        BigInt(0),
        suiCoreBridgePackageId,
        suiTokenBridgePackageId
    )

    const { transaction: attestTransaction } = await suiWallet.signAndExecuteTransactionBlock({
        transactionBlock: suiAttestTxPayload as any,
    })

    if (!attestTransaction) return null

    const { sequence: attestSequence, emitterAddress: attestEmitterAddress } =
        getEmitterAddressAndSequenceFromResponseSui(
            suiCoreBridgePackageId,
            attestTransaction as any
        )
    const { vaaBytes: attestVAA } = await getSignedVAAWithRetry(
        wormholeHosts,
        CHAIN_ID_SUI,
        attestEmitterAddress,
        attestSequence
    )
    const { tokenAddress } = parseAttestMetaVaa(attestVAA)
    const coins = await suiProvider.getCoins({
        owner: suiAddress,
    })

    const payload = Buffer.from("All your base are belong to us")
    const transferAmount = parseUnits("1", 8).toBigInt()

    // Transfer to Ethereum with payload
    const suiTransferTxPayload = await transferFromSui(
        suiProvider,
        suiCoreStateObjectId,
        suiTokenBridgeStateObjectId,
        coins.data,
        suiTypeArg,
        transferAmount,
        targetChainId,
        tryNativeToUint8Array(recipientAddress, targetChainId),
        BigInt(0),
        BigInt(0),
        payload,
        undefined,
        undefined,
        suiAddress
    )

    const result = await suiWallet.signAndExecuteTransactionBlock({
        transactionBlock: suiTransferTxPayload as any,
    })
    const { transaction: transferTransaction } = result
    if (!transferTransaction) return null

    const { sequence, emitterAddress } =
        getEmitterAddressAndSequenceFromResponseSui(
            suiCoreBridgePackageId,
            transferTransaction as any
        )
    const { vaaBytes: transferVAA } = await getSignedVAAWithRetry(
        wormholeHosts,
        CHAIN_ID_SUI,
        emitterAddress,
        sequence!
    )

    return {
        tokenAddress: tokenAddress.toString("utf-8"),
        transferVAA,
    }
}
