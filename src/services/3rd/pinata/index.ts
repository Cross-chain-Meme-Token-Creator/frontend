import { v4 as uuidv4 } from "uuid";
import { Readable } from "stream";

export const uploadImageToPinata = async (readStream: Readable) => {
    const pinataSdk = require("@pinata/sdk")
    const pinata = new pinataSdk(process.env.NEXT_PUBLIC_PINATA_API_KEY, process.env.NEXT_PUBLIC_PINATA_SECRET_KEY);
    const { IpfsHash } = await pinata.pinFileToIPFS(readStream, {
        pinataMetadata: {
            name: uuidv4()
        }
    })

    return `https://ipfs.io/ipfs/${IpfsHash}`
}