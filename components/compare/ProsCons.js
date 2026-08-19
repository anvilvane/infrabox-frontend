import Image from "next/image";

function ProIcon() {
  return (
    <svg className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ConIcon() {
  return (
    <svg className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function ProviderColumn({ name, domain, isInfrabox, pros, cons }) {
  return (
    <div className={`rounded-xl border p-5 ${isInfrabox ? "border-[#1240cc]/20 bg-[#1240cc]/[0.02]" : "border-gray-200 bg-white"}`}>
      <div className="flex items-center gap-2 mb-4">
        {isInfrabox ? (
          <img src="/logo.png" alt="Infrabox" className="h-5 w-auto" />
        ) : (
          <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`} alt="" className="w-5 h-5 rounded-sm" />
        )}
        <span className="text-sm font-semibold text-gray-900">{name}</span>
      </div>

      {/* Pros */}
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-2">Strengths</p>
        <ul className="space-y-2">
          {pros.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <ProIcon />
              <span className="text-sm text-gray-700 leading-snug">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-4" />

      {/* Cons */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-red-500 mb-2">Limitations</p>
        <ul className="space-y-2">
          {cons.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <ConIcon />
              <span className="text-sm text-gray-600 leading-snug">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function ProsCons({ prosCons, competitorName, competitorDomain }) {
  if (!prosCons) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <ProviderColumn
        name="Infrabox"
        isInfrabox
        pros={prosCons.infrabox.pros}
        cons={prosCons.infrabox.cons}
      />
      <ProviderColumn
        name={competitorName}
        domain={competitorDomain}
        pros={prosCons.competitor.pros}
        cons={prosCons.competitor.cons}
      />
    </div>
  );
}
