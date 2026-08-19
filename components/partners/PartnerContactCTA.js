'use client';

import { Mail } from 'lucide-react';

export default function PartnerContactCTA({ variant = 'hero' }) {
  const handleClick = (e) => {
    e.preventDefault();
    const el = document.getElementById('contact-form');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const base =
    'inline-flex items-center justify-center gap-2 rounded-full bg-[#1240cc] hover:bg-[#0b34b4] text-white font-semibold transition-colors';
  const sizing =
    variant === 'sidebar'
      ? 'mt-4 w-full px-5 py-2.5 text-sm'
      : 'px-6 py-3 text-sm';

  return (
    <a href="#contact-form" onClick={handleClick} className={`${base} ${sizing}`}>
      <Mail className="w-3.5 h-3.5" />
      Send a message
    </a>
  );
}
