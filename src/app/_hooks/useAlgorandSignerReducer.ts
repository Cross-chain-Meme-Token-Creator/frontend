import { useReducer } from "react"

export type AlgorandSelectedSigner = "pera"

export interface AlgorandSignerState {
    peraWallet: {
        address?: string
    }
    selectedSigner?: AlgorandSelectedSigner
}

export interface SetPeraWalletAddressAction {
    type: "SET_PERA_WALLET_ADDRESS"
    payload?: string
}

export interface SetAlgorandSelectedSignerAction {
    type: "SET_ALGORAND_SELECTED_SIGNER"
    payload?: AlgorandSelectedSigner
}

export type AlgorandSignerAction =
    | SetPeraWalletAddressAction
    | SetAlgorandSelectedSignerAction

export const initialState: AlgorandSignerState = {
    peraWallet: {},
}

export const reducer = (
    state: AlgorandSignerState = initialState,
    action: AlgorandSignerAction
): AlgorandSignerState => {
    switch (action.type) {
    case "SET_PERA_WALLET_ADDRESS":
        return {
            ...state,
            peraWallet: {
                ...state.peraWallet,
                address: action.payload,
            },
        }
    case "SET_ALGORAND_SELECTED_SIGNER":
        return {
            ...state,
            selectedSigner: action.payload,
        }
    default:
        return state
    }
}

export const useAlgorandSignerReducer = () => {
    return useReducer(reducer, initialState)
}
