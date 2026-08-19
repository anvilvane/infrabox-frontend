'use client';

import { useEffect, useState } from 'react';

const BRAND_TEAL = '#1240cc';

export default function PartnerSearch() {
  const [q, setQ] = useState('');

  useEffect(() => {
    const needle = q.trim().toLowerCase();
    const cards = document.querySelectorAll('[data-partner-search]');
    const sections = document.querySelectorAll('[data-tier-section]');

    cards.forEach((card) => {
      const hay = (card.getAttribute('data-partner-search') || '').toLowerCase();
      const match = !needle || hay.includes(needle);
      card.style.display = match ? '' : 'none';
    });

    // Hide tier sections that have no visible cards left.
    sections.forEach((section) => {
      const visible = section.querySelectorAll('[data-partner-search]:not([style*="display: none"])').length;
      section.style.display = visible === 0 ? 'none' : '';
    });
  }, [q]);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      role="search"
      className="mt-9 mx-auto max-w-[640px] flex items-center bg-white rounded-full border border-gray-200 focus-within:border-[#1240cc]/40 transition-colors p-1.5 pl-5"
    >
      <svg
        className="w-[18px] h-[18px] text-gray-400 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search partners by name, service, or location…"
        className="flex-1 min-w-0 appearance-none border-none outline-none focus:outline-none focus-visible:outline-none focus:ring-0 px-3 py-2 text-[15px] bg-transparent text-gray-900 placeholder:text-gray-400"
        style={{ boxShadow: 'none', WebkitAppearance: 'none' }}
        aria-label="Search partners"
      />
      <button
        type="submit"
        className="px-5 py-2.5 rounded-full text-sm font-semibold text-white hover:bg-[#0b34b4] transition-colors shrink-0"
        style={{ background: BRAND_TEAL }}
      >
        Search
      </button>
    </form>
  );
}
