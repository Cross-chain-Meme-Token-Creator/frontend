import React from "react"
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Image,
    Accordion,
    AccordionItem,
} from "@nextui-org/react"
import { Button } from "@nextui-org/button"
import { publicConfig } from "@config"
import { useWallet } from "@suiet/wallet-kit"
import { truncateAddress } from "@common"

export const ConnectWalletsModal = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure()

    const { address, select, disconnect, configuredWallets } = useWallet()

    return (
        <>
            <Button color="primary" onPress={onOpen}>
                Connect Wallets
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Connect Wallets
                            </ModalHeader>
                            <ModalBody>
                                <Accordion variant="light" showDivider className="border border-divider rounded-medium px-3" selectionMode="single" itemClasses={{
                                    trigger: "py-4",
                                    titleWrapper: "px-0",
                                    content: "py-4",
                                }} isCompact>
                                    <AccordionItem
                                        key="1"
                                        aria-label="Accordion 1"
                                        title={
                                            <div className="flex gap-1 items-center font-semibold">
                                                <Image
                                                    className="w-3.5 h-3.5"
                                                    removeWrapper
                                                    src={publicConfig.icons.sui}
                                                />
                                                <div className="text-sm">
                                                    SUI
                                                </div>
                                            </div>
                                        }
                                    >
                                        <div className="grid gap-4">
                                            {configuredWallets.map(
                                                ({ iconUrl, name }) => {
                                                    return (
                                                        <Button
                                                            onPress={() =>
                                                                select(name)
                                                            }
                                                            size="lg"
                                                            variant="light"
                                                            key={name}
                                                            isIconOnly
                                                        >
                                                            <Image
                                                                removeWrapper
                                                                src={iconUrl}
                                                                alt={name}
                                                            />
                                                        </Button>
                                                    )
                                                }
                                            )}
                                        
                                            {address ? (
                                                <div className="text-sm flex items-center justify-between">
                                                    <Button
                                                        onPress={() => disconnect()}
                                                        variant="flat"
                                                        className="w-fit"
                                                        color="primary"
                                                    >
                                                    Disconnect
                                                    </Button>
                                                    <div className="text-primary">
                                                        {truncateAddress(
                                                            address
                                                        )}
                                                    </div>
                                                </div>
                                            ) : null}
                                        </div>
                                    </AccordionItem>
                                </Accordion>
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
                                    Action
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}
