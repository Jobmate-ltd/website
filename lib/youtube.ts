/**
 * YouTube URL helpers. Plain functions, importable from server and client
 * components alike (a 'use client' module cannot export callable functions
 * to the server).
 */

/** The hqdefault thumbnail exists for every upload; maxresdefault 404s for many. */
export function youtubeThumbnail(id: string): string {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`
}

/** Privacy-enhanced embed: youtube-nocookie.com sets no advertising cookies. */
export function youtubeEmbedUrl(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`
}
