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

import {
    PassphraseAndQRCodeModalContext,
    SignTransactionModalContext,
    TransactionToastContext,
    WalletConnectionRequiredModalContext,
} from "../../../../../_components"
import { VAA } from "@wormhole-foundation/sdk-definitions"

export const CreateAttestationTab = () => {
    const { reducer } = useContext(TokenContext)!
    const [state] = reducer
    const { tokenInfo, tokenAddress } = state
    const { tokenType } = { ...tokenInfo }

    const { getGenericSigner } = useGenericSigner()

    const { reducer: rootReducer } = useContext(RootContext)!
    const [rootState] = rootReducer
    const { network, selectedChainName } = rootState

    const { functions } = useContext(PassphraseAndQRCodeModalContext)!
    const { openModal } = functions

    const { address } = useAlgorandSigner()

    const { functions: signTransactionModalFunctions } = useContext(
        SignTransactionModalContext
    )!
    const {
        openModal: openSignTransactionModal,
        closeModal: closeSignTransactionModal,
    } = signTransactionModalFunctions

    const { functions: walletConnectionRequiredModalFunctions } = useContext(
        WalletConnectionRequiredModalContext
    )!
    const { openModal: openWalletConnectionRequiredModal } =
        walletConnectionRequiredModalFunctions

    const { functions: transactionToastFunctions } = useContext(
        TransactionToastContext
    )!
    const { notify } = transactionToastFunctions

    const openModalWithVaa = (vaa: VAA) =>
        openModal({
            title: "Create Attestation Successfully",
            vaa,
            passphraseNote : "Keep the passphrase securely for creating wrapped tokens on other chains",
            qrNote : "Scan the QR code to get the passphrase"
        })

    return (
        <div>
            <div>
                <Button
                    color="primary"
                    onPress={async () => {
                        const chainSigner = getGenericSigner(selectedChainName)
                        if (!chainSigner) {
                            openWalletConnectionRequiredModal()
                            return
                        }

                        switch (selectedChainName) {
                        case SupportedChainName.Sui: {
                            // try {
                            //     if (!tokenType) return

                            //     const vaa = await createAttestation({
                            //         network,
                            //         chainName: selectedChainName,
                            //         tokenAddress:
                            //                 getInnerType(tokenType) ?? "",
                            //         signer: chainSigner,
                            //     })

                            //     if (!vaa) return
                            //     openModalWithVaa(vaa)
                            // } catch (ex) {
                            //     console.log(ex)
                            // }
                            break
                        }
                        case SupportedChainName.Algorand: {
                            if (!tokenAddress) return
                            if (!address) return

                            try {
                                openSignTransactionModal()
                                const { vaa, txHash } = await createAttestation({
                                    network,
                                    chainName: selectedChainName,
                                    tokenAddress,
                                    signer: chainSigner,
                                })

                                if (!vaa) return
                                openModalWithVaa(vaa)

                                notify({
                                    chainName: selectedChainName,
                                    txHash: txHash
                                })
                            } catch (ex) {
                                console.log(ex)
                            } finally {
                                closeSignTransactionModal()
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
