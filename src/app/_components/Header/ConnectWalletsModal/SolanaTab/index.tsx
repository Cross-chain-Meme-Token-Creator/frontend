// import { Button } from "@nextui-org/button"
// import { Tab, Spacer, Image, Link } from "@nextui-org/react"
// import React, { useContext } from "react"
// import { truncateString } from "@common"
// import { supportedChains, SupportedChainName } from "@services"
// import { RootContext } from "../../../../_hooks"

// export const SolanaTab = () => {
//     const { reducer, wallets } = useContext(RootContext)!
//     const { phantomWallet } = wallets

//     const [rootState, rootDispatch] = reducer
//     const { wallets: walletsState } = rootState
//     const { phantomWallet: phantomWalletState } = walletsState

//     return (
//         <Tab
//             key={supportedChains[SupportedChainName.Solana].chainId}
//             title={
//                 <div className="flex items-center gap-2">
//                     <Image
//                         src={
//                             supportedChains[SupportedChainName.Solana]
//                                 .imageUrl
//                         }
//                         removeWrapper
//                         className="w-3.5"
//                     />
//                     {supportedChains[SupportedChainName.Solana].name}
//                 </div>
//             }
//         >
//             <div>
//                 <div className="gap-4 flex">
//                     <div className="grid gap-1 place-items-center w-fit">
//                         <Button
//                             size="lg"
//                             isIconOnly
//                             variant="light"
//                             onPress={async () => {
//                                 try {
//                                     await phantomWallet.connect()
//                                     const solanaAddress = await phantomWallet.getAddress()
//                                     rootDispatch({
//                                         type: "SET_PHANTOM_WALLET_ADDRESS",
//                                         payload: solanaAddress,
//                                     })
//                                 } catch (ex) {
//                                     console.log(ex)
//                                 }
//                             }}
//                         >
//                             <Image
//                                 removeWrapper
//                                 src="/icons/pera.png"
//                                 className="w-8"
//                             />
//                         </Button>
//                         <div className="text-sm text-center">Pera</div>
//                     </div>
//                 </div>
//                 {phantomWalletState.address ? (
//                     <>
//                         <Spacer y={4} />
//                         <div className="flex items-center gap-4 text-sm">
//                             {truncateString(phantomWalletState.address)}

//                             <Link
//                                 className="text-sm"
//                                 as="button"
//                                 onPress={async () => {
//                                     try {
//                                         await phantomWallet.disconnect()
//                                         rootDispatch({
//                                             type: "SET_PHANTOM_WALLET_ADDRESS",
//                                             payload: undefined,
//                                         })
//                                     } catch (ex) {
//                                         console.log(ex)
//                                     }
//                                 }}
//                             >
//                                 Disconnect
//                             </Link>
//                         </div>
//                     </>
//                 ) : null}
//             </div>
//         </Tab>
//     )
// }
