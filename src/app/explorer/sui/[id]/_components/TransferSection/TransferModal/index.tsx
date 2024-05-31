import {
    Button,
    Divider,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Textarea,
    useDisclosure,
} from "@nextui-org/react"
import React, { useContext } from "react"
import {
    TransferModalContext,
    TransferModalProvider,
} from "./TransferModalProvider"
import { ChainSelect } from "./ChainSelect"

const WrappedTransferModal = () => {
    const { formik } = useContext(TransferModalContext)!
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

    return (
        <>
            <Button color="primary" onPress={onOpen}>
                Transfer
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        Transfer
                    </ModalHeader>
                    <ModalBody className="gap-8">
                        <div className="text-xs text-foreground-500">
                            Transfer tokens to the recipient after attestation,
                            then the recipient can redeem them by provide the generated passphrase
                        </div>

                        <div className="gap-4 grid">
                            <Input
                                id="recipient"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.recipient}
                                isRequired
                                placeholder="0xcoffee"
                                labelPlacement="outside"
                                label="Recipient"
                            />
                            <Textarea
                                id="transferAmount"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.transferAmount.toString()}
                                isRequired
                                placeholder="1"
                                labelPlacement="outside"
                                label="Transfer Amount"
                            />
                            <ChainSelect />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="danger"
                            variant="light"
                            onPress={onClose}
                        >
                            Close
                        </Button>
                        <Button color="primary" onPress={formik.submitForm}>
                            Transfer
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export const TransferModal = () => (
    <TransferModalProvider>
        <WrappedTransferModal />
    </TransferModalProvider>
)
