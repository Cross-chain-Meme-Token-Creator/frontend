import { Button } from "@nextui-org/button"
import { Spacer, Image, Link } from "@nextui-org/react"
import React from "react"
import { truncateString } from "@common"
import { useSDK } from "@metamask/sdk-react-ui"

export const CeloTab = () => {
    const { account: celoAddress, sdk } = useSDK()
    return (
        <div>
            <div className="gap-4 flex">
                <div className="grid gap-1 place-items-center w-fit">
                    <Button
                        size="lg"
                        isIconOnly
                        variant="light"
                        onPress={() => sdk?.connect()}
                    >
                        <Image
                            removeWrapper
                            src="/icons/metamask.svg"
                            className="w-8"
                        />
                    </Button>
                    <div className="text-sm text-center">Metamask</div>
                </div>
            </div>
            {celoAddress ? (
                <>
                    <Spacer y={4} />
                    <div className="flex items-center gap-4 text-sm">
                        {truncateString(celoAddress)}

                        <Link
                            className="text-sm"
                            as="button"
                            onPress={async () => sdk?.disconnect()}
                        >
                            Disconnect
                        </Link>
                    </div>
                </>
            ) : null}
        </div>
    )
}
