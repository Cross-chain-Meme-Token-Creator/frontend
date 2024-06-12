import { useReducer } from "react"

export interface TempTokenInfo {
    tokenAddress: string,
}

export interface CreateTokenFormState {
    tempTokenInfo?: TempTokenInfo
}

export interface SetCreateTokenFormAddressAction {
    type: "SET_TEMP_TOKEN_INFO"
    payload?: TempTokenInfo
}

export type CreateTokenFormAction =
    | SetCreateTokenFormAddressAction


export const initialState: CreateTokenFormState = {
}

export const reducer = (
    state: CreateTokenFormState = initialState,
    action: CreateTokenFormAction
): CreateTokenFormState => {
    switch (action.type) {
    case "SET_TEMP_TOKEN_INFO": 
        return {
            ...state,
            tempTokenInfo: action.payload
        }
    default:
        return state
    }
}

export const useCreateTokenFormReducer = () => {
    return useReducer(reducer, initialState)
}
