"use client"
import { Tabs, Tab } from "@nextui-org/react"
import React from "react"
import { InfoTab } from "./InfoTab"
import { CreateAndSubmitAttestationTab } from "./CreateAndSubmitAttestationTab"
export const MainSection = () => {
    return (
        <Tabs
            variant="underlined"
            classNames={{
                tabList: "p-0",
                cursor: "w-full",
                base: "w-full justify-center border-b border-divider",
                panel: "p-6 max-w-[1280px] mx-auto",
            }}
        >
            <Tab key="info" title="Info">
                <InfoTab />
            </Tab>
            <Tab key="createSubmitAndAttestation" title="Create & Submit Attestation">
                <CreateAndSubmitAttestationTab />
            </Tab>
            <Tab key="videos" title="Videos">
                <div/>
            </Tab>
        </Tabs>
    )
}