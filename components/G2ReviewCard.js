import { ShieldCheck } from "lucide-react";
import CustomerStoriesAvatar from "@/components/CustomerStoriesAvatar";

const G2_RED = "#FF492C";

const G2Mark = ({ className = "" }) => (
  <div
    className={`shrink-0 rounded flex items-center justify-center font-black text-white ${className}`}
    style={{ backgroundColor: G2_RED }}
    aria-label="G2"
  >
    G2
  </div>
);

const STAR_PATH = "M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.9l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85z";

// Supports half-star ratings (e.g. 4.5) to match G2's actual precision.
function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.min(1, Math.max(0, rating - i));
        return (
          <div key={i} className="relative w-4 h-4">
            <svg viewBox="0 0 20 20" className="absolute inset-0 w-4 h-4" fill="#E5E7EB">
              <path d={STAR_PATH} />
            </svg>
            {fill > 0 && (
              <div className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <svg viewBox="0 0 20 20" className="w-4 h-4" fill={G2_RED}>
                  <path d={STAR_PATH} />
                </svg>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// variant: "columns" (CSS multi-column wall, clamped) | "stretch" (h-full grid row, clamped) |
// "natural" (content-sized, unclamped — used inside manually height-balanced columns).
export default function G2ReviewCard({ review, variant = "columns" }) {
  const wrapperClass =
    variant === "columns" ? "break-inside-avoid mb-5" : variant === "stretch" ? "h-full" : "";
  const clamp = variant !== "natural";

  return (
    <div
      className={`${wrapperClass} flex flex-col rounded-lg border border-gray-200 bg-white p-5 hover:shadow-md hover:shadow-gray-200/60 transition-shadow duration-200`}
    >
      <div className="flex items-center justify-between mb-3">
        <Stars rating={review.rating} />
        <G2Mark className="w-7 h-7 text-[11px]" />
      </div>

      <h3 className={`text-sm font-semibold text-gray-900 leading-snug ${clamp ? "line-clamp-2" : ""}`}>
        "{review.headline}"
      </h3>
      <p className={`mt-2 text-[13px] text-gray-600 leading-relaxed ${clamp ? "line-clamp-4" : ""} ${variant === "stretch" ? "flex-1" : ""}`}>
        {review.body}
      </p>

      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3">
        <CustomerStoriesAvatar name={review.name} size="h-9 w-9" />
        <div className="min-w-0">
          <div className="text-xs font-semibold text-gray-900 truncate">
            {review.name}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-gray-400 truncate">
            <ShieldCheck className="w-3 h-3 shrink-0" style={{ color: G2_RED }} />
            <span className="truncate">Verified Reviewer &middot; {review.title}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
