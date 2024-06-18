import { Contract, EthExecutionAPI, SupportedProviders, Web3 } from "web3"
import { abi } from "./abi.erc20"

export class ERC20Contract {
    private contract: Contract<typeof abi>

    constructor(
        _contractAddress: string,
        _provider: SupportedProviders<EthExecutionAPI>,  
    ) {

        const web3Object = new Web3(_provider)
        this.contract = new Contract(abi, _contractAddress, web3Object)
    }

    balanceOf = (address: string) => ({
        call: async () => {
            return await this.contract.methods.balanceOf(address).call<bigint>()
        },

    })

    decimals = () => ({
        call: async () => Number(await this.contract.methods.decimals().call()),
        abi : this.contract.methods.decimals().encodeABI()
    })

    name = () => ({
        call: async () => Number(await this.contract.methods.decimals().call()),
        abi : this.contract.methods.name().encodeABI()
    })

    symbol = () => ({
        call: async () => Number(await this.contract.methods.symbol().call()),
        abi : this.contract.methods.symbol().encodeABI()
    })
}