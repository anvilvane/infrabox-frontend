'use client';

import { useEffect } from 'react';
import { trackResource, trackScrollDepth, debounce } from '@/lib/datafast';

/**
 * Blog Analytics Component
 * Tracks blog post views, reading time, and engagement
 */
export default function BlogAnalytics({ postSlug, postTitle, category }) {
  useEffect(() => {
    // Track blog post view
    trackResource('blog', 'viewed', {
      post_slug: postSlug,
      post_title: postTitle,
      category: category,
    });

    // Track reading progress
    let timeSpent = 0;
    const timeInterval = setInterval(() => {
      timeSpent += 15; // Track every 15 seconds

      if (timeSpent % 30 === 0) {
        // Log every 30 seconds
        trackResource('blog', 'reading', {
          post_slug: postSlug,
          time_spent: timeSpent,
        });
      }

      // Stop tracking after 10 minutes
      if (timeSpent >= 600) {
        clearInterval(timeInterval);
      }
    }, 15000);

    // Track scroll depth
    let maxScrollDepth = 0;
    const handleScroll = debounce(() => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || window.pageYOffset;
      const scrollPercentage = Math.round(
        ((scrollTop + windowHeight) / documentHeight) * 100
      );

      // Track milestones: 25%, 50%, 75%, 100%
      if (scrollPercentage > maxScrollDepth) {
        maxScrollDepth = scrollPercentage;

        if (scrollPercentage >= 25 && scrollPercentage < 50 && maxScrollDepth < 50) {
          trackScrollDepth(`blog_${postSlug}`, 25);
        } else if (scrollPercentage >= 50 && scrollPercentage < 75 && maxScrollDepth < 75) {
          trackScrollDepth(`blog_${postSlug}`, 50);
        } else if (scrollPercentage >= 75 && scrollPercentage < 100 && maxScrollDepth < 100) {
          trackScrollDepth(`blog_${postSlug}`, 75);
        } else if (scrollPercentage >= 100) {
          trackScrollDepth(`blog_${postSlug}`, 100);
          trackResource('blog', 'completed', {
            post_slug: postSlug,
            post_title: postTitle,
          });
        }
      }
    }, 500);

    window.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => {
      clearInterval(timeInterval);
      window.removeEventListener('scroll', handleScroll);

      // Track final time spent on page
      if (timeSpent > 0) {
        trackResource('blog', 'exit', {
          post_slug: postSlug,
          time_spent: timeSpent,
          scroll_depth: maxScrollDepth,
        });
      }
    };
  }, [postSlug, postTitle, category]);

  return null; // This component doesn't render anything
}
