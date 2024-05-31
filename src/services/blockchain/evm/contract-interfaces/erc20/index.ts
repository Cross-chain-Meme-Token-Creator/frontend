import { Contract, EthExecutionAPI, SupportedProviders, Web3 } from "web3";
import { abi } from "./abi.erc20";

export class Erc20Contract {
    private contract: Contract<typeof abi>

    constructor(
        _provider: SupportedProviders<EthExecutionAPI>,
        _contractAddress: string
    ) {

        const web3Object = new Web3(_provider)
        this.contract = new Contract(abi, _contractAddress, web3Object)
    }

    balanceOf = {
        call: async (address: string) => {
            return await this.contract.methods.balanceOf(address).call<bigint>()
        }
    }

    decimals = {
        call: async () => Number(await this.contract.methods.decimals().call())
    }
}