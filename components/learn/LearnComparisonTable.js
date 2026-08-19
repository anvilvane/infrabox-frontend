function CellValue({ value }) {
  if (value === true) {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        className="text-emerald-500 mx-auto"
      >
        <path
          d="M4 8.5l3 3 5-6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (value === false) {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        className="text-red-400 mx-auto"
      >
        <path
          d="M5 5l6 6M11 5l-6 6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return <span className="text-sm text-gray-700">{value}</span>;
}

export default function LearnComparisonTable({ tools = [], rows = [], highlightTool }) {
  return (
    <div className="my-6 overflow-x-auto border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full text-left min-w-[600px]">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Feature
            </th>
            {tools.map((tool) => (
              <th
                key={tool}
                className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-center ${
                  tool === highlightTool
                    ? 'text-[#1240cc] bg-[#1240cc]/5'
                    : 'text-gray-500'
                }`}
              >
                {tool}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={`border-b border-gray-100 ${
                i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
              }`}
            >
              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                {row.feature}
              </td>
              {tools.map((tool) => (
                <td
                  key={tool}
                  className={`px-4 py-3 text-center ${
                    tool === highlightTool ? 'bg-[#1240cc]/5' : ''
                  }`}
                >
                  <CellValue value={row[tool]} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
