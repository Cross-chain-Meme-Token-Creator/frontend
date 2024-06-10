import { useReducer } from "react"

export interface CreateAndSubmitAttestationModalState {
    isLoading: boolean
}

export interface SetIsLoadingAction {
    type: "SET_IS_LOADING"
    payload: boolean
}

export type CreateAndSubmitAttestationModalAction = SetIsLoadingAction

export const initialState: CreateAndSubmitAttestationModalState = {
    isLoading: false,
}

export const reducer = (
    state: CreateAndSubmitAttestationModalState = initialState,
    action: CreateAndSubmitAttestationModalAction
): CreateAndSubmitAttestationModalState => {
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

export const useCreateAndSubmitAttestationModalReducer = () => {
    return useReducer(reducer, initialState)
}
