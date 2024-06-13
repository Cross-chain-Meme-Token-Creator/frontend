"use client"
import React, { ReactNode, createContext, useMemo } from "react"
import toast, { Toaster } from "react-hot-toast"
import { truncateString } from "@common"
import { Link } from "@nextui-org/react"
import { ChevronRightIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { v4 as uuidv4 } from "uuid"
import { SupportedChainName, supportedChains } from "@services"

interface NotifyParams {
    chainName: SupportedChainName
    txHash?: string
    isFailed?: boolean
}

type NotifyFunction = (params: NotifyParams) => void

export interface TransactionToastContextValue {
    functions: {
        notify: NotifyFunction
    }
}

export const TransactionToastContext =
    createContext<TransactionToastContextValue | null>(null)

export const TransactionToastProvider = ({
    children,
}: {
    children: ReactNode
}) => {
    const notify = ({ chainName, txHash, isFailed }: NotifyParams) => {
        const id = uuidv4()

        if (!isFailed) {
            toast.success(
                <div className="flex gap-4">
                    <div>
                        <div className="text-sm font-semibold text-primary">
                            Transaction succesfully
                        </div>
                        <div className="flex items-center gap-1">
                            <div> {supportedChains[chainName].name} </div>
                            <ChevronRightIcon className="w-3.5 h-3.5" />
                            <Link
                                as="button"
                                size="sm"
                                isExternal
                                showAnchorIcon
                            >
                                {truncateString(txHash)}
                            </Link>
                        </div>
                    </div>
                    <Link as="button" onPress={() => toast.dismiss(id)}>
                        <XMarkIcon className="w-5 h-5" />
                    </Link>
                </div>,
                {
                    id,
                    position: "top-right",
                    iconTheme: {
                        primary: "#006fee",
                        secondary: "#fff",
                    },
                    duration: 5000,
                }
            )
        } else {
            //
        }
    }
    const txHashToastContextValue: TransactionToastContextValue = useMemo(
        () => ({
            functions: {
                notify,
            },
        }),
        [notify]
    )

    return (
        <TransactionToastContext.Provider value={txHashToastContextValue}>
            <Toaster />
            {children}
        </TransactionToastContext.Provider>
    )
}
