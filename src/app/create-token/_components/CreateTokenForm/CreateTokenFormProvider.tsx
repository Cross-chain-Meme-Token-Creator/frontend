import { Form, Formik, FormikProps } from "formik"
import React, {
    Dispatch,
    ReactNode,
    createContext,
    useContext,
    useMemo,
} from "react"
import {
    AlgorandCreateAssetResponse,
    SupportedChainName,
    baseAxios,
    getCreateSuiTokenTransactionBlock,
    getMakeAlgorandAssetTransaction,
} from "@services"
import { SuiObjectChangeCreated } from "@mysten/sui.js/client"
import { useDisclosure } from "@nextui-org/react"
import useSwr, { SWRResponse } from "swr"
import * as Yup from "yup"
import { DisclosureType, computeNumberMultipeBigInt, computePow } from "@common"
import { RootContext, useAlgorandSigner } from "../../../_hooks"
import { useWallet } from "@suiet/wallet-kit"
import {
    CreateTokenFormState,
    SetCreateTokenFormAddressAction,
    useCreateTokenFormReducer,
} from "./useCreateTokenFormReducer"
import {
    SignTransactionModalContext,
    TransactionToastContext,
    WalletConnectionRequiredModalContext,
} from "../../../_components"

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
    discloresures: {
        tokenCreatedSuccesfullyModalDiscloresure: DisclosureType
    }
    reducer: [CreateTokenFormState, Dispatch<SetCreateTokenFormAddressAction>]
}

const initialValues: FormikValue = {
    symbol: "USDT",
    name: "UST Tether",
    description: "",
    decimals: 8,
    iconUrl: "",
    totalSupply: 10_000_000_000,
}

export const CreateTokenFormContext =
    createContext<CreateTokenFormContextValue | null>(null)

const renderBody = (
    formik: FormikProps<FormikValue>,
    chidren: ReactNode,
    others: {
        tokenCreatedSuccesfullyModalDiscloresure: DisclosureType
        reducer: [
            CreateTokenFormState,
            Dispatch<SetCreateTokenFormAddressAction>
        ]
    }
) => {
    const { tokenCreatedSuccesfullyModalDiscloresure, reducer } = others

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
            discloresures: {
                tokenCreatedSuccesfullyModalDiscloresure,
            },
            reducer,
        }),
        [formik, iconUrlSwr, reducer, tokenCreatedSuccesfullyModalDiscloresure]
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
    const { address: suiAddress, signAndExecuteTransactionBlock } = useWallet()!

    const tokenCreatedSuccesfullyModalDiscloresure = useDisclosure()
    const { onOpen } = tokenCreatedSuccesfullyModalDiscloresure

    const { reducer: rootReducer } = useContext(RootContext)!
    const [rootState] = rootReducer
    const { selectedChainName } = rootState

    const { address: algorandAddress, signAndSend } = useAlgorandSigner()

    const reducer = useCreateTokenFormReducer()
    const [, dispatch] = reducer

    const { functions } = useContext(SignTransactionModalContext)!
    const { openModal, closeModal } = functions

    const { functions: walletConnectionRequiredModalFunctions } = useContext(
        WalletConnectionRequiredModalContext
    )!
    const { openModal: openWalletConnectionRequiredModal } =
        walletConnectionRequiredModalFunctions

    const { functions: transactionToastFunctions } = useContext(
        TransactionToastContext
    )!
    const { notify } = transactionToastFunctions

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
                switch (selectedChainName) {
                case SupportedChainName.Sui: {
                    if (!suiAddress) {
                        openWalletConnectionRequiredModal()
                        return
                    }
                    try {
                        openModal()
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
                        const { objectChanges, digest } =
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

                        dispatch({
                            type: "SET_TEMP_TOKEN_INFO",
                            payload: {
                                tokenAddress: objectId,
                            },
                        })

                        notify({
                            chainName: selectedChainName,
                            txHash: digest,
                        })
                        onOpen()
                    } finally {
                        closeModal()
                    }
                    break
                }
                case SupportedChainName.Algorand: {
                    if (!algorandAddress) {
                        openWalletConnectionRequiredModal()
                        return
                    }
                    try {
                        openModal()
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
                        const response = (await signAndSend(txn)) as
                            | AlgorandCreateAssetResponse
                            | undefined
                        if (!response) return
                        dispatch({
                            type: "SET_TEMP_TOKEN_INFO",
                            payload: {
                                tokenAddress:
                                    response["asset-index"].toString(),
                            },
                        })

                    
                        notify({
                            chainName: selectedChainName,
                            txHash: txn.txID(),
                        })
                        onOpen()
                    } finally {
                        closeModal()
                    }
                    break
                }
                }
            }}
        >
            {(formik) =>
                renderBody(formik, children, {
                    tokenCreatedSuccesfullyModalDiscloresure,
                    reducer,
                })
            }
        </Formik>
    )
}
