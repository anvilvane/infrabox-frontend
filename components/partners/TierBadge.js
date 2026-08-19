// Shared tier badge components — used by /partners directory and /partners/[slug] profile.
// Tokens match partners.css from the design bundle.

export const TIER_TOKENS = {
  platinum:  { label: 'Platinum Elite', bg: '#d9fad3', fg: '#0033bb', dot: '#001040', deep: '#0033bb' },
  gold:      { label: 'Gold',           bg: '#fdf0d1', fg: '#7c5a14', dot: '#c79324', deep: '#7c5a14' },
  growth:    { label: 'Growth',         bg: '#e8edf2', fg: '#475569', dot: '#8b95a3', deep: '#475569' },
  certified: { label: 'Certified',      bg: '#fde7d3', fg: '#7c4a25', dot: '#b87333', deep: '#7c4a25' },
};

export const TIER_ORDER = ['platinum', 'gold', 'growth', 'certified'];

// Modern tier glyphs — bold solid shapes, single fill, optimized for ≤12px rendering.
// Platinum: solid diamond (premium gem)  ·  Gold: solid 5-point star
// Growth:   solid lightning bolt          ·  Certified: solid checkmark in rounded badge
export function TierGlyph({ tier, color, size = 10 }) {
  const sz = size;
  switch (tier) {
    case 'platinum':
      // Modern 4-point sparkle ✦ — solid, smooth-joined rays.
      return (
        <svg width={sz} height={sz} viewBox="0 0 14 14" aria-hidden="true">
          <path
            d="M7 0.6 L8 6 L13.4 7 L8 8 L7 13.4 L6 8 L0.6 7 L6 6 Z"
            fill={color}
            stroke={color}
            strokeWidth="0.6"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'gold':
      // Solid 5-point star — classic award.
      return (
        <svg width={sz} height={sz} viewBox="0 0 14 14" aria-hidden="true">
          <path
            d="M7 1 L8.85 5.05 L13.3 5.5 L9.9 8.4 L10.85 12.8 L7 10.5 L3.15 12.8 L4.1 8.4 L0.7 5.5 L5.15 5.05 Z"
            fill={color}
            stroke={color}
            strokeWidth="0.6"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'growth':
      // Mountain peaks (smaller left, taller right) — aspirational "climb / summit".
      return (
        <svg width={sz} height={sz} viewBox="0 0 14 14" aria-hidden="true">
          <path
            d="M0.8 12.2 L4.8 6.4 L7 8.6 L9.8 3.4 L13.2 12.2 Z"
            fill={color}
            stroke={color}
            strokeWidth="0.6"
            strokeLinejoin="round"
          />
          <path
            d="M8.95 5 L9.8 3.4 L10.7 5"
            fill="white"
            fillOpacity="0.55"
            stroke="none"
          />
        </svg>
      );
    case 'certified':
      // Heraldic shield with checkmark — verified / protected.
      return (
        <svg width={sz} height={sz} viewBox="0 0 14 14" aria-hidden="true">
          <path
            d="M7 1 L12.4 2.6 L12.4 7 Q 12.4 10.8 7 13 Q 1.6 10.8 1.6 7 L 1.6 2.6 Z"
            fill={color}
            stroke={color}
            strokeWidth="0.6"
            strokeLinejoin="round"
          />
          <path
            d="M4.5 7.1 L6.3 8.9 L9.6 5.4"
            stroke="white"
            strokeWidth="1.55"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      );
    default:
      return null;
  }
}

export function TierBadge({ tier, size = 'md' }) {
  const t = TIER_TOKENS[tier];
  if (!t) return null;
  const sm = size === 'sm';
  const cls = sm
    ? 'text-[10px] py-[2px] pl-2 pr-2.5 gap-1'
    : 'text-[11px] py-1 pl-2.5 pr-3 gap-1.5';
  const glyphSize = sm ? 9 : 11;
  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold whitespace-nowrap ${cls}`}
      style={{ background: t.bg, color: t.fg }}
    >
      <TierGlyph tier={tier} color={t.deep} size={glyphSize} />
      {t.label}
    </span>
  );
}

export function TierDot({ tier, size = 8 }) {
  const t = TIER_TOKENS[tier];
  if (!t) return null;
  const shadow = tier === 'platinum' ? `0 0 0 1.5px ${t.bg} inset` : 'none';
  return (
    <span
      className="inline-block rounded-full"
      style={{ width: size, height: size, background: t.dot, boxShadow: shadow }}
      aria-hidden="true"
    />
  );
}
