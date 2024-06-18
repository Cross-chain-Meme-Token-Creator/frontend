import { SupportedEvmChainName, mapSupportedChainNameToSupportedEvmChainName } from "../constants.blockchain"
import { SupportedNetwork } from "@common"
import { getTokenFactoryContractAddress, web3HttpObject } from "./constants.evm"
import { CREATE_TOKEN_TOPIC, TokenFactoryContract } from "./contracts"
import { SupportedProviders, EthExecutionAPI } from "web3"

export type CreateEvmTokenParams = {
    fromAddress: string
    decimals: number
    name: string
    symbol: string
    totalSupply: bigint,
    provider: SupportedProviders<EthExecutionAPI>
    network: SupportedNetwork,
    chainName: SupportedEvmChainName
}

export type CreateEvmTokenReturn = {
    txHash: string,
    tokenAddress: string
}

export const createEvmToken = async ({
    fromAddress,
    decimals,
    name,
    symbol,
    totalSupply,
    provider,
    network,
    chainName
}: CreateEvmTokenParams): Promise<CreateEvmTokenReturn | null> => {
    const contract = new TokenFactoryContract(
        getTokenFactoryContractAddress(
            network,
            chainName
        ),
        provider,
        fromAddress
    )

    const { transactionHash, logs } = await contract
        .createToken({
            name,
            symbol,
            decimals,
            totalSupply,
        })
        .send()

    const { topics, data } = {
        ...logs.find(({ topics }) => topics?.at(0) === CREATE_TOKEN_TOPIC),
    }
    if (!data || !topics) return null

    const decoded = web3HttpObject(
        network,
        chainName
    ).eth.abi.decodeLog(
        [
            {
                type: "string",
                name: "topic",
            },
            {
                type: "address",
                name: "tokenAddress",
                indexed: true,
            },
        ],
        data,
        topics
    )
    return {
        txHash: transactionHash,
        tokenAddress: decoded.tokenAddress as string
    }
}
