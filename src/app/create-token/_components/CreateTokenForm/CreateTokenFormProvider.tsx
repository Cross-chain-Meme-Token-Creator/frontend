import { Form, Formik, FormikProps } from "formik"
import React, { ReactNode, createContext, useMemo } from "react"
import { createCurrencyTx } from "@features"
import { useWallet } from "@suiet/wallet-kit"

interface FormikValue {
    symbol: string
    name: string,
    description: string,
    decimals: number,
    iconUrl: string,
}

interface CreateTokenFormContextValue {
    formik: FormikProps<FormikValue>
}

const initialValues: FormikValue = {
    symbol: "",
    name: "",
    description: "",
    decimals: 9,
    iconUrl: ""
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
    const { address } = useWallet()

    const {
        signAndExecuteTransactionBlock
        // ... other methods
    } = useWallet()

    return (
        <Formik
            initialValues={initialValues}
            //validationSchema={}
            onSubmit={async ({name, symbol, decimals, description, iconUrl}) => {
                console.log(address)
                if (!address) return
                const tx = createCurrencyTx({
                    currency: {
                        decimals,
                        description,
                        name,
                        symbol,
                        iconUrl
                    },
                    currentAddr: address
                })
                if (!tx) return 
                await signAndExecuteTransactionBlock({
                    transactionBlock: tx,
                })
            }}
        >
            {(_props) => renderBody(_props, children)}
        </Formik>
    )
}

