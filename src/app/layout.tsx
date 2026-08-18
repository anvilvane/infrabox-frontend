import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import { GeistSans } from "geist/font/sans";

import "./globals.css";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { SITE_URL } from "@/lib/product";

/*
 * Both faces are self-hosted: `geist` ships the font files in the package and
 * next/font/google inlines Figtree at build time. Neither makes a runtime
 * request to a font CDN, so there is no third-party connection on any page.
 *
 * Geist Sans -> --font-geist-sans -> Tailwind `font-display` -> all h1..h6
 * Figtree    -> --font-figtree    -> Tailwind `font-sans`    -> body copy
 * (wired up in globals.css)
 */
const fontBody = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Infrabox — cold-email infrastructure, provisioned end to end",
    template: "%s · Infrabox",
  },
  description:
    "Buy a domain and get Google Workspace mailboxes on it: registration, DNS, MX/SPF/DMARC, domain verification, DKIM and a working sending credential — all provisioned unattended.",
  applicationName: "Infrabox",
  authors: [{ name: "Infrabox" }],
  creator: "Infrabox",
  publisher: "Infrabox",
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Infrabox",
    title: "Infrabox — cold-email infrastructure, provisioned end to end",
    description:
      "Domains, DNS and Google Workspace mailboxes, provisioned unattended and handed to your sending tool over SMTP.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Infrabox — cold-email infrastructure, provisioned end to end",
    description:
      "Domains, DNS and Google Workspace mailboxes, provisioned unattended and handed to your sending tool over SMTP.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#012c3c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${fontBody.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <a
          href="#main"
          className="skip-link inline-flex h-10 items-center rounded-full bg-brand px-5 text-sm font-medium text-brand-foreground"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
