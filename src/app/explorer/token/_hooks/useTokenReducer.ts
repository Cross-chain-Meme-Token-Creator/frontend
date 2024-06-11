import { useReducer } from "react"
import { v4 as uuidv4 } from "uuid"
import { SupportedChainName } from "@services"

export interface TokenInfo {
    decimals: number
    name: string
    description?: string
    iconUrl?: string
    symbol: string
    //sui only
    tokenType?: string
}

export interface BridgedChainInfo {
    id: string
    wrappedAddress: string
    chainName: SupportedChainName
    balance?: string
}

export interface TokenState {
    tokenInfo?: TokenInfo
    loadings: {
        isLoading: boolean
        isWrappedTokensFetchLoading: boolean
    }
    tokenAddress?: string
    bridgedChainInfos: Array<BridgedChainInfo>
    keys: {
        refreshWrappedTokensKey?: string
    }
}

export interface SetTokenAddressAction {
    type: "SET_TOKEN_ADDRESS"
    payload: string
}

export interface SetTokenInfoAction {
    type: "SET_TOKEN_INFO"
    payload?: TokenInfo
}

export interface SetIsLoadingAction {
    type: "SET_IS_LOADING"
    payload: boolean
}
export interface SetIsWrappedTokensFetchLoadingAction {
    type: "SET_IS_WRAPPED_TOKENS_FETCH_LOADING"
    payload: boolean
}

export interface SetBridgedChainInfosAction {
    type: "SET_BRIDGED_CHAIN_INFOS"
    payload: Array<Omit<BridgedChainInfo, "id">>
}

export interface AddBridgedChainInfoAction {
    type: "ADD_BRIDGED_CHAIN_INFO"
    payload: Omit<BridgedChainInfo, "id">
}

export interface UpdateBalanceAction {
    type: "UPDATE_BALANCE"
    payload: {
        chainName: SupportedChainName
        balance?: string
    }
}

export interface SetRefreshWrappedTokensKeyAction {
    type: "SET_REFRESH_WRAPPED_TOKENS_KEY_ACTION"
}

export type TokenAction =
    | SetTokenAddressAction
    | SetTokenInfoAction
    | SetIsWrappedTokensFetchLoadingAction
    | SetBridgedChainInfosAction
    | AddBridgedChainInfoAction
    | UpdateBalanceAction
    | SetRefreshWrappedTokensKeyAction
    | SetIsLoadingAction

export const initialState: TokenState = {
    loadings: {
        isLoading: false,
        isWrappedTokensFetchLoading: false,
    },
    bridgedChainInfos: [],
    keys: {}
}

export const reducer = (
    state: TokenState = initialState,
    action: TokenAction
): TokenState => {
    switch (action.type) {
    case "SET_TOKEN_ADDRESS":
        return {
            ...state,
            tokenAddress: action.payload,
        }
    case "SET_TOKEN_INFO":
        return {
            ...state,
            tokenInfo: action.payload,
        }
    case "SET_IS_WRAPPED_TOKENS_FETCH_LOADING":
        return {
            ...state,
            loadings: {
                ...state.loadings,
                isWrappedTokensFetchLoading: action.payload
            }
        }
    case "SET_BRIDGED_CHAIN_INFOS": {
        const bridgedChainInfos = action.payload.map(
            (bridgedChainInfo) => ({ ...bridgedChainInfo, id: uuidv4() })
        )
        return {
            ...state,
            bridgedChainInfos,
        }
    }
    case "ADD_BRIDGED_CHAIN_INFO": {
        const { bridgedChainInfos } = state
        bridgedChainInfos.push({
            id: uuidv4(),
            ...action.payload,
        })
        return {
            ...state,
            bridgedChainInfos,
        }
    }
    case "UPDATE_BALANCE": {
        const { bridgedChainInfos } = state
        const { chainName, balance } = action.payload

        const updatedbridgedChainInfos = bridgedChainInfos.map(
            (bridgedChainInfo) => {
                if (bridgedChainInfo.chainName === chainName)
                    bridgedChainInfo.balance = balance
                return bridgedChainInfo
            }
        )
        return {
            ...state,
            bridgedChainInfos: updatedbridgedChainInfos,
        }
    }

    case "SET_REFRESH_WRAPPED_TOKENS_KEY_ACTION":
        return {
            ...state,
            keys: {
                ...state.keys,
                refreshWrappedTokensKey: uuidv4()
            }
        }
    case "SET_IS_LOADING":
        return {
            ...state,
            loadings: {
                ...state.loadings,
                isLoading: action.payload
            }
        }

    default:
        return state
    }
}

export const useTokenReducer = () => {
    return useReducer(reducer, initialState)
}
