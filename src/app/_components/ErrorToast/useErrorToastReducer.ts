import { useReducer } from "react"

export interface ErrorToastState {
    message?: string,
    description?: string
}

interface OpenAction {
    type: "OPEN"
    payload: ErrorToastState
}

interface CloseAction {
    type: "CLOSE"
}

export type ErrorToastAction =
    | OpenAction
    | CloseAction

const initialState: ErrorToastState = {
}

export const reducer = (
    state: ErrorToastState = initialState,
    action: ErrorToastAction
): ErrorToastState => {
    switch (action.type) {
    case "OPEN":
    {
        return {
            ...state,
            message: action.payload.message,
            description: action.payload.description
        }
    }
    case "CLOSE":
    {
        return {
            ...state,
            message: undefined,
            description: undefined
        }
    }
    default:
        return state
    }
}

export const useErrorToastReducer = () => {
    return useReducer(reducer, initialState)
}
