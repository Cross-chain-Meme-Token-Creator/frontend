import { VAA } from "@wormhole-foundation/sdk-definitions"
import { useReducer } from "react"

export interface PassphraseAndQRCodeModalState {
    vaa?: VAA,
    passphraseNote?: string,
    qrNote?: string,
    title?: string
}

interface OpenAction {
    type: "OPEN"
    payload: PassphraseAndQRCodeModalState
}

interface CloseAction {
    type: "CLOSE"
}

export type PassphraseAndQRCodeModalAction =
    | OpenAction
    | CloseAction

const initialState: PassphraseAndQRCodeModalState = {
}

export const reducer = (
    state: PassphraseAndQRCodeModalState = initialState,
    action: PassphraseAndQRCodeModalAction
): PassphraseAndQRCodeModalState => {
    switch (action.type) {
    case "OPEN":
    {
        return {
            ...state,
            vaa: action.payload.vaa,
            passphraseNote: action.payload.passphraseNote,
            qrNote: action.payload.qrNote,
            title: action.payload.title
        }
    }
    case "CLOSE":
    {
        return {
            ...state,
            vaa: undefined,
            passphraseNote: undefined,
            qrNote: undefined,
            title: undefined
        }
    }
    default:
        return state
    }
}

export const usePassphraseAndQRCodeModalReducer = () => {
    return useReducer(reducer, initialState)
}
