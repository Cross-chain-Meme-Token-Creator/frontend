import numeral from "numeral"

export const formatNumber = (number: number) => numeral(number).format("0.0a")