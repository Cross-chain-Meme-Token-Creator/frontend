"use client"
import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Input,
    Link,
    Spinner,
    Textarea,
} from "@nextui-org/react"
import { Button } from "@nextui-org/button"

import React, { useContext } from "react"
import Dropzone from "react-dropzone"
import {
    CreateTokenFormContext,
    CreateTokenFormProvider,
} from "./CreateTokenFormProvider"

const WrappedCreateTokenForm = () => {
    const { formik, swrs } = useContext(CreateTokenFormContext)!
    const { iconUrlSwr } = swrs

    return (
        <Card className="max-w-[500px] mx-auto mt-12 border border-divider" shadow="none">
            <CardHeader className="font-bold p-4 pb-0">
                Create Token
            </CardHeader>
            <CardBody className="grid gap-4 p-4">
                <Input
                    id="name"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    isRequired
                    placeholder="USD Tether"
                    labelPlacement="outside"
                    label="Name"
                    isInvalid={!!(formik.touched.name && formik.errors.name)}
                    errorMessage={formik.touched.name && formik.errors.name}
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
                    isInvalid={!!(formik.touched.symbol && formik.errors.symbol)}
                    errorMessage={formik.touched.symbol && formik.errors.symbol}
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
                    isInvalid={!!(formik.touched.decimals && formik.errors.decimals)}
                    errorMessage={formik.touched.decimals && formik.errors.decimals}
                />
                <Textarea
                    id="description"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.description.toString()}
                    placeholder=""
                    labelPlacement="outside"
                    label="Description"
                    isInvalid={!!(formik.touched.description && formik.errors.description)}
                    errorMessage={formik.touched.description && formik.errors.description}
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
                            console.log(file)
                            formik.setFieldValue("iconFile", file)
                            iconUrlSwr.mutate()
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
                        !iconUrlSwr.isValidating ? (
                            <Link
                                showAnchorIcon
                                isExternal
                                href={formik.values.iconUrl}
                                size="sm"
                            >
                                View
                            </Link>
                        ) : (
                            <Spinner
                                className="flex flex-row w-fit"
                                classNames={{
                                    wrapper: "w-3.5 h-3.5",
                                    circle1: "w-3.5 h-3.5",
                                    circle2: "w-3.5 h-3.5",
                                    label: "text-sm",
                                }}
                            >
                                Loading
                            </Spinner>
                        )
                    ) : null}
                </div>
                <Input
                    id="totalSupply"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.totalSupply.toString()}
                    isRequired
                    placeholder="10000000000"
                    labelPlacement="outside"
                    label="Total Supply"
                    isInvalid={!!(formik.touched.totalSupply && formik.errors.totalSupply)}
                    errorMessage={formik.touched.totalSupply && formik.errors.totalSupply}
                />
            </CardBody>
            <CardFooter className="p-4 pt-0">
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
