import { SupportedNetwork, bytesToNumber, bytesToString } from "@common"
import { ERC20Contract, MulticallContract } from "./contracts"
import { getHttpProvider } from "./constants.evm"
import { SupportedEvmChainName } from "../constants.blockchain"

export interface GetEvmTokenInfoParams {
    network: SupportedNetwork
    chainName: SupportedEvmChainName
    tokenAddress: string
}

interface EvmTokenInfo {
    name: string
    symbol: string
    decimals: number
}

export const getEvmTokenInfo = async ({
    network,
    chainName,
    tokenAddress,
}: GetEvmTokenInfoParams): Promise<EvmTokenInfo> => {
    const erc20Contract = new ERC20Contract(
        tokenAddress,
        getHttpProvider(network, chainName)
    )

    const nameAbi = erc20Contract.name().abi
    const symbolAbi = erc20Contract.symbol().abi
    const decimalsAbi = erc20Contract.decimals().abi

    console.log(nameAbi)
    
    const multicallContract = new MulticallContract(
        tokenAddress,
        getHttpProvider(network, chainName)
    )
    const [nameBytes, symbolBytes, decimalsBytes] = await multicallContract
        .multicall([nameAbi, symbolAbi, decimalsAbi])
        .call()
    const name = bytesToString(nameBytes)
    const symbol = bytesToString(symbolBytes)
    const decimals = bytesToNumber(decimalsBytes)

    return {
        name,
        symbol,
        decimals,
    }
}
