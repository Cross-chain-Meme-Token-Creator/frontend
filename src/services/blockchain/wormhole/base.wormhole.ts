import { wormhole } from "@wormhole-foundation/sdk"
import algorand from "@wormhole-foundation/sdk/algorand"
import evm from "@wormhole-foundation/sdk/evm"
import solana from "@wormhole-foundation/sdk/solana"
import sui from "@wormhole-foundation/sdk/sui"
import cosmwasm from "@wormhole-foundation/sdk/cosmwasm"
import aptos from "@wormhole-foundation/sdk/aptos"

export const getWormhole = async () =>
    wormhole("Testnet", [sui, evm, algorand, solana, cosmwasm, aptos])
