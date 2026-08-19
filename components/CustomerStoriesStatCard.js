const VARIANTS = {
  dark: "bg-[#1240cc] text-white",
  accent: "bg-emerald-700 text-white",
};

// layout: "masonry" (CSS multi-column wall) | "stretch" (h-full grid row) | "natural" (content-sized).
export default function CustomerStoriesStatCard({ variant = "dark", value, label, quote, attribution, layout = "masonry" }) {
  const wrapperClass =
    layout === "masonry" ? "break-inside-avoid mb-5" : layout === "stretch" ? "h-full flex flex-col justify-center" : "";
  return (
    <div
      className={`${wrapperClass} rounded-2xl p-6 ${VARIANTS[variant]}`}
    >
      <div className="text-4xl sm:text-[42px] font-bold leading-none mb-2">{value}</div>
      <p className="text-sm font-medium opacity-90">{label}</p>
      {quote && (
        <p className="text-[13px] italic opacity-80 mt-4 leading-relaxed">
          "{quote}"{attribution && <span className="not-italic opacity-70"> — {attribution}</span>}
        </p>
      )}
    </div>
  );
}
