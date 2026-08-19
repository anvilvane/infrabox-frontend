import Link from "next/link";
import Image from "next/image";

export default function CompareMatrix({ entries }) {
  if (!entries || entries.length === 0) return null;

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="w-full text-left min-w-[700px]">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Provider</th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Starting Price</th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Account Type</th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">G2 Rating</th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Key Differentiator</th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500"></th>
          </tr>
        </thead>
        <tbody>
          {/* Infrabox row - highlighted */}
          <tr className="bg-[#1240cc]/5 border-b border-gray-200">
            <td className="px-4 py-3">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#1240cc]">
                <img src="/logo.png" alt="Infrabox" className="h-4 w-auto" />
                Infrabox
              </span>
            </td>
            <td className="px-4 py-3 text-sm font-medium text-[#1240cc]">$2.50/mo</td>
            <td className="px-4 py-3 text-sm text-gray-700">Real Google & Microsoft</td>
            <td className="px-4 py-3 text-sm text-gray-700">-</td>
            <td className="px-4 py-3 text-sm text-gray-700">US IPs, InfraGuard, 24+ integrations</td>
            <td className="px-4 py-3">
              <a
                href="https://app.infrabox.software/signup"
                className="text-xs font-semibold text-[#1240cc] hover:underline"
              >
                Get Started
              </a>
            </td>
          </tr>
          {/* Competitor rows */}
          {entries.map((entry, i) => {
            const startingPrice =
              entry.atAGlance?.find((a) => a.label === "Starting Price")?.competitor ||
              entry.competitorPricing?.[0]?.price ||
              "-";
            const accountType =
              entry.atAGlance?.find((a) => a.label === "Account Type")?.competitor ||
              entry.features?.find((f) => f.feature === "Account Type")?.competitor ||
              "-";
            const g2 = entry.ratings?.g2
              ? `${entry.ratings.g2.score} (${entry.ratings.g2.reviewCount})`
              : "-";
            const differentiator =
              entry.atAGlance?.find(
                (a) => a.label !== "Starting Price" && a.label !== "Account Type" && a.label !== "G2 Rating"
              )?.competitor || "-";

            return (
              <tr
                key={entry.slug}
                className={`border-b border-gray-100 last:border-0 ${
                  i % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                }`}
              >
                <td className="px-4 py-3">
                  <Link href={`/compare/${entry.slug}`} className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-[#1240cc] transition-colors">
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${entry.competitorDomain}&sz=32`}
                      alt=""
                      className="w-4 h-4 rounded-sm"
                    />
                    {entry.competitorName}
                  </Link>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{startingPrice}</td>
                <td className="px-4 py-3 text-sm text-gray-600 max-w-[160px] truncate">{accountType}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{g2}</td>
                <td className="px-4 py-3 text-sm text-gray-600 max-w-[200px] truncate">{differentiator}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/compare/${entry.slug}`}
                    className="text-xs font-semibold text-[#1240cc] hover:underline"
                  >
                    Compare
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
