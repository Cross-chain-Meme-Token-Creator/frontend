"use client"
import React, { useContext } from "react"
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Avatar,
    Link,
    Spacer,
} from "@nextui-org/react"
import { CreateTokenFormContext } from "../CreateTokenFormProvider"
import { truncateString } from "@common"
import { RootContext } from "../../../../_hooks"
import { chainNameToTokenIdName, supportedChains } from "@services"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"

export const TokenCreatedSuccesfullyModal = () => {
    const { discloresures, formik, reducer } = useContext(
        CreateTokenFormContext
    )!
    const { tokenCreatedSuccesfullyModalDiscloresure } = discloresures
    const { onOpenChange, onClose, isOpen } =
        tokenCreatedSuccesfullyModalDiscloresure

    const [state] = reducer
    const { tempTokenInfo } = state
    const { tokenAddress } = { ...tempTokenInfo }

    const { reducer: rootReducer } = useContext(RootContext)!
    const [rootState] = rootReducer
    const { selectedChainName } = rootState

    const router = useRouter()
    const searchParams = useSearchParams()

    return (
        <Modal onOpenChange={onOpenChange} isOpen={isOpen} size="sm">
            <ModalContent>
                <ModalHeader className="p-4 pb-0 font-bold text-base">
                    Token Created Succesfully
                </ModalHeader>
                <ModalBody className="p-4 min-h-[160px] grid place-items-center">
                    <div className="grid place-items-center">
                        <div className="relative w-fit">
                            <Avatar
                                isBordered
                                classNames={{
                                    base: "ring-0 bg-background",
                                }}
                                className="-bottom-2 -right-2 w-8 h-8 absolute z-20"
                                src={supportedChains[selectedChainName].imageUrl}
                            />
                            <Avatar
                                className="w-16 h-16 relative"
                                src={formik.values.iconUrl}
                                showFallback
                                name={formik.values.symbol}
                            />
                        </div>
                        <Spacer y={4}/>
                        <div className="grid place-items-center">
                            <div className="font-semibold text-xl"> {formik.values.symbol} </div>
                            <div className="text-foreground-500 text-sm"> {formik.values.name} </div>
                        </div>
                        <Spacer y={4}/>
                        <div className="flex items-center gap-2">
                            <div className="text-sm font-semibold">{chainNameToTokenIdName[selectedChainName]}</div>
                            <Link color="foreground" size="sm" isExternal showAnchorIcon> {truncateString(tokenAddress) }</Link>
                        </div>  
                    </div>
                </ModalBody>
                <ModalFooter className="p-4 pt-0">
                    <Button
                        color="primary"
                        fullWidth
                        onPress={() => {
                            if (!tokenAddress) return
                            const _searchParams = new URLSearchParams(
                                searchParams
                            )
                            _searchParams.set("chainName", selectedChainName)
                            _searchParams.set("tokenAddress", tokenAddress)

                            const url = `/explorer/token?${_searchParams.toString()}`
                            router.push(url)

                            onClose()
                        }}
                    >
                        View in explorer
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
