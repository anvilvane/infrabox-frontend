export default function LearnProsCons({ pros = [], cons = [] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-6">
      {/* Pros */}
      <div className="border border-emerald-200 bg-emerald-50/30 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          {/* SVG check circle icon */}
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-emerald-600">
              <path
                d="M4 8.5l3 3 5-6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          Pros
        </h4>
        <ul className="space-y-2">
          {pros.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-600 leading-relaxed">
              {/* Small SVG check */}
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                className="text-emerald-500 mt-0.5 flex-shrink-0"
              >
                <path
                  d="M4 8.5l3 3 5-6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Cons */}
      <div className="border border-red-200 bg-red-50/30 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          {/* SVG X circle icon */}
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-100">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-red-500">
              <path
                d="M5 5l6 6M11 5l-6 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
          Cons
        </h4>
        <ul className="space-y-2">
          {cons.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-600 leading-relaxed">
              {/* Small SVG X */}
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                className="text-red-400 mt-0.5 flex-shrink-0"
              >
                <path
                  d="M5 5l6 6M11 5l-6 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
