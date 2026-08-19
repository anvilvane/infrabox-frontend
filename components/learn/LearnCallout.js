const variants = {
  tip: {
    border: 'border-l-emerald-500',
    bg: 'bg-emerald-50/50',
    iconColor: 'text-emerald-600',
    titleColor: 'text-emerald-900',
    textColor: 'text-emerald-800',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-emerald-600">
        <path
          d="M9 21h6M12 3a6 6 0 0 1 4 10.47V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-3.53A6 6 0 0 1 12 3Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  warning: {
    border: 'border-l-amber-500',
    bg: 'bg-amber-50/50',
    iconColor: 'text-amber-600',
    titleColor: 'text-amber-900',
    textColor: 'text-amber-800',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-amber-600">
        <path
          d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  info: {
    border: 'border-l-blue-500',
    bg: 'bg-blue-50/50',
    iconColor: 'text-blue-600',
    titleColor: 'text-blue-900',
    textColor: 'text-blue-800',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-blue-600">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M12 16v-4m0-4h.01"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  verdict: {
    border: 'border-l-[#1240cc]',
    bg: 'bg-[#1240cc]/5',
    iconColor: 'text-[#1240cc]',
    titleColor: 'text-[#1240cc]',
    textColor: 'text-gray-700',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#1240cc]">
        <circle cx="12" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
};

export default function LearnCallout({ variant = 'info', title, text }) {
  const config = variants[variant] || variants.info;

  return (
    <div
      className={`border-l-4 ${config.border} ${config.bg} rounded-r-lg p-4 my-6`}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-0.5">{config.icon}</div>
        <div>
          {title && (
            <p className={`text-sm font-semibold ${config.titleColor} mb-1`}>
              {title}
            </p>
          )}
          <p className={`text-sm leading-relaxed ${config.textColor}`}>
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}
