
import { useReducer } from "react"

export interface RootState {
    wallets: {
        peraWallet: {
            address?: string
        },
        phantomWallet: {
            address?: string
        }
    }
}

export interface SetPeraWalletAddressAction {
    type: "SET_PERA_WALLET_ADDRESS"
    payload: string | undefined
}

export interface SetPhantomWalletAddressAction {
    type: "SET_PHANTOM_WALLET_ADDRESS"
    payload: string | undefined
}

export type RootAction =
    | SetPeraWalletAddressAction
    | SetPhantomWalletAddressAction

export const initialState: RootState = {
    wallets: {
        peraWallet: {
            address: undefined
        },
        phantomWallet: {
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
                    ...state.wallets, peraWallet: {
                        address: action.payload
                    }
                }
            }
        case "SET_PHANTOM_WALLET_ADDRESS":
            return {
                ...state, wallets: {
                    ...state.wallets, phantomWallet: {
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
