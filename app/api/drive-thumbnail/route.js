import { NextResponse } from "next/server";

// Google Drive file IDs are base64url-ish: letters, digits, - and _.
const DRIVE_ID_RE = /^[a-zA-Z0-9_-]{10,100}$/;

export async function GET(request) {
  const id = request.nextUrl.searchParams.get("id");

  if (!id || !DRIVE_ID_RE.test(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const upstream = await fetch(`https://lh3.googleusercontent.com/d/${id}=w1000`, {
    next: { revalidate: 86400 },
  });

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: "Thumbnail unavailable" }, { status: 502 });
  }

  return new NextResponse(upstream.body, {
    headers: {
      "Content-Type": upstream.headers.get("content-type") || "image/jpeg",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
