import { useReducer } from "react"
import { SupportedNetwork } from "@common"
import { SupportedChainName } from "@services"

export type EvmSelectedSigner = "metaMask"
export type AlgorandSelectedSigner = "pera"

export interface RootState {
    wallets: {
        peraWallet: {
            address?: string
        }
        phantomWallet: {
            address?: string
        }
    }
    selectedSigner: {
        evm?: EvmSelectedSigner
        algorand?: AlgorandSelectedSigner
    }
    selectedChainName: SupportedChainName
    searchValue: string
    network: SupportedNetwork,
}

export interface SetPeraWalletAddressAction {
    type: "SET_PERA_WALLET_ADDRESS"
    payload?: string
}

export interface SetPhantomWalletAddressAction {
    type: "SET_PHANTOM_WALLET_ADDRESS"
    payload?: string
}

export interface SetNetworkAction {
    type: "SET_NETWORK_ACTION"
    payload: SupportedNetwork
}

export interface SetAlgorandSelectedSignerAction {
    type: "SET_ALGORAND_SELECTED_SIGNER"
    payload?: AlgorandSelectedSigner
}

export interface SetEvmSelectedSignerAction {
    type: "SET_EVM_SELECTED_SIGNER"
    payload?: EvmSelectedSigner
}

export interface SetChainNameAction {
    type: "SET_CHAIN_NAME"
    payload: SupportedChainName
}

export interface SetSearchValueAction {
    type: "SET_SEARCH_VALUE"
    payload: string
}

export type RootAction =
    | SetPeraWalletAddressAction
    | SetPhantomWalletAddressAction
    | SetNetworkAction
    | SetAlgorandSelectedSignerAction
    | SetEvmSelectedSignerAction
    | SetChainNameAction
    | SetSearchValueAction

export const initialState: RootState = {
    wallets: {
        peraWallet: {
            address: undefined,
        },
        phantomWallet: {
            address: undefined,
        },
    },
    selectedChainName: SupportedChainName.Sui,
    selectedSigner: {},
    network: "Testnet",
    searchValue: ""
}

export const reducer = (
    state: RootState = initialState,
    action: RootAction
): RootState => {
    switch (action.type) {
    case "SET_PERA_WALLET_ADDRESS":
        return {
            ...state,
            wallets: {
                ...state.wallets,
                peraWallet: {
                    address: action.payload,
                },
            },
        }
    case "SET_PHANTOM_WALLET_ADDRESS":
        return {
            ...state,
            wallets: {
                ...state.wallets,
                phantomWallet: {
                    address: action.payload,
                },
            },
        }
    case "SET_NETWORK_ACTION":
        return {
            ...state,
            network: action.payload,
        }
    case "SET_ALGORAND_SELECTED_SIGNER":
        return {
            ...state,
            selectedSigner: {
                ...state.selectedSigner,
                algorand: action.payload,
            },
        }
    case "SET_CHAIN_NAME":
        return {
            ...state,
            selectedChainName: action.payload,
        }
    case "SET_EVM_SELECTED_SIGNER":
        return {
            ...state,
            selectedSigner: {
                ...state.selectedSigner,
                evm: action.payload,
            },
        }
    case "SET_SEARCH_VALUE":
        return {
            ...state,
            searchValue: action.payload,
        }
    default:
        return state
    }
}

export const useRootReducer = () => {
    return useReducer(reducer, initialState)
}
