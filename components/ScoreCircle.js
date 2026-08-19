export default function ScoreCircle({ score, size = 120 }) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 10) * circumference;
  
  const getColor = (score) => {
    if (score >= 8) return '#10b981'; // Green
    if (score >= 6) return '#f59e0b'; // Yellow  
    if (score >= 4) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  const getRiskLevel = (score) => {
    if (score >= 8) return 'Low';
    if (score >= 6) return 'Medium';
    if (score >= 4) return 'Medium';
    return 'High';
  };

  const color = getColor(score);
  const riskLevel = getRiskLevel(score);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        
        {/* Score text in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold text-gray-900">{score}</div>
          <div className="text-sm text-gray-600">of 10</div>
        </div>
      </div>
      
      {/* Risk level badge */}
      <div className={`mt-3 px-3 py-1 rounded-full text-sm font-medium ${
        riskLevel === 'Low' ? 'bg-green-100 text-green-800' :
        riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
        'bg-red-100 text-red-800'
      }`}>
        Risk: {riskLevel}
      </div>
    </div>
  );
}