export function normalizeDuration0_1(duration: number, maxShadowHours = 8) {
    const maxDuration = maxShadowHours * 60 * 60 * 1000; // 8 hours in milliseconds
    return duration / maxDuration;
}