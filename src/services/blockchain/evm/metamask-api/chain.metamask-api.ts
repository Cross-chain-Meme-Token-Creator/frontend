import { SDKProvider } from "@metamask/sdk"
import web3 from "web3"
import {
    SupportedEvmChainName,
    supportedChains,
} from "../../constants.blockchain"
import { SupportedNetwork } from "@common"

export class MetamaskApi {
    constructor(
        private ethereum: SDKProvider,
        private network: SupportedNetwork
    ) {
        this.ethereum = ethereum
    }

    async addEthereumChain(evmChainName: SupportedEvmChainName) {
        try {
            const { evmProps } = supportedChains[evmChainName]
            if (!evmProps) throw new Error("Not an evm chain")
            const { mainnet, testnet } = evmProps
            const { blockExplorerUrls, chainId, nativeCurrency, rpcUrl } =
                this.network === "Testnet" ? testnet : mainnet

            await this.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                    {
                        chainId: web3.utils.toHex(chainId).toString(),
                        chainName: evmChainName,
                        rpcUrls: [rpcUrl],
                        iconUrls: [],
                        nativeCurrency,
                        blockExplorerUrls,
                    },
                ],
            })
        } catch (ex) {
            console.log(ex)
        }
    }

    async switchEthereumChain(
        evmChainName: SupportedEvmChainName,
        retry: boolean = true
    ) {
        const { evmProps } = supportedChains[evmChainName]
        if (!evmProps) throw new Error("Not an evm chain")
        const { mainnet, testnet } = evmProps
        const { chainId } = this.network === "Testnet" ? testnet : mainnet
        try {
            await this.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [
                    {
                        chainId: web3.utils.toHex(chainId).toString(),
                    },
                ],
            })
        } catch (ex) {
            const { code } = ex as ErrorResponse
            if (code === 4902 && retry) {
                console.log(evmChainName)
                await this.addEthereumChain(evmChainName)
                await this.switchEthereumChain(evmChainName, false)
            } else {
                throw ex
            }
        }
    }

    async chainId(): Promise<number> {
        const chainId = await this.ethereum.request({ method: "eth_chainId" })
        return Number(web3.utils.toDecimal(String(chainId)))
    }
}

export interface ErrorResponse {
    code: number
    message: string
    stack: string
}
