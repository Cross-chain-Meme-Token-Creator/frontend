export const computeNumberMultipeBigInt = (
    number: number,
    bigint: bigint,
    fractionDigits: number = 5
) => {
    const multipliedNumber = BigInt(number * 10 ** fractionDigits)
    return (multipliedNumber * bigint) / BigInt(10 ** fractionDigits)
}

export const computePow = (numDigits: number = 5): bigint =>
    BigInt(10 ** numDigits)

