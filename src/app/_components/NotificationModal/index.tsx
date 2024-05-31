import { useContext } from "react"
import { NotificationModalContext } from "./NotificationModalProvider"
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@nextui-org/react"

export * from "./NotificationModalProvider"
export * from "./useNotificationModalReducer"

export const NotificationModal = () => {
    const { reducer, discloresures  } = useContext(NotificationModalContext)!
    const [ state ] = reducer
    const { innerHtml, title, size } = state
    const { baseDiscloresure } = discloresures
    const { onClose, isOpen } = baseDiscloresure!

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={size}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    {title}
                </ModalHeader>
                <ModalBody>{innerHtml}</ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
