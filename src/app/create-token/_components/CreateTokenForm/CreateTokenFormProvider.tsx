import { Form, Formik, FormikProps } from "formik"
import React, { ReactNode, createContext, useContext, useMemo } from "react"
import { getCreateSuiTokenTransactionBlock } from "@services"
import { useWallet } from "@suiet/wallet-kit"
import {
    SuiObjectChange,
    SuiObjectChangeCreated,
    SuiObjectData,
} from "@mysten/sui.js/client"
import { Link, Spacer } from "@nextui-org/react"
import { RootContext } from "../../../_hooks"
import { NotificationModalContext } from "../../../_components"
import { useRouter } from "next/navigation"

interface FormikValue {
    symbol: string
    name: string
    description: string
    decimals: number
    iconUrl: string
    totalSupply: number
}

interface CreateTokenFormContextValue {
    formik: FormikProps<FormikValue>
}

const initialValues: FormikValue = {
    symbol: "USDT",
    name: "UST Tether",
    description: "",
    decimals: 8,
    iconUrl: "",
    totalSupply: 10,
}

export const CreateTokenFormContext =
    createContext<CreateTokenFormContextValue | null>(null)

const renderBody = (formik: FormikProps<FormikValue>, chidren: ReactNode) => {
    const CreateTokenFormContextValue: CreateTokenFormContextValue = useMemo(
        () => ({
            formik,
        }),
        [formik]
    )

    return (
        <CreateTokenFormContext.Provider value={CreateTokenFormContextValue}>
            <Form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
                {chidren}
            </Form>
        </CreateTokenFormContext.Provider>
    )
}

export const CreateTokenFormProvider = ({
    children,
}: {
    children: ReactNode
}) => {
    const { address, signAndExecuteTransactionBlock } = useWallet()
    const { functions } = useContext(NotificationModalContext)!
    const { openModal, closeModal } = functions
    const router = useRouter()

    return (
        <Formik
            initialValues={initialValues}
            //validationSchema={}
            onSubmit={async ({
                name,
                symbol,
                decimals,
                description,
                iconUrl,
                totalSupply,
            }) => {
                if (!address) return
                const tx = await getCreateSuiTokenTransactionBlock({
                    decimals,
                    description,
                    name,
                    symbol,
                    iconUrl,
                    totalSupply: (totalSupply * (10 ** decimals)).toString(),
                })
                const { objectChanges } = await signAndExecuteTransactionBlock({
                    transactionBlock: tx,
                    options: {
                        showObjectChanges: true,
                    },
                })

                const metadataObject = (
                    objectChanges as Array<SuiObjectChangeCreated>
                ).find(({ objectType }) =>
                    objectType.includes("0x2::coin::CoinMetadata")
                )
                console.log(metadataObject)
                if (!metadataObject) return

                const { objectId } = metadataObject

                const innerHtml = (
                    <div>
                        <div className="text-sm">
                            {`Congratulations! You have created token ${symbol} successfully. ${
                                totalSupply
                            } ${symbol} have been sent to you.`}
                        </div>
                        <Spacer y={2} />
                        <div className="flex gap-1 items-center text-sm">
                            <div>{`To transfer ${symbol}, please go to `}</div>

                            <Link
                                as="button"
                                onPress={() => {
                                    router.push(`/explorer/sui/${objectId}`)
                                    closeModal()
                                }}
                                isExternal
                            >
                                explorer page
                            </Link>
                        </div>
                    </div>
                )

                openModal({
                    innerHtml,
                    title: "Create Token Successfully",
                })
            }}
        >
            {(_props) => renderBody(_props, children)}
        </Formik>
    )
}
