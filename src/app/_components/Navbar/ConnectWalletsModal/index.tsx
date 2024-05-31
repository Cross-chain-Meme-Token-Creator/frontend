import React, { useContext } from "react"
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Tabs,
    Tab,
    Image,
} from "@nextui-org/react"
import { Button } from "@nextui-org/button"
import { SuiTab } from "./SuiTab"
import { CeloTab } from "./CeloTab"
import { BscTab } from "./BscTab"
import { AlgorandTab } from "./AlgorandTab"
import { supportedChains, SupportedChainName } from "@services"
// import { SolanaTab } from "./SolanaTab"

export const ConnectWalletsModal = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure()

    return (
        <>
            <Button color="primary" onPress={onOpen}>
                Connect Wallets
            </Button>
            <Modal isOpen={isOpen} size="xl" onOpenChange={onOpenChange}>
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
                                        cursor: "w-full bg-primary",
                                    }}
                                >
                                    <Tab
                                        key={
                                            supportedChains[
                                                SupportedChainName.Sui
                                            ].chainId
                                        }
                                        title={
                                            <div className="flex items-center gap-2">
                                                <Image
                                                    src={
                                                        supportedChains[
                                                            SupportedChainName
                                                                .Sui
                                                        ].imageUrl
                                                    }
                                                    removeWrapper
                                                    className="w-3.5"
                                                />
                                                {
                                                    supportedChains[
                                                        SupportedChainName.Sui
                                                    ].name
                                                }
                                            </div>
                                        }
                                    >
                                        <SuiTab />
                                    </Tab>
                                    <Tab
                                        key={
                                            supportedChains[
                                                SupportedChainName.Celo
                                            ].chainId
                                        }
                                        title={
                                            <div className="flex items-center gap-2">
                                                <Image
                                                    src={
                                                        supportedChains[
                                                            SupportedChainName
                                                                .Celo
                                                        ].imageUrl
                                                    }
                                                    removeWrapper
                                                    className="w-3.5"
                                                />
                                                {
                                                    supportedChains[
                                                        SupportedChainName.Celo
                                                    ].name
                                                }
                                            </div>
                                        }
                                    >
                                        <CeloTab />
                                    </Tab>
                                    <Tab
                                        key={
                                            supportedChains[
                                                SupportedChainName.Bsc
                                            ].chainId
                                        }
                                        title={
                                            <div className="flex items-center gap-2">
                                                <Image
                                                    src={
                                                        supportedChains[
                                                            SupportedChainName
                                                                .Bsc
                                                        ].imageUrl
                                                    }
                                                    removeWrapper
                                                    className="w-3.5"
                                                />
                                                {
                                                    supportedChains[
                                                        SupportedChainName.Bsc
                                                    ].name
                                                }
                                            </div>
                                        }
                                    >
                                        <BscTab />
                                    </Tab>
                                    <Tab
                                        key={
                                            supportedChains[
                                                SupportedChainName.Algorand
                                            ].chainId
                                        }
                                        title={
                                            <div className="flex items-center gap-2">
                                                <Image
                                                    src={
                                                        supportedChains[
                                                            SupportedChainName
                                                                .Algorand
                                                        ].imageUrl
                                                    }
                                                    removeWrapper
                                                    className="w-3.5"
                                                />
                                                {
                                                    supportedChains[
                                                        SupportedChainName
                                                            .Algorand
                                                    ].name
                                                }
                                            </div>
                                        }
                                    >
                                        <AlgorandTab />
                                    </Tab>
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
