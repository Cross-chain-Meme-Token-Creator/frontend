"use client"
import { useContext } from "react"
import { SigningTransactionModalContext } from "."
import React, {
    Modal,
    Image,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Spinner,
    Link,
} from "@nextui-org/react"
import { RootContext, useAlgorandSigner, useEvmSigner } from "../../_hooks"
import { SupportedPlatform, supportedChains } from "@services"
import { chainToPlatform } from "@wormhole-foundation/sdk-base"
import { publicConfig } from "@config"
import { ArrowRightIcon } from "@heroicons/react/24/outline"
import { truncateString } from "@common"

export const SigningTransactionModal = () => {
    const { reducer, discloresures } = useContext(
        SigningTransactionModalContext
    )!
    const [state] = reducer
    const { txHash } = state

    const { baseDiscloresure } = discloresures
    const { onClose, isOpen, onOpenChange } = baseDiscloresure

    const { reducer: rootReducer } = useContext(RootContext)!
    const [rootState] = rootReducer
    const { selectedChainName } = rootState

    const { selectedSigner: evmSelectedSigner } = useEvmSigner()
    const { selectedSigner: algorandSelectedSigner } = useAlgorandSigner()

    let walletImageUrl: string = ""
    let walletName: string = ""

    switch (chainToPlatform(selectedChainName)) {
    case SupportedPlatform.Algorand: {
        if (algorandSelectedSigner === "pera") {
            walletImageUrl = publicConfig.icons.pera
            walletName = "Pera Wallet"
        }
        break
    }
    case SupportedPlatform.Evm: {
        if (evmSelectedSigner === "metaMask") {
            walletImageUrl = publicConfig.icons.metamask
            walletName = "Metamask Wallet"
        }
        break
    }
    case SupportedPlatform.Solana: {
        break
    }
    case SupportedPlatform.Sui: {
        break
    }
    }

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onClose={onClose}
            size="sm"
        >
            <ModalContent>
                <ModalHeader className="p-4 pb-0 text-base font-bold">
                    Signing Transaction
                </ModalHeader>
                <ModalBody className="p-4 min-h-[160px] place-content-center">
                    <div className="flex items-center gap-4 w-full">
                        <Image
                            removeWrapper
                            className="w-10 h-10"
                            src={supportedChains[selectedChainName].imageUrl}
                        />
                        <ArrowRightIcon className="w-5 h-5 text-foreground-500" />
                        <Image
                            removeWrapper
                            className="w-10 h-10"
                            src={walletImageUrl}
                        />
                    </div>
                    {txHash ? (
                        <div className="flex items-center gap-1">
                            <div className="text-sm"> Tx Hash:</div>
                            <Link size="sm" isExternal showAnchorIcon>
                                {truncateString(txHash)}
                            </Link>
                        </div>
                    ) : null}
                </ModalBody>
                <ModalFooter className="p-4 pt-0 flex gap-2">
                    <Spinner size="sm" />
                    <div className="text-sm">
                        {`Signing ${supportedChains[selectedChainName].name} transaction(s) using ${walletName}`}
                    </div>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
