import { Form, Formik, FormikProps } from "formik"
import React, { ReactNode, createContext, useContext, useMemo } from "react"
import { useWallet } from "@suiet/wallet-kit"
import { ExplorerSuiIdContext } from "../../../_hooks"
import QRCode from "qrcode"

import { SuiWalletSigner, SupportedChainName, transfer } from "@services"
import { Chain } from "@wormhole-foundation/sdk-base"
import { getInnerType, truncateString } from "@common"
import { NotificationModalContext } from "../../../../../../_components"
import { Divider, Snippet, Spacer, Image } from "@nextui-org/react"
import { RootContext } from "../../../../../../_hooks"

interface FormikValue {
    chainName: SupportedChainName
    recipient: string
    transferAmount: number
}

interface TransferModalContextValue {
    formik: FormikProps<FormikValue>
}

const initialValues: FormikValue = {
    chainName: SupportedChainName.Celo,
    recipient: "",
    transferAmount: 0,
}

export const TransferModalContext =
    createContext<TransferModalContextValue | null>(null)

const renderBody = (formik: FormikProps<FormikValue>, chidren: ReactNode) => {
    const TransferModalContextValue: TransferModalContextValue = useMemo(
        () => ({
            formik,
        }),
        [formik]
    )

    return (
        <TransferModalContext.Provider value={TransferModalContextValue}>
            <Form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
                {chidren}
            </Form>
        </TransferModalContext.Provider>
    )
}

export const TransferModalProvider = ({
    children,
}: {
    children: ReactNode
}) => {
    const suiWallet = useWallet()

    const { reducer } = useContext(ExplorerSuiIdContext)!
    const [state] = reducer
    const { token } = state
    const { tokenType, decimals } = token

    const { functions } = useContext(NotificationModalContext)!
    const { openModal } = functions

    const { reducer : rootReducer } = useContext(RootContext)!
    const [ rootState, ] = rootReducer
    const { network } = rootState

    return (
        <Formik
            initialValues={initialValues}
            //validationSchema={}
            onSubmit={async ({ chainName, recipient, transferAmount }) => {
                if (!tokenType || !decimals) return

                const serializedVaa = await transfer<"Sui", Chain>({
                    transferAmount: BigInt(transferAmount * 10 ** decimals),
                    recipient,
                    sourceChainName: "Sui",
                    targetChainName: chainName as Chain,
                    tokenAddress: getInnerType(tokenType) ?? "",
                    signer: new SuiWalletSigner(suiWallet, network),
                })

                if (!serializedVaa) return

                const qrUri = await QRCode.toDataURL(serializedVaa)
                
                const innerHtml = (
                    <div>
                        <div className="text-xs text-foreground-500">
                            To let recipient redeem transfered tokens, you can
                            either
                        </div>
                        <Spacer y={6} />
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <div className="text-sm">
                                    Send this passphrase to recipient
                                </div>
                                <Spacer y={4} />
                                <Snippet codeString={serializedVaa}>
                                    {truncateString(serializedVaa, 6, 4)}
                                </Snippet>
                            </div>
                            <Divider orientation="vertical" className="h-auto"/>
                            <div className="flex-1">
                                <div className="text-sm">
                                    Recipient scan this QR code
                                </div>
                                <Spacer y={4} />
                                <Image removeWrapper src={qrUri} alt="qr" />
                                
                            </div>
                        </div>
                    </div>
                )

                openModal({
                    innerHtml,
                    title: "Transfer Token Successfully",
                    size: "xl",
                })
            }}
        >
            {(_props) => renderBody(_props, children)}
        </Formik>
    )
}
