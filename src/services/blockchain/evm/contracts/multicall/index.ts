import { Bytes, Contract, EthExecutionAPI, SupportedProviders, Web3 } from "web3"
import { abi } from "./abi.multicall"

export class MulticallContract {
    private contract: Contract<typeof abi>

    constructor(
        _contractAddress: string,
        _provider: SupportedProviders<EthExecutionAPI>,  
        private fromAddress?: string
    ) {

        const web3Object = new Web3(_provider)
        this.contract = new Contract(abi, _contractAddress, web3Object)
    }

    multicall = (bytes: Array<Bytes>) => ({
        call: async () => {
            return await this.contract.methods.multicall(bytes).call<Array<Bytes>>()
        },
        send: async () => {
            return await this.contract.methods.multicall(bytes).send({
                from: this.fromAddress
            })
        }
    })
}