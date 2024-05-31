import { Form, Formik, FormikProps } from "formik"
import React, { ReactNode, createContext, useContext, useMemo } from "react"
import { useWallet } from "@suiet/wallet-kit"
import { ExplorerSuiIdContext } from "../../../_hooks"
import { useSDK } from "@metamask/sdk-react"

import {
    SupportedChainName,
    getSigner,
    redeem,
} from "@services"

import { Chain } from "@wormhole-foundation/sdk-base"
import { useDisclosure } from "@nextui-org/react"
import { DisclosureType } from "@common"

interface FormikValue {
    chainName: SupportedChainName
    passphrase: string
}

interface RedeemModalContextValue {
    formik: FormikProps<FormikValue>
    discloresures: {
        baseDiscloresure: DisclosureType
    }
}

const initialValues: FormikValue = {
    chainName: SupportedChainName.Celo,
    passphrase: "",
}

export const RedeemModalContext = createContext<RedeemModalContextValue | null>(
    null
)

const renderBody = (
    formik: FormikProps<FormikValue>,
    baseDiscloresure: DisclosureType,
    chidren: ReactNode
) => {
    const redeemModalContextValue: RedeemModalContextValue = useMemo(
        () => ({
            formik,
            discloresures: {
                baseDiscloresure,
            },
        }),
        [formik, baseDiscloresure]
    )

    return (
        <RedeemModalContext.Provider value={redeemModalContextValue}>
            <Form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
                {chidren}
            </Form>
        </RedeemModalContext.Provider>
    )
}

export const RedeemModalProvider = ({ children }: { children: ReactNode }) => {
    const suiWallet = useWallet()
    const metamaskWallet = useSDK()

    const { reducer, functions } = useContext(ExplorerSuiIdContext)!
    const { triggerFetchBalance } = functions
    const [state, dispatch] = reducer
    const { token } = state
    const { tokenType, decimals } = token

    const baseDiscloresure = useDisclosure()
    const { onClose } = baseDiscloresure

    return (
        <Formik
            initialValues={initialValues}
            //validationSchema={}
            onSubmit={async ({ chainName, passphrase }) => {
                if (!tokenType || !decimals) return

                const signer = getSigner(chainName as Chain, {
                    metamaskWallet,
                    suiWallet,
                })
                console.log(passphrase)

                if (!signer) return

                const txId = await redeem<Chain, "Sui">({
                    redeemChainName: chainName as Chain,
                    senderChainName: "Sui",
                    serializedVaa: passphrase,
                    signer,
                })

                triggerFetchBalance()

                onClose()

                console.log(txId)
            }}
        >
            {(_props) => renderBody(_props, baseDiscloresure, children)}
        </Formik>
    )
}
