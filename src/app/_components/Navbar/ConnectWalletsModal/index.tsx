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
    Spacer,
    Link,
} from "@nextui-org/react"
import { Button } from "@nextui-org/button"
import { useWallet as useSuiWallet } from "@suiet/wallet-kit"
import { SupportedChainName, supportedChains } from "@services"
import { truncateAddress } from "@common"
import { useSDK as useMetamaskWallet } from "@metamask/sdk-react-ui"
import { RootContext } from "../../../_hooks"

export const ConnectWalletsModal = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure()

    const {
        address: suiAddress,
        select,
        disconnect,
        configuredWallets,
    } = useSuiWallet()
    const { sdk, account: evmAddress } = useMetamaskWallet()

    const { reducer, wallets } = useContext(RootContext)!
    const { pera } = wallets

    const [rootState, rootDispatch] = reducer
    const { wallets: walletsState } = rootState
    const { pera: peraState } = walletsState

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
                                        <div>
                                            <div className="gap-4 flex">
                                                {configuredWallets.map(
                                                    ({ name, iconUrl }) => (
                                                        <div className="grid gap-1 place-items-center w-fit">
                                                            <Button
                                                                size="lg"
                                                                isIconOnly
                                                                variant="light"
                                                                onPress={() =>
                                                                    select(name)
                                                                }
                                                            >
                                                                <Image
                                                                    removeWrapper
                                                                    src={
                                                                        iconUrl
                                                                    }
                                                                />
                                                            </Button>
                                                            <div className="text-sm text-center">
                                                                {name}
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                            {suiAddress ? (
                                                <>
                                                    <Spacer y={4} />
                                                    <div className="flex items-center gap-4 text-sm">
                                                        {truncateAddress(
                                                            suiAddress
                                                        )}

                                                        <Link
                                                            className="text-sm"
                                                            as="button"
                                                            onPress={() =>
                                                                disconnect()
                                                            }
                                                        >
                                                            Disconnect
                                                        </Link>
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
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
                                        <div>
                                            <div className="gap-4 flex">
                                                <div className="grid gap-1 place-items-center w-fit">
                                                    <Button
                                                        size="lg"
                                                        isIconOnly
                                                        variant="light"
                                                        onPress={() =>
                                                            sdk?.connect()
                                                        }
                                                    >
                                                        <Image
                                                            removeWrapper
                                                            src="/icons/metamask.svg"
                                                            className="w-8"
                                                        />
                                                    </Button>
                                                    <div className="text-sm text-center">
                                                        Metamask
                                                    </div>
                                                </div>
                                            </div>
                                            {evmAddress ? (
                                                <>
                                                    <Spacer y={4} />
                                                    <div className="flex items-center gap-4 text-sm">
                                                        {truncateAddress(
                                                            evmAddress
                                                        )}

                                                        <Link
                                                            className="text-sm"
                                                            as="button"
                                                            onPress={async () =>
                                                                sdk?.disconnect()
                                                            }
                                                        >
                                                            Disconnect
                                                        </Link>
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
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
                                        <div>
                                            <div className="gap-4 flex">
                                                <div className="grid gap-1 place-items-center w-fit">
                                                    <Button
                                                        size="lg"
                                                        isIconOnly
                                                        variant="light"
                                                        onPress={async () => {
                                                            try {
                                                                const [
                                                                    algorandAddress,
                                                                ] =
                                                                    await pera.connect()
                                                                rootDispatch({
                                                                    type: "SET_PERA_WALLET_ADDRESS",
                                                                    payload:
                                                                        algorandAddress,
                                                                })
                                                            } catch (ex) {
                                                                console.log(ex)
                                                            }
                                                        }}
                                                    >
                                                        <Image
                                                            removeWrapper
                                                            src="/icons/pera.png"
                                                            className="w-8"
                                                        />
                                                    </Button>
                                                    <div className="text-sm text-center">
                                                        Pera
                                                    </div>
                                                </div>
                                            </div>
                                            {peraState.address ? (
                                                <>
                                                    <Spacer y={4} />
                                                    <div className="flex items-center gap-4 text-sm">
                                                        {truncateAddress(
                                                            peraState.address
                                                        )}

                                                        <Link
                                                            className="text-sm"
                                                            as="button"
                                                            onPress={async () => {
                                                                try {
                                                                    await pera.disconnect()
                                                                    rootDispatch(
                                                                        {
                                                                            type: "SET_PERA_WALLET_ADDRESS",
                                                                            payload:
                                                                                undefined,
                                                                        }
                                                                    )
                                                                } catch (ex) {
                                                                    console.log(
                                                                        ex
                                                                    )
                                                                }
                                                            }}
                                                        >
                                                            Disconnect
                                                        </Link>
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
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
