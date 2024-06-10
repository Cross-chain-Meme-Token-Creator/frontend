import { Form, Formik, FormikProps } from "formik"
import React, { ReactNode, createContext, useContext, useMemo } from "react"
import {
    SupportedChainName,
    baseAxios,
    getCreateSuiTokenTransactionBlock,
    getMakeAlgorandAssetTransaction,
} from "@services"
import { SuiObjectChangeCreated } from "@mysten/sui.js/client"
import { Link, Spacer } from "@nextui-org/react"
import { NotificationModalContext } from "../../../_components"
import { useRouter } from "next/navigation"
import useSwr, { SWRResponse } from "swr"
import * as Yup from "yup"
import { computeNumberMultipeBigInt, computePow } from "@common"
import { RootContext, useAlgorandSigner } from "../../../_hooks"
import { useWallet } from "@suiet/wallet-kit"

interface FormikValue {
    symbol: string
    name: string
    description: string
    decimals: number
    iconFile?: File
    iconUrl: string
    totalSupply: number
}

interface CreateTokenFormContextValue {
    swrs: {
        iconUrlSwr: SWRResponse
    }
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
    const iconUrlSwr = useSwr(
        "ICON_URL",
        async () => {
            const iconFile = formik.values.iconFile
            if (!iconFile) return
            const formData = new FormData()
            formData.append("file", iconFile)
            const { data } = await baseAxios.post<string>("/api", formData)
            formik.setFieldValue("iconUrl", data)
        },
        {
            revalidateOnMount: false,
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        }
    )

    const createTokenFormContextValue: CreateTokenFormContextValue = useMemo(
        () => ({
            formik,
            swrs: {
                iconUrlSwr,
            },
        }),
        [formik, iconUrlSwr]
    )

    return (
        <CreateTokenFormContext.Provider value={createTokenFormContextValue}>
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
    const {
        address: suiAddress,
        select,
        signAndExecuteTransactionBlock,
    } = useWallet()
    const { functions } = useContext(NotificationModalContext)!
    const { openModal, closeModal } = functions
    const router = useRouter()

    const { reducer } = useContext(RootContext)!
    const [state] = reducer
    const { selectedChainName } = state

    const {
        address: algorandAddress,
        signAndSend,
        connectPera
    } = useAlgorandSigner()

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={Yup.object({
                name: Yup.string().required(),
                symbol: Yup.string().required(),
                decimals: Yup.number().min(3).max(20).integer(),
                totalSupply: Yup.number().min(0),
            })}
            onSubmit={async ({
                name,
                symbol,
                decimals,
                description,
                iconUrl,
                totalSupply,
            }) => {
                let contractAddress: string

                switch (selectedChainName) {

                case SupportedChainName.Sui: {
                    if (!suiAddress) {
                        await select("Suiet")
                        return
                    }

                    const transactionBlock =
                            await getCreateSuiTokenTransactionBlock({
                                decimals,
                                description,
                                name,
                                symbol,
                                iconUrl,
                                totalSupply: computeNumberMultipeBigInt(
                                    totalSupply,
                                    computePow(decimals)
                                ),
                            })
                    const { objectChanges } =
                            await signAndExecuteTransactionBlock({
                                transactionBlock,
                                options: {
                                    showObjectChanges: true,
                                },
                            })

                    const metadataObject = (
                            objectChanges as Array<SuiObjectChangeCreated>
                    ).find(({ objectType }) =>
                        objectType.includes("0x2::coin::CoinMetadata")
                    )
                    if (!metadataObject) return

                    const { objectId } = metadataObject
                    contractAddress = objectId
                    break
                }
                case SupportedChainName.Algorand: {
                    if (!algorandAddress) {
                        connectPera()
                        return
                    }
                    
                    const txn = await getMakeAlgorandAssetTransaction({
                        fromAddress: algorandAddress,
                        decimals,
                        name,
                        symbol,
                        iconUrl,
                        totalSupply: computeNumberMultipeBigInt(
                            totalSupply,
                            computePow(decimals)
                        ),
                    })
                    const res = await signAndSend(txn)
                    console.log(res)
                    contractAddress = ""
                    break
                }
                }

                const innerHtml = (
                    <div>
                        <div className="text-sm">
                            {`Congratulations! You have created token ${symbol} successfully. ${totalSupply} ${symbol} have been sent to you.`}
                        </div>
                        <Spacer y={2} />
                        <div className="flex gap-1 items-center text-sm">
                            <div>{`To transfer ${symbol}, please go to `}</div>

                            <Link
                                as="button"
                                onPress={() => {
                                    router.push(
                                        `/explorer/sui/${contractAddress}`
                                    )
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
            {(formik) => renderBody(formik, children)}
        </Formik>
    )
}
