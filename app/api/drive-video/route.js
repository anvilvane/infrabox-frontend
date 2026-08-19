import { NextResponse } from "next/server";

// Google Drive file IDs are base64url-ish: letters, digits, - and _.
const DRIVE_ID_RE = /^[a-zA-Z0-9_-]{10,100}$/;

export async function GET(request) {
  const id = request.nextUrl.searchParams.get("id");

  if (!id || !DRIVE_ID_RE.test(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  // Forward the Range header so the browser can seek/buffer the video properly.
  const range = request.headers.get("range");
  const upstream = await fetch(
    `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`,
    { headers: range ? { Range: range } : {} }
  );

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: "Video unavailable" }, { status: 502 });
  }

  const headers = {
    "Content-Type": upstream.headers.get("content-type") || "video/mp4",
    "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=86400",
  };
  const contentLength = upstream.headers.get("content-length");
  const contentRange = upstream.headers.get("content-range");
  if (contentLength) headers["Content-Length"] = contentLength;
  if (contentRange) headers["Content-Range"] = contentRange;

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers,
  });
}
