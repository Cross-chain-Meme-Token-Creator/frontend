import { Form, Formik, FormikProps } from "formik"
import React, { ReactNode, createContext, useContext, useMemo } from "react"
import {
    SuiWalletSigner,
    SupportedChainName,
    createAttestation,
} from "@services"
import { useWallet } from "@suiet/wallet-kit"
import { ExplorerSuiIdContext } from "../../../_hooks"
import { createWrapped } from "@services"
import { getInnerType } from "@common"
import { Chain } from "@wormhole-foundation/sdk"
import { RootContext, useGenericSigner } from "../../../../_hooks"
interface FormikValue {
    chainName: SupportedChainName
}

interface CreateAttestationModalContextValue {
    formik: FormikProps<FormikValue>
}

const initialValues: FormikValue = {
    chainName: SupportedChainName.Celo,
}

export const CreateAttestationModalContext =
    createContext<CreateAttestationModalContextValue | null>(null)

const renderBody = (formik: FormikProps<FormikValue>, chidren: ReactNode) => {
    const CreateAttestationModalContextValue: CreateAttestationModalContextValue =
        useMemo(
            () => ({
                formik,
            }),
            [formik]
        )

    return (
        <CreateAttestationModalContext.Provider
            value={CreateAttestationModalContextValue}
        >
            <Form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
                {chidren}
            </Form>
        </CreateAttestationModalContext.Provider>
    )
}

export const CreateAttestationModalProvider = ({
    children,
}: {
    children: ReactNode
}) => {
    const suiWallet = useWallet()

    const { reducer } = useContext(ExplorerSuiIdContext)!
    const [state] = reducer
    const { token } = state
    const { tokenType } = token

    const { getGenericSigner } = useGenericSigner()

    const { reducer : rootReducer } = useContext(RootContext)!
    const [ rootState, ] = rootReducer
    const { network } = rootState

    return (
        <Formik
            initialValues={initialValues}
            //validationSchema={}
            onSubmit={async ({ chainName }) => {
                if (!tokenType) return

                const vaa = await createAttestation<"Sui">({
                    chainName: "Sui",
                    tokenAddress: getInnerType(tokenType) ?? "",
                    signer: new SuiWalletSigner(suiWallet, network)
                })

                if (!vaa) return
                
                const signer = getGenericSigner(chainName)

                if (!signer) return

                const txId = await createWrapped({
                    vaa,
                    chainName: chainName as Chain,
                    signer
                })
                console.log(txId)
            }}
        >
            {(_props) => renderBody(_props, children)}
        </Formik>
    )
}
