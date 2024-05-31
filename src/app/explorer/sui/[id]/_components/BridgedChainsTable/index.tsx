import React, { useContext } from "react"
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Avatar,
    Spinner,
} from "@nextui-org/react"
import { ExplorerSuiIdContext } from "../../_hooks"
import { chainToChainId } from "@wormhole-foundation/sdk-base"
import { SupportedChainName, supportedChains } from "@services"
import { BalanceInfo } from "./BalanceInfo"

export const BridgedChainsTable = () => {
    const { reducer } = useContext(ExplorerSuiIdContext)!
    const [state] = reducer
    const { bridgedChainInfos } = state

    const loadingState = !bridgedChainInfos ? "loading" : "idle";

    return (
        <Table removeWrapper aria-label="Example static collection table">
            <TableHeader>
                <TableColumn>Chain Name</TableColumn>
                <TableColumn>Chain Id </TableColumn>
                <TableColumn>Wrapped Address </TableColumn>
                <TableColumn>Balance </TableColumn>
            </TableHeader>
            <TableBody
                items={bridgedChainInfos ?? []}
                emptyContent={"No rows to display."}
                loadingContent={<Spinner />}
                loadingState={loadingState}
            >
                {({ chainAddress, chainName }) => (
                    <TableRow key={chainToChainId(chainName)}>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <Avatar
                                    src={
                                        supportedChains[
                                            chainName as SupportedChainName
                                        ].imageUrl
                                    }
                                />
                                <div>{chainName}</div>
                            </div>
                        </TableCell>
                        <TableCell>{chainToChainId(chainName)}</TableCell>
                        <TableCell>{chainAddress.address.toString()}</TableCell>
                        <TableCell>
                            <BalanceInfo
                                chainName={chainName}
                                wrappedAddress={chainAddress.address as string}
                            />
                        </TableCell>
                    </TableRow>
                )
            }
            </TableBody>
        </Table>
    )
}
