import { Chain } from "@wormhole-foundation/sdk-base"
import { useReducer } from "react"

export interface ExplorerState {
    contractAddress?: string
    chainName: Chain
}

export interface SetContractAddressAction {
    type: "SET_CONTRACT_ADDRESS"
    payload: string
}

export interface SetChainNameAction {
    type: "SET_CHAIN_NAME"
    payload: Chain
}

export type ExplorerAction = SetContractAddressAction | SetChainNameAction

export const initialState: ExplorerState = {
    chainName: "Sui",
}

export const reducer = (
    state: ExplorerState = initialState,
    action: ExplorerAction
): ExplorerState => {
    switch (action.type) {
    case "SET_CHAIN_NAME":
        return {
            ...state,
            chainName: action.payload,
        }
    case "SET_CONTRACT_ADDRESS":
        return {
            ...state,
            contractAddress: action.payload,
        }
    default:
        return state
    }
}

export const useExplorerReducer = () => {
    return useReducer(reducer, initialState)
}
