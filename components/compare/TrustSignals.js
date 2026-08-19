function StarIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

export default function TrustSignals({ ratings, companySignals, competitorName }) {
  const badges = [];

  if (ratings?.g2) {
    badges.push({
      icon: <StarIcon />,
      text: `${ratings.g2.score} on G2 (${ratings.g2.reviewCount} reviews)`,
    });
  }

  if (ratings?.trustpilot) {
    badges.push({
      icon: <StarIcon />,
      text: `${ratings.trustpilot.score} on Trustpilot (${ratings.trustpilot.reviewCount} reviews)`,
    });
  }

  if (companySignals?.customersServed) {
    badges.push({
      icon: (
        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      text: `${companySignals.customersServed} customers`,
    });
  }

  if (companySignals?.mailboxesManaged) {
    badges.push({
      icon: (
        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      text: `${companySignals.mailboxesManaged} mailboxes`,
    });
  }

  if (companySignals?.emailsPerDay) {
    badges.push({
      icon: (
        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      text: `${companySignals.emailsPerDay} emails/day`,
    });
  }

  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <span className="text-xs text-gray-400 font-medium self-center mr-1">{competitorName}:</span>
      {badges.map((badge, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1.5 text-xs bg-gray-100 px-2.5 py-1 rounded-full text-gray-600"
        >
          {badge.icon}
          {badge.text}
        </span>
      ))}
    </div>
  );
}
