import { useSDK } from "@metamask/sdk-react-ui"
import { Link } from "@nextui-org/react"
import { Chain, chainToPlatform } from "@wormhole-foundation/sdk-base"
import { Erc20Contract } from "@services"
import { useContext, useEffect, useState } from "react"
import { ExplorerSuiIdContext } from "../../../_hooks"

interface BalanceInfoProps {
    chainName: Chain
    wrappedAddress: string
}

export const BalanceInfo = (props: BalanceInfoProps) => {
    const { chainName, wrappedAddress } = props
    const metamaskWallet = useSDK()

    const { reducer } = useContext(ExplorerSuiIdContext)!
    const [state] = reducer
    const { keys } = state
    const { fetchBalanceKey } = keys
    console.log(state)
    
    const [balance, setBalance] = useState(0)
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        const handleEffect = async () => {
            switch (chainToPlatform(chainName)) {
                case "Evm": {
                    if (
                        !metamaskWallet.connected ||
                        !metamaskWallet.provider ||
                        !metamaskWallet.account
                    )
                        return
                    const erc20Contract = new Erc20Contract(
                        metamaskWallet.provider,
                        wrappedAddress
                    )
                    const balance = await erc20Contract.balanceOf.call(
                        metamaskWallet.account
                    )
                    const decimals = await erc20Contract.decimals.call()
                    setIsConnected(true)
                    setBalance(Number(balance) / Math.pow(10, decimals))
                }
                default:
                    return
            }
        }
        handleEffect()
    }, [fetchBalanceKey])

    return isConnected ? (
        <div> {balance} </div>
    ) : (
        <Link size="sm" as="button">
            Connect Wallet
        </Link>
    )
}
