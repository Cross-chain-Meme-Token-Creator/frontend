import React from "react"
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Tabs,
    Tab,
} from "@nextui-org/react"
import { Button } from "@nextui-org/button"
import { SuiTab } from "./SuiTab"
import { EvmTab } from "./EvmTab"
import { AlgorandTab } from "./AlgorandTab"
import { SupportedPlatform } from "@services"

export const ConnectWalletsModal = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure()

    interface Tab {
        key: SupportedPlatform
        title: string
        content: JSX.Element
    }

    const tabs: Array<Tab> = [
        {
            key: "Evm",
            title: "EVM",
            content: <EvmTab />,
        },
        {
            key: "Sui",
            title: "Sui",
            content: <SuiTab />,
        },
        {
            key: "Algorand",
            title: "Algorand",
            content: <AlgorandTab />,
        },
    ]

    return (
        <>
            <Button color="primary" onPress={onOpen}>
                Connect Wallets
            </Button>
            <Modal classNames={{
            
            }} isOpen={isOpen} size="xl" onOpenChange={onOpenChange} isDismissable={false}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Connect Wallets
                            </ModalHeader>
                            <ModalBody>
                                <Tabs
                                    variant="underlined"
                                    classNames={{
                                        panel: "px-0",
                                        tabList: "px-0",
                                        tab: "px-4",
                                        cursor: "w-full bg-primary"
                                    }}
                                >
                                    {tabs.map(({ key, title, content }) => (
                                        <Tab key={key} title={title}>
                                            {content}
                                        </Tab>
                                    ))}
                                </Tabs>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={onClose}
                                >
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}
