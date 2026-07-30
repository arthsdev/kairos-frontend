export function parseBackendValidationError(responseData: unknown): string | null {
  if (typeof responseData !== 'object' || responseData === null || !('message' in responseData)) {
    return null
  }

  const message = (responseData as { message: string }).message

  if (!message) {
    return null
  }

  const cleanedMessages = message
    .split(';')
    .map((msg) => msg.trim().replace(/^[a-zA-Z0-9_]+:\s*/, ''))
    .filter(Boolean)

  return cleanedMessages.length > 0 ? cleanedMessages.join('. ') : null
}