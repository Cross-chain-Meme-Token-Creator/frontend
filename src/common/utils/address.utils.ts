export const truncateAddress = (
    address?: string,
    start: number = 4,
    end: number = 2
): string => {
    if (!address) return ""
    const beginning = address.slice(0, start)
    const ending = address.slice(-end)
    return `${beginning}...${ending}`
}
