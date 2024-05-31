import { Button } from "@nextui-org/button"
import { Tab, Spacer, Image, Link } from "@nextui-org/react"
import React from "react"
import { truncateString } from "@common"
import { supportedChains, SupportedChainName } from "@services"
import { useWallet } from "@suiet/wallet-kit"

export const SuiTab = () => {
    const { configuredWallets, select, disconnect, address: suiAddress } = useWallet()
    return (
            <div>
                <div className="gap-4 flex">
                    {configuredWallets.map(({ name, iconUrl }) => (
                        <div className="grid gap-1 place-items-center w-fit">
                            <Button
                                size="lg"
                                isIconOnly
                                variant="light"
                                onPress={() => select(name)}
                            >
                                <Image removeWrapper src={iconUrl} />
                            </Button>
                            <div className="text-sm text-center">{name}</div>
                        </div>
                    ))}
                </div>
                {suiAddress ? (
                    <>
                        <Spacer y={4} />
                        <div className="flex items-center gap-4 text-sm">
                            {truncateString(suiAddress)}

                            <Link
                                className="text-sm"
                                as="button"
                                onPress={() => disconnect()}
                            >
                                Disconnect
                            </Link>
                        </div>
                    </>
                ) : null}
            </div>
    )
}
