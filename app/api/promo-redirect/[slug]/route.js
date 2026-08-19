import { NextResponse } from "next/server";

const API_BASE_URL = "https://api.infrabox.software/v1";
const DASHBOARD_BASE_URL = "https://app.infrabox.software";

export async function GET(request, { params }) {
  const { slug } = await params;

  // Track the visit (fire-and-forget)
  fetch(`${API_BASE_URL}/auth/promo-link/${slug}/visit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  }).catch(() => {});

  // Build redirect URL — uses /r/slug for consistent URL format
  const redirectUrl = `${DASHBOARD_BASE_URL}/r/${encodeURIComponent(slug)}`;

  // Create redirect response and set cookie
  const response = NextResponse.redirect(redirectUrl, 307);
  response.cookies.set("promo_slug", slug, {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: "/",
    httpOnly: false, // Dashboard needs to read this
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
