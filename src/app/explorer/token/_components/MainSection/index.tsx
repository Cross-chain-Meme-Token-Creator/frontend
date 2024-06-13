"use client"
import { Tabs, Tab } from "@nextui-org/react"
import React, { useContext } from "react"
import { InfoTab } from "./InfoTab"
import { WrappedTokensTab } from "./WrappedTokensTab"
import { CreateAttestationTab } from "./CreateAttestationTab"
import { TransferTab } from "./TransferTab"
import { RedeemTab } from "./RedeemTab"
import { TokenContext } from "../../_hooks"
export const MainSection = () => {
    interface TabItem {
        key: string
        title: string
        component: JSX.Element
        isDisabled?: boolean
    }

    const { reducer } = useContext(TokenContext)!
    const [state] = reducer
    const { bridgedChainInfos } = state

    const tabs: Array<TabItem> = [
        { key: "info", title: "Info", component: <InfoTab /> },
        {
            key: "createAttestation",
            title: "Create Attestation",
            component: <CreateAttestationTab />,
        },
        {
            key: "wrappedTokenTokens",
            title: "Wrapped Tokens",
            component: <WrappedTokensTab />,
        },
        {
            key: "transfer",
            title: "Transfer",
            component: <TransferTab />,
            isDisabled: !bridgedChainInfos.length,
        },
        {
            key: "redeem",
            title: "Redeem",
            component: <RedeemTab />,
            isDisabled: !bridgedChainInfos.length,
        },
    ]
    return (
        <Tabs
            variant="underlined"
            color="primary"
            classNames={{
                tabList: "p-0",
                cursor: "w-full",
                base: "w-full justify-center border-b border-divider",
                panel: "px-6 pt-12 max-w-[1280px] mx-auto",
            }}
        >
            {tabs.map(({ key, title, isDisabled, component }) => (
                <Tab key={key} title={title} isDisabled={isDisabled}>
                    {component}
                </Tab>
            ))}
        </Tabs>
    )
}
