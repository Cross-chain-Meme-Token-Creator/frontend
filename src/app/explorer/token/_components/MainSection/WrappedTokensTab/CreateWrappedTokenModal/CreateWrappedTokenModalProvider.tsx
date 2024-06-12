import { Form, Formik, FormikProps } from "formik"
import React, {
    Dispatch,
    ReactNode,
    createContext,
    useContext,
    useMemo,
} from "react"
import { SupportedChainName } from "@services"
import { createWrappedToken } from "@services"
import { RootContext, useGenericSigner } from "../../../../../../_hooks"
import { SetIsLoadingAction } from "../../../../_hooks"
import {
    CreateWrappedTokenModalState,
    useCreateWrappedTokenModalReducer,
} from "./useCreateWrappedTokenModalReducer"
import * as Yup from "yup"
import { deserialize } from "@wormhole-foundation/sdk-definitions"
import { NotificationModalContext } from "../../../../../../_components"
import { Link } from "@nextui-org/react"
import { truncateString } from "@common"

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

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={Yup.object({
                passphrase: Yup.string().required(),
            })}
            onSubmit={async ({ targetChainName, passphrase }) => {
                switch (targetChainName) {
                case SupportedChainName.Sui: {
                    return
                }
                default: {
                    const vaa = deserialize(
                        "TokenBridge:AttestMeta",
                        Uint8Array.from(Buffer.from(passphrase, "base64"))
                    )

                    const signer = getGenericSigner(targetChainName)
                    const txId = await createWrappedToken({
                        network,
                        targetChainName,
                        vaa,
                        signer
                    })

                    openModal({
                        title: "Create Wrapped Token Successfully",
                        innerHtml: (
                            <div>
                                <div className="text-sm">
                                        Create wrapped token successfully.
                                </div>
                                <div className="flex gap-1">
                                    <div className="text-sm">
                                            Transaction hash:
                                    </div>
                                    <Link size="sm">  {truncateString(txId)}</Link>
                                </div>
                            </div>
                        ),
                    })

                    return
                }
                }
            }}
        >
            {(_props) => renderBody(_props, children)}
        </Formik>
    )
}
