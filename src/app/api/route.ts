import { NextRequest, NextResponse } from "next/server"
import { uploadImageToPinata } from "@services"
import { ReadStream } from "fs"

export const POST = async (request: NextRequest) => {
    const formData = await request.formData()
    const file = formData.get("file")
    if (!file) return
    if (typeof file === "string") return
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const readStream = ReadStream.from(buffer)
    const data = await uploadImageToPinata(readStream)
    console.log(data)
    return new NextResponse(data)
}