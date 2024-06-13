import { Transaction, waitForConfirmation } from "algosdk"
import { useContext, useEffect, useState } from "react"
import { getAlgodClient } from "@services"
import { AlgorandSignerContext, peraWallet } from "./AlgorandSignerProvider"
import { RootContext } from "./RootProvider"

export const useAlgorandSigner = () => {
    const { reducer } = useContext(AlgorandSignerContext)!
    const [state, dispatch] = reducer
    const { selectedSigner, peraWallet: peraWalletState } = state
    const { address: peraAddress } = peraWalletState
    
    const { reducer: rootReducer } = useContext(RootContext)!
    const [rootState] = rootReducer
    const { network } = rootState

    const [address, setAddress] = useState<string | undefined>(undefined)

    useEffect(() => {
        switch (selectedSigner) {
        case "pera": {
            setAddress(peraAddress)
            break
        }
        default:
            setAddress(undefined)
            break
        }
    }, [ selectedSigner, peraAddress ])

    const connectPera = async () => {
        try {
            const [address] = await peraWallet.connect()
            dispatch({
                type: "SET_PERA_WALLET_ADDRESS",
                payload: address,
            })
            dispatch({
                type: "SET_ALGORAND_SELECTED_SIGNER",
                payload: "pera",
            })
            return address
        } catch (ex) {
            console.log(ex)
        }
    }

    const disconnectPera = async () => {
        try {
            await peraWallet.disconnect()
            dispatch({
                type: "SET_PERA_WALLET_ADDRESS",
            })
            dispatch({
                type: "SET_ALGORAND_SELECTED_SIGNER",
            })
        } catch (ex) {
            console.log(ex)
        }
    }

    const disconnect = async () => {
        switch (selectedSigner) {
        case "pera": {
            disconnectPera()
            return
        }
        default:
            // nothing
            return
        }
    }

    const signAndSend = async (txn: Transaction) => {
        const _getAlgodClient = getAlgodClient(network)
        switch (selectedSigner) {
        case "pera": {
            const signedTxns = await peraWallet.signTransaction([
                [
                    {
                        txn,
                    },
                ],
            ])

            const { txId } = await _getAlgodClient
                .sendRawTransaction(signedTxns)
                .do()
            return await waitForConfirmation(_getAlgodClient, txId, 3)
        }
        }
    }

    return {
        address,
        selectedSigner,
        signAndSend,
        connectPera,
        disconnect,
    }
}
