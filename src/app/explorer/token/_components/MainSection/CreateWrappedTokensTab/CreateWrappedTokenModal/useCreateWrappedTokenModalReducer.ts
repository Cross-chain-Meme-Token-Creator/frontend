import { useReducer } from "react"

export interface CreateWrappedTokenModalState {
    isLoading: boolean
}

export interface SetIsLoadingAction {
    type: "SET_IS_LOADING"
    payload: boolean
}

export type CreateWrappedTokenModalAction = SetIsLoadingAction

export const initialState: CreateWrappedTokenModalState = {
    isLoading: false,
}

export const reducer = (
    state: CreateWrappedTokenModalState = initialState,
    action: CreateWrappedTokenModalAction
): CreateWrappedTokenModalState => {
    switch (action.type) {
    case "SET_IS_LOADING":
        return {
            ...state,
            isLoading: action.payload,
        }
    default:
        return state
    }
}

export const useCreateWrappedTokenModalReducer = () => {
    return useReducer(reducer, initialState)
}
