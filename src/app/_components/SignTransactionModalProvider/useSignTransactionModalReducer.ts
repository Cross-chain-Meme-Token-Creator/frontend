import { SupportedChainName } from "@services"
import { useReducer } from "react"

export interface SignTransactionModalState {
    chainName?: SupportedChainName
}

interface OpenAction {
    type: "OPEN"
    payload: SignTransactionModalState
}

interface CloseAction {
    type: "CLOSE"
}

export type SignTransactionModalAction = OpenAction | CloseAction

const initialState: SignTransactionModalState = {}

export const reducer = (
    state: SignTransactionModalState = initialState,
    action: SignTransactionModalAction
): SignTransactionModalState => {
    switch (action.type) {
    case "OPEN": {
        return {
            ...state,
            chainName: action.payload.chainName,
        }
    }
    case "CLOSE": {
        return {
            ...state,
            chainName: undefined,
        }
    }
    default:
        return state
    }
}

export const useSignTransactionModalReducer = () => {
    return useReducer(reducer, initialState)
}
