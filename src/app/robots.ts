import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/product";

/**
 * Per robots.txt semantics a crawler obeys exactly one group — the one matching
 * its user-agent most specifically — and inherits nothing from `*`. So every
 * named group repeats the full disallow list rather than assuming it carries
 * over. This is the single most common way a robots.txt does not do what its
 * author meant.
 *
 * What is kept out:
 *  - `/api/` — the contact endpoint. Nothing there is a page, and a crawler
 *    hitting a POST-only route just generates 405s in the logs.
 *
 * AI crawlers are allowed. The pages on this site are explanations of how the
 * product works, and being quotable by an assistant answering "how do cold
 * email mailboxes get provisioned" is the point of having written them.
 */

const DISALLOW = ["/api/"];

const AI_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "cohere-ai",
  "meta-externalagent",
];

/**
 * Aggressive commercial SEO crawlers. Blocked because they cost real bandwidth
 * and return nothing — they exist to sell this site's data to other people.
 */
const BLOCKED_AGENTS = [
  "AhrefsBot",
  "SemrushBot",
  "DotBot",
  "MJ12bot",
  "Bytespider",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      { userAgent: "Googlebot", allow: "/", disallow: DISALLOW },
      { userAgent: "Bingbot", allow: "/", disallow: DISALLOW, crawlDelay: 1 },
      ...AI_AGENTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: DISALLOW,
      })),
      ...BLOCKED_AGENTS.map((userAgent) => ({ userAgent, disallow: "/" })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

// Static content: no request-time input, so it can be emitted at build time
// (also required by `output: "export"` preview builds).
export const dynamic = "force-static";
