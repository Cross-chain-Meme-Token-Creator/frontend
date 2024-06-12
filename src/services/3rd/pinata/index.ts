import { v4 as uuidv4 } from "uuid"
import { Readable } from "stream"

import PinataSdk from "@pinata/sdk"

const pinata = new PinataSdk(
    process.env.NEXT_PUBLIC_PINATA_API_KEY,
    process.env.NEXT_PUBLIC_PINATA_SECRET_KEY
)

export const uploadImageToPinata = async (readStream: Readable) => {
    const { IpfsHash } = await pinata.pinFileToIPFS(readStream, {
        pinataMetadata: {
            name: uuidv4(),
        },
    })

    return `https://ipfs.io/ipfs/${IpfsHash}`
}
