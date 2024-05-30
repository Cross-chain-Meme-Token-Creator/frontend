import { Form, Formik, FormikProps } from "formik"
import React, { ReactNode, createContext, useMemo } from "react"
import { getCreateSuiTokenTransactionBlock } from "@services"
import { useWallet } from "@suiet/wallet-kit"

interface FormikValue {
    symbol: string
    name: string,
    description: string,
    decimals: number,
    iconUrl: string,
    totalSupply: string
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
    totalSupply: "10000000000"
}

export const CreateTokenFormContext = createContext<CreateTokenFormContextValue | null>(
    null
)

const renderBody = (
    formik: FormikProps<FormikValue>,
    chidren: ReactNode
) => {


    const CreateTokenFormContextValue: CreateTokenFormContextValue = useMemo(() => ({
        formik
    }), [formik])

    return (
        <CreateTokenFormContext.Provider value={CreateTokenFormContextValue}>
            <Form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>{chidren}</Form>
        </CreateTokenFormContext.Provider>
    )
}

export const CreateTokenFormProvider = ({ children }: { children: ReactNode }) => {
    const {
        address,
        signAndExecuteTransactionBlock
    } = useWallet()

    return (
        <Formik
            initialValues={initialValues}
            //validationSchema={}
            onSubmit={async ({name, symbol, decimals, description, iconUrl, totalSupply }) => {
                if (!address) return
                const tx = await getCreateSuiTokenTransactionBlock({
                        decimals,
                        description,
                        name,
                        symbol,
                        iconUrl,
                        totalSupply
                })
                const result = await signAndExecuteTransactionBlock({
                    transactionBlock: tx,
                })
                console.log(result)
            }}
        >
            {(_props) => renderBody(_props, children)}
        </Formik>
    )
}

