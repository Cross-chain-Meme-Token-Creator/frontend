import {
    Spacer,
    Image,
    Link,
    CardBody,
    CardFooter,
    Card,
} from "@nextui-org/react"
import React, { useContext } from "react"
import { truncateString } from "@common"
import {
    AlgorandSelectedSigner,
    AlgorandSignerContext,
    useAlgorandSigner,
} from "../../../../_hooks"
import { publicConfig } from "@config"
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline"

export const AlgorandTab = () => {
    const { reducer } = useContext(AlgorandSignerContext)!
    const { connectPera, disconnectPera, address } = useAlgorandSigner()

    const [state] = reducer
    const { selectedSigner } = state

    const renderWallet = () => {
        if (!selectedSigner) return null
        const peraToWallet: Record<AlgorandSelectedSigner, JSX.Element> = {
            pera: (
                <div className="flex items-center gap-2">
                    <Image
                        removeWrapper
                        src={publicConfig.icons.pera}
                        radius="full"
                        className="w-3.5 h-3.5"
                    />
                    <div className="text-sm">Pera</div>
                </div>
            ),
        }
        return peraToWallet[selectedSigner]
    }

    return (
        <div>
            <div className="gap-4 flex">
                <div className="grid gap-1 place-items-center w-fit">
                    <Card
                        isPressable
                        onPress={() => connectPera()}
                        shadow="none"
                        className="border border-divider"
                    >
                        <CardBody className="p-4 items-center">
                            <Image
                                radius="full"
                                src={publicConfig.icons.pera}
                                className="w-12 h-12"
                            />
                        </CardBody>
                        <CardFooter className="p-4 pt-0 text-sm justify-center">
                            Pera
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
                        onPress={() => disconnectPera()}
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
