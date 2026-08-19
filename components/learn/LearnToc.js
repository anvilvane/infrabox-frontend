'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function LearnToc({ items }) {
  const [activeId, setActiveId] = useState('');
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const tocRef = useRef(null);
  const activeRef = useRef(null);
  const navRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 0 });

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);

      const footer = document.querySelector('footer');
      if (footer) {
        const footerTop = footer.getBoundingClientRect().top;
        setVisible(footerTop > window.innerHeight);
      }

      const offsets = items
        .map((item) => {
          const el = document.getElementById(item.id);
          if (!el) return null;
          return { id: item.id, top: el.getBoundingClientRect().top };
        })
        .filter(Boolean);

      let current = '';
      for (const offset of offsets) {
        if (offset.top <= 120) {
          current = offset.id;
        }
      }
      if (current) {
        setActiveId(current);
      } else if (offsets.length > 0 && offsets[0].top > 0) {
        setActiveId(offsets[0].id);
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  // Measure active element position for sliding indicator
  useEffect(() => {
    if (activeRef.current && navRef.current) {
      const navRect = navRef.current.getBoundingClientRect();
      const elRect = activeRef.current.getBoundingClientRect();
      setIndicatorStyle({
        top: elRect.top - navRect.top,
        height: elRect.height,
      });
    }
  }, [activeId]);

  // Scroll active into view
  useEffect(() => {
    if (activeRef.current && tocRef.current) {
      const container = tocRef.current;
      const el = activeRef.current;
      const cRect = container.getBoundingClientRect();
      const eRect = el.getBoundingClientRect();
      if (eRect.top < cRect.top || eRect.bottom > cRect.bottom) {
        el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [activeId]);

  const handleClick = useCallback((e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', `#${id}`);
    }
  }, []);

  return (
    <>
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-gray-100"
        initial={false}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-[#1240cc] to-[#2060f0]"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        />
      </motion.div>

      {/* TOC */}
      <div
        ref={tocRef}
        className={`p-6 pt-16 transition-opacity duration-300 ${
          visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <p className="font-mono text-[9px] text-gray-400 uppercase tracking-[0.15em] mb-5 flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 6h16M4 12h10M4 18h14" strokeLinecap="round"/>
          </svg>
          On this page
        </p>

        <nav ref={navRef} className="relative">
          {/* Static track line */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200" />

          {/* Sliding active indicator */}
          <AnimatePresence>
            {activeId && (
              <motion.div
                className="absolute left-0 w-[3px] rounded-full bg-[#1240cc]"
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{
                  opacity: 1,
                  scaleY: 1,
                  top: indicatorStyle.top + 6,
                  height: indicatorStyle.height - 12,
                }}
                exit={{ opacity: 0, scaleY: 0 }}
                transition={{
                  top: { type: 'spring', stiffness: 300, damping: 30 },
                  height: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                  scaleY: { duration: 0.2 },
                }}
                style={{ originY: 0.5 }}
              />
            )}
          </AnimatePresence>

          {/* Sliding active background */}
          <AnimatePresence>
            {activeId && (
              <motion.div
                className="absolute left-0 right-0 bg-[#1240cc]/5 rounded-r-md -z-10"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  top: indicatorStyle.top,
                  height: indicatorStyle.height,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  top: { type: 'spring', stiffness: 300, damping: 30 },
                  height: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.15 },
                }}
              />
            )}
          </AnimatePresence>

          <div className="space-y-px">
            {items.map((item) => {
              const isActive = activeId === item.id;
              return (
                <a
                  key={item.id}
                  ref={isActive ? activeRef : null}
                  href={`#${item.id}`}
                  onClick={(e) => handleClick(e, item.id)}
                  className={`group relative block text-[12px] leading-snug pl-4 pr-2 py-[7px] transition-colors duration-200 ${
                    isActive
                      ? 'text-[#1240cc] font-medium'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title={item.label}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        </nav>

        {/* Separator */}
        <div className="my-6 border-t border-gray-100" />

        {/* CTA */}
        <div className="-mx-2 p-5 bg-[#1240cc] rounded-xl">
          <img src="/logo.png" alt="Infrabox" className="h-5 w-auto brightness-0 invert mb-3" />
          <p className="text-[11px] text-white/60 mb-4 leading-relaxed">
            Plans from $39/mo for 10 mailboxes. Scale with Agency and Enterprise tiers.
          </p>
          <a
            href="https://app.infrabox.software/signup"
            className="block text-center text-[11px] font-semibold text-[#1240cc] bg-white hover:bg-gray-100 active:bg-gray-200 px-3 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            Get Started &rarr;
          </a>
        </div>
      </div>
    </>
  );
}
