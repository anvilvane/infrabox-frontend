'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

function getDismissKey(text) {
  try {
    return `announcement-banner-dismissed-${btoa(text).slice(0, 12)}`;
  } catch {
    return `announcement-banner-dismissed-${text.slice(0, 12)}`;
  }
}

function isExternalUrl(url) {
  try {
    const parsed = new URL(url, window.location.origin);
    return parsed.origin !== window.location.origin;
  } catch {
    return false;
  }
}

const BANNER_HEIGHT = '44px';

export default function AnnouncementBanner() {
  const [banner, setBanner] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await fetch('https://api.infrabox.software/v1/auth/announcement-banner/active');
        const data = await response.json();

        if (data.active && data.banner && data.banner.show_on_landing) {
          const text = data.banner.landing_text || '';
          const dismissKey = getDismissKey(text);
          const wasDismissed = localStorage.getItem(dismissKey) === 'true';

          if (!wasDismissed && text) {
            setBanner(data.banner);
            setIsVisible(true);
            document.documentElement.style.setProperty('--announcement-banner-height', BANNER_HEIGHT);
          }
        }
      } catch {
        // Silently fail - banner is non-critical
      } finally {
        setIsLoaded(true);
      }
    };

    fetchBanner();

    return () => {
      document.documentElement.style.setProperty('--announcement-banner-height', '0px');
    };
  }, []);

  const bannerText = banner?.landing_text || banner?.dashboard_text || '';
  const bannerUrl = banner?.landing_url || banner?.dashboard_url || '';

  const handleDismiss = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const dismissKey = getDismissKey(bannerText);
    localStorage.setItem(dismissKey, 'true');
    setIsVisible(false);
    document.documentElement.style.setProperty('--announcement-banner-height', '0px');
  };

  const handleClick = () => {
    if (!bannerUrl) return;
    if (isExternalUrl(bannerUrl)) {
      window.open(bannerUrl, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = bannerUrl;
    }
  };

  if (!isLoaded || !isVisible || !banner || !bannerText) {
    return null;
  }

  return (
    <>
      <div style={{ height: BANNER_HEIGHT }} />
      <div
        className="fixed top-0 left-0 right-0 z-[60] transition-transform duration-300"
      >
        <div className="relative overflow-hidden bg-[#1240cc]">
          <div
            className={`relative px-4 py-2.5 pr-12 ${bannerUrl ? 'cursor-pointer' : ''}`}
            onClick={bannerUrl ? handleClick : undefined}
          >
            <div className="flex items-center justify-center gap-2 text-sm sm:text-[15px] text-white">
              <span>{bannerText}</span>
              {bannerUrl && (
                <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-white text-[#1240cc] text-xs font-semibold shrink-0">
                  Learn more
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full hover:bg-white/20 transition-colors group"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5 text-white/70 group-hover:text-white transition-colors" />
          </button>
        </div>
      </div>
    </>
  );
}
