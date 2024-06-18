import web3, { Address, Bytes } from "web3"

export const truncateString = (
    string?: string,
    start: number = 4,
    end: number = 2
): string => {
    if (!string) return ""
    if (string.length <= start + end) return string
    const beginning = string.slice(0, start)
    const ending = string.slice(-end)
    return `${beginning}...${ending}`
}

export const getInnerType = (type: string): string | null => {
    if (!type) return null
    const match = type.match(/<(.*)>/)
    if (!match) {
        return null
    }

    return match[1]
}

export const bytesToAddress = (bytes: Bytes): Address => {
    const hexString = web3.utils.bytesToHex(bytes)
    return web3.utils.toChecksumAddress(`0x${hexString.slice(26)}`)
}

export const bytesToBigInt = (bytes: Bytes): bigint =>
    BigInt(web3.utils.hexToNumber(web3.utils.bytesToHex(bytes)))

export const bytesToNumber = (bytes: Bytes): number =>
    Number(web3.utils.hexToNumber(web3.utils.bytesToHex(bytes)))

export const bytesToString = (bytes: Bytes): string =>
{
    return web3.utils.toUtf8(web3.utils.bytesToHex(bytes)).trim()
}
    
