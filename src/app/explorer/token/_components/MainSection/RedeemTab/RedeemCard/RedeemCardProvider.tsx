import { Form, Formik, FormikProps } from "formik"
import React, { ReactNode, createContext, useContext, useMemo } from "react"
import { SupportedChainName, redeem } from "@services"
import { RootContext, useGenericSigner } from "../../../../../../_hooks"
import { deserialize } from "@wormhole-foundation/sdk-definitions"
import { NotificationModalContext } from "../../../../../../_components"
import { truncateString } from "@common"
import { Link } from "@nextui-org/react"

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

    return (
        <Formik
            initialValues={initialValues}
            //validationSchema={}
            onSubmit={async ({ senderChainName, passphrase }) => {
                const signer = getGenericSigner(selectedChainName)
                if (!signer) return

                const txId = await redeem({
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
                        <div>
                            <div className="text-sm">
                                Redeem tokens successfully.
                            </div>
                            <div className="flex gap-1">
                                <div className="text-sm">Transaction hash:</div>
                                <Link size="sm"> {truncateString(txId)}</Link>
                            </div>
                        </div>
                    ),
                })
            }}
        >
            {(_props) => renderBody(_props, children)}
        </Formik>
    )
}
