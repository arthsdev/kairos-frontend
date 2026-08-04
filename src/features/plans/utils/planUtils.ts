/**
 * Calculates the number of remaining days until an ISO expiration date.
 * Returns null if no expiration date is provided.
 */
export function calculateDaysRemaining(expiresAt: string | null): number | null {
    if (!expiresAt) return null
    const diffMs = new Date(expiresAt).getTime() - Date.now()
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    return Math.max(0, days)
}