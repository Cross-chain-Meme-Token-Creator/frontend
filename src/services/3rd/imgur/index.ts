import { baseAxios } from "../../backend"

export const uploadImageToImgur = async (image: File) : Promise<string> => {
    const formData = new FormData()
    formData.append("image", image)
    formData.append("type", "file")

    const { data } = await baseAxios.post("https://api.imgur.com/3/image",
        formData
    )

    return data.data.link as string
}