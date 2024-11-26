/**
 * The function calculates the perpendicular height of a right triangle given the hypotenuse length and
 * an angle in degrees.
 * @param {number} hypotenuse - The hypotenuse is the longest side of a right-angled triangle, opposite
 * the right angle. It is the side that is directly across from the right angle.
 * @param {number} angleDegrees - The `angleDegrees` parameter represents the angle in degrees for
 * which you want to calculate the perpendicular height.
 * @returns the perpendicular height of a right triangle, calculated using the given hypotenuse length
 * and angle in degrees.
 */
export function calculatePerpendicularHeight(hypotenuse: number, angleDegrees: number): number {
    // Convert angle from degrees to radians
    const angleRadians = angleDegrees * (Math.PI / 180);
    // Calculate the perpendicular height using sine
    return hypotenuse * Math.sin(angleRadians);
}