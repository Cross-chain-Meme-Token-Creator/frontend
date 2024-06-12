"use client"
import { Tabs, Tab } from "@nextui-org/react"
import React from "react"
import { InfoTab } from "./InfoTab"
import { WrappedTokensTab } from "./WrappedTokensTab"
import { CreateAttestationTab } from "./CreateAttestationTab"
import { TransferTab } from "./TransferTab"
import { RedeemTab } from "./RedeemTab"
export const MainSection = () => {
    interface TabItem {
        key: string
        title: string
        component: JSX.Element
    }

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
        { key: "transfer", title: "Transfer", component: <TransferTab /> },
        { key: "redeem", title: "Redeem", component: <RedeemTab /> },
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
            {tabs.map((tab) => (
                <Tab key={tab.key} title={tab.title}>
                    {tab.component}
                </Tab>
            ))}
        </Tabs>
    )
}
