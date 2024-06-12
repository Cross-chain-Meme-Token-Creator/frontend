export type WithIdx<T> = {
    idx: number
    data: T
}
export const pushPositionedElementsToArray = <T>(
    positionedElements: Array<WithIdx<T>>,
    array: Array<T>
): Array<T> => {
    const newArray = [...array]

    for (const positionedElement of positionedElements) {
        newArray.splice(positionedElement.idx, 0, positionedElement.data)
    }

    return newArray
}
