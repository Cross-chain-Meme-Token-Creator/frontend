import { FormikValue } from "./CreateTokenFormProvider"
import { useContext } from "react"
import {
    AlgorandCreateAssetResponse,
    SupportedChainName,
    getMakeAlgorandAssetTransaction,
} from "@services"
import {
    SignTransactionModalContext,
    TransactionToastContext,
    WalletConnectionRequiredModalContext,
} from "../../../_components"
import { RootContext, useAlgorandSigner } from "../../../_hooks"
import {
    CreateTokenFormState,
    SetCreateTokenFormAddressAction,
} from "./useCreateTokenFormReducer"
import { DisclosureType } from "@common"

export const useCreateAlgorandToken = (
    { onOpen }: DisclosureType,
    [, dispatch]: [
        CreateTokenFormState,
        React.Dispatch<SetCreateTokenFormAddressAction>
    ]
) => {
    const { address, signAndSend } = useAlgorandSigner()

    const { functions } = useContext(SignTransactionModalContext)!
    const { openModal, closeModal } = functions

    const { functions: walletConnectionRequiredModalFunctions } = useContext(
        WalletConnectionRequiredModalContext
    )!

    const { openModal: openWalletConnectionRequiredModal } =
        walletConnectionRequiredModalFunctions

    const { reducer: rootReducer } = useContext(RootContext)!
    const [rootState] = rootReducer
    const { selectedChainName } = rootState

    const { functions: transactionToastFunctions } = useContext(
        TransactionToastContext
    )!
    const { notify } = transactionToastFunctions

    const createToken = async ({
        decimals,
        name,
        symbol,
        iconUrl,
        totalSupply,
    }: FormikValue) => {
        if (selectedChainName !== SupportedChainName.Algorand) return

        if (!address) {
            openWalletConnectionRequiredModal()
            return
        }

        try {
            openModal()
            const txn = await getMakeAlgorandAssetTransaction({
                fromAddress: address,
                decimals,
                name,
                symbol,
                iconUrl,
                totalSupply,
            })
            const response = (await signAndSend(txn)) as
                | AlgorandCreateAssetResponse
                | undefined
            if (!response) return
            dispatch({
                type: "SET_TEMP_TOKEN_INFO",
                payload: {
                    tokenAddress: response["asset-index"].toString(),
                },
            })

            notify({
                chainName: selectedChainName,
                txHash: txn.txID(),
            })
            onOpen()
        } finally {
            closeModal()
        }
    }

    return createToken
}
