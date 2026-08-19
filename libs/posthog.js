// PostHog Analytics Utility for Landing Page
// Matches structure from app.infrabox.software implementation

/**
 * Track a custom event
 * @param {string} eventName - Name of the event
 * @param {object} properties - Additional properties to track
 */
export const trackEvent = (eventName, properties = {}) => {
  if (typeof window !== 'undefined' && window.posthog) {
    window.posthog.capture(eventName, properties);
  }
};

/**
 * Track page view (for manual tracking if needed)
 * @param {string} pageName - Name of the page
 * @param {object} properties - Additional properties
 */
export const trackPageView = (pageName, properties = {}) => {
  if (typeof window !== 'undefined' && window.posthog) {
    window.posthog.capture('$pageview', {
      page_name: pageName,
      $current_url: window.location.href,
      ...properties
    });
  }
};

// Pre-defined event names for landing page (consistent with app)
export const EVENTS = {
  // CTA Events
  CTA_CLICKED: 'cta_clicked',

  // Landing Page Engagement
  PRICING_VIEWED: 'pricing_viewed',
  FAQ_EXPANDED: 'faq_expanded',
  FEATURE_VIEWED: 'feature_viewed',

  // Conversion Intent
  BOOK_CALL_CLICKED: 'book_call_clicked',
  DEMO_REQUESTED: 'demo_requested'
};
