import Link from "next/link";

const API_BASE_URL = "https://api.infrabox.software/v1";
const DASHBOARD_BASE_URL = "https://app.infrabox.software";

async function validatePromoLink(slug) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/promo-link/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.valid ? json.data : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return {
    title: `Infrabox - Special Signup`,
    description: `Sign up for Infrabox with special pricing`,
    robots: "noindex, nofollow",
  };
}

export default async function PromoLinkPage({ params }) {
  const { slug } = await params;

  // Validate the promo link
  const promoData = await validatePromoLink(slug);

  if (!promoData) {
    // Show expired/invalid link page
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="mb-6">
            <svg
              className="mx-auto h-16 w-16 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            This link is no longer available
          </h1>
          <p className="text-gray-600 mb-8">
            The signup link you followed has expired or is no longer active.
            You can still sign up for Infrabox using our regular signup page.
          </p>
          <Link
            href={`${DASHBOARD_BASE_URL}/signup?utm_source=expired_promo&utm_medium=link&utm_campaign=promo_redirect`}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-black hover:bg-gray-800 transition-colors"
          >
            Sign Up for Infrabox
          </Link>
        </div>
      </div>
    );
  }

  // Valid link — redirect to Route Handler which sets cookie and redirects
  const { redirect } = await import("next/navigation");
  redirect(`/api/promo-redirect/${slug}`);
}
