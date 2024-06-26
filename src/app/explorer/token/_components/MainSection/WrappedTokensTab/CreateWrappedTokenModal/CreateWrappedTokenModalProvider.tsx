import { Form, Formik, FormikProps } from "formik"
import React, {
    Dispatch,
    ReactNode,
    createContext,
    useContext,
    useMemo,
} from "react"
import { SupportedChainName, supportedChains } from "@services"
import { createWrappedToken } from "@services"
import { RootContext, useGenericSigner } from "../../../../../../_hooks"
import { SetIsLoadingAction } from "../../../../_hooks"
import {
    CreateWrappedTokenModalState,
    useCreateWrappedTokenModalReducer,
} from "./useCreateWrappedTokenModalReducer"
import * as Yup from "yup"
import { deserialize } from "@wormhole-foundation/sdk-definitions"
import {
    NotificationModalContext,
    SignTransactionModalContext,
    TransactionToastContext,
    WalletConnectionRequiredModalContext,
} from "../../../../../../_components"

interface FormikValue {
    targetChainName: SupportedChainName
    passphrase: string
}

interface CreateWrappedTokenModalContextValue {
    formik: FormikProps<FormikValue>
    reducer: [CreateWrappedTokenModalState, Dispatch<SetIsLoadingAction>]
}

const initialValues: FormikValue = {
    targetChainName: SupportedChainName.Celo,
    passphrase: "",
}

export const CreateWrappedTokenModalContext =
    createContext<CreateWrappedTokenModalContextValue | null>(null)

const renderBody = (formik: FormikProps<FormikValue>, chidren: ReactNode) => {
    const reducer = useCreateWrappedTokenModalReducer()

    const CreateWrappedTokenModalContextValue: CreateWrappedTokenModalContextValue =
        useMemo(
            () => ({
                formik,
                reducer,
            }),
            [formik, reducer]
        )

    return (
        <CreateWrappedTokenModalContext.Provider
            value={CreateWrappedTokenModalContextValue}
        >
            <Form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
                {chidren}
            </Form>
        </CreateWrappedTokenModalContext.Provider>
    )
}

export const CreateWrappedTokenModalProvider = ({
    children,
}: {
    children: ReactNode
}) => {
    //const { reducer } = useContext(TokenContext)!
    //const [state] = reducer
    // const { tokenInfo } = state
    // const { tokenType } = { ...tokenInfo }

    const { getGenericSigner } = useGenericSigner()

    const { reducer: rootReducer } = useContext(RootContext)!
    const [rootState] = rootReducer
    const { network } = rootState

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
            validationSchema={Yup.object({
                passphrase: Yup.string().required(),
            })}
            onSubmit={async ({ targetChainName, passphrase }) => {
                const signer = getGenericSigner(targetChainName)
                if (!signer) {
                    openWalletConnectionRequiredModal({
                        chainName: targetChainName,
                    })
                    return
                }

                switch (targetChainName) {
                case SupportedChainName.Sui: {
                    return
                }
                default: {
                    try {
                        openSignTransactionModal({
                            chainName: targetChainName,
                        })

                        const vaa = deserialize(
                            "TokenBridge:AttestMeta",
                            Uint8Array.from(
                                Buffer.from(passphrase, "base64")
                            )
                        )

                        const txHash = await createWrappedToken({
                            network,
                            targetChainName,
                            vaa,
                            signer,
                        })

                        openModal({
                            title: "Create Wrapped Token Successfully",
                            innerHtml: (
                                <div className="text-sm">
                                        Congratulations! A wrapped token has
                                        been successfully created on the{" "}
                                    <span className="font-semibold">
                                            
                                        {
                                            supportedChains[targetChainName]
                                                .name
                                        }
                                    </span>{" "}
                                        blockchain. You can now receive the
                                        token here.
                                </div>
                            ),
                        })

                        notify({
                            chainName: targetChainName,
                            txHash,
                        })
                    } catch (ex) {
                        console.log(ex)
                    } finally {
                        closeSignTransactionModal()
                    }
                }
                }
            }}
        >
            {(_props) => renderBody(_props, children)}
        </Formik>
    )
}
