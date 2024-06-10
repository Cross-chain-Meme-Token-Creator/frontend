import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Spacer,
    Textarea,
} from "@nextui-org/react"
import React, { useContext } from "react"
import { RedeemCardContext, RedeemCardProvider } from "./RedeemCardProvider"
import { ChainSelect, UploadQR } from "@shared"
import { RootContext } from "../../../../../../_hooks"

const WrappedRedeemCard = () => {
    const { formik } = useContext(RedeemCardContext)!

    const { reducer: rootReducer } = useContext(RootContext)!
    const [rootState] = rootReducer
    const { selectedChainName } = rootState

    return (
        <Card
            shadow="none"
            className="border border-divider max-w-[400px] mx-auto"
        >
            <CardHeader className="p-4 pb-0 font-bold">Redeem</CardHeader>
            <CardBody className="gap-4">
                <div className="text-sm text-foreground-500">
                    Recipients can redeem their tokens with a passphrase
                </div>

                <div className="gap-4 grid">
                    <div>
                        <Textarea
                            id="passphrase"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.passphrase.toString()}
                            isRequired
                            placeholder="ABCDEF..."
                            labelPlacement="outside"
                            label="Passphrase"
                        />
                        <Spacer y={1} />
                        <UploadQR />
                    </div>

                    <ChainSelect
                        chainName={formik.values.senderChainName}
                        setChainName={(selectedChainName) =>
                            formik.setFieldValue(
                                "senderChainName",
                                selectedChainName
                            )
                        }
                        excludes={[selectedChainName]}
                        firstAsDefault
                        label="Sender chain"
                        selectedChainName={selectedChainName}
                    />
                </div>
            </CardBody>
            <CardFooter>
                <Button color="primary" fullWidth onPress={formik.submitForm}>
                    Redeem
                </Button>
            </CardFooter>
        </Card>
    )
}

export const RedeemCard = () => (
    <RedeemCardProvider>
        <WrappedRedeemCard />
    </RedeemCardProvider>
)
