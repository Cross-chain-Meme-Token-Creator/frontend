import { baseAxios } from "../axios-instances"
import { backendApiUrl } from "../constants.api"

export interface GetTokenByteCodeRequestBody {
    decimals: number
    name: string
    symbol: string
    description: string
    iconUrl: string
    totalSupply: string
}

export interface GetTokenByteCodeResponseData {
    modules: Array<string>
    dependencies: Array<string>
    digest: Array<number>
}

const baseUrl = `${backendApiUrl}/sui`

export const getTokenByteCode = async (
    body: GetTokenByteCodeRequestBody
): Promise<GetTokenByteCodeResponseData> => {
    const { data } = await baseAxios.post(
        `${baseUrl}/get-token-byte-code`,
        body
    )
    return data
}
