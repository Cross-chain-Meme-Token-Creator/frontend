"use client"
import { useContext } from "react"
import { NotificationModalContext } from "."
import React, {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@nextui-org/react"

export const NotificationModal = () => {
    const { reducer, discloresures } = useContext(NotificationModalContext)!
    const [state] = reducer
    const { innerHtml, title, size } = state
    const { baseDiscloresure } = discloresures
    const { onClose, isOpen } = baseDiscloresure!

    return (
        <Modal isDismissable={false} isOpen={isOpen} onClose={onClose} size={size}>
            <ModalContent>
                {title ? (
                    <ModalHeader className="p-4 pb-0 text-base font-bold">
                        {title}
                    </ModalHeader>
                ) : null}
                <ModalBody className="p-4">{innerHtml}</ModalBody>
                <ModalFooter className="p-4 pt-0">
                    <Button color="danger" variant="light" onPress={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
