import { useReducer } from "react"
import { SupportedChainName, defaultSupportedChainName } from "@services"

export interface ExplorerState {
    contractAddress?: string
    chainName: SupportedChainName
}

export interface SetContractAddressAction {
    type: "SET_CONTRACT_ADDRESS"
    payload: string
}

export interface SetChainNameAction {
    type: "SET_CHAIN_NAME"
    payload: SupportedChainName
}

export type ExplorerAction = SetContractAddressAction | SetChainNameAction

export const initialState: ExplorerState = {
    chainName: defaultSupportedChainName,
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
