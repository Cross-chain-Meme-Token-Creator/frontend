import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Spacer,
    useDisclosure,
} from "@nextui-org/react"
import {
    CreateAndSubmitAttestationModalContext,
    CreateAndSubmitAttestationModalProvider,
} from "./CreateAndSubmitAttestationModalProvider"
import React, { useContext } from "react"
import { ChainSelect } from "../../../../../../../shared/components"
import { RootContext } from "../../../../../../_hooks"
import { PlusIcon } from "@heroicons/react/24/outline"
import { TokenContext } from "../../../../_hooks"

const WrappedCreateAndSubmitAttestationModal = () => {
    const { formik } = useContext(CreateAndSubmitAttestationModalContext)!
    const { reducer: rootReducer } = useContext(RootContext)!
    const [rootState] = rootReducer
    const { selectedChainName } = rootState

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

    const { reducer: tokenReducer } = useContext(TokenContext)!
    const [tokenState] = tokenReducer
    const {  bridgedChainInfos } = tokenState

    return (
        <>
            <Button
                startContent={<PlusIcon className="w-5 h-5" />}
                color="primary"
                onPress={onOpen}
            >
                Create & Submit Attestation
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    <ModalHeader className="text-base font-bold p-4 pb-0">
                        Create & Submit Attestation
                    </ModalHeader>
                    <ModalBody className="p-4 gap-0">
                        <div>
                            <div className="text-xs text-foreground-500">
                                Create and attestation that allows the creation
                                of wrapped version tokens on the target chain,
                                allowing seamless token transfer.
                            </div>
                        </div>
                        <Spacer y={4}/>
                        <ChainSelect
                            firstAsDefault
                            chainName={formik.values.chainName}
                            setChainName={(chainName) =>
                                formik.setFieldValue("chainName", chainName)
                            }
                            excludes={[...bridgedChainInfos.map(({chainName}) => chainName), selectedChainName ]}
                        />
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

export const CreateAndSubmitAttestationModal = () => {
    return (
        <CreateAndSubmitAttestationModalProvider>
            <WrappedCreateAndSubmitAttestationModal />
        </CreateAndSubmitAttestationModalProvider>
    )
}
