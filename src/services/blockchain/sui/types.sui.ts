export type SuiObjectTokenFields = {
    decimals: number
    name: string
    description: string
    icon_url: string
    symbol: string
}

export type SuiObjectTokenContent = {
    fields: SuiObjectTokenFields,
    type: string
}
