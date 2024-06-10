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
import React, { useContext } from "react"
import { FoundToken } from "./FoundToken"
import { RootContext } from "../../../_hooks"

export const SearchBar = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const { reducer } = useContext(RootContext)!
    const [state, dispatch] = reducer
    const { searchValue } = state

    return (
        <>
            <Button
                variant="flat"
                startContent={<MagnifyingGlassIcon className="w-5 h-5" />}
                onPress={onOpen}
            >
                Search anything
            </Button>
            <Modal size="4xl" hideCloseButton isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col p-4 pb-0">
                                <Input
                                    value={searchValue}
                                    onValueChange={(searchValue) => {
                                        dispatch({
                                            type: "SET_SEARCH_VALUE",
                                            payload: searchValue,
                                        })
                                    }}
                                    placeholder="0xcoffee"
                                />
                            </ModalHeader>
                            <ModalBody className="p-4">
                                <FoundToken />
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
