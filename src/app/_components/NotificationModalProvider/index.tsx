"use client"
import React, { ReactNode, createContext, useCallback, useMemo } from "react"
import {
    NotificationModalAction,
    NotificationModalState,
    useNotificationModalReducer,
} from "./useNotificationModalReducer"
import { useDisclosure } from "@nextui-org/react"
import { DisclosureType } from "@common"
import { NotificationModal } from "./NotificationModal"

export interface NotificationModalContextValue {
    reducer: [NotificationModalState, React.Dispatch<NotificationModalAction>]
    discloresures: {
        baseDiscloresure: DisclosureType
    }
    functions: {
        openModal: (params: NotificationModalState) => void
        closeModal: () => void
    }
}

export const NotificationModalContext =
    createContext<NotificationModalContextValue | null>(null)

export const NotificationModalProvider = ({
    children,
}: {
    children: ReactNode
}) => {
    const reducer = useNotificationModalReducer()
    const [, dispatch] = reducer

    const baseDiscloresure = useDisclosure()
    const { onOpen, onClose } = baseDiscloresure

    const openModal = useCallback(
        (params: NotificationModalState) => {
            dispatch({
                type: "OPEN",
                payload: params,
            })
            onOpen()
        },
        [reducer, baseDiscloresure]
    )

    const closeModal = useCallback(() => {
        dispatch({
            type: "CLOSE",
        })
        onClose()
    }, [reducer, baseDiscloresure])

    const notificationModalContextValue: NotificationModalContextValue =
        useMemo(
            () => ({
                reducer,
                discloresures: {
                    baseDiscloresure,
                },
                functions: {
                    openModal,
                    closeModal,
                },
            }),
            [reducer, baseDiscloresure]
        )

    return (
        <NotificationModalContext.Provider
            value={notificationModalContextValue}
        >
            <NotificationModal/>
            {children}
        </NotificationModalContext.Provider>
    )
}
