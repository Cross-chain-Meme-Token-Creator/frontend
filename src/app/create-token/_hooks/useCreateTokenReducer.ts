
import { useReducer } from "react"
import { SupportedChainName } from "@services"

export interface CreateTokenState {
    selectedChainName: SupportedChainName
}

export interface SetSelectedChainIdAction {
    type: "SET_SELECTED_CHAIN_ID"
    payload: SupportedChainName
}

export type CreateTokenAction =
    | SetSelectedChainIdAction

export const initialState: CreateTokenState = {
    selectedChainName: SupportedChainName.Sui
}

export const reducer = (
    state: CreateTokenState = initialState,
    action: CreateTokenAction
): CreateTokenState => {
    switch (action.type) {
    case "SET_SELECTED_CHAIN_ID":
        return { ...state, selectedChainName: action.payload }
    default:
        return state
    }
}

export const useCreateTokenReducer = () => {
    return useReducer(reducer, initialState)
}
