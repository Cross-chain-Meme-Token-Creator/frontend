"use client"
import Dropzone from "react-dropzone"
import React from "react"
import { Link } from "@nextui-org/react"

export const UploadQR = () => {
    return (
        <Dropzone
            accept={{
                "image/jpeg": [".jpeg", ".png"],
            }}
            onDrop={async (acceptedFiles: Array<File>) => {
                const file = acceptedFiles.at(0)
                if (!file) return
            }}
        >
            {({ getRootProps, getInputProps }) => (
                <section>
                    <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <Link size="sm" as="button">
                            Drop QR image here or upload
                        </Link>   
                    </div>
                </section>
            )}
        </Dropzone>
    )
}
