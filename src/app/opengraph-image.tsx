import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

/**
 * The site-wide Open Graph card, rendered at build time by `next/og`.
 *
 * Everything is drawn locally: the logo is read off disk and inlined as a data
 * URI, and there is no remote font and no third-party card service. Outsourcing
 * this would put the first impression of every shared link behind somebody
 * else's uptime.
 *
 * The colours are the brand ramp sampled from `public/logo.png` and recorded in
 * `globals.css`. They are repeated as literals here — and only here — because
 * an OG image renders outside the document and cannot read a CSS variable.
 * If the palette changes in `globals.css`, change these four to match.
 */

export const alt =
  "Infrabox — cold-email infrastructure, provisioned end to end";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** `--brand-900` — the dark section ground. */
const GROUND = "#012c3c";
/** `--brand-950` — the deepest cube face, used for the grid lines. */
const GRID = "#01202c";
/** `--accent-400` — the wordmark cyan. Highlights only, never body text. */
const ACCENT = "#3ce2f4";
/** Near-white body text on the dark ground. */
const TEXT = "#eaf6f9";
/** Muted text on the dark ground. */
const MUTED = "#8fb6c4";

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public", "logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: GROUND,
          color: TEXT,
          padding: "58px 76px 64px",
          // The hairline grid the site uses behind dark bands, at card scale.
          backgroundImage: `linear-gradient(to right, ${GRID} 1px, transparent 1px), linear-gradient(to bottom, ${GRID} 1px, transparent 1px)`,
          backgroundSize: "84px 84px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* The lockup already contains the wordmark, so no text beside it. */}
          <img src={logoSrc} alt="" width={132} height={132} />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 58,
              fontWeight: 600,
              lineHeight: 1.08,
              letterSpacing: "-0.035em",
              maxWidth: 900,
            }}
          >
            Domains, DNS and Google Workspace mailboxes, provisioned end to end.
          </div>
          <div
            style={{
              marginTop: 26,
              fontSize: 27,
              lineHeight: 1.4,
              color: MUTED,
              maxWidth: 840,
            }}
          >
            Eight steps, unattended, then handed to your sending tool over SMTP.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 21,
            color: MUTED,
            borderTop: `1px solid ${GRID}`,
            paddingTop: 22,
          }}
        >
          <span style={{ color: ACCENT }}>MX, SPF, DMARC</span>
          <span>·</span>
          <span>Domain verification</span>
          <span>·</span>
          <span>DKIM signing</span>
          <span>·</span>
          <span>SMTP relay</span>
        </div>
      </div>
    ),
    size,
  );
}

// Rendered once at build time — nothing about it varies per request.
export const dynamic = "force-static";
