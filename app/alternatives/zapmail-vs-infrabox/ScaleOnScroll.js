'use client';

import { useEffect, useRef } from 'react';

/**
 * Scroll-tied scale wrapper.
 *
 * The wrapped element renders at `minScale` while it's near the bottom
 * edge of the viewport, then scales up to 1 as it scrolls upward into
 * full view. Re-entering from above (scrolling back) re-applies the
 * mapping, so the same card grows/shrinks consistently with scroll
 * position.
 *
 * The transform is written directly to the DOM via the ref (no React
 * state per frame) and updates are rAF-throttled on scroll/resize.
 *
 * Props:
 *   - minScale: scale when the card's top is at the bottom of the viewport (default 0.85)
 *   - endRatio: fraction of viewport height at which the card reaches full scale
 *               (default 0.2 — top edge ~20% from the top of the viewport = scale 1)
 *   - className: forwarded to the rendered div
 */
export default function ScaleOnScroll({
  children,
  minScale = 0.85,
  endRatio = 0.2,
  className = '',
  style,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const el = ref.current;
    if (!el) return;

    if (reduced) {
      el.style.transform = 'scale(1)';
      return;
    }

    let frame = null;

    const update = () => {
      frame = null;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const startY = vh;
      const endY = vh * endRatio;
      const span = startY - endY;
      const raw = span > 0 ? (startY - rect.top) / span : 1;
      const progress = Math.max(0, Math.min(1, raw));
      const scale = minScale + (1 - minScale) * progress;
      el.style.transform = `scale(${scale})`;
    };

    const schedule = () => {
      if (frame !== null) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [minScale, endRatio]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        transform: `scale(${minScale})`,
        transformOrigin: 'center center',
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
}
