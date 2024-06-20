import useSWRMutation from "swr/mutation"
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
import { useCreateTokenFormReducer } from "./useCreateTokenFormReducer"
import { useDisclosure } from "@nextui-org/react"

export const useCreateEvmToken = () => {
    const { address, metamaskWallet } = useEvmSigner()
    const { provider } = metamaskWallet

    const tokenCreatedSuccesfullyModalDiscloresure = useDisclosure()
    const { onOpen } = tokenCreatedSuccesfullyModalDiscloresure

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

    const reducer = useCreateTokenFormReducer()
    const [, dispatch] = reducer

    const { functions: transactionToastFunctions } = useContext(
        TransactionToastContext
    )!
    const { notify } = transactionToastFunctions

    const swrMutation = useSWRMutation(
        "CREATE_ALGORAND_TOKEN",
        async (
            _: string,
            {
                arg,
            }: {
                arg: FormikValue
            }
        ) => {
            if (!Object.keys(SupportedEvmChainName).includes(selectedChainName))
                return

            if (!address) {
                openWalletConnectionRequiredModal()
                return
            }

            const { decimals, name, symbol, totalSupply } = arg

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
    )

    return swrMutation
}
