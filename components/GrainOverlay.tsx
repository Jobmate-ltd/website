// Fixed, non-interactive film-grain overlay. Breaks up the flat dark surfaces so
// the large near-black sections read as textured rather than sterile. Sits above
// section backgrounds but below the sticky nav (z-50) and ticker (z-60), and never
// intercepts pointer events. Base64 fractal-noise SVG — no network request.
const NOISE =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxNDAnIGhlaWdodD0nMTQwJz48ZmlsdGVyIGlkPSduJz48ZmVUdXJidWxlbmNlIHR5cGU9J2ZyYWN0YWxOb2lzZScgYmFzZUZyZXF1ZW5jeT0nMC44NScgbnVtT2N0YXZlcz0nMicgc3RpdGNoVGlsZXM9J3N0aXRjaCcvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnIGZpbHRlcj0ndXJsKCNuKScvPjwvc3ZnPg=='

export default function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-40 opacity-[0.06] mix-blend-soft-light"
      style={{ backgroundImage: `url("${NOISE}")`, backgroundSize: '140px 140px' }}
    />
  )
}
