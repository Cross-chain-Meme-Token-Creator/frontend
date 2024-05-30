import { Form, Formik, FormikProps } from "formik"
import React, { ReactNode, createContext, useContext, useMemo } from "react"
import { SupportedChainName, getCreateSuiTokenTransactionBlock, supportedChains, transferCrossChainFromSui } from "@services"
import { useWallet } from "@suiet/wallet-kit"
import { ExplorerSuiIdContext } from "../../_hooks"
import { ChainId } from "@certusone/wormhole-sdk"

interface FormikValue {
    targetEvmAddress: string
    chainName: SupportedChainName,
}

interface SendToEvmButtonContextValue {
    formik: FormikProps<FormikValue>
}

const initialValues: FormikValue = {
    targetEvmAddress: "",
    chainName: SupportedChainName.Celo
}

export const SendToEvmButtonContext = createContext<SendToEvmButtonContextValue | null>(
    null
)

const renderBody = (
    formik: FormikProps<FormikValue>,
    chidren: ReactNode
) => {


    const SendToEvmButtonContextValue: SendToEvmButtonContextValue = useMemo(() => ({
        formik
    }), [formik])

    return (
        <SendToEvmButtonContext.Provider value={SendToEvmButtonContextValue}>
            <Form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>{chidren}</Form>
        </SendToEvmButtonContext.Provider>
    )
}

export const SendToEvmButtonProvider = ({ children }: { children: ReactNode }) => {
    const suiWallet = useWallet()

    const { reducer } = useContext(ExplorerSuiIdContext)!
    const [state, dispatch] = reducer
    const { balance, token } = state
    const { type } = token

    return (
        <Formik
            initialValues={initialValues}
            //validationSchema={}
            onSubmit={async ({ chainName, targetEvmAddress }) => {
                if (!type) return
                const result = await transferCrossChainFromSui({
                    suiTypeArg: type,
                    recipientAddress: targetEvmAddress,
                    suiWallet,
                    targetChainId: supportedChains[chainName].chainId as ChainId
                })
                if (!result) return

                const { tokenAddress, transferVAA } = result
                console.log(tokenAddress, transferVAA)
            }}
        >
            {(_props) => renderBody(_props, children)}
        </Formik>
    )
}

