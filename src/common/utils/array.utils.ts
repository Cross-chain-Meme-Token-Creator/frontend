export type WithIdx<T> = {
    idx: number
    data: T
}
export const pushPositionedElementsToArray = <T>(
    positionedElements: Array<WithIdx<T>>,
    array: Array<T>
): Array<T> => {
    const newArray = [...array]

    for (const { idx, data } of positionedElements) {
        newArray.splice(idx, 0, data)
    }

    return newArray
}
