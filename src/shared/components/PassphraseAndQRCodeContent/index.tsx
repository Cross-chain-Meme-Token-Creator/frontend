"use client"
import { Divider, Snippet, Spacer, Button } from "@nextui-org/react"
import { VAA, serialize } from "@wormhole-foundation/sdk-definitions"
import React from "react"
import { QRCodeSVG } from "qrcode.react"
import { downloadSVGAsPNG, truncateString } from "@common"
import { ArrowDownTrayIcon, ShareIcon } from "@heroicons/react/24/outline"

interface PassphraseAndQRCodeContentProps {
    vaa: VAA
    passphraseNote?: string
    qrNote?: string
    className?: string
}

export const PassphraseAndQRCodeContent = ({
    vaa,
    passphraseNote,
    qrNote,
    className,
}: PassphraseAndQRCodeContentProps) => {
    const serializedVaa = Buffer.from(serialize(vaa)).toString("base64")

    const qrCodeId = "qrCode"

    return (
        <div className={`flex gap-4 ${className}`}>
            <div className="flex-1">
                <div className="text-xs text-foreground-500">
                    {passphraseNote ?? "Passphrase"}
                </div>
                <Spacer y={4} />
                <Snippet className="w-full" codeString={serializedVaa}>
                    {truncateString(serializedVaa, 6, 4)}
                </Snippet>
            </div>
            <Divider orientation="vertical" className="h-auto" />
            <div className="flex-1">
                <div className="text-xs text-foreground-500">
                    {qrNote ?? "QR"}
                </div>
                <Spacer y={4} />
                <QRCodeSVG
                    id={qrCodeId}
                    value={serializedVaa}
                    bgColor={"#ffffff"}
                    fgColor={"#000000"}
                    level={"L"}
                    includeMargin={false}
                    // imageSettings={{
                    //     src: "https://scontent.fsgn5-12.fna.fbcdn.net/v/t39.30808-6/316301705_114932571436049_549628509009748365_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeHaIKEt134Xa2ZjdJrvilRUrDdtxUGd03esN23FQZ3Td7fMEvFORvSbm5TKvy8qC_fb1km34ZjkOpjj4ioMFklQ&_nc_ohc=qiWierkmR7oQ7kNvgGTQb69&_nc_ht=scontent.fsgn5-12.fna&oh=00_AYDCBANCtJySEBIaMM1W7Hmj7snvx3wBqM-ar6WzH6AsAQ&oe=666D11CA",
                    //     x: undefined,
                    //     y: undefined,
                    //     height: 50,
                    //     width: 50,
                    //     excavate: true,
                    // }}
                />
                <Spacer y={4} />
                <div className="flex gap-4">
                    <Button
                        color="primary"
                        variant="light"
                        isIconOnly
                        onPress={() => downloadSVGAsPNG(qrCodeId)}
                    >
                        <ArrowDownTrayIcon className="w-5 h-5" />
                    </Button>
                    <Button color="primary" variant="light" isIconOnly>
                        <ShareIcon className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
