import { useReducer } from "react"

export interface SigningTransactionModalState {
    txHash?: string
}

interface OpenAction {
    type: "OPEN"
    payload: SigningTransactionModalState
}

interface CloseAction {
    type: "CLOSE"
}

export type SigningTransactionModalAction =
    | OpenAction
    | CloseAction

const initialState: SigningTransactionModalState = {
}

export const reducer = (
    state: SigningTransactionModalState = initialState,
    action: SigningTransactionModalAction
): SigningTransactionModalState => {
    switch (action.type) {
    case "OPEN":
    {
        return {
            ...state,
            txHash: action.payload.txHash
        }
    }
    case "CLOSE":
    {
        return {
            ...state,
            txHash: undefined
        }
    }
    default:
        return state
    }
}

export const useSigningTransactionModalReducer = () => {
    return useReducer(reducer, initialState)
}
