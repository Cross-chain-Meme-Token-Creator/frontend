import { Form, Formik, FormikProps } from "formik"
import React, { ReactNode, createContext, useContext, useMemo } from "react"
import { SupportedChainName, transfer } from "@services"
import { Chain } from "@wormhole-foundation/sdk-base"
import { computeRaw, getInnerType } from "@common"
import { TokenContext } from "../../../../_hooks"
import { NotificationModalContext } from "../../../../../../_components"
import { RootContext, useGenericSigner } from "../../../../../../_hooks"
import { VAA } from "@wormhole-foundation/sdk-definitions"
import { PassphraseAndQRCodeContent } from "@shared"

interface FormikValue {
    targetChainName: SupportedChainName
    recipient: string
    transferAmount: number
}

interface TransferCardContextValue {
    formik: FormikProps<FormikValue>
}

const initialValues: FormikValue = {
    targetChainName: SupportedChainName.Celo,
    recipient: "",
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

export const TransferCardProvider = ({
    children,
}: {
    children: ReactNode
}) => {
    const { reducer } = useContext(TokenContext)!
    const [state] = reducer
    const { tokenInfo, tokenAddress } = state
    const { tokenType, decimals } = { ...tokenInfo }

    const { functions } = useContext(NotificationModalContext)!
    const { openModal } = functions

    const { reducer: rootReducer } = useContext(RootContext)!
    const [rootState] = rootReducer
    const { network, selectedChainName } = rootState

    const { getGenericSigner } = useGenericSigner()

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={async ({
                targetChainName,
                recipient,
                transferAmount,
            }) => {
                if (!tokenType || !decimals) return

                let vaa: VAA<"TokenBridge:Transfer"> | null

                const signer = getGenericSigner(selectedChainName)

                switch (selectedChainName) {
                case SupportedChainName.Sui: {
                    vaa = await transfer({
                        network,
                        transferAmount: computeRaw(
                            transferAmount,
                            decimals
                        ),
                        recipient,
                        sourceChainName: selectedChainName as Chain,
                        targetChainName: targetChainName as Chain,
                        tokenAddress: getInnerType(tokenType) ?? "",
                        signer,
                    })
                    break
                }
                default: {
                    if (!tokenAddress) return
                    vaa = await transfer({
                        network,
                        transferAmount: computeRaw(
                            transferAmount,
                            decimals
                        ),
                        recipient,
                        sourceChainName: selectedChainName as Chain,
                        targetChainName: targetChainName as Chain,
                        tokenAddress: tokenAddress,
                        signer,
                    })
                    break
                }
                }

                if (!vaa) return

                openModal({
                    innerHtml: (
                        <PassphraseAndQRCodeContent
                            vaa={vaa}
                            passphraseNote="Send this passphrase to the recipient to allow them to redeem tokens"
                            qrNote="Send the QR code to the recipient so they can scan it to redeem their tokens"
                        />
                    ),
                    title: "Transfer Tokens Successfully",
                    size: "xl",
                })
            }}
        >
            {(_props) => renderBody(_props, children)}
        </Formik>
    )
}
