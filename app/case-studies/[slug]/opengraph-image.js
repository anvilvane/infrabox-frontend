import { ImageResponse } from "next/og";
import { getCaseStudy } from "./case-studies-data";

export const runtime = "edge";
export const alt = "Infrabox Case Study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BRAND = "#1240cc";
const BRAND_SOFT = "#e8f0fe";
const BG = "#fafaf9";
const INK = "#0f172a";
const MUTED = "#64748b";

export default async function Image({ params }) {
  const post = getCaseStudy(params.slug);
  const title = post?.headline || post?.title || "Infrabox Case Study";
  const category = (post?.category || "Case Study").toUpperCase();
  const clientName = post?.client?.name || "Infrabox";
  const readingTime = post?.readingTime || "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: BG,
          padding: "64px 72px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -160,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: BRAND_SOFT,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -200,
            left: -120,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: BRAND_SOFT,
            opacity: 0.7,
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: BRAND,
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: 800,
                letterSpacing: -1,
              }}
            >
              ✕
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: BRAND,
                letterSpacing: -0.5,
              }}
            >
              Infrabox
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 16px",
              borderRadius: 999,
              background: BRAND,
              color: "white",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            {category}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            zIndex: 10,
            maxWidth: 1000,
          }}
        >
          <div
            style={{
              fontSize: title.length > 80 ? 48 : title.length > 50 ? 58 : 64,
              fontWeight: 800,
              color: INK,
              lineHeight: 1.1,
              letterSpacing: -1.5,
            }}
          >
            {title}
          </div>

          <div
            style={{
              width: 80,
              height: 5,
              background: BRAND,
              borderRadius: 4,
              display: "flex",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ fontSize: 18, color: INK, fontWeight: 600 }}>
              {clientName}
            </div>
            {readingTime && (
              <div style={{ fontSize: 15, color: MUTED }}>{readingTime}</div>
            )}
          </div>

          <div
            style={{
              fontSize: 16,
              color: MUTED,
              fontFamily: "ui-monospace, SFMono-Regular, monospace",
              fontWeight: 500,
            }}
          >
            infrabox.software/case-studies
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
