import { useReducer } from "react"
import { SupportedPlatform, defaultSupportedPlatform } from "@services"

export interface ConnectWalletState {
    platform: SupportedPlatform,
}

export interface SetConnectWalletAction {
    type: "SET_PLATFORM"
    payload: SupportedPlatform
}


export type ConnectWalletAction =
    | SetConnectWalletAction

const initialState: ConnectWalletState = {
    platform: defaultSupportedPlatform
}

const reducer = (
    state: ConnectWalletState = initialState,
    action: ConnectWalletAction
): ConnectWalletState => {
    switch (action.type) {
    case "SET_PLATFORM":
        return {
            ...state,
            platform: action.payload,
        }
    default:
        return state
    }
}

export const useConnectWalletReducer = () => {
    return useReducer(reducer, initialState)
}
