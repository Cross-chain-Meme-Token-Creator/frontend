import { Form, Formik, FormikProps } from "formik"
import React, { Dispatch, ReactNode, createContext, useContext, useMemo } from "react"
import {
    SupportedChainName,
    createAttestation,
} from "@services"
import { createWrapped } from "@services"
import { getInnerType } from "@common"
import { RootContext, useGenericSigner } from "../../../../../../_hooks"
import { SetIsLoadingAction, TokenContext } from "../../../../_hooks"
import { CreateAndSubmitAttestationModalState, useCreateAndSubmitAttestationModalReducer } from "./useCreateAndSubmitAttestationModalReducer"

interface FormikValue {
    chainName: SupportedChainName
}

interface CreateAndSubmitAttestationModalContextValue {
    formik: FormikProps<FormikValue>,
    reducer: [CreateAndSubmitAttestationModalState, Dispatch<SetIsLoadingAction>]
}

const initialValues: FormikValue = {
    chainName: SupportedChainName.Celo,
}

export const CreateAndSubmitAttestationModalContext =
    createContext<CreateAndSubmitAttestationModalContextValue | null>(null)

const renderBody = (formik: FormikProps<FormikValue>, chidren: ReactNode) => {
    const reducer = useCreateAndSubmitAttestationModalReducer()

    const CreateAndSubmitAttestationModalContextValue: CreateAndSubmitAttestationModalContextValue =
        useMemo(
            () => ({
                formik,
                reducer
            }),
            [formik, reducer]
        )

    return (
        <CreateAndSubmitAttestationModalContext.Provider
            value={CreateAndSubmitAttestationModalContextValue}
        >
            <Form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
                {chidren}
            </Form>
        </CreateAndSubmitAttestationModalContext.Provider>
    )
}

export const CreateAndSubmitAttestationModalProvider = ({
    children,
}: {
    children: ReactNode
}) => {
    const { reducer } = useContext(TokenContext)!
    const [state] = reducer
    const { tokenInfo } = state
    const { tokenType } = { ...tokenInfo }

    const { getGenericSigner } = useGenericSigner()

    const { reducer : rootReducer } = useContext(RootContext)!
    const [ rootState ] = rootReducer
    const { network, selectedChainName } = rootState

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={async ({ chainName }) => {
                if (!tokenType) return

                const sourceChainSigner = getGenericSigner(selectedChainName)

                if (!sourceChainSigner) return

                const vaa = await createAttestation({
                    network,
                    chainName: selectedChainName,
                    tokenAddress: getInnerType(tokenType) ?? "",
                    signer: sourceChainSigner
                })

                if (!vaa) return
                
                const targetChainSigner = getGenericSigner(chainName)

                if (!targetChainSigner) return

                const txId = await createWrapped({
                    vaa,
                    chainName,
                    signer: targetChainSigner
                })
                console.log(txId)
            }}
        >
            {(_props) => renderBody(_props, children)}
        </Formik>
    )
}
