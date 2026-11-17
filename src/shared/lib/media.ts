// Preserve the bucket, object name and query while using the second same-origin proxy.
export function mediaUrl(value: string | null | undefined, fallback: string): string {
  if (!value) return fallback
  if (value.startsWith('/s3/') || value.startsWith('blob:')) return value
  const url = new URL(value, window.location.origin)
  if (url.pathname.startsWith('/frax-bucket/')) return `/s3${url.pathname}${url.search}`
  return value
}
