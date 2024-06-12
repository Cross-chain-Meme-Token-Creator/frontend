import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Input
} from "@nextui-org/react"
import React, { useContext } from "react"
import {
    TransferCardContext,
    TransferCardProvider,
} from "./TransferCardProvider"

import { TokenContext } from "../../../../_hooks"
import { RootContext } from "../../../../../../_hooks"
import { ChainSelect } from "../../../../../../_shared-components"

const WrappedTransferCard = () => {
    const { formik } = useContext(TransferCardContext)!
    const { reducer } = useContext(TokenContext)!
    const [ state ] = reducer
    const { bridgedChainInfos } = state

    const { reducer: rootReducer } = useContext(RootContext)!
    const [rootState] = rootReducer
    const { selectedChainName } = rootState

    return (
        <Card shadow={"none"} className="border border-divider">
            <CardHeader className="p-4 pb-0 font-bold">
                        Transfer
            </CardHeader>
            <CardBody className="p-4 gap-4">
                <div className="text-xs text-foreground-500">
                            Transfer tokens to the recipient,
                            then the recipient can redeem them by provide the
                            generated passphrase
                </div>

                <div className="gap-4 grid">
                    <Input
                        id="recipientAddress"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.recipientAddress}
                        isRequired
                        placeholder="0xcoffee"
                        labelPlacement="outside"
                        label="Recipient Address"
                    />
                    <Input
                        id="transferAmount"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.transferAmount.toString()}
                        isRequired
                        placeholder="1"
                        labelPlacement="outside"
                        label="Transfer amount"
                    />
                    <ChainSelect
                        chainName={formik.values.targetChainName}
                        setChainName={(selectedChainName) =>
                            formik.setFieldValue(
                                "targetChainName",
                                selectedChainName
                            )
                        }
                        firstAsDefault
                        label="Target chain"
                        includes={bridgedChainInfos.map(({chainName}) => chainName)}
                        selectedChainName={selectedChainName}
                    />
                </div>
            </CardBody>
            <CardFooter>
                <Button color="primary" fullWidth onPress={formik.submitForm}>
                            Transfer
                </Button>
            </CardFooter>
        </Card>
    )
}

export const TransferCard = () => (
    <div className="max-w-[400px] mx-auto">
        <TransferCardProvider>
            <WrappedTransferCard />
        </TransferCardProvider>
    </div>
)
