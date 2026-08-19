'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronDown, Menu, X, Zap, Shield, BarChart, Bell, Server } from 'lucide-react';
import { trackClick } from '@/lib/datafast';

// Bumping the newest announcement's id makes the unread dot come back for everyone.
const WHATS_NEW_SEEN_KEY = 'infrabox:whats-new-seen';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobileResourcesOpen, setIsMobileResourcesOpen] = useState(false);
  // Assume "seen" until localStorage says otherwise, so the dot never flashes on first paint.
  const [hasSeenLatestAnnouncement, setHasSeenLatestAnnouncement] = useState(true);

  const bellButtonRef = useRef(null);
  const drawerRef = useRef(null);
  const resourcesButtonRef = useRef(null);
  const resourcesKeyboardOpenRef = useRef(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const resourceLinks = [
    { href: "/compare", title: "Compare", item: "compare" },
    { href: "/alternatives", title: "Alternatives", item: "alternatives" },
    { href: "/learn", title: "Learn", item: "learn" },
    { href: "/customer-stories/case-studies", title: "Case Studies", item: "case_studies" }
  ];

  // Newest first. `isNew` is reserved for the last couple of releases.
  const announcements = [
    {
      id: "what-is-infrabox-guide-2026-08",
      title: "Platform Guide Refreshed",
      description: "\"What is Infrabox\" now walks through the whole platform end to end: real Google Workspace, Microsoft 365, and Azure mailboxes, automated DNS, isolated warmup, and InfraGuard monitoring.",
      date: "Aug 19, 2026",
      isNew: true,
      icon: Server,
      href: "/learn/what-is-infrabox"
    },
    {
      id: "case-studies-hub-2026-08",
      title: "Case Studies Hub Is Live",
      description: "See how agencies and sales teams build their sending infrastructure on Infrabox, with the setup and the numbers behind each rollout.",
      date: "Aug 12, 2026",
      isNew: true,
      icon: BarChart,
      href: "/customer-stories/case-studies"
    },
    {
      id: "infraguard-monitoring-2026-07",
      title: "InfraGuard Monitoring, Per Domain",
      description: "InfraGuard checks your domains against blacklists every six hours, watches for DNS drift, and can automatically pause the affected mailboxes when something breaks.",
      date: "Jul 22, 2026",
      isNew: false,
      icon: Shield,
      href: "https://app.infrabox.software/signup?utm_source=whats_new&utm_medium=drawer&utm_campaign=infraguard"
    },
    {
      id: "provider-comparisons-2026-06",
      title: "Side-by-Side Provider Comparisons",
      description: "Head-to-head breakdowns of Infrabox against the other email infrastructure providers, covering pricing, provisioning, and what each plan actually includes.",
      date: "Jun 30, 2026",
      isNew: false,
      icon: Zap,
      href: "/compare"
    }
  ];

  const latestAnnouncementId = announcements[0]?.id ?? '';
  const hasNewAnnouncements = announcements.some((announcement) => announcement.isNew);
  const showUnreadDot = hasNewAnnouncements && !hasSeenLatestAnnouncement;

  // localStorage is only ever touched after mount, never during render.
  useEffect(() => {
    try {
      setHasSeenLatestAnnouncement(window.localStorage.getItem(WHATS_NEW_SEEN_KEY) === latestAnnouncementId);
    } catch {
      // Storage blocked (private mode, embedded context) - fall back to showing the dot.
      setHasSeenLatestAnnouncement(false);
    }
  }, [latestAnnouncementId]);

  const openWhatsNewDrawer = (source) => {
    setIsDrawerOpen(true);
    setHasSeenLatestAnnouncement(true);
    try {
      window.localStorage.setItem(WHATS_NEW_SEEN_KEY, latestAnnouncementId);
    } catch {
      // Nothing to persist to - the dot simply returns on the next page load.
    }
    trackClick(source, { action: 'open_drawer' });
  };

  const closeWhatsNewDrawer = () => {
    setIsDrawerOpen(false);
    bellButtonRef.current?.focus();
  };

  // Global Escape key handler for dropdown and drawer
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (isDrawerOpen) {
          setIsDrawerOpen(false);
          bellButtonRef.current?.focus();
        }
        if (isResourcesOpen) {
          setIsResourcesOpen(false);
          resourcesKeyboardOpenRef.current = false;
          resourcesButtonRef.current?.focus();
        }
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isDrawerOpen, isResourcesOpen]);

  // Drawer focus trap and body scroll lock
  useEffect(() => {
    if (!isDrawerOpen) return;

    document.body.style.overflow = 'hidden';

    const timer = setTimeout(() => {
      const closeBtn = drawerRef.current?.querySelector('button');
      if (closeBtn) closeBtn.focus();
    }, 100);

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab' || !drawerRef.current) return;
      const focusable = drawerRef.current.querySelectorAll(
        'a[href], button, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-4 focus-visible:z-[100] focus-visible:px-4 focus-visible:py-2 focus-visible:bg-[#1240cc] focus-visible:text-white focus-visible:rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1240cc]"
      >
        Skip to main content
      </a>
      <header style={{ top: 'var(--announcement-banner-height, 0px)' }} className="sticky left-0 right-0 z-50 transition-all bg-white duration-300">
        <div className="border-b border-dashed border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 border-x border-gray-200 border-dashed">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <a
              href="/"
              onClick={() => trackClick('header_logo', { destination: 'home' })}
              className="flex items-center gap-3"
              aria-label="Infrabox homepage - Email Deliverability Platform"
            >
              <Image
                src="/logo-horizontal.png"
                alt="Infrabox"
                width={132}
                height={40}
                priority
                className="h-9 lg:h-8 xl:h-10 w-auto"
              />
            </a>


            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8" aria-label="Main navigation">

              <a
                href="/"
                onClick={() => trackClick('header_nav', { item: 'home' })}
                className="text-gray-700 hover:text-black font-medium transition-colors text-sm"
              >
                Home
              </a>

              <a
                href="/learn/what-is-infrabox"
                onClick={() => trackClick('header_nav', { item: 'what_is_infrabox' })}
                className="text-gray-700 hover:text-black font-medium transition-colors text-sm"
              >
                What is Infrabox
              </a>

              {/* Developers - coming soon, intentionally not a link */}
              <span
                className="flex items-center gap-2 text-gray-400 font-medium text-sm cursor-default select-none"
                aria-disabled="true"
              >
                Developers
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  Coming soon
                </span>
              </span>

              {/* Resources Dropdown */}
              <div className="relative" onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  setIsResourcesOpen(false);
                  resourcesKeyboardOpenRef.current = false;
                }
              }}>
                <button
                  ref={resourcesButtonRef}
                  className="flex items-center gap-1 text-gray-700 hover:text-black font-medium transition-colors text-sm"
                  onMouseEnter={() => { resourcesKeyboardOpenRef.current = false; setIsResourcesOpen(true); }}
                  onMouseLeave={() => { if (!resourcesKeyboardOpenRef.current) setIsResourcesOpen(false); }}
                  onClick={() => trackClick('header_nav', { item: 'resources' })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      const willOpen = !isResourcesOpen;
                      setIsResourcesOpen(willOpen);
                      if (willOpen) resourcesKeyboardOpenRef.current = true;
                      trackClick('header_nav', { item: 'resources' });
                    }
                  }}
                  aria-haspopup="true"
                  aria-expanded={isResourcesOpen}
                  aria-controls="resources-dropdown-menu"
                >
                  Resources
                  <ChevronDown className={`h-3 w-3 transition-transform ${isResourcesOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Resources Dropdown Menu */}
                {isResourcesOpen && (
                  <div
                    className="absolute -left-4 top-full pt-2"
                    onMouseEnter={() => setIsResourcesOpen(true)}
                    onMouseLeave={() => { if (!resourcesKeyboardOpenRef.current) setIsResourcesOpen(false); }}
                  >
                    <div id="resources-dropdown-menu" className="w-56 rounded-xl border border-gray-200 border-dashed bg-white p-2 shadow-lg">
                      {resourceLinks.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-[#1240cc]/5 hover:text-[#1240cc]"
                          onClick={() => trackClick('resources_dropdown', { type: 'page', item: link.item })}
                        >
                          {link.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <a href="https://app.infrabox.software/login?utm_source=header_login&utm_medium=button&utm_campaign=navbar" onClick={() => trackClick('header_login', { destination: 'login' })} className="bg-none text-gray-700 px-4 py-2 font-medium rounded-lg transition-colors text-sm">
                  Login
              </a>
              <a
                href="/#book-call"
                className="relative group"
                onClick={() => trackClick('header_book_call', { destination: 'book_call_section' })}
              >
                <div className="absolute -inset-[1px] bg-gradient-to-r from-[#1240cc] via-emerald-500 to-[#1240cc] rounded-full opacity-75 group-hover:opacity-100 animate-gradient-x pointer-events-none"></div>
                <div className="relative flex items-center gap-2 bg-white text-gray-700 px-4 py-2 font-medium rounded-full transition-colors text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                    <path d="m9 16 2 2 4-4" />
                  </svg>
                  Talk to Sales
                </div>
              </a>
              <a href="https://app.infrabox.software/signup?utm_source=header_cta&utm_medium=button&utm_campaign=navbar" onClick={() => trackClick('header_cta', { destination: 'signup' })} className="bg-[#1240cc] hover:bg-[#0b34b4] text-white px-4 py-2 font-medium rounded-full transition-colors text-sm">
                  Get Started
              </a>

              {/* What's New Bell */}
              <button
                ref={bellButtonRef}
                onClick={() => openWhatsNewDrawer('whats_new_bell')}
                className="relative p-2 text-gray-600 hover:text-[#1240cc] border border-gray-200 rounded-full hover:border-[#1240cc]/20 transition-all duration-200"
                aria-label={showUnreadDot ? "What's new notifications, unread updates" : "What's new notifications"}
                aria-expanded={isDrawerOpen}
                aria-controls="whats-new-drawer"
              >
                <Bell className="w-4 h-4" aria-hidden="true" />
                {showUnreadDot && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" aria-hidden="true"></span>
                )}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 text-gray-700 hover:text-black"
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div id="mobile-menu" className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-3">

              <a
                href="/"
                className="block text-gray-700 hover:text-black font-medium py-2 text-sm"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  trackClick('mobile_nav', { item: 'home' });
                }}
              >
                Home
              </a>

              <a
                href="/learn/what-is-infrabox"
                className="block text-gray-700 hover:text-black font-medium py-2 text-sm"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  trackClick('mobile_nav', { item: 'what_is_infrabox' });
                }}
              >
                What is Infrabox
              </a>

              {/* Mobile Developers - coming soon, intentionally not a link */}
              <div
                className="flex items-center gap-2 py-2 text-sm font-medium text-gray-400 cursor-default select-none"
                aria-disabled="true"
              >
                Developers
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  Coming soon
                </span>
              </div>

              {/* Mobile Resources */}
              <div>
                <button
                  className="flex w-full items-center justify-between text-gray-700 hover:text-black font-medium py-2 text-sm"
                  onClick={() => setIsMobileResourcesOpen(!isMobileResourcesOpen)}
                  aria-expanded={isMobileResourcesOpen}
                  aria-controls="mobile-resources-menu"
                >
                  Resources
                  <ChevronDown className={`h-4 w-4 transition-transform ${isMobileResourcesOpen ? 'rotate-180' : ''}`} />
                </button>

                <div id="mobile-resources-menu" className={`overflow-hidden transition-all duration-300 ease-in-out ${isMobileResourcesOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="space-y-1 pl-2 pb-2">
                    {resourceLinks.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        className="block rounded-lg px-2 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-[#1240cc]/5 hover:text-[#1240cc]"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          trackClick('mobile_resources', { type: 'page', item: link.item });
                        }}
                      >
                        {link.title}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200 space-y-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openWhatsNewDrawer('mobile_whats_new_bell');
                  }}
                  className="flex items-center justify-between w-full text-gray-700 hover:text-black font-medium py-2 text-sm"
                  aria-expanded={isDrawerOpen}
                  aria-controls="whats-new-drawer"
                >
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4" aria-hidden="true" />
                    What&apos;s New
                    {showUnreadDot && (
                      <>
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" aria-hidden="true"></span>
                        <span className="sr-only">unread updates</span>
                      </>
                    )}
                  </div>
                </button>
                <a href="https://app.infrabox.software/login" className="block w-full text-center bg-[#1240cc] hover:bg-emerald-700 text-white px-4 py-2 font-medium rounded-lg transition-colors text-sm">
                    Login
                </a>
              </div>
            </div>
          </div>
        )}
        </div>
      </header>

      {/* Side Drawer Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
          onClick={closeWhatsNewDrawer}
          aria-hidden="true"
        />
      )}

      {/* Side Drawer */}
      <div
        ref={drawerRef}
        id="whats-new-drawer"
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg z-50 transform transition-transform duration-200 ease-out ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'} border-l border-gray-200`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="whats-new-title"
        aria-hidden={!isDrawerOpen}
      >
        {/* Header */}
        <div className="px-6 py-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <span id="whats-new-title" className="text-lg font-semibold text-gray-900">What&apos;s New</span>
            <button
              onClick={closeWhatsNewDrawer}
              className="p-1 text-gray-500 hover:text-gray-600 transition-colors"
              aria-label="Close what's new panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 h-full overflow-y-auto">
          <div className="space-y-6">
            {announcements.map((announcement, index) => (
              <div key={announcement.id}>
                <a
                  href={announcement.href}
                  className="group block"
                  onClick={() => {
                    closeWhatsNewDrawer();
                    trackClick('whats_new_drawer', { item: announcement.title });
                  }}
                >
                  <div className="flex items-start gap-3 hover:bg-gray-50 p-3 -m-3 rounded-lg transition-colors">
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      {(() => {
                        const IconComponent = announcement.icon || Bell;
                        return <IconComponent className="w-5 h-5 text-gray-600" />;
                      })()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-1">
                        <span className="font-medium text-gray-900 text-sm">
                          {announcement.title}
                        </span>
                        {announcement.isNew && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {announcement.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {announcement.date}
                      </p>
                    </div>
                  </div>
                </a>
                {index < announcements.length - 1 && (
                  <div className="border-b border-gray-100 my-4"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Remove spacer - Hero section will handle its own top padding */}
    </>
  );
}
