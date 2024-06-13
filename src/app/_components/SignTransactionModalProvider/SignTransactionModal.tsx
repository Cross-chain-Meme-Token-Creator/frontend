"use client"
import { useContext } from "react"
import React, {
    Modal,
    Image,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Avatar,
    Spinner,
} from "@nextui-org/react"
import { RootContext, useAlgorandSigner, useEvmSigner } from "../../_hooks"
import {
    SupportedPlatform,
    supportedChains,
} from "@services"
import { chainToPlatform } from "@wormhole-foundation/sdk-base"
import { publicConfig } from "@config"
import { SignTransactionModalContext } from "./index"
import { useWallet } from "@suiet/wallet-kit"

export const SignTransactionModal = () => {
    const { discloresures } = useContext(SignTransactionModalContext)!

    const { baseDiscloresure } = discloresures
    const { onClose, isOpen, onOpenChange } = baseDiscloresure

    const { reducer } = useContext(SignTransactionModalContext)!
    const [state] = reducer
    const { chainName } = state

    const { reducer: rootReducer } = useContext(RootContext)!
    const [rootState] = rootReducer
    const { selectedChainName } = rootState

    const _chainName = chainName ?? selectedChainName

    const { selectedSigner: evmSelectedSigner } = useEvmSigner()
    const { selectedSigner: algorandSelectedSigner } = useAlgorandSigner()
    const { name, configuredWallets } = useWallet()

    let walletImageUrl: string = ""
    switch (chainToPlatform(_chainName)) {
    case SupportedPlatform.Algorand: {
        if (algorandSelectedSigner === "pera") {
            walletImageUrl = publicConfig.icons.pera
        }
        break
    }
    case SupportedPlatform.Evm: {
        if (evmSelectedSigner === "metaMask") {
            walletImageUrl = publicConfig.icons.metamask
        }
        break
    }
    case SupportedPlatform.Solana: {
        break
    }
    case SupportedPlatform.Sui: {
        walletImageUrl =
                configuredWallets.find(({ name: _name }) => _name === name)
                    ?.iconUrl ?? ""
        break
    }
    }

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onClose={onClose}
            size="xs"
        >
            <ModalContent>
                <ModalHeader className="p-4 pb-0 text-base font-bold">
                    Sign Transaction
                </ModalHeader>
                <ModalBody className="p-4 min-h-[160px] grid place-items-center">
                    <div className="relative">
                        <Avatar
                            isBordered
                            classNames={{
                                base: "ring-0 bg-background",
                            }}
                            className="-bottom-2 -right-2 w-8 h-8 absolute z-20"
                            src={supportedChains[_chainName].imageUrl}
                        />
                        <Image
                            removeWrapper
                            className="w-16 h-16 relative"
                            src={walletImageUrl}
                        />
                    </div>
                </ModalBody>
                <ModalFooter className="p-4 pt-0">
                    <div className="flex items-center gap-2 w-full">
                        <Spinner size="sm" color="default" />
                        <div className="text-sm">Proceed in wallet</div>
                    </div>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
