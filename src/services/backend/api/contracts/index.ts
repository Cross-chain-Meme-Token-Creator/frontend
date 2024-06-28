import { baseAxios } from "../axios-instances"
import { backendApiUrl } from "../constants.api"

export interface GetSuiPublishTokenBytecodeRequestBody {
    decimals: number
    name: string
    symbol: string
    description: string
    iconUrl: string
    totalSupply: string
}

export interface GetSuiPublishTokenBytecodeResponseData {
    modules: Array<string>
    dependencies: Array<string>
    digest: Array<number>
}

const baseUrl = `${backendApiUrl}/contracts`

export const getSuiPublishTokenBytecode = async (
    body: GetSuiPublishTokenBytecodeRequestBody
): Promise<GetSuiPublishTokenBytecodeResponseData> => {
    const { data } = await baseAxios.post(
        `${baseUrl}/get-sui-publish-token-bytecode`,
        body
    )
    return data
}
