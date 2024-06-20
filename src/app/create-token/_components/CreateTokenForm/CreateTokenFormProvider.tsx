import { Form, Formik, FormikProps } from "formik"
import React, {
    Dispatch,
    ReactNode,
    createContext,
    useContext,
    useMemo,
} from "react"
import { SupportedChainName, baseAxios } from "@services"
import { useDisclosure } from "@nextui-org/react"
import useSWRMutation, { SWRMutationResponse } from "swr/mutation"
import * as Yup from "yup"
import { DisclosureType } from "@common"
import { RootContext } from "../../../_hooks"
import {
    CreateTokenFormState,
    SetCreateTokenFormAddressAction,
    useCreateTokenFormReducer,
} from "./useCreateTokenFormReducer"
import { useCreateSuiToken } from "./useCreateSuiToken"
import { useCreateAlgorandToken } from "./useCreateAlgorandToken"
import { useCreateEvmToken } from "./useCreateEvmToken"

export interface FormikValue {
    symbol: string
    name: string
    description: string
    decimals: number
    iconUrl: string
    totalSupply: number
}

interface CreateTokenFormContextValue {
    swrs: {
        iconUrlSwrMutation: SWRMutationResponse<
            void,
            unknown,
            "ICON_URL",
            {
                iconFile: File
            }
        >
    }
    formik: FormikProps<FormikValue>
    discloresures: {
        tokenCreatedSuccesfullyModalDiscloresure: DisclosureType
    }
    reducer: [CreateTokenFormState, Dispatch<SetCreateTokenFormAddressAction>]
}

const initialValues: FormikValue = {
    symbol: "CPP",
    name: "Ci PEPE",
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

    const iconUrlSwrMutation = useSWRMutation(
        "ICON_URL",
        async (
            _,
            {
                arg,
            }: {
                arg: {
                    iconFile: File
                }
            }
        ) => {
            const { iconFile } = arg
            const formData = new FormData()
            formData.append("file", iconFile)
            const { data } = await baseAxios.post<string>("/api", formData)
            formik.setFieldValue("iconUrl", data)
        }
    )

    const createTokenFormContextValue: CreateTokenFormContextValue = useMemo(
        () => ({
            formik,
            swrs: {
                iconUrlSwrMutation,
            },
            discloresures: {
                tokenCreatedSuccesfullyModalDiscloresure,
            },
            reducer,
        }),
        [
            formik,
            iconUrlSwrMutation,
            reducer,
            tokenCreatedSuccesfullyModalDiscloresure,
        ]
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
    const tokenCreatedSuccesfullyModalDiscloresure = useDisclosure()

    const { reducer: rootReducer } = useContext(RootContext)!
    const [rootState] = rootReducer
    const { selectedChainName } = rootState

    const reducer = useCreateTokenFormReducer()

    const createSuiToken = useCreateSuiToken(
        tokenCreatedSuccesfullyModalDiscloresure
    )
    const createAlgorandToken = useCreateAlgorandToken(
        tokenCreatedSuccesfullyModalDiscloresure
    )
    const createEvmToken = useCreateEvmToken(
        tokenCreatedSuccesfullyModalDiscloresure
    )

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={Yup.object({
                name: Yup.string().required(),
                symbol: Yup.string().required(),
                decimals: Yup.number().min(3).max(20).integer(),
                totalSupply: Yup.number().min(0),
            })}
            onSubmit={async (values) => {
                switch (selectedChainName) {
                    case SupportedChainName.Sui: {
                        await createSuiToken(values)
                        return
                    }
                    case SupportedChainName.Algorand: {
                        await createAlgorandToken(values)
                        return
                    }
                    case SupportedChainName.Celo:
                    case SupportedChainName.Klaytn: {
                        await createEvmToken(values)
                        return
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
