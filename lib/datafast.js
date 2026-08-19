/**
 * DataFast Analytics Utility Library
 * Centralized tracking functions for Infrabox
 */

/**
 * Track a custom goal with DataFast
 * @param {string} goalName - Name of the goal (lowercase, max 32 chars)
 * @param {Object} metadata - Optional metadata (max 10 properties)
 * @returns {void}
 */
export function trackGoal(goalName, metadata = {}) {
  try {
    // Ensure DataFast is available
    if (typeof window !== 'undefined' && window.datafast) {
      // Validate goal name
      if (!goalName || typeof goalName !== 'string') {
        return;
      }

      // Sanitize goal name (lowercase, replace spaces with underscores)
      const sanitizedGoalName = goalName
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_-]/g, '')
        .substring(0, 32);

      // Validate and sanitize metadata
      const sanitizedMetadata = {};
      if (metadata && typeof metadata === 'object') {
        const entries = Object.entries(metadata).slice(0, 10); // Max 10 properties
        
        for (const [key, value] of entries) {
          // Sanitize property names
          const sanitizedKey = key
            .toLowerCase()
            .replace(/\s+/g, '_')
            .replace(/[^a-z0-9_-]/g, '')
            .substring(0, 32);
          
          // Sanitize property values (convert to string, max 255 chars)
          const sanitizedValue = String(value).substring(0, 255);
          
          if (sanitizedKey && sanitizedValue) {
            sanitizedMetadata[sanitizedKey] = sanitizedValue;
          }
        }
      }

      // Send the goal to DataFast
      if (Object.keys(sanitizedMetadata).length > 0) {
        window.datafast(sanitizedGoalName, sanitizedMetadata);
      } else {
        window.datafast(sanitizedGoalName);
      }
    }
  } catch (error) {
    // Silently fail in production
  }
}

/**
 * Track a click event
 * @param {string} elementName - Name of the element clicked
 * @param {Object} additionalData - Additional context data
 */
export function trackClick(elementName, additionalData = {}) {
  const metadata = {
    element: elementName,
    timestamp: new Date().toISOString(),
    ...additionalData
  };
  trackGoal(`${elementName}_clicked`, metadata);
}

/**
 * Track scroll depth for a section
 * @param {string} sectionName - Name of the section
 * @param {number} scrollDepth - Percentage of scroll depth (0-100)
 */
export function trackScrollDepth(sectionName, scrollDepth = 50) {
  trackGoal(`scroll_${sectionName}`, {
    section: sectionName,
    scroll_depth: Math.round(scrollDepth)
  });
}

/**
 * Track form interactions
 * @param {string} formName - Name of the form
 * @param {string} action - Action performed (started, completed, abandoned)
 * @param {Object} formData - Optional form data
 */
export function trackForm(formName, action, formData = {}) {
  trackGoal(`${formName}_${action}`, {
    form: formName,
    action: action,
    ...formData
  });
}

/**
 * Track tool usage
 * @param {string} toolName - Name of the tool
 * @param {string} action - Action performed
 * @param {Object} toolData - Tool-specific data
 */
export function trackTool(toolName, action, toolData = {}) {
  trackGoal(`tool_${action}`, {
    tool_name: toolName,
    ...toolData
  });
}

/**
 * Track pricing interactions
 * @param {string} action - Action performed
 * @param {Object} pricingData - Pricing-specific data
 */
export function trackPricing(action, pricingData = {}) {
  trackGoal(`pricing_${action}`, pricingData);
}

/**
 * Track calculator usage
 * @param {string} action - Action performed
 * @param {Object} calculatorData - Calculator-specific data
 */
export function trackCalculator(action, calculatorData = {}) {
  trackGoal(`calculator_${action}`, calculatorData);
}

/**
 * Track page views with additional context
 * @param {string} pageName - Name of the page
 * @param {Object} pageData - Page-specific data
 */
export function trackPageView(pageName, pageData = {}) {
  trackGoal(`page_viewed`, {
    page: pageName,
    url: typeof window !== 'undefined' ? window.location.pathname : '',
    ...pageData
  });
}

/**
 * Track time spent on page (call this at intervals)
 * @param {string} pageName - Name of the page
 * @param {number} seconds - Seconds spent on page
 */
export function trackTimeOnPage(pageName, seconds) {
  if (seconds % 30 === 0 && seconds > 0) { // Track every 30 seconds
    trackGoal('time_on_page', {
      page: pageName,
      duration_seconds: seconds
    });
  }
}

/**
 * Track signup flow
 * @param {string} step - Step in signup process
 * @param {Object} signupData - Signup-specific data
 */
export function trackSignup(step, signupData = {}) {
  trackGoal(`signup_${step}`, signupData);
}

/**
 * Track resource engagement (guides, case studies, blog)
 * @param {string} resourceType - Type of resource
 * @param {string} action - Action performed
 * @param {Object} resourceData - Resource-specific data
 */
export function trackResource(resourceType, action, resourceData = {}) {
  trackGoal(`${resourceType}_${action}`, resourceData);
}

/**
 * Debounce function for scroll events
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 */
export function debounce(func, wait = 250) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Get visitor ID from DataFast (if available)
 * @returns {string|null} Visitor ID or null
 */
export function getVisitorId() {
  try {
    // Check for DataFast visitor ID in cookies
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'datafast_visitor_id') {
          return value;
        }
      }
    }
  } catch (error) {
    // Silently fail in production
  }
  return null;
}

/**
 * Track conversion funnel step
 * @param {string} funnelName - Name of the funnel
 * @param {number} step - Step number
 * @param {string} stepName - Name of the step
 * @param {Object} stepData - Step-specific data
 */
export function trackFunnelStep(funnelName, step, stepName, stepData = {}) {
  trackGoal(`funnel_${funnelName}_step_${step}`, {
    funnel: funnelName,
    step: step,
    step_name: stepName,
    ...stepData
  });
}

/**
 * Track errors and issues
 * @param {string} errorType - Type of error
 * @param {string} errorMessage - Error message
 * @param {Object} errorData - Additional error data
 */
export function trackError(errorType, errorMessage, errorData = {}) {
  trackGoal(`error_${errorType}`, {
    message: errorMessage,
    ...errorData
  });
}

/**
 * Initialize DataFast tracking for a page
 * Sets up common tracking like page view and time on page
 * @param {string} pageName - Name of the page
 */
export function initializePageTracking(pageName) {
  if (typeof window === 'undefined') return;

  // Track page view
  trackPageView(pageName);

  // Track time on page - fire once when user leaves
  const startTime = Date.now();
  let tracked = false;

  const handleUnload = () => {
    if (tracked) return;
    tracked = true;
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    if (timeSpent > 0) {
      trackTimeOnPage(pageName, timeSpent);
    }
  };

  window.addEventListener('beforeunload', handleUnload);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      handleUnload();
    }
  });
}

// Export all functions as default object as well
export default {
  trackGoal,
  trackClick,
  trackScrollDepth,
  trackForm,
  trackTool,
  trackPricing,
  trackCalculator,
  trackPageView,
  trackTimeOnPage,
  trackSignup,
  trackResource,
  trackFunnelStep,
  trackError,
  debounce,
  getVisitorId,
  initializePageTracking
};