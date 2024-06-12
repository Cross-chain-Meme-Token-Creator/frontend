"use client"
import { Button } from "@nextui-org/button"
import React, { useContext } from "react"
import {
    useGenericSigner,
    RootContext,
    useAlgorandSigner,
} from "../../../../../_hooks"
import { TokenContext } from "../../../_hooks"
import { SupportedChainName, createAttestation } from "@services"
import { getInnerType } from "@common"
import { NotificationModalContext } from "../../../../../_components"
import { VAA } from "@wormhole-foundation/sdk-definitions"
import { PassphraseAndQRCodeContent } from "../../../../../_shared-components"

export const CreateAttestationTab = () => {
    const { reducer } = useContext(TokenContext)!
    const [state] = reducer
    const { tokenInfo, tokenAddress } = state
    const { tokenType } = { ...tokenInfo }

    const { getGenericSigner } = useGenericSigner()

    const { reducer: rootReducer } = useContext(RootContext)!
    const [rootState] = rootReducer
    const { network, selectedChainName } = rootState

    const { functions } = useContext(NotificationModalContext)!
    const { openModal } = functions

    const { address } = useAlgorandSigner()

    const openModalWithVaa = (vaa: VAA) =>
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

    return (
        <div>
            <div>
                <Button
                    color="primary"
                    onPress={async () => {
                        const chainSigner = getGenericSigner(selectedChainName)
                        if (!chainSigner) return

                        switch (selectedChainName) {
                        case SupportedChainName.Sui: {
                            try {
                                if (!tokenType) return

                                const vaa = await createAttestation({
                                    network,
                                    chainName: selectedChainName,
                                    tokenAddress:
                                            getInnerType(tokenType) ?? "",
                                    signer: chainSigner,
                                })

                                if (!vaa) return
                                openModalWithVaa(vaa)
                            } catch (ex) {
                                console.log(ex)
                            }
                            break
                        }
                        case SupportedChainName.Algorand: {
                            try {
                                if (!tokenAddress) return
                                    
                                if (!address) return
 
                                const vaa = await createAttestation({
                                    network,
                                    chainName: selectedChainName,
                                    tokenAddress,
                                    signer: chainSigner
                                })

                                if (!vaa) return
                                openModalWithVaa(vaa)
                            } catch (ex) {
                                console.log(ex)
                            }
                            break
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
