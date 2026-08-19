import Image from "next/image";

function CheckIcon() {
  return (
    <svg className="w-4.5 h-4.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="w-4.5 h-4.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function FeatureValue({ value }) {
  if (value === true || value === "Yes") return <CheckIcon />;
  if (value === false || value === "No") return <XIcon />;
  return <span>{value}</span>;
}

export default function CategorizedFeatureTable({
  categorizedFeatures,
  features,
  competitorName,
  competitorDomain,
}) {
  // Fall back to flat features if no categorized data
  if (!categorizedFeatures && features) {
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 w-2/5">Feature</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-[#1240cc] w-[30%]">
                <span className="inline-flex items-center gap-1.5">
                  <img src="/logo.png" alt="Infrabox" className="h-3.5 w-auto" />
                  Infrabox
                </span>
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 w-[30%]">
                <span className="inline-flex items-center gap-1.5">
                  <img src={`https://www.google.com/s2/favicons?domain=${competitorDomain}&sz=32`} alt="" className="w-3.5 h-3.5 rounded-sm" />
                  {competitorName}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {features.map((row, i) => (
              <tr key={i} className={`border-b border-gray-100 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                <td className="py-2.5 px-4 text-sm font-medium text-gray-900">{row.feature}</td>
                <td className="py-2.5 px-4 text-sm text-gray-700"><FeatureValue value={row.infrabox} /></td>
                <td className="py-2.5 px-4 text-sm text-gray-500"><FeatureValue value={row.competitor} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!categorizedFeatures) return null;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 w-2/5">Feature</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-[#1240cc] w-[30%]">
              <span className="inline-flex items-center gap-1.5">
                <img src="/logo.png" alt="Infrabox" className="h-3.5 w-auto" />
                Infrabox
              </span>
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 w-[30%]">
              <span className="inline-flex items-center gap-1.5">
                <img src={`https://www.google.com/s2/favicons?domain=${competitorDomain}&sz=32`} alt="" className="w-3.5 h-3.5 rounded-sm" />
                {competitorName}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {categorizedFeatures.map((group, gi) =>
            [
              <tr key={`cat-${gi}`} className="bg-gray-100 border-b border-gray-200">
                <td colSpan={3} className="py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-gray-600">
                  {group.category}
                </td>
              </tr>,
              ...group.features.map((row, fi) => (
                <tr
                  key={`${gi}-${fi}`}
                  className={`border-b border-gray-100 last:border-0 ${
                    row.infraboxWins
                      ? "bg-emerald-50/30"
                      : fi % 2 === 0
                      ? "bg-white"
                      : "bg-gray-50/50"
                  }`}
                >
                  <td className="py-2.5 px-4 text-sm font-medium text-gray-900">
                    {row.feature}
                  </td>
                  <td className="py-2.5 px-4 text-sm text-gray-700">
                    <FeatureValue value={row.infrabox} />
                  </td>
                  <td className="py-2.5 px-4 text-sm text-gray-500">
                    <FeatureValue value={row.competitor} />
                  </td>
                </tr>
              )),
            ]
          )}
        </tbody>
      </table>
    </div>
  );
}
