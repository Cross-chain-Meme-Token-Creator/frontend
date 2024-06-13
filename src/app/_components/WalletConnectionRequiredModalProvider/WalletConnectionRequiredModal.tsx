"use client"
import { useContext } from "react"
import { WalletConnectionRequiredModalContext } from "."
import React, {
    Modal,
    Image,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Avatar,
    Button,
} from "@nextui-org/react"
import { ConnectWalletContext, RootContext } from "../../_hooks"
import {
    ArrowRightIcon,
    QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline"
import { supportedChains } from "@services"

export const WalletConnectionRequiredModal = () => {
    const { reducer: rootReducer } = useContext(RootContext)!
    const [rootState] = rootReducer
    const { selectedChainName } = rootState

    const { discloresures } = useContext(WalletConnectionRequiredModalContext)!
    const { baseDiscloresure } = discloresures
    const { isOpen, onClose, onOpenChange } = baseDiscloresure
    const { functions } = useContext(ConnectWalletContext)!
    const { connectWallet } = functions

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onClose={onClose}
            size="sm"
        >
            <ModalContent>
                <ModalHeader className="p-4 pb-0 text-base font-bold">
                    Wallet Connection Required
                </ModalHeader>
                <ModalBody className="p-4 min-h-[160px] place-content-center">
                    <div className="flex items-center gap-4">
                        <Image
                            className="w-10 h-10"
                            removeWrapper
                            src={supportedChains[selectedChainName].imageUrl}
                        />
                        <ArrowRightIcon className="w-5 h-5 text-foreground-500" />
                        <Avatar
                            fallback={
                                <QuestionMarkCircleIcon className="w-10 h-10" />
                            }
                            showFallback
                        ></Avatar>
                    </div>

                    <div className="text-sm text-justify">
                        To process the transaction(s) in{" "}
                        <span className="font-bold text-primary">
                            {supportedChains[selectedChainName].name}
                        </span>
                        , please connect wallet
                    </div>
                </ModalBody>
                <ModalFooter className="p-4 pt-0">
                    <Button
                        color="primary"
                        fullWidth
                        onPress={() => {
                            connectWallet()
                            onClose()
                        }}
                    >
                        Connect Wallet
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
