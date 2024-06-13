"use client"
import { useContext } from "react"
import { WalletConnectionRequiredModalContext } from "."
import React, {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Avatar,
    Button,
} from "@nextui-org/react"
import { ConnectWalletContext, RootContext } from "../../_hooks"
import { mapPlatformToSupportedPlatform, supportedChains } from "@services"
import { publicConfig } from "@config"
import { chainToPlatform } from "@wormhole-foundation/sdk-base"

export const WalletConnectionRequiredModal = () => {
    const { reducer } = useContext(WalletConnectionRequiredModalContext)!
    const [state] = reducer
    const { chainName } = state

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
                <ModalBody className="p-4 min-h-[160px] grid place-items-center">
                    <div className="relative">
                        <Avatar
                            isBordered
                            classNames={{
                                base: "ring-0",
                            }}
                            className="-bottom-2 -right-2 w-8 h-8 absolute z-20"
                            src={supportedChains[selectedChainName].imageUrl}
                        />
                        <Avatar
                            className="w-16 h-16 relative"
                            src={publicConfig.images.web3Wallet}
                        />
                    </div>
                </ModalBody>
                <ModalFooter className="p-4 pt-0">
                    <Button
                        color="primary"
                        fullWidth
                        onPress={() => {
                            if (!chainName) return
                            connectWallet({
                                platform: mapPlatformToSupportedPlatform(
                                    chainToPlatform(chainName)
                                ),
                            })
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
