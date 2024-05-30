import { Button } from "@nextui-org/button"
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@nextui-org/react"
import React, { useContext } from "react"
import {
    SendToEvmButtonContext,
    SendToEvmButtonProvider,
} from "./SendToEvmButtonProvider"
import { Step1 } from "./Step1"

const WrappedSendToEvmButton = () => {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
    const { formik } = useContext(SendToEvmButtonContext)!
    console.log(formik.values)

    return (
        <>
            <Button color="primary" onPress={onOpen}>
                Send To Evm
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        Send To Evm
                    </ModalHeader>
                    <ModalBody className="gap-8">
                        <Step1/>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="danger"
                            variant="light"
                            onPress={onClose}
                        >
                            Close
                        </Button>
                        <Button color="primary" onPress={onClose}>
                            Transfer
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export const SendToEvmButton = () => {
    return (
        <SendToEvmButtonProvider>
            <WrappedSendToEvmButton />
        </SendToEvmButtonProvider>
    )
}
