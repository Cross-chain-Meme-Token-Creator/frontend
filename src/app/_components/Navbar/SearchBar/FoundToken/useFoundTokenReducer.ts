import { useReducer } from "react"

export interface TokenInfo {
    decimals: number
    name: string
    description?: string
    iconUrl?: string
    symbol: string
}

export interface FoundTokenState {
    tokenInfo?: TokenInfo
    isLoading: boolean
}

export interface SetFoundTokenInfoAction {
    type: "SET_FOUND_TOKEN_INFO"
    payload?: TokenInfo
}

export interface SetIsLoadingAction {
    type: "SET_IS_LOADING"
    payload: boolean
}

export type FoundTokenAction = SetFoundTokenInfoAction | SetIsLoadingAction

export const initialState: FoundTokenState = {
    isLoading: false,
}

export const reducer = (
    state: FoundTokenState = initialState,
    action: FoundTokenAction
): FoundTokenState => {
    switch (action.type) {
    case "SET_FOUND_TOKEN_INFO":
        return {
            ...state,
            tokenInfo: action.payload,
        }
    case "SET_IS_LOADING":
        return {
            ...state,
            isLoading: action.payload,
        }
    default:
        return state
    }
}

export const useFoundTokenReducer = () => {
    return useReducer(reducer, initialState)
}
