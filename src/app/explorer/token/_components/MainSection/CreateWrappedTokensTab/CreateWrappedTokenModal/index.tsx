import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Spacer,
    Textarea,
    useDisclosure,
} from "@nextui-org/react"
import {
    CreateWrappedTokenModalContext,
    CreateWrappedTokenModalProvider,
} from "./CreateWrappedTokenModalProvider"
import React, { useContext } from "react"
import { ChainSelect, UploadQR } from "@shared"
import { RootContext } from "../../../../../../_hooks"
import { TokenContext } from "../../../../_hooks"

const WrappedCreateWrappedTokenModal = () => {
    const { formik } = useContext(CreateWrappedTokenModalContext)!
    const { reducer: rootReducer } = useContext(RootContext)!
    const [rootState] = rootReducer
    const { selectedChainName } = rootState

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

    const { reducer: tokenReducer } = useContext(TokenContext)!
    const [tokenState] = tokenReducer
    const { bridgedChainInfos } = tokenState

    return (
        <>
            <Button color="primary" onPress={onOpen}>
                Create Wrapped Token
            </Button>
            <Modal size="lg" isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
                <ModalContent>
                    <ModalHeader className="text-base font-bold p-4 pb-0">
                        Create Wrapped Token
                    </ModalHeader>
                    <ModalBody className="p-4 gap-0">
                        <div>
                            <div className="text-xs text-foreground-500">
                                Create and attestation that allows the creation
                                of wrapped version tokens on the target chain,
                                allowing seamless token transfer.
                            </div>
                        </div>
                        <Spacer y={4} />
                        <ChainSelect
                            label="Target chain"
                            firstAsDefault
                            chainName={formik.values.targetChainName}
                            setChainName={(chainName) =>
                                formik.setFieldValue("targetChainName", chainName)
                            }
                            excludes={[
                                ...bridgedChainInfos.map(
                                    ({ chainName }) => chainName
                                ),
                                selectedChainName,
                            ]}
                            selectedChainName={selectedChainName}
                        />
                        <Spacer y={4} />
                        <Textarea
                            id="passphrase"
                            label="Passphrase"
                            labelPlacement="outside"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.passphrase}
                            isRequired
                            placeholder="ABCDEF..."
                            isInvalid={
                                !!(
                                    formik.touched.passphrase &&
                                    formik.errors.passphrase
                                )
                            }
                            errorMessage={  
                                formik.touched.passphrase &&
                                formik.errors.passphrase
                            }
                        />
                        <Spacer y={1} />
                        <UploadQR />
                    </ModalBody>
                    <ModalFooter className="p-4 pt-0">
                        <Button
                            color="danger"
                            variant="light"
                            onPress={onClose}
                        >
                            Close
                        </Button>
                        <Button color="primary" onPress={formik.submitForm}>
                            Create
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export const CreateWrappedTokenModal = () => {
    return (
        <CreateWrappedTokenModalProvider>
            <WrappedCreateWrappedTokenModal />
        </CreateWrappedTokenModalProvider>
    )
}
