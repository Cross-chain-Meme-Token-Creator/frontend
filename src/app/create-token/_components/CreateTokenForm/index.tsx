"use client"
import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Input,
    Link,
    Textarea,
} from "@nextui-org/react"
import { Button } from "@nextui-org/button"

import React, { useContext } from "react"
import Dropzone from "react-dropzone"
import {
    CreateTokenFormContext,
    CreateTokenFormProvider,
} from "./CreateTokenFormProvider"
import { BaseChainSelect } from "./BaseChainSelect"
import { baseAxios } from "@services"

const WrappedCreateTokenForm = () => {
    const { formik } = useContext(CreateTokenFormContext)!
    return (
        <Card className="max-w-[560px] mx-auto my-12">
            <CardHeader className="font-semibold text-xl p-6 pb-2">
                Create Token
            </CardHeader>
            <CardBody className="grid gap-4 p-6">
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
                        accept={{
                            "image/jpeg": [".jpeg", ".png"],
                        }}
                        onDrop={async (acceptedFiles: Array<File>) => {
                            const file = acceptedFiles.at(0)
                            if (!file) return
                            const formData = new FormData()
                            formData.append("file", file)
                            const { data } = await baseAxios.post<string>(
                                "/api",
                                formData
                            )
                            formik.setFieldValue("iconUrl", data)
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
                                                Drop your file here or upload
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </section>
                        )}
                    </Dropzone>
                    {formik.values.iconUrl ? (
                        <Link
                            showAnchorIcon
                            isExternal
                            href={formik.values.iconUrl}
                            size="sm"
                        >
                            View
                        </Link>
                    ) : null}
                </div>
                <Input
                    id="totalSupply"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.totalSupply}
                    isRequired
                    placeholder="10000000000"
                    labelPlacement="outside"
                    label="Total Supply"
                />
                <BaseChainSelect />
            </CardBody>
            <CardFooter className="p-6 pt-2">
                <Button type="submit" color="primary" className="w-full">
                    Create
                </Button>
            </CardFooter>
        </Card>
    )
}

export const CreateTokenForm = () => {
    return (
        <CreateTokenFormProvider>
            <WrappedCreateTokenForm />
        </CreateTokenFormProvider>
    )
}
