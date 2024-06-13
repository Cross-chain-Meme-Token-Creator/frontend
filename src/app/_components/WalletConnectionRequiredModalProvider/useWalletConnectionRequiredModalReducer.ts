import { SupportedChainName } from "@services"
import { useReducer } from "react"

export interface WalletConnectionRequiredModalState {
    chainName?: SupportedChainName
}

interface OpenAction {
    type: "OPEN"
    payload: WalletConnectionRequiredModalState
}

interface CloseAction {
    type: "CLOSE"
}

export type WalletConnectionRequiredModalAction =
    | OpenAction
    | CloseAction

const initialState: WalletConnectionRequiredModalState = {
}

export const reducer = (
    state: WalletConnectionRequiredModalState = initialState,
    action: WalletConnectionRequiredModalAction
): WalletConnectionRequiredModalState => {
    switch (action.type) {
    case "OPEN":
    {
        return {
            ...state,
            chainName: action.payload.chainName
        }
    }
    case "CLOSE":
    {
        return {
            ...state,
            chainName: undefined
        }
    }
    default:
        return state
    }
}

export const useWalletConnectionRequiredModalReducer = () => {
    return useReducer(reducer, initialState)
}
