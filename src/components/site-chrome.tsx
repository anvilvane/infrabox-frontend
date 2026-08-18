import Image from "next/image";
import Link from "next/link";

import { ButtonLink, Container } from "@/components/ui";
import { CompactNav, SiteNav, type NavItem } from "@/components/site-nav";
import { COMPARISONS } from "@/app/compare/comparisons";
import { LEGAL_DOCS } from "@/app/legal/legal-chrome";
import { GUIDES } from "@/content/guides";
import { cn } from "@/lib/utils";

/* --------------------------------------------------------------- the mark */

/**
 * `public/logo.png` is a 500×500 lockup: the isometric cube sits in
 * (123,50)–(391,355) and the "INFRABOX" wordmark sits below it. At header size
 * that baked-in wordmark would render two pixels tall, so we show the cube
 * only — cropped in CSS, from the same untouched file that is also the
 * favicon, the apple icon and the footer mark. One asset, no variants.
 */
const CUBE = { x: 123, y: 50, w: 268, h: 305, canvas: 500 } as const;

export function LogoMark({
  height = 30,
  className,
  priority = false,
}: {
  height?: number;
  className?: string;
  priority?: boolean;
}) {
  const scale = height / CUBE.h;
  const size = CUBE.canvas * scale;
  return (
    <span
      aria-hidden
      className={cn("relative block shrink-0 overflow-hidden", className)}
      style={{ width: Math.round(CUBE.w * scale), height }}
    >
      <Image
        src="/logo.png"
        alt=""
        width={CUBE.canvas}
        height={CUBE.canvas}
        priority={priority}
        className="absolute max-w-none"
        style={{
          width: size,
          height: size,
          left: -CUBE.x * scale,
          top: -CUBE.y * scale,
        }}
      />
    </span>
  );
}

/** The mark plus the wordmark. `tone="dark"` for use on the ink ground. */
export function Wordmark({
  tone = "light",
  height = 26,
  priority = false,
}: {
  tone?: "light" | "dark";
  height?: number;
  priority?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark height={height} priority={priority} />
      <span
        className={cn(
          "font-display text-[1.0625rem] font-semibold tracking-[-0.035em]",
          tone === "dark" ? "text-ink-foreground" : "text-foreground",
        )}
      >
        Infrabox
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------ header */

/**
 * The menus are derived from the same registries the pages are generated from
 * (`GUIDES`, `COMPARISONS`, `LEGAL_DOCS`), so a menu entry cannot point at a
 * route that does not exist, and adding a guide or a comparison puts it in the
 * navigation automatically. Only the handful of standalone pages are listed
 * literally, and each of those is a real route.
 */
const NAV_ITEMS: NavItem[] = [
  {
    label: "Product",
    groups: [
      {
        heading: "The service",
        links: [
          {
            href: "/how-it-works",
            label: "How it works",
            description: "The eight provisioning steps, start to finish.",
          },
          {
            href: "/deliverability",
            label: "Deliverability",
            description: "MX, SPF, DKIM, DMARC and the relay hand-off.",
          },
          {
            href: "/for-agencies",
            label: "For agencies",
            description: "Many clients, one workspace, one bill.",
          },
        ],
      },
      {
        heading: "Compare",
        links: COMPARISONS.map((comparison) => ({
          href: `/compare/${comparison.slug}`,
          label: comparison.approach,
        })),
      },
    ],
    footer: { href: "/compare", label: "All comparisons" },
  },
  {
    label: "Pricing",
    groups: [
      {
        links: [
          {
            href: "/pricing",
            label: "Plans and pricing",
            description: "Per-mailbox price, domain cost and what is not included.",
          },
          {
            href: "/pricing/calculator",
            label: "Pricing calculator",
            description: "Estimate a first month and a first year for your estate.",
          },
        ],
      },
    ],
  },
  {
    label: "Resources",
    groups: [
      {
        heading: "Guides",
        links: GUIDES.map((guide) => ({
          href: `/guides/${guide.slug}`,
          label: guide.shortTitle,
        })),
      },
      {
        heading: "Reference",
        links: [
          {
            href: "/resources",
            label: "Resource hub",
            description: "Everything written down, in one index.",
          },
          {
            href: "/resources/faq",
            label: "FAQ",
            description: "The questions worth asking before you buy.",
          },
          {
            href: "/legal",
            label: "Legal documents",
            description: "Policies, and an honest note on which are still drafts.",
          },
        ],
      },
    ],
    footer: { href: "/guides", label: "All guides" },
  },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <Container className="flex h-[3.75rem] items-center justify-between gap-6">
        <Link href="/" aria-label="Infrabox — home" className="rounded-sm">
          <Wordmark priority />
        </Link>

        <SiteNav items={NAV_ITEMS} />

        <div className="flex items-center gap-1">
          <ButtonLink href="/get-started" size="sm" className="h-9 px-4 text-[0.8125rem]">
            Get started
          </ButtonLink>
        </div>
      </Container>

      <CompactNav items={NAV_ITEMS} />
    </header>
  );
}

/* ------------------------------------------------------------------ footer */

const FOOTER_COLUMNS: { heading: string; links: { href: string; label: string }[] }[] =
  [
    {
      heading: "Product",
      links: [
        { href: "/how-it-works", label: "How it works" },
        { href: "/deliverability", label: "Deliverability" },
        { href: "/for-agencies", label: "For agencies" },
        { href: "/pricing", label: "Pricing" },
        { href: "/pricing/calculator", label: "Pricing calculator" },
        { href: "/get-started", label: "Get started" },
      ],
    },
    {
      heading: "Resources",
      links: [
        { href: "/resources", label: "Resources" },
        { href: "/guides", label: "Guides" },
        { href: "/resources/faq", label: "FAQ" },
        { href: "/compare", label: "Compare approaches" },
      ],
    },
    {
      heading: "Legal",
      links: [
        { href: "/legal/terms-of-service", label: "Terms of service" },
        { href: "/legal/privacy-policy", label: "Privacy policy" },
        { href: "/legal/acceptable-use-policy", label: "Acceptable use" },
        { href: "/legal/refund-policy", label: "Refund policy" },
        {
          href: "/legal/service-level-agreement",
          label: "Service level agreement",
        },
      ],
    },
  ];

export function SiteFooter() {
  return (
    <footer className="on-ink bg-ink text-ink-foreground">
      <Container className="grid gap-12 py-16 md:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))] md:gap-10 lg:gap-14">
        <div className="max-w-sm">
          <Wordmark tone="dark" />
          <p className="mt-5 text-sm leading-relaxed text-ink-muted">
            Cold-email infrastructure: domains registered, DNS connected and
            Google Workspace mailboxes provisioned end to end, then handed to
            your sending tool over SMTP.
          </p>
        </div>

        {FOOTER_COLUMNS.map((col) => (
          <div key={col.heading}>
            <h2 className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-muted">
              {col.heading}
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-ink-foreground/80 transition-colors hover:text-ink-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <div className="border-t border-ink-border">
        <Container className="flex flex-col gap-2 py-6 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Infrabox</p>
          <p>Google Workspace mailboxes</p>
        </Container>
      </div>
    </footer>
  );
}
