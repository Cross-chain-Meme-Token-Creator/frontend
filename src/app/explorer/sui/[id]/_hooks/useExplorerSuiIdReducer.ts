import { BridgedChainInfo } from "@services"
import { Chain } from "@wormhole-foundation/sdk-base"
import { useReducer } from "react"

export interface TokenSuiInfo {
    name?: string
    iconUrl?: string
    symbol?: string
    description?: string
    decimals?: number
    tokenType?: string
}

export interface ExplorerSuiIdState {
    token: TokenSuiInfo
    balance: number
    id?: string
    bridgedChainInfos?: Array<BridgedChainInfo<Chain>>
    keys: {
        fetchBalanceKey: number
    }
   
}

export interface SetTokenNameAction {
    type: "SET_TOKEN_NAME"
    payload: string | undefined
}

export interface SetTokenIconUrlAction {
    type: "SET_TOKEN_ICON_URL"
    payload: string | undefined
}

export interface SetTokenSymbolAction {
    type: "SET_TOKEN_SYMBOL"
    payload: string | undefined
}

export interface SetTokenDescriptionAction {
    type: "SET_TOKEN_DESCRIPTION"
    payload: string | undefined
}

export interface SetTokenDecimalsAction {
    type: "SET_TOKEN_DECIMALS"
    payload: number | undefined
}

export interface SetTokenTypeAction {
    type: "SET_TOKEN_TYPE"
    payload: string | undefined
}

export interface SetTokenAllAction {
    type: "SET_TOKEN_ALL"
    payload: TokenSuiInfo
}

export interface SetTokenBalanceAction {
    type: "SET_TOKEN_BALANCE"
    payload: number
}

export interface SetIdAction {
    type: "SET_ID"
    payload: string
}

export interface SetBridgedChainInfosAction {
    type: "SET_BRIDGED_CHAINS_INFO"
    payload: Array<BridgedChainInfo>
}

export interface TriggerFetchBalanceAction {
    type: "TRIGGER_FETCH_BALANCE"
}

export type ExplorerSuiIdAction =
    | SetTokenNameAction
    | SetTokenIconUrlAction
    | SetTokenSymbolAction
    | SetTokenDecimalsAction
    | SetTokenDescriptionAction
    | SetTokenAllAction
    | SetTokenBalanceAction
    | SetTokenTypeAction
    | SetIdAction
    | SetBridgedChainInfosAction
    | TriggerFetchBalanceAction

export const initialState: ExplorerSuiIdState = {
    token: {},
    balance: 0,
    keys: {
        fetchBalanceKey: 0,
    }
    
}

export const reducer = (
    state: ExplorerSuiIdState = initialState,
    action: ExplorerSuiIdAction
): ExplorerSuiIdState => {
    switch (action.type) {
    case "SET_TOKEN_NAME":
        return {
            ...state,
            token: {
                ...state.token,
                name: action.payload,
            },
        }
    case "SET_TOKEN_SYMBOL":
        return {
            ...state,
            token: {
                ...state.token,
                symbol: action.payload,
            },
        }
    case "SET_TOKEN_ICON_URL":
        return {
            ...state,
            token: {
                ...state.token,
                iconUrl: action.payload,
            },
        }
    case "SET_TOKEN_DESCRIPTION":
        return {
            ...state,
            token: {
                ...state.token,
                description: action.payload,
            },
        }
    case "SET_TOKEN_DECIMALS":
        return {
            ...state,
            token: {
                ...state.token,
                decimals: action.payload,
            },
        }
    case "SET_TOKEN_ALL":
        return {
            ...state,
            token: action.payload,
        }
    case "SET_TOKEN_BALANCE":
        return {
            ...state,
            balance: action.payload,
        }
    case "SET_TOKEN_TYPE":
        return {
            ...state,
            token: {
                ...state.token,
                tokenType: action.payload,
            },
        }
    case "SET_ID":
        return {
            ...state,
            id: action.payload,
        }
    case "SET_BRIDGED_CHAINS_INFO":
        return {
            ...state,
            bridgedChainInfos: action.payload,
        }
    case "TRIGGER_FETCH_BALANCE":
        return {
            ...state,
            keys: {
                fetchBalanceKey: state.keys.fetchBalanceKey + 1,
            }
        }
    default:
        return state
    }
}

export const useExplorerSuiIdReducer = () => {
    return useReducer(reducer, initialState)
}
