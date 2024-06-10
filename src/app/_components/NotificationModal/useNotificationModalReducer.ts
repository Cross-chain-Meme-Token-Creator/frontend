import { useReducer } from "react"

export type SizeType = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full" | undefined

export interface NotificationModalState {
    innerHtml?: JSX.Element | Array<JSX.Element>,
    title?: string,
    size?: SizeType
}

export interface SetInnerHtmlAction {
    type: "SET_INNER_HTML"
    payload: JSX.Element | Array<JSX.Element>
}

export interface SetTitleAction {
    type: "SET_TITLE"
    payload: string | undefined
}

export interface SetTokenTypeAction {
    type: "SET_TOKEN_TYPE"
    payload: string | undefined
}

export interface SetSizeAction {
    type: "SET_SIZE"
    payload: SizeType
}

export interface OpenAction {
    type: "OPEN"
    payload: NotificationModalState
}

export interface CloseAction {
    type: "CLOSE"
}

export type NotificationModalAction =
    | SetInnerHtmlAction
    | SetTitleAction
    | OpenAction
    | CloseAction
    | SetSizeAction

export const initialState: NotificationModalState = {
    title: ""
}

export const reducer = (
    state: NotificationModalState = initialState,
    action: NotificationModalAction
): NotificationModalState => {
    switch (action.type) {
    case "SET_TITLE":
        return {
            ...state,
            title: action.payload
        }
    case "SET_INNER_HTML":
        return {
            ...state,
            innerHtml: action.payload
        }
    case "OPEN":
    {

        return {
            ...state,
            innerHtml: action.payload.innerHtml,
            title: action.payload.title,
            size: action.payload.size
        }
    }
    case "CLOSE":
    {
        return {
            ...state,
            innerHtml: undefined,
            title: undefined
        }
    }
    case "SET_SIZE": {
        return {
            ...state,
            size: action.payload
        }
    }
    default:
        return state
    }
}

export const useNotificationModalReducer = () => {
    return useReducer(reducer, initialState)
}
