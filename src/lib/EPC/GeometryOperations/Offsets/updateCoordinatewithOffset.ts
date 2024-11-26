/**
 * The function takes in two sets of coordinates and an offset value, and returns updated sets of
 * coordinates with the offset applied based on the direction of movement.
 * @param {number[]} lastCoordinates - An array containing the last coordinates, where the first
 * element is the x-coordinate and the second element is the y-coordinate.
 * @param {number[]} currentCoordinates - An array containing the current x and y coordinates.
 * @param {number} offset - The `offset` parameter is a number that represents the amount by which the
 * coordinates should be updated. It determines the distance by which the updated coordinates will be
 * shifted from the original coordinates.
 * @returns an object with two properties: "updatedLast" and "updatedCurrent". These properties contain
 * the updated values of the lastCoordinates and currentCoordinates arrays, respectively.
 */
export function updateCoordinatesOffset(lastCoordinates: number[], currentCoordinates: number[], offset: number): { updatedLast: number[], updatedCurrent: number[] } {
    const [lastX, lastY] = lastCoordinates;
    const [currentX, currentY] = currentCoordinates;
    const deltaX = currentX - lastX;
    const deltaY = currentY - lastY;

    // Calculate the absolute values of deltaX and deltaY
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    let updatedLast: number[] = lastCoordinates.slice();
    let updatedCurrent: number[] = currentCoordinates.slice();

    if (absDeltaX > absDeltaY) {
        // Horizontal line
        if (deltaX > 0) {
            // Left to right
            updatedLast[1] += offset;
            updatedCurrent[1] += offset;
        } else {
            // Right to left
            updatedLast[1] -= offset;
            updatedCurrent[1] -= offset;
        }
    } else {
        // Vertical line
        if (deltaY > 0) {
            // Top to bottom
            updatedLast[0] -= offset;
            updatedCurrent[0] -= offset;
        } else {
            // Bottom to top
            updatedLast[0] += offset;
            updatedCurrent[0] += offset;
        }
    }

    return { updatedLast, updatedCurrent };
}