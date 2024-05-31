export const truncateString = (
    address?: string,
    start: number = 4,
    end: number = 2
): string => {
    if (!address) return ""
    const beginning = address.slice(0, start)
    const ending = address.slice(-end)
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
