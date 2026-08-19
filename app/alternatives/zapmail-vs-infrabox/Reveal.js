'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Scroll-triggered fade wrapper that replays on every viewport entry.
 *
 * Uses IntersectionObserver with two thresholds:
 *   - 0  → element completely leaves viewport → reset to hidden
 *   - threshold (default 0.2) → element reaches required visibility → reveal
 *
 * This means scrolling past, then back, restarts the animation each time.
 *
 * Props:
 *   - direction: 'up' (default) or 'down'
 *   - delay: ms after enter before the transition starts
 *   - as: tag to render (default 'div')
 *   - className: forwarded to the rendered element
 *   - threshold: ratio required for the reveal (default 0.2)
 *   - distance: px of initial offset (default 24)
 */
export default function Reveal({
  children,
  direction = 'up',
  delay = 0,
  as: Tag = 'div',
  className = '',
  threshold = 0.2,
  distance = 24,
  rootMargin = '0px 0px -15% 0px',
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const thresholds = threshold > 0 ? [0, threshold] : [0];
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio === 0) {
          setVisible(false);
        } else if (entry.intersectionRatio >= threshold) {
          setVisible(true);
        }
      },
      { threshold: thresholds, rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const offset = direction === 'down' ? -distance : distance;
  const style = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : `translateY(${offset}px)`,
    transition: `opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
    willChange: 'opacity, transform',
  };

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}
