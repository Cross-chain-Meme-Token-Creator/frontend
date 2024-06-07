import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure,
} from "@nextui-org/react"
import React, { useContext } from "react"
import {
    CreateAttestationModalContext,
    CreateAttestationModalProvider,
} from "./CreateAttestationModalProvider"
import { ChainSelect } from "./ChainSelect"

const WrappedCreateAttestationModal = () => {
    const { formik } = useContext(CreateAttestationModalContext)!
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

    return (
        <>
            <Button color="primary" onPress={onOpen}>
                Create Attestation
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        Create Attestation
                    </ModalHeader>
                    <ModalBody className="gap-8">
                        <div>
                            <div className="text-xs text-foreground-500">
                                Create an attestation on the target chain for
                                cross-chain transfers, enabling redemption with
                                a passphrase
                            </div>
                        </div>
                        <div className="gap-4 grid">
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
                            Create
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export const CreateAttestationModal = () => (
    <CreateAttestationModalProvider>
        <WrappedCreateAttestationModal />
    </CreateAttestationModalProvider>
)
