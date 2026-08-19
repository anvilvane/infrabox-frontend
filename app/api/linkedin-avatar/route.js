import { NextResponse } from "next/server";

// Only ever proxy LinkedIn's own media CDN — prevents this route being used as an open proxy.
const ALLOWED_HOSTS = new Set(["media.licdn.com"]);

export async function GET(request) {
  const target = request.nextUrl.searchParams.get("url");

  if (!target) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  let parsed;
  try {
    parsed = new URL(target);
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  if (parsed.protocol !== "https:" || !ALLOWED_HOSTS.has(parsed.hostname)) {
    return NextResponse.json({ error: "Host not allowed" }, { status: 400 });
  }

  const upstream = await fetch(parsed.toString(), {
    next: { revalidate: 86400 },
  });

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: "Image unavailable" }, { status: 502 });
  }

  return new NextResponse(upstream.body, {
    headers: {
      "Content-Type": upstream.headers.get("content-type") || "image/jpeg",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
