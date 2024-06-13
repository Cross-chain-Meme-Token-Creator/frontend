import { Form, Formik, FormikProps } from "formik"
import React, { ReactNode, createContext, useContext, useMemo } from "react"
import { SupportedChainName, redeem, supportedChains } from "@services"
import { RootContext, useGenericSigner } from "../../../../../../_hooks"
import { deserialize } from "@wormhole-foundation/sdk-definitions"
import {
    NotificationModalContext,
    SignTransactionModalContext,
    TransactionToastContext,
    WalletConnectionRequiredModalContext,
} from "../../../../../../_components"

interface FormikValue {
    senderChainName: SupportedChainName
    passphrase: string
}

interface RedeemCardContextValue {
    formik: FormikProps<FormikValue>
}

const initialValues: FormikValue = {
    senderChainName: SupportedChainName.Celo,
    passphrase: "",
}

export const RedeemCardContext = createContext<RedeemCardContextValue | null>(
    null
)

const renderBody = (formik: FormikProps<FormikValue>, chidren: ReactNode) => {
    const RedeemCardContextValue: RedeemCardContextValue = useMemo(
        () => ({
            formik,
        }),
        [formik]
    )

    return (
        <RedeemCardContext.Provider value={RedeemCardContextValue}>
            <Form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
                {chidren}
            </Form>
        </RedeemCardContext.Provider>
    )
}

export const RedeemCardProvider = ({ children }: { children: ReactNode }) => {
    const { getGenericSigner } = useGenericSigner()

    const { reducer } = useContext(RootContext)!
    const [state] = reducer
    const { network, selectedChainName } = state

    const { functions } = useContext(NotificationModalContext)!
    const { openModal } = functions

    const { functions: signTransactionModalFunctions } = useContext(
        SignTransactionModalContext
    )!
    const {
        openModal: openSignTransactionModal,
        closeModal: closeSignTransactionModal,
    } = signTransactionModalFunctions

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
            onSubmit={async ({ senderChainName, passphrase }) => {
                const signer = getGenericSigner(selectedChainName)
                if (!signer) {
                    openWalletConnectionRequiredModal()
                    return
                }

                try {
                    openSignTransactionModal()
                    const txHash = await redeem({
                        network,
                        redeemChainName: selectedChainName,
                        senderChainName: senderChainName,
                        vaa: deserialize(
                            "TokenBridge:Transfer",
                            Uint8Array.from(Buffer.from(passphrase, "base64"))
                        ),
                        signer,
                    })

                    openModal({
                        title: "Redeem Tokens Successfully",
                        innerHtml: (
                            <div className="text-sm">
                                You have successfully redeemed tokens sent from{" "}
                                <span className="font-semibold">
                                    {supportedChains[senderChainName].name}
                                </span>{" "}
                                blockchain. Double-check your balance to see the
                                changes.
                            </div>
                        ),
                    })
                    notify({
                        chainName: selectedChainName,
                        txHash,
                    })
                } catch (ex) {
                    console.log(ex)
                } finally {
                    closeSignTransactionModal()
                }
            }}
        >
            {(_props) => renderBody(_props, children)}
        </Formik>
    )
}
