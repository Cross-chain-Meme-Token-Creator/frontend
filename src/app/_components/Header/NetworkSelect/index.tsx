import { Select, SelectItem } from "@nextui-org/react"
import React, { useContext } from "react"
import { RootContext } from "../../../_hooks"
import { SupportedNetwork } from "@common"

export const NetworkSelect = () => {
    const { reducer } = useContext(RootContext)!
    const [state, dispatch] = reducer
    const { network } = state

    const networks: Array<SupportedNetwork> = ["Testnet", "Mainnet"]
    
    return (
        <Select
            className="w-[120px]"
            label=""
            labelPlacement="outside"
            onSelectionChange={(key) => {
                if (key === "all") return
                const currentNetwork = Array.from(key.keys()).at(
                    0
                ) as SupportedNetwork
                dispatch({
                    type: "SET_NETWORK_ACTION",
                    payload: currentNetwork,
                })
            }}
            selectedKeys={[network]}
            selectionMode="single"
        >
            {networks.map((network) => (
                <SelectItem key={network} value={network}>
                    {network}
                </SelectItem>
            ))}
        </Select>
    )
}
