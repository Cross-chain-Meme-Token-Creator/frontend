import { useReducer } from "react"
import { v4 as uuidv4 } from "uuid"
import { SupportedChainName } from "@services"

export interface TokenInfo {
    decimals: number
    name: string
    description: string
    iconUrl: string
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
    isLoading: boolean
    tokenAddress?: string
    bridgedChainInfos: Array<BridgedChainInfo>
    refreshBalancesKey?: string
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

export interface SetRefreshBalancesKeyAction {
    type: "SET_REFRESH_BALANCES_KEY"
}


export type TokenAction =
    | SetTokenAddressAction
    | SetTokenInfoAction
    | SetIsLoadingAction
    | SetBridgedChainInfosAction
    | AddBridgedChainInfoAction
    | UpdateBalanceAction
    | SetRefreshBalancesKeyAction

export const initialState: TokenState = {
    isLoading: false,
    bridgedChainInfos: [],
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
    case "SET_IS_LOADING":
        return {
            ...state,
            isLoading: action.payload,
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

    case "SET_REFRESH_BALANCES_KEY":
        return {
            ...state,
            refreshBalancesKey: uuidv4(),
        }

    default:
        return state
    }
}

export const useTokenReducer = () => {
    return useReducer(reducer, initialState)
}
