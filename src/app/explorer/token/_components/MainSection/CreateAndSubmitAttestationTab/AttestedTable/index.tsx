"use client"
import React, { useContext } from "react"
import { TokenContext } from "../../../../_hooks"
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    Spinner,
    TableRow,
    TableCell,
    Avatar,
    Spacer,
    Card,
    CardBody,
    Button,
} from "@nextui-org/react"
import { chainToChainId } from "@wormhole-foundation/sdk-base"
import { supportedChains, SupportedChainName } from "@services"
import { BalanceInfo } from "./BalanceInfo"
import { ArrowPathIcon } from "@heroicons/react/24/outline"

export const AttestedTable = () => {
    const { reducer } = useContext(TokenContext)!
    const [state] = reducer
    const { bridgedChainInfos } = state

    const loadingState = !bridgedChainInfos ? "loading" : "idle"

    return (
        <Card shadow="none" className="border border-divider">
            <CardBody className="p-4">
                <div className="flex items-center justify-between">
                    <div className="font-bold"> Attested Table </div>
                    <Button
                        startContent={<ArrowPathIcon className="w-5 h-5" />}
                        color="primary"
                    >
                        Refresh
                    </Button>
                </div>

                <Spacer y={4} />
                <Table removeWrapper aria-label="Attested Table">
                    <TableHeader>
                        <TableColumn>Chain Name</TableColumn>
                        <TableColumn>Chain Id </TableColumn>
                        <TableColumn>Wrapped Token Address </TableColumn>
                        <TableColumn>Balance </TableColumn>
                    </TableHeader>
                    <TableBody
                        items={bridgedChainInfos ?? []}
                        emptyContent={
                            <div className="text-sm">No rows to display.</div>
                        }
                        loadingContent={<Spinner />}
                        loadingState={loadingState}
                    >
                        {({ chainName, id, wrappedAddress }) => (
                            <TableRow key={id}>
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
                                <TableCell>
                                    {chainToChainId(chainName)}
                                </TableCell>
                                <TableCell>{wrappedAddress}</TableCell>
                                <TableCell>
                                    <BalanceInfo chainName={chainName} />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardBody>
        </Card>
    )
}
