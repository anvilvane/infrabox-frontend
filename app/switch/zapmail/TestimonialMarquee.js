'use client';

import Reveal from './Reveal';

function Card({ t }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        {t.image ? (
          <img
            src={t.image}
            alt={t.name}
            loading="lazy"
            className="w-10 h-10 rounded-full object-cover bg-[#1240cc]/10 flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-[#1240cc]/10 text-[#1240cc] flex items-center justify-center text-sm font-semibold flex-shrink-0">
            {t.name.charAt(0)}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 leading-tight">{t.name}</p>
          <p className="text-xs text-gray-500 leading-tight">{t.role}</p>
        </div>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{t.quote}</p>
    </div>
  );
}

function Column({ testimonials, direction, duration, delay }) {
  const cards = [...testimonials, ...testimonials];
  return (
    <Reveal as="div" delay={delay} distance={0} className="ik-tm-mask relative overflow-hidden h-[560px]">
      <div
        className={direction === 'up' ? 'ik-tm-up' : 'ik-tm-down'}
        style={{ '--ik-tm-dur': duration }}
      >
        {cards.map((t, i) => (
          <div key={`${t.name}-${i}`} className="pb-4">
            <Card t={t} />
          </div>
        ))}
      </div>
    </Reveal>
  );
}

export default function TestimonialMarquee({ testimonials }) {
  const cols = [[], [], []];
  testimonials.forEach((t, i) => cols[i % 3].push(t));

  return (
    <>
      <style>{`
        @keyframes ik-tm-up {
          0%   { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(0, -50%, 0); }
        }
        @keyframes ik-tm-down {
          0%   { transform: translate3d(0, -50%, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        .ik-tm-up   { animation: ik-tm-up   var(--ik-tm-dur, 40s) linear infinite; will-change: transform; }
        .ik-tm-down { animation: ik-tm-down var(--ik-tm-dur, 40s) linear infinite; will-change: transform; }
        .ik-tm-up:hover, .ik-tm-down:hover { animation-play-state: paused; }
        .ik-tm-mask {
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, #000 10%, #000 90%, transparent 100%);
                  mask-image: linear-gradient(to bottom, transparent 0%, #000 10%, #000 90%, transparent 100%);
        }
        @media (prefers-reduced-motion: reduce) {
          .ik-tm-up, .ik-tm-down { animation: none; }
        }
      `}</style>

      {/* Mobile / tablet — static stacked grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
        {testimonials.map((t) => (
          <Card key={t.name + t.role} t={t} />
        ))}
      </div>

      {/* Desktop — 3-column marquee */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-4">
        <Column testimonials={cols[0]} direction="up"   duration="42s" delay={0} />
        <Column testimonials={cols[1]} direction="down" duration="46s" delay={200} />
        <Column testimonials={cols[2]} direction="up"   duration="44s" delay={400} />
      </div>
    </>
  );
}
