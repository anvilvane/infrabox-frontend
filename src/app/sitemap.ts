import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/product";
import { GUIDES } from "@/content/guides";
import { COMPARISONS } from "./compare/comparisons";
import { LEGAL_DOCS } from "./legal/legal-chrome";

/**
 * Every indexable route on the site, in one list.
 *
 * Two rules this file follows:
 *
 * 1. **Routes that are generated from data are listed from that data.** Guides
 *    come from the guide registry and legal documents from the legal registry,
 *    so adding one cannot leave the sitemap behind.
 *
 * 2. **`lastModified` is not `new Date()` for evergreen pages.** Bumping the
 *    modified date on every deploy without a content change is a false
 *    freshness signal, and search engines discount a sitemap that does it. Hub
 *    pages aggregate a growing set of children, so a deploy genuinely can
 *    refresh them; everything else carries the date its content last changed.
 */

/** Bumped by hand when the content of the static pages actually changes. */
const CONTENT_REVISED = new Date("2026-08-19");

type Entry = MetadataRoute.Sitemap[number];

const url = (path: string) => `${SITE_URL}${path}`;

const PRODUCT_PAGES: Entry[] = [
  {
    url: url("/"),
    lastModified: CONTENT_REVISED,
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    url: url("/how-it-works"),
    lastModified: CONTENT_REVISED,
    changeFrequency: "monthly",
    priority: 0.9,
  },
  {
    url: url("/pricing"),
    lastModified: CONTENT_REVISED,
    changeFrequency: "monthly",
    priority: 0.9,
  },
  {
    url: url("/pricing/calculator"),
    lastModified: CONTENT_REVISED,
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: url("/deliverability"),
    lastModified: CONTENT_REVISED,
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: url("/for-agencies"),
    lastModified: CONTENT_REVISED,
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: url("/get-started"),
    lastModified: CONTENT_REVISED,
    changeFrequency: "monthly",
    priority: 0.8,
  },
];

const HUB_PAGES: Entry[] = [
  {
    url: url("/resources"),
    lastModified: CONTENT_REVISED,
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: url("/guides"),
    lastModified: CONTENT_REVISED,
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: url("/compare"),
    lastModified: CONTENT_REVISED,
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: url("/legal"),
    lastModified: CONTENT_REVISED,
    changeFrequency: "monthly",
    priority: 0.4,
  },
];

const CONTENT_PAGES: Entry[] = [
  {
    url: url("/resources/faq"),
    lastModified: CONTENT_REVISED,
    changeFrequency: "monthly",
    priority: 0.8,
  },
  ...GUIDES.map<Entry>((guide) => ({
    url: url(`/guides/${guide.slug}`),
    lastModified: CONTENT_REVISED,
    changeFrequency: "monthly",
    priority: 0.7,
  })),
  // Owned by another page, listed from its own data for the same reason the
  // guides are: a new comparison must not need a sitemap edit to be found.
  ...COMPARISONS.map<Entry>((comparison) => ({
    url: url(`/compare/${comparison.slug}`),
    lastModified: CONTENT_REVISED,
    changeFrequency: "monthly",
    priority: 0.7,
  })),
];

const LEGAL_PAGES: Entry[] = LEGAL_DOCS.map<Entry>((doc) => ({
  url: url(doc.href),
  lastModified: CONTENT_REVISED,
  changeFrequency: "yearly",
  // Deliberately low. These are drafts, and two of them are stubs saying so —
  // they should be findable, not competing with the pages that sell anything.
  priority: 0.3,
}));

export default function sitemap(): MetadataRoute.Sitemap {
  return [...PRODUCT_PAGES, ...HUB_PAGES, ...CONTENT_PAGES, ...LEGAL_PAGES];
}

// Static content: no request-time input, so it can be emitted at build time
// (also required by `output: "export"` preview builds).
export const dynamic = "force-static";
