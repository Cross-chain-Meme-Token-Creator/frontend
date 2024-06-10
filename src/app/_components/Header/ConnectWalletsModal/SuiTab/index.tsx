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
import { useWallet } from "@suiet/wallet-kit"
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline"

export const SuiTab = () => {
    const { configuredWallets, select, disconnect, address, name } = useWallet()

    return (
        <div>
            <div className="gap-4 flex">
                {configuredWallets.map(({ name, iconUrl }) => (
                    <div
                        key={name}
                        className="grid gap-1 place-items-center w-fit"
                    >
                        <Card
                            isPressable
                            onPress={() => select(name)}
                            shadow="none"
                            className="border border-divider"
                        >
                            <CardBody className="p-4 items-center">
                                <Image src={iconUrl} className="w-12 h-12" />
                            </CardBody>
                            <CardFooter className="p-4 pt-0 text-sm justify-center">
                                {name}
                            </CardFooter>
                        </Card>
                    </div>
                ))}
            </div>
            <Spacer y={6} />
            {address ? (
                <div className="flex items-center gap-4 text-sm">
                    <CheckIcon className="w-5 h-5 text-primary" />
                    <div className="flex gap-2 items-center">
                        <Image
                            className="w-3.5 h-3.5"
                            removeWrapper
                            radius="none"
                            src={
                                configuredWallets.find(
                                    ({ name: foundName }) => foundName === name
                                )?.iconUrl
                            }
                        ></Image>
                        {name}
                    </div>
                    {truncateString(address)}
                    <Link
                        className="text-sm"
                        as="button"
                        onPress={() => disconnect()}
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
