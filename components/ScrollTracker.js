'use client'

import { useEffect, useRef } from 'react';
import { trackScrollDepth, debounce } from '@/lib/datafast';

/**
 * ScrollTracker Component
 * Tracks when sections of the page become visible
 */
export default function ScrollTracker({ children, sections = [] }) {
  const trackedSections = useRef(new Set());
  const sectionRefs = useRef({});

  useEffect(() => {
    // Create an intersection observer with 50% threshold
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Check if section is at least 50% visible
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const sectionId = entry.target.id || entry.target.dataset.trackingId;
            
            // Only track each section once per session
            if (sectionId && !trackedSections.current.has(sectionId)) {
              trackedSections.current.add(sectionId);
              
              // Track the scroll milestone
              const scrollDepth = Math.round(entry.intersectionRatio * 100);
              trackScrollDepth(sectionId, scrollDepth);
            }
          }
        });
      },
      { 
        threshold: [0.25, 0.5, 0.75, 1.0], // Multiple thresholds for more granular tracking
        rootMargin: '0px'
      }
    );

    // Observe all sections with tracking IDs
    const sectionsToObserve = document.querySelectorAll('[data-tracking-id]');
    sectionsToObserve.forEach(section => {
      observer.observe(section);
    });

    // Also observe sections by ID if provided
    sections.forEach(sectionId => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.setAttribute('data-tracking-id', sectionId);
        observer.observe(element);
      }
    });

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, [sections]);

  // Track overall scroll depth percentage
  useEffect(() => {
    const trackOverallScroll = debounce(() => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollPercentage = Math.round((scrollTop + windowHeight) / documentHeight * 100);

      // Track milestone scroll depths
      if (scrollPercentage >= 25 && !trackedSections.current.has('page_scroll_25')) {
        trackedSections.current.add('page_scroll_25');
        trackScrollDepth('page', 25);
      }
      if (scrollPercentage >= 50 && !trackedSections.current.has('page_scroll_50')) {
        trackedSections.current.add('page_scroll_50');
        trackScrollDepth('page', 50);
      }
      if (scrollPercentage >= 75 && !trackedSections.current.has('page_scroll_75')) {
        trackedSections.current.add('page_scroll_75');
        trackScrollDepth('page', 75);
      }
      if (scrollPercentage >= 95 && !trackedSections.current.has('page_scroll_100')) {
        trackedSections.current.add('page_scroll_100');
        trackScrollDepth('page', 100);
      }
    }, 250);

    window.addEventListener('scroll', trackOverallScroll);
    
    return () => {
      window.removeEventListener('scroll', trackOverallScroll);
    };
  }, []);

  return <>{children}</>;
}

/**
 * Hook to track scroll depth for a specific element
 */
export function useScrollTracking(elementId, trackingName) {
  const elementRef = useRef(null);
  const hasTracked = useRef(false);

  useEffect(() => {
    if (!elementRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5 && !hasTracked.current) {
            hasTracked.current = true;
            trackScrollDepth(trackingName || elementId, Math.round(entry.intersectionRatio * 100));
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(elementRef.current);

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [elementId, trackingName]);

  return elementRef;
}