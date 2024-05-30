
import { useReducer } from "react"
import { SupportedChainName } from "@services"

export interface RootState {
    wallets: {
        pera: {
            address?: string
        }
    }
}

export interface SetPeraWalletAddressAction {
    type: "SET_PERA_WALLET_ADDRESS"
    payload: string | undefined
}

export type RootAction =
    | SetPeraWalletAddressAction

export const initialState: RootState = {
    wallets: {
        pera: {
            address: undefined
        }
    }
}

export const reducer = (
    state: RootState = initialState,
    action: RootAction
): RootState => {
    switch (action.type) {
        case "SET_PERA_WALLET_ADDRESS":
            return {
                ...state, wallets: {
                    ...state.wallets, pera: {
                        address: action.payload
                    }
                }
            }
        default:
            return state
    }
}

export const useRootReducer = () => {
    return useReducer(reducer, initialState)
}
