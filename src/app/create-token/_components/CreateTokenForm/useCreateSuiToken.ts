import useSWRMutation from "swr/mutation"
import { FormikValue } from "./CreateTokenFormProvider"
import { useWallet } from "@suiet/wallet-kit"
import { SuiObjectChangeCreated } from "@mysten/sui.js/client"
import { useContext } from "react"
import { getInnerType } from "../../../../common/utils"
import {
    SupportedChainName,
    getCreateSuiTokenTransactionBlock,
} from "../../../../services/blockchain"
import {
    SignTransactionModalContext,
    TransactionToastContext,
    WalletConnectionRequiredModalContext,
} from "../../../_components"
import { RootContext } from "../../../_hooks"
import { DisclosureType } from "@common"
import {
    CreateTokenFormState,
    SetCreateTokenFormAddressAction,
} from "./useCreateTokenFormReducer"

export const useCreateSuiToken = (
    { onOpen }: DisclosureType,
    [, dispatch]: [
        CreateTokenFormState,
        React.Dispatch<SetCreateTokenFormAddressAction>
    ]
) => {
    const { address, signAndExecuteTransactionBlock } = useWallet()

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
        description,
        name,
        symbol,
        iconUrl,
        totalSupply,
    }: FormikValue) => {
        if (selectedChainName !== SupportedChainName.Sui) return

        if (!address) {
            openWalletConnectionRequiredModal()
            return
        }

        try {
            openModal()
            const transactionBlock = await getCreateSuiTokenTransactionBlock({
                decimals,
                description,
                name,
                symbol,
                iconUrl,
                totalSupply,
            })
            const { objectChanges, digest } =
                await signAndExecuteTransactionBlock({
                    transactionBlock,
                    options: {
                        showObjectChanges: true,
                    },
                })

            if (!objectChanges) return
            console.log(objectChanges)

            const coinType =
                getInnerType(
                    (objectChanges as Array<SuiObjectChangeCreated>).find(
                        (objectChange) => {
                            const { objectType } = objectChange
                            if (!objectType) return false
                            return objectType.includes(
                                "0x2::coin::CoinMetadata"
                            )
                        }
                    )?.objectType ?? ""
                ) ?? ""

            dispatch({
                type: "SET_TEMP_TOKEN_INFO",
                payload: {
                    tokenAddress: coinType,
                },
            })

            notify({
                chainName: selectedChainName,
                txHash: digest,
            })

            onOpen()
        } finally {
            closeModal()
        }
    }

    return createToken
}
