import { Transaction, mnemonicToSecretKey, waitForConfirmation } from "algosdk"
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
            break
        }
    }, [selectedSigner, peraAddress])

    const connectPera = async () => {
        try {
            const [address] = await peraWallet.connect()
            dispatch({
                type: "SET_PERA_WALLET_ADDRESS",
                //payload: address,
                payload: "ZLNCYK6I3PAOB74KDAPKFUKQPVNVYTUANAYJDIB3GJS6FYAC6XTZ3QL7GY"
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

    const signAndSend = async (txn: Transaction) => {
        const _getAlgodClient = getAlgodClient(network)
        switch (selectedSigner) {
        case "pera": {
            // const signedTxns = await peraWallet.signTransaction([
            //     [
            //         {
            //             txn,
            //         },
            //     ],
            // ])

            const _aaa = mnemonicToSecretKey("solve youth payment gasp swallow document spoil just aim ancient control cotton anger miss multiply siren laugh shoulder lonely embody penalty term comic abstract between")
            const ttt = txn.signTxn(_aaa.sk)

            const { txId } = await _getAlgodClient
                .sendRawTransaction(ttt)
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
        disconnectPera,
    }
}
