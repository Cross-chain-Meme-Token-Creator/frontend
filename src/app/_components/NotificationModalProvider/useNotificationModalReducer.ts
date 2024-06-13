import { SizeType } from "@common"
import { useReducer } from "react"

export interface NotificationModalState {
    innerHtml?: JSX.Element | Array<JSX.Element>
    title?: string
    size?: SizeType
}

export interface OpenAction {
    type: "OPEN"
    payload: NotificationModalState
}

export interface CloseAction {
    type: "CLOSE"
}

export type NotificationModalAction = OpenAction | CloseAction

export const initialState: NotificationModalState = {
    title: "",
}

export const reducer = (
    state: NotificationModalState = initialState,
    action: NotificationModalAction
): NotificationModalState => {
    switch (action.type) {
    case "OPEN": {
        return {
            ...state,
            innerHtml: action.payload.innerHtml,
            title: action.payload.title,
            size: action.payload.size,
        }
    }
    case "CLOSE": {
        return {
            ...state,
            innerHtml: undefined,
            title: undefined,
            size: undefined
        }
    }
    default:
        return state
    }
}

export const useNotificationModalReducer = () => {
    return useReducer(reducer, initialState)
}
