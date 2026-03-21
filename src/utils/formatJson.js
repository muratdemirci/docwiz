/**
 * Single Responsibility: JSON formatting utility
 * Used by both EndpointDetail and ReadmeGenerator to avoid duplication.
 */
export function formatJson(raw) {
  if (!raw) return ''
  try {
    return JSON.stringify(JSON.parse(raw), null, 2)
  } catch {
    return raw
  }
}
