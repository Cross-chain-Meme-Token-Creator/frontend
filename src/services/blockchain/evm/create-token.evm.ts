import { SupportedEvmChainName, mapSupportedChainNameToSupportedEvmChainName } from "../constants.blockchain"
import { SupportedNetwork, computeRaw } from "@common"
import { getTokenFactoryContractAddress, web3HttpObject } from "./constants.evm"
import { CREATE_TOKEN_TOPIC, TokenFactoryContract } from "./contracts"
import { SupportedProviders, EthExecutionAPI } from "web3"

export interface CreateEvmTokenParams {
    fromAddress: string
    decimals: number
    name: string
    symbol: string
    totalSupply: number,
    provider: SupportedProviders<EthExecutionAPI>
    network: SupportedNetwork,
    chainName: SupportedEvmChainName
}

export interface CreateEvmTokenResult {
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
}: CreateEvmTokenParams): Promise<CreateEvmTokenResult | null> => {
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
            totalSupply: computeRaw(totalSupply, decimals),
        })
        .send()

    const log = {
        ...logs.find(({ topics }) => topics?.at(0) === CREATE_TOKEN_TOPIC),
    }
    if (!log) return null
    const { data, topics } = log
    
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
