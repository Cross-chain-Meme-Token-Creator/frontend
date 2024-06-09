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
import { RedeemModalContext, RedeemModalProvider } from "./RedeemModalProvider"
import { ChainSelect } from "./ChainSelect"

const WrappedRedeemModal = () => {
    const { formik, discloresures } = useContext(RedeemModalContext)!
    const { baseDiscloresure } = discloresures
    const { onOpen, onOpenChange, isOpen, onClose } = baseDiscloresure
    
    return (
        <>
            <Button color="primary" onPress={onOpen}>
                Redeem
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        Redeem
                    </ModalHeader>
                    <ModalBody className="gap-8">
                        <div className="text-sm text-foreground-500">
                            Recipients can redeem their tokens with a passphrase
                        </div>

                        <div className="gap-4 grid">
                            <Textarea
                                id="passphrase"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.passphrase.toString()}
                                isRequired
                                placeholder="1"
                                labelPlacement="outside"
                                label="Passphrase"
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
                            Redeem
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export const RedeemModal = () => (
    <RedeemModalProvider>
        <WrappedRedeemModal />
    </RedeemModalProvider>
)
