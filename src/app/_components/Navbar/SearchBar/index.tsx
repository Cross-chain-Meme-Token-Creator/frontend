"use client"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure,
} from "@nextui-org/react"
import React from "react"
import { FoundToken } from "./FoundToken"

export const SearchBar = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure()

    return (
        <>
            <Button variant="flat" startContent={<MagnifyingGlassIcon className="w-5 h-5"/>} onPress={onOpen}> Search anything </Button>
            <Modal hideCloseButton isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col p-4 pb-0">
                                <Input classNames={{
                                }} placeholder="0xcoffee" />
                            </ModalHeader>
                            <ModalBody className="p-4">
                                <FoundToken/>
                            </ModalBody>
                            <ModalFooter className="p-4 pt-0 gap-4">
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

export interface FoundTokenInfo {
    decimals: number,
    name: string,
    description: string,
    iconUrl: string,
    symbol: string,
}