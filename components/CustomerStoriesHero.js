"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Star } from "lucide-react";

const TRUST_AVATARS = [
  "/image-assets/avatars/luka.jpeg",
  "/image-assets/avatars/benjamin-douablin.jpeg",
  "/image-assets/avatars/walter-winn.jpeg",
  "/image-assets/avatars/dimitar-petkov.png",
  "/image-assets/avatars/jesse-oulette.jpeg",
];

const NAV_ITEMS = [
  { key: "wall-of-love", label: "Wall of Love", href: "/customer-stories/wall-of-love", hash: "#wall-of-love" },
  { key: "case-studies", label: "Case Studies", href: "/customer-stories/case-studies", hash: "#case-studies" },
  { key: "g2-reviews", label: "G2 Reviews", href: "/customer-stories/g2-reviews", hash: "#g2-reviews" },
  { key: "video-testimonials", label: "Video Testimonials", href: "/customer-stories/video-testimonials", hash: "#video-testimonials" },
];

export default function CustomerStoriesHero({
  breadcrumb,
  eyebrow,
  headlineLead,
  headlineAccent,
  subtext,
  showPills = true,
  pillMode = "route",
  showTrustBar = true,
}) {
  const pathname = usePathname();

  return (
    <section className="px-6 pt-14 sm:pt-20 pb-12 sm:pb-14 max-w-4xl mx-auto text-center">
      {breadcrumb && (
        <nav className="flex items-center justify-center gap-2 text-xs text-gray-500/80 mb-8">
          <Link href="/customer-stories" className="hover:text-gray-700 transition-colors">
            Customer Stories
          </Link>
          <span>/</span>
          <span className="text-gray-700">{breadcrumb}</span>
        </nav>
      )}

      <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#1240cc]/10 text-[#1240cc] text-[11px] font-bold uppercase tracking-wider mb-6">
        {eyebrow}
      </span>

      <h1 className="text-[34px] sm:text-[46px] md:text-[54px] font-bold text-gray-900 leading-[1.12] mb-5">
        {headlineLead}{" "}
        <span className="text-[#1240cc]">{headlineAccent}</span>
      </h1>

      {subtext && (
        <p className="text-base sm:text-lg text-gray-500 leading-relaxed max-w-xl mx-auto mb-8">
          {subtext}
        </p>
      )}

      {showTrustBar && (
        /* Trust bar — real avatars + real G2 rating, same as the homepage */
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
          <div className="flex items-center gap-2.5">
            <div className="flex -space-x-2">
              {TRUST_AVATARS.map((src, i) => (
                <Image
                  key={i}
                  src={src}
                  alt=""
                  role="presentation"
                  width={28}
                  height={28}
                  className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-sm"
                />
              ))}
            </div>
            <span className="text-xs font-medium text-gray-600">
              Trusted by agencies &amp; sales teams worldwide
            </span>
          </div>

          <div className="hidden sm:block h-4 w-px bg-gray-300/70" />

          <a
            href="https://www.g2.com/products/infrabox/reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 group"
          >
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
              ))}
            </div>
            <span className="text-xs font-medium text-gray-600 group-hover:text-[#1240cc]">
              <span className="font-semibold text-gray-800">4.9</span> on G2
            </span>
          </a>
        </div>
      )}

      {showPills && (
        <nav
          className="flex flex-wrap items-center justify-center gap-2 mt-8"
          aria-label="Customer stories sections"
        >
          {NAV_ITEMS.map((item) => {
            const href = pillMode === "hash" ? item.hash : item.href;
            const isActive = pillMode === "route" && pathname === item.href;
            return (
              <Link
                key={item.key}
                href={href}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors shadow-sm ${
                  isActive
                    ? "bg-[#1240cc] border-[#1240cc] text-white"
                    : "bg-white/70 border-gray-900/5 text-gray-700 hover:bg-white hover:text-[#1240cc]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </section>
  );
}
