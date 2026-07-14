import { readFile } from "node:fs/promises";
import path from "node:path";
import { verifyDownloadToken } from "@/lib/toolkit/token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FILENAME = "jobsafe-incident-near-miss-toolkit.pdf";

/**
 * The only route that can read the gated PDF. The file lives in /private, which
 * Next never serves statically, so there is no guessable public URL for it.
 */
export async function GET(request: Request): Promise<Response> {
  const token = new URL(request.url).searchParams.get("t");
  const result = verifyDownloadToken(token);

  if (!result.ok) {
    const expired = result.reason === "expired";
    return Response.json(
      {
        ok: false,
        message: expired
          ? "That download link has expired. Please request the toolkit again."
          : "That download link is not valid.",
      },
      { status: expired ? 410 : 403 },
    );
  }

  let file: Buffer;
  try {
    file = await readFile(path.join(process.cwd(), "private", FILENAME));
  } catch (err) {
    console.error("[toolkit] the gated PDF is missing from /private", err);
    return Response.json(
      { ok: false, message: "The toolkit is temporarily unavailable." },
      { status: 500 },
    );
  }

  console.info("[toolkit] download", { jti: result.claims.jti, sub: result.claims.sub });

  return new Response(new Uint8Array(file), {
    status: 200,
    headers: {
      "content-type": "application/pdf",
      "content-length": String(file.byteLength),
      "content-disposition": `attachment; filename="${FILENAME}"`,
      // Signed, per-user and time-limited: must never be cached by a CDN or proxy.
      "cache-control": "private, no-store, max-age=0",
      "x-content-type-options": "nosniff",
    },
  });
}
