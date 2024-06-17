import { Contract, EthExecutionAPI, SupportedProviders, Web3 } from "web3"
import { abi } from "./abi.token-factory"

export class TokenFactoryContract {
    private contract: Contract<typeof abi>

    constructor(
        _contractAddress: string,
        _provider: SupportedProviders<EthExecutionAPI>,  
        private fromAddress?: string
    ) {

        const web3Object = new Web3(_provider)
        this.contract = new Contract(abi, _contractAddress, web3Object)
    }

    getCreatorAddr = (tokenAddress: string) => ({
        call: async () => {
            return await this.contract.methods.getCreatorAddr(tokenAddress).call()
        }
    })
    createToken = (params: CreateTokenParams) => ({
        send: async () => await this.contract.methods.createToken(params).send({
            from: this.fromAddress
        })
    })
}

export interface CreateTokenParams {
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: bigint;
}