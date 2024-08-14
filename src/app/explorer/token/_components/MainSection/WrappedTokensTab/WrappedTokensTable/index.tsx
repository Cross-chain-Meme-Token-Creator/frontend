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
    Image,
    Spacer,
    Card,
    CardBody,
    Button,
    Link,
} from "@nextui-org/react"
import { chainToChainId } from "@wormhole-foundation/sdk-base"
import { supportedChains } from "@services"
import { BalanceInfo } from "./BalanceInfo"
import { ArrowPathIcon } from "@heroicons/react/24/outline"
import { truncateString } from "@common"

export const WrappedTokensTable = () => {
    const { reducer } = useContext(TokenContext)!
    const [state, dispatch] = reducer
    const { bridgedChainInfos, loadings } = state
    const { isWrappedTokensFetchLoading } = loadings

    const loadingState = isWrappedTokensFetchLoading ? "loading" : "idle"

    return (
        <Card shadow="none" className="border border-divider">
            <CardBody className="p-4">
                <div className="flex items-center justify-between">
                    <div className="font-bold"> Wrapped Tokens </div>
                    <Button
                        onPress={() =>
                            dispatch({
                                type: "SET_REFRESH_WRAPPED_TOKENS_KEY",
                            })
                        }
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
                                        <Image
                                            className="w-10 h-10"
                                            alt="chain"
                                            src={
                                                supportedChains[chainName]
                                                    .imageUrl
                                            }
                                        />
                                        <div className="font-bold">
                                            {supportedChains[chainName].name}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {chainToChainId(chainName)}
                                </TableCell>
                                <TableCell>
                                    <Link
                                        size="sm"
                                        color="foreground"
                                        isExternal
                                        as="button"
                                        showAnchorIcon
                                    >
                                        {wrappedAddress}
                                    </Link>
                                </TableCell>
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
