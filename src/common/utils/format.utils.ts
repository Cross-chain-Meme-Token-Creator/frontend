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
