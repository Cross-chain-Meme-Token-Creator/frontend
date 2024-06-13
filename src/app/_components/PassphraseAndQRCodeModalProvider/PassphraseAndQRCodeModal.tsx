"use client"
import { useContext, useEffect, useRef, useState } from "react"
import { PassphraseAndQRCodeModalContext } from "."
import React, {
    Button,
    Card,
    CardBody,
    Divider,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Snippet,
    Spacer,
} from "@nextui-org/react"
import { serialize } from "@wormhole-foundation/sdk-definitions"
import QRCodeStyling from "qr-code-styling-2"
import { ArrowDownTrayIcon, ShareIcon } from "@heroicons/react/24/outline"
import { truncateString } from "../../../common/utils"

export const PassphraseAndQRCodeModal = () => {
    const { reducer, discloresures } = useContext(
        PassphraseAndQRCodeModalContext
    )!
    const [state] = reducer
    const { vaa, passphraseNote, qrNote, title } = state
    const { baseDiscloresure } = discloresures
    const { onClose, isOpen } = baseDiscloresure!

    const ref = useRef<HTMLDivElement | null>(null)
    const qrCodeRef = useRef<QRCodeStyling | null>(null)

    const [serializedVaa, setSerializedVaa] = useState("")

    useEffect(() => {
        if (!vaa) return

        const handleEffect = async () => {
            const _serializedVaa = Buffer.from(serialize(vaa)).toString(
                "base64"
            )

            const { default: QRCodeStyling } = await import("qr-code-styling-2")
            const qrCode = new QRCodeStyling({
                width: 250,
                height: 250,
                image: "https://scontent.fsgn5-12.fna.fbcdn.net/v/t39.30808-6/316301705_114932571436049_549628509009748365_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeHaIKEt134Xa2ZjdJrvilRUrDdtxUGd03esN23FQZ3Td7fMEvFORvSbm5TKvy8qC_fb1km34ZjkOpjj4ioMFklQ&_nc_ohc=qiWierkmR7oQ7kNvgGihk8a&_nc_ht=scontent.fsgn5-12.fna&oh=00_AYBIZHJ0uKl1kS4713vfJDw_jUXqxedh6vM0PDWWNS4jHA&oe=666DF2CA",
                dotsOptions: {
                    color: "#000",
                    type: "rounded",
                },
                cornersSquareOptions: {
                    color: "#006fee",
                    type: "extra-rounded",
                },
                cornersDotOptions: {
                    type: "dot",
                },
                imageOptions: {
                    crossOrigin: "anonymous",
                    margin: 5,
                },
            })
            qrCode.append(ref.current ?? undefined)
            qrCode.update({
                data: _serializedVaa,
            })
            qrCodeRef.current = qrCode

            setSerializedVaa(_serializedVaa)
        }
        handleEffect()
    }, [vaa])

    return (
        <Modal
            isDismissable={false}
            isOpen={isOpen}
            onClose={onClose}
            size="xl"
        >
            <ModalContent>
                {title ? (
                    <ModalHeader className="p-4 pb-0 text-base font-bold">
                        {title}
                    </ModalHeader>
                ) : null}
                <ModalBody className="p-4">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <div className="text-xs text-foreground-500">
                                {passphraseNote ?? "Passphrase"}
                            </div>
                            <Spacer y={4} />
                            <Snippet
                                className="w-full"
                                codeString={serializedVaa}
                            >
                                {truncateString(serializedVaa, 6, 4)}
                            </Snippet>
                        </div>
                        <Divider orientation="vertical" className="h-auto" />
                        <div className="flex-1">
                            <div className="text-xs text-foreground-500">
                                {qrNote ?? "QR"}
                            </div>
                            <Spacer y={4} />
                            <Card
                                className="border border-divider"
                                shadow="none"
                            >
                                <CardBody className="p-2">
                                    <div ref={ref} />
                                </CardBody>
                            </Card>

                            <Spacer y={4} />
                            <div className="flex gap-4">
                                <Button
                                    color="primary"
                                    variant="light"
                                    isIconOnly
                                    onPress={() =>
                                        qrCodeRef.current?.download()
                                    }
                                >
                                    <ArrowDownTrayIcon className="w-5 h-5" />
                                </Button>
                                <Button
                                    color="primary"
                                    variant="light"
                                    isIconOnly
                                >
                                    <ShareIcon className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter className="p-4 pt-0">
                    <Button color="danger" variant="light" onPress={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
