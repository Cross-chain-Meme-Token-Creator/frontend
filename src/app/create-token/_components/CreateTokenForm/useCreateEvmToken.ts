import { FormikValue } from "./CreateTokenFormProvider"
import { useContext } from "react"
import {
    SupportedEvmChainName,
    createEvmToken,
    mapSupportedChainNameToSupportedEvmChainName,
} from "@services"
import {
    SignTransactionModalContext,
    TransactionToastContext,
    WalletConnectionRequiredModalContext,
} from "../../../_components"
import { RootContext, useEvmSigner } from "../../../_hooks"
import {
    CreateTokenFormState,
    SetCreateTokenFormAddressAction,
} from "./useCreateTokenFormReducer"
import { DisclosureType } from "@common"

export const useCreateEvmToken = (
    { onOpen }: DisclosureType,
    [, dispatch]: [
        CreateTokenFormState,
        React.Dispatch<SetCreateTokenFormAddressAction>
    ]
) => {
    const { address, metamaskWallet } = useEvmSigner()
    const { provider } = metamaskWallet

    const { functions } = useContext(SignTransactionModalContext)!
    const { openModal, closeModal } = functions

    const { functions: walletConnectionRequiredModalFunctions } = useContext(
        WalletConnectionRequiredModalContext
    )!

    const { openModal: openWalletConnectionRequiredModal } =
        walletConnectionRequiredModalFunctions

    const { reducer: rootReducer } = useContext(RootContext)!
    const [rootState] = rootReducer
    const { selectedChainName, network } = rootState

    const { functions: transactionToastFunctions } = useContext(
        TransactionToastContext
    )!
    const { notify } = transactionToastFunctions

    const createToken = async ({
        decimals,
        name,
        symbol,
        totalSupply,
    }: FormikValue) => {
        if (!Object.keys(SupportedEvmChainName).includes(selectedChainName))
            return

        if (!address) {
            openWalletConnectionRequiredModal()
            return
        }

        try {
            openModal()
            if (!provider) return

            const response = await createEvmToken({
                chainName:
                    mapSupportedChainNameToSupportedEvmChainName(
                        selectedChainName
                    ),
                decimals,
                fromAddress: address,
                name,
                network,
                provider,
                symbol,
                totalSupply,
            })
            if (!response) return

            const { tokenAddress, txHash } = response

            dispatch({
                type: "SET_TEMP_TOKEN_INFO",
                payload: {
                    tokenAddress,
                },
            })

            notify({
                chainName: selectedChainName,
                txHash,
            })
            onOpen()
        } finally {
            closeModal()
        }
    }

    return createToken
}
