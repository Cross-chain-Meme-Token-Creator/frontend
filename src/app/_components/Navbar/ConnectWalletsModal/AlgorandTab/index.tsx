import { Button } from "@nextui-org/button"
import { Spacer, Image, Link } from "@nextui-org/react"
import React, { useContext } from "react"
import { truncateString } from "@common"
import { RootContext } from "../../../../_hooks"

export const AlgorandTab = () => {
    const { reducer, wallets } = useContext(RootContext)!
    const { peraWallet } = wallets

    const [rootState, rootDispatch] = reducer
    const { wallets: walletsState } = rootState
    const { peraWallet: peraWalletState } = walletsState

    return (
        <div>
            <div className="gap-4 flex">
                <div className="grid gap-1 place-items-center w-fit">
                    <Button
                        size="lg"
                        isIconOnly
                        variant="light"
                        onPress={async () => {
                            try {
                                const [algorandAddress] =
                                    await peraWallet.connect()
                                rootDispatch({
                                    type: "SET_PERA_WALLET_ADDRESS",
                                    payload: algorandAddress,
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
                    <div className="text-sm text-center">Pera</div>
                </div>
            </div>
            {peraWalletState.address ? (
                <>
                    <Spacer y={4} />
                    <div className="flex items-center gap-4 text-sm">
                        {truncateString(peraWalletState.address)}

                        <Link
                            className="text-sm"
                            as="button"
                            onPress={async () => {
                                try {
                                    await peraWallet.disconnect()
                                    rootDispatch({
                                        type: "SET_PERA_WALLET_ADDRESS",
                                        payload: undefined,
                                    })
                                } catch (ex) {
                                    console.log(ex)
                                }
                            }}
                        >
                            Disconnect
                        </Link>
                    </div>
                </>
            ) : null}
        </div>
    )
}
