import {
    Spacer,
    Image,
    Link,
    Card,
    CardBody,
    CardFooter,
} from "@nextui-org/react"
import React from "react"
import { truncateString } from "@common"
import { EvmSelectedSigner, useEvmSigner } from "../../../../_hooks"
import { publicConfig } from "@config"
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline"

export const EvmTab = () => {
    const { selectedSigner, address, connectMetaMask, disconnectMetaMask } =
        useEvmSigner()

    const renderWallet = () => {
        if (!selectedSigner) return
        const evmToWallet: Record<EvmSelectedSigner, JSX.Element> = {
            metaMask: (
                <div className="flex items-center gap-2">
                    <Image
                        removeWrapper
                        src={publicConfig.icons.metamask}
                        radius="none"
                        className="w-3.5 h-3.5"
                    />
                    <div className="text-sm">Metamask</div>
                </div>
            ),
        }
        return evmToWallet[selectedSigner]
    }

    return (
        <div>
            <div className="gap-4 flex">
                <div className="grid gap-1 place-items-center w-fit">
                    <Card isPressable onPress={connectMetaMask}>
                        <CardBody className="p-4 items-center">
                            <Image
                                radius="none"
                                src={publicConfig.icons.metamask}
                                className="w-12 h-12"
                            />
                        </CardBody>
                        <CardFooter className="p-4 pt-0 text-sm justify-center">
                            Metamask
                        </CardFooter>
                    </Card>
                </div>
            </div>
            <Spacer y={6} />
            {address ? (
                <div className="flex items-center gap-4 text-sm">
                    <CheckIcon className="w-5 h-5 text-primary" />
                    {renderWallet()}
                    {truncateString(address)}
                    <Link
                        className="text-sm"
                        as="button"
                        onPress={disconnectMetaMask}
                    >
                        Disconnect
                    </Link>
                </div>
            ) : (
                <div className="flex gap-2 items-center">
                    <XMarkIcon className="w-5 h-5 text-foreground-500" />
                    <div className="text-sm text-foreground-500">
                        Not connected
                    </div>
                </div>
            )}
        </div>
    )
}
