import { Form, Formik, FormikProps } from "formik"
import React, { ReactNode, createContext, useContext, useMemo } from "react"
import { SupportedChainName, transfer } from "@services"
import { Chain } from "@wormhole-foundation/sdk-base"
import { computeRaw } from "@common"
import { TokenContext } from "../../../../_hooks"
import {
    PassphraseAndQRCodeModalContext,
    SignTransactionModalContext,
    TransactionToastContext,
    WalletConnectionRequiredModalContext,
} from "../../../../../../_components"
import { RootContext, useGenericSigner } from "../../../../../../_hooks"
import { VAA, toNative } from "@wormhole-foundation/sdk-definitions"

interface FormikValue {
    targetChainName: SupportedChainName
    recipientAddress: string
    transferAmount: number
}

interface TransferCardContextValue {
    formik: FormikProps<FormikValue>
}

const initialValues: FormikValue = {
    targetChainName: SupportedChainName.Celo,
    recipientAddress: "",
    transferAmount: 0,
}

export const TransferCardContext =
    createContext<TransferCardContextValue | null>(null)

const renderBody = (formik: FormikProps<FormikValue>, chidren: ReactNode) => {
    const TransferCardContextValue: TransferCardContextValue = useMemo(
        () => ({
            formik,
        }),
        [formik]
    )

    return (
        <TransferCardContext.Provider value={TransferCardContextValue}>
            <Form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
                {chidren}
            </Form>
        </TransferCardContext.Provider>
    )
}

export const TransferCardProvider = ({ children }: { children: ReactNode }) => {
    const { reducer } = useContext(TokenContext)!
    const [state] = reducer
    const { tokenInfo, tokenAddress } = state
    const { decimals } = { ...tokenInfo }

    const { reducer: rootReducer } = useContext(RootContext)!
    const [rootState] = rootReducer
    const { network, selectedChainName } = rootState

    const { functions } = useContext(PassphraseAndQRCodeModalContext)!
    const { openModal } = functions

    const { getGenericSigner } = useGenericSigner()

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

    const openModalWithVaa = (vaa: VAA) =>
        openModal({
            title: "Transfer Successfully",
            vaa,
            passphraseNote:
                "Send this passphrase to the recipient to allow them to redeem tokens",
            qrNote: "Send the QR code to the recipient so they can scan it to redeem their tokens",
        })

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={async ({
                targetChainName,
                recipientAddress,
                transferAmount,
            }) => {
                const signer = getGenericSigner(selectedChainName)
                if (!signer) {
                    openWalletConnectionRequiredModal()
                    return
                }

                switch (selectedChainName) {
                default: {
                    if (!tokenAddress) return

                    try {
                        openSignTransactionModal()

                        const { vaa, txHash } = await transfer({
                            network,
                            transferAmount: computeRaw(
                                transferAmount,
                                decimals
                            ),
                            recipientAddress,
                            sourceChainName: selectedChainName as Chain,
                            targetChainName: targetChainName as Chain,
                            tokenAddress: toNative(
                                selectedChainName,
                                tokenAddress
                            ),
                            signer,
                        })

                        if (!vaa) return
                        openModalWithVaa(vaa)

                        notify({ chainName: selectedChainName, txHash })
                    } catch (ex) {
                        console.log(ex)
                    } finally {
                        closeSignTransactionModal()
                    }

                    break
                }
                }
            }}
        >
            {(_props) => renderBody(_props, children)}
        </Formik>
    )
}
