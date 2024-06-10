import axios from "axios"
import fileDownload from "js-file-download"
import { toPng } from "html-to-image"
import { v4 as uuidv4 } from "uuid"

export const downloadFromUrl = async (url: string, extname: string = "png") => {
    const { data } = await axios.get(url, {
        responseType: "blob",
    })
    fileDownload(data, `${uuidv4()}.${extname}`)
}

export const downloadSVGAsPNG = async (id: string) => {
    const svg = document.getElementById(id)
    if (!svg) return
    const pngDataUrl = await toPng(svg)
    const pngBlob = await fetch(pngDataUrl).then((res) => res.blob())
    const pngUrl = URL.createObjectURL(pngBlob)
    downloadFromUrl(pngUrl)
}
