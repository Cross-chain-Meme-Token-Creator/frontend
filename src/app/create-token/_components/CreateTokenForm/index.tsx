"use client"
import { Input, Textarea } from "@nextui-org/react"
import { Button } from "@nextui-org/button"

import React, { useContext } from "react"
import Dropzone from "react-dropzone"
import {
    CreateTokenFormContext,
    CreateTokenFormProvider,
} from "./CreateTokenFormProvider"

const WrappedCreateTokenForm = () => {
    const { formik } = useContext(CreateTokenFormContext)!
    return (
        <div className="grid gap-6 p-12 max-w-[500px]">
            <div className="grid gap-4">
                <Input
                    id="name"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    isRequired
                    placeholder="USD Tether"
                    labelPlacement="outside"
                    label="Name"
                />
                <Input
                    id="symbol"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.symbol}
                    isRequired
                    placeholder="USDT"
                    labelPlacement="outside"
                    label="Symbol"
                />
                <Input
                    id="decimals"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.decimals.toString()}
                    isRequired
                    placeholder="6"
                    labelPlacement="outside"
                    label="Decimals"
                />
                <Textarea
                    id="description"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.description.toString()}
                    placeholder=""
                    labelPlacement="outside"
                    label="Description"
                />
                <div className="grid gap-2">
                    <div className="text-sm">Icon Url</div>
                    <Dropzone
                        onDrop={async (acceptedFiles) => {
                            const file = acceptedFiles.at(0)
                            const arrayBuffer = await file?.arrayBuffer()
                            if (!arrayBuffer) return
                            const buffer = Buffer.from(arrayBuffer)
                            formik.setFieldValue(
                                "iconUrl",
                                buffer.toString("base64")
                            )
                        }}
                    >
                        {({ getRootProps, getInputProps }) => (
                            <section>
                                <div {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    <div className="outline-dashed text-sm px-3 py-2.5 outline-1 outline-divider rounded-medium bg-foreground-100">
                                        {formik.values.iconUrl ? (
                                            `${formik.values.iconUrl.substring(
                                                0,
                                                32
                                            )}...`
                                        ) : (
                                            <span className="text-foreground-500">
                                                {" "}
                                                Drop your file here or upload{" "}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </section>
                        )}
                    </Dropzone>
                </div>
            </div>
            <Button type="submit" color="primary">
                Create
            </Button>
        </div>
    )
}

export const CreateTokenForm = () => {
    return (
        <CreateTokenFormProvider>
            <WrappedCreateTokenForm />
        </CreateTokenFormProvider>
    )
}
