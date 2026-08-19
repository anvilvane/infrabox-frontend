'use client';

import Link from 'next/link';
import { trackClick } from '@/lib/datafast';

export function ClickableLink({ href, onClick, className, children, trackEvent, trackData }) {
  const handleClick = () => {
    if (trackEvent) {
      trackClick(trackEvent, trackData);
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}

export function ClickableAnchor({ href, onClick, className, children, trackEvent, trackData }) {
  const handleClick = () => {
    if (trackEvent) {
      trackClick(trackEvent, trackData);
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <a href={href} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}
