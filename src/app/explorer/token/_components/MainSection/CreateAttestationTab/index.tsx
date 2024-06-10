"use client"
import { Button } from "@nextui-org/button"
import React, { useContext } from "react"
import { useGenericSigner, RootContext } from "../../../../../_hooks"
import { TokenContext } from "../../../_hooks"
import { SupportedChainName, createAttestation } from "@services"
import { getInnerType } from "@common"
import { NotificationModalContext } from "../../../../../_components"
import { PassphraseAndQRCodeContent } from "@shared"

export const CreateAttestationTab = () => {
    const { reducer } = useContext(TokenContext)!
    const [state] = reducer
    const { tokenInfo } = state
    const { tokenType } = { ...tokenInfo }

    const { getGenericSigner } = useGenericSigner()

    const { reducer: rootReducer } = useContext(RootContext)!
    const [rootState] = rootReducer
    const { network, selectedChainName } = rootState

    const { functions } = useContext(NotificationModalContext)!
    const { openModal } = functions

    return (
        <div>
            <div>
                <Button
                    color="primary"
                    onPress={async () => {
                        switch (selectedChainName) {
                        case SupportedChainName.Sui: {
                            try {
                                if (!tokenType) return

                                const chainSigner =
                                        getGenericSigner(selectedChainName)

                                if (!chainSigner) return

                                const vaa = await createAttestation({
                                    network,
                                    chainName: selectedChainName,
                                    tokenAddress:
                                            getInnerType(tokenType) ?? "",
                                    signer: chainSigner,
                                })

                                if (!vaa) return

                                openModal({
                                    size: "xl",
                                    title: "Create Attestation Successfully",
                                    innerHtml: (
                                        <PassphraseAndQRCodeContent
                                            vaa={vaa}
                                            passphraseNote="Keep the passphrase securely for creating wrapped tokens on other chains"
                                            qrNote="Scan the QR code to get the passphrase"
                                        />
                                    ),
                                })
                                return
                            } catch (ex) {
                                console.log(ex)
                                return
                            }
                        }
                        default: {
                            return
                        }
                        }
                    }}
                >
                    Create Attestation
                </Button>
            </div>
        </div>
    )
}
