import useSWRMutation from "swr/mutation"
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
import { useCreateTokenFormReducer } from "./useCreateTokenFormReducer"
import { useDisclosure } from "@nextui-org/react"

export const useCreateAlgorandToken = () => {
    const { address, signAndSend } = useAlgorandSigner()

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
    const { selectedChainName } = rootState

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
            if (selectedChainName !== SupportedChainName.Algorand) return

            if (!address) {
                openWalletConnectionRequiredModal()
                return
            }

            const {
                decimals,
                name,
                symbol,
                iconUrl,
                totalSupply,
            } = arg

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
    )

    return swrMutation
}
