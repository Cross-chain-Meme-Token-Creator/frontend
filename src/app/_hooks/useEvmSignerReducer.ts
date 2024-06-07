import { useReducer } from "react"

export type EvmSelectedSigner = "metaMask"

export interface EvmSignerState {
    selectedSigner?: EvmSelectedSigner
}

export interface SetEvmSelectedSignerAction {
    type: "SET_EVM_SELECTED_SIGNER"
    payload?: EvmSelectedSigner
}

export type EvmSignerAction = SetEvmSelectedSignerAction

export const initialState: EvmSignerState = {}

export const reducer = (
    state: EvmSignerState = initialState,
    action: EvmSignerAction
): EvmSignerState => {
    switch (action.type) {
    case "SET_EVM_SELECTED_SIGNER":
        return {
            ...state,
            selectedSigner: action.payload,
        }
    default:
        return state
    }
}

export const useEvmSignerReducer = () => {
    return useReducer(reducer, initialState)
}
