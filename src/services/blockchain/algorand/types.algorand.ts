export interface AlgorandAsset {
    id: string
    params: {
        decimals: number
        name: string
        total: number
        "unit-name": string
        url: string
    }
}

export type AlgorandCreateAssetResponse = {
    "asset-index": number,
    "confirmed-round": number
}
