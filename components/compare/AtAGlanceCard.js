import Image from "next/image";

export default function AtAGlanceCard({ atAGlance, competitorName, competitorDomain }) {
  if (!atAGlance || atAGlance.length === 0) return null;

  return (
    <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-200 bg-gray-50">
        <h2 className="text-sm font-semibold text-gray-900">At a Glance</h2>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-2.5 px-4 text-left text-xs font-medium text-gray-500 w-[34%]">
              Feature
            </th>
            <th className="py-2.5 px-4 text-left text-xs font-semibold text-[#1240cc] w-[33%]">
              <span className="inline-flex items-center gap-1.5">
                <img src="/logo.png" alt="Infrabox" className="h-3.5 w-auto" />
                Infrabox
              </span>
            </th>
            <th className="py-2.5 px-4 text-left text-xs font-medium text-gray-500 w-[33%]">
              <span className="inline-flex items-center gap-1.5">
                <img
                  src={`https://www.google.com/s2/favicons?domain=${competitorDomain}&sz=32`}
                  alt=""
                  className="w-3.5 h-3.5 rounded-sm"
                />
                {competitorName}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {atAGlance.map((row, i) => {
            const infraboxBetter =
              row.label === "Monitoring" ||
              row.label === "Account Type" ||
              row.label === "Setup Time" ||
              row.label === "Inbox Placement" ||
              (row.infrabox && row.infrabox !== "N/A" && row.competitor === "Not included") ||
              (row.infrabox && row.infrabox !== "N/A" && row.competitor === "Not offered");

            return (
              <tr
                key={i}
                className={`border-b border-gray-100 last:border-0 ${
                  infraboxBetter ? "bg-emerald-50/50" : i % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                }`}
              >
                <td className="py-2 px-4 text-sm font-medium text-gray-700">{row.label}</td>
                <td className="py-2 px-4 text-sm text-gray-900 font-medium">{row.infrabox}</td>
                <td className="py-2 px-4 text-sm text-gray-600">{row.competitor}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
