import { Figtree } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import ClientLayout from "@/components/LayoutClient";
import StructuredData from "@/components/StructuredData";
import DeferredAnalytics from "@/components/DeferredAnalytics";
import config from "@/config";
import "./globals.css";

// Figtree = body/paragraph text, Geist Sans = headings. Both exposed as CSS variables and
// wired to font-family rules in globals.css (body -> Figtree, h1-h6 -> Geist Sans).
const figtree = Figtree({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-figtree",
});

export const viewport = {
  themeColor: "#1240cc",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata = {
  metadataBase: new URL("https://www.infrabox.software"),
  title: {
    default: "Infrabox: US-IP Google & Microsoft Email Infrastructure",
    template: "%s | Infrabox",
  },
  description:
    "US-IP Google Workspace & Microsoft 365 mailboxes from $2.50/mo on Enterprise annual. Automated DNS, isolated warmup, and 24+ sequencer integrations.",
  keywords: [
    "Infrabox",
    "email infrastructure",
    "US IP Google Workspace",
    "Google Workspace accounts",
    "Microsoft 365 accounts",
    "Azure mailboxes",
    "email deliverability",
    "inbox placement",
    "email warmup",
    "email warmup",
    "SPF DKIM DMARC",
    "DNS management",
    "sender reputation",
    "email authentication",
    "outbound sales infrastructure",
    "agency email solution",
    "bulk mailbox management",
    "SmartLead integration",
    "Instantly integration",
    "Lemlist integration",
    "email infrastructure platform",
    "US IP addresses email",
    "email setup",
    "email deliverability tools",
    "InfraGuard",
  ],
  authors: [{ name: "Infrabox", url: "https://www.infrabox.software" }],
  creator: "Infrabox",
  publisher: "Infrabox",
  category: "Technology",
  classification: "Email Infrastructure Software",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.infrabox.software",
    siteName: "Infrabox",
    title: "Infrabox - US-IP Google & Microsoft Workspace Accounts for Email",
    description:
      "Enterprise email infrastructure from $2.50/mailbox on Enterprise annual. US-IP Google Workspace & Microsoft 365 accounts with 95% inbox delivery. Automated DNS, warmup, and 24+ integrations.",
    images: [
      {
        url: "https://www.infrabox.software/og-default.png",
        width: 1920,
        height: 1080,
        alt: "Infrabox - Email Infrastructure Dashboard",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Infrabox - US-IP Google & Microsoft Accounts from $2.50/mo",
    description:
      "Enterprise email infrastructure with 95% inbox delivery. Automated DNS, warmup, 24+ integrations. Trusted by agencies worldwide.",
    images: ["https://www.infrabox.software/og-default.png"],
  },
  alternates: {
    canonical: "https://www.infrabox.software",
  },
  other: {
    "msapplication-TileColor": "#1240cc",
    "apple-mobile-web-app-title": "Infrabox",
    "application-name": "Infrabox",
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme={config.colors.theme} className={`${figtree.variable} ${GeistSans.variable}`}>
      <head>
        {/* Preconnect to external domains — only ones we actually load.
            GA / PostHog / Vector / Partnero hints were dropped with their scripts
            (see components/DeferredAnalytics.js); re-add alongside the env vars. */}
        <link rel="preconnect" href="https://accounts.google.com" />
        <link rel="preconnect" href="https://app.guideflow.com" />

        {/* DNS prefetch for other domains */}
        <link rel="dns-prefetch" href="https://calendly.com" />

        {/* Performance hints */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Infrabox" />

        {/* DataFast Queue — minimal stub to capture events before main script loads */}
        <script
          id="datafast-queue"
          dangerouslySetInnerHTML={{
            __html: `window.datafast=window.datafast||function(){(window.datafast.q=window.datafast.q||[]).push(arguments)};`
          }}
        />

        <StructuredData />
      </head>
      <body>
        {/* ClientLayout contains all the client wrappers (toast messages, tooltips, etc.) */}
        <ClientLayout>{children}</ClientLayout>

        {/* All third-party analytics/marketing scripts load on first interaction (or idle
            fallback) so they never block first paint. See components/DeferredAnalytics.js */}
        <DeferredAnalytics />
      </body>
    </html>
  );
}
