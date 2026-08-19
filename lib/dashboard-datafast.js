/**
 * DataFast Dashboard Tracking Utility
 * Use this file in your dashboard application at app.infrabox.software
 * to complete the visitor-to-conversion journey tracking
 */

/**
 * Initialize DataFast tracking for dashboard
 * Add this to your dashboard's main layout/app file
 */
export const initDataFastDashboard = () => {
  // DataFast queue initialization (ensures no events are lost)
  if (typeof window !== 'undefined') {
    window.datafast = window.datafast || function() {
      window.datafast.q = window.datafast.q || [];
      window.datafast.q.push(arguments);
    };
  }
};

/**
 * Track dashboard events with DataFast
 * @param {string} eventName - Name of the event (lowercase, underscores)
 * @param {Object} eventData - Event metadata (max 10 properties)
 */
export const trackDashboard = (eventName, eventData = {}) => {
  try {
    if (typeof window !== 'undefined' && window.datafast) {
      // Add timestamp and source
      const enrichedData = {
        source: 'dashboard',
        timestamp: new Date().toISOString(),
        ...eventData
      };

      // Remove any undefined values and limit to 10 properties
      const cleanData = {};
      const entries = Object.entries(enrichedData).slice(0, 10);
      
      for (const [key, value] of entries) {
        if (value !== undefined && value !== null) {
          // Ensure property names are clean (lowercase, underscores)
          const cleanKey = key.toLowerCase().replace(/[^a-z0-9_-]/g, '_').substring(0, 32);
          // Ensure values are strings and limited to 255 chars
          const cleanValue = String(value).substring(0, 255);
          cleanData[cleanKey] = cleanValue;
        }
      }

      // Send to DataFast
      window.datafast(eventName, cleanData);
    }
  } catch (error) {
    // Silently fail in production
  }
};

/**
 * Track user signup completion
 * Call this after successful account creation
 */
export const trackSignupCompleted = (userData = {}) => {
  trackDashboard('signup_completed', {
    method: userData.method || 'email',
    referrer: userData.referrer || document.referrer,
    utm_source: getUTMParam('utm_source'),
    utm_campaign: getUTMParam('utm_campaign')
  });
};

/**
 * Track email verification
 * Call this when user verifies their email
 */
export const trackEmailVerified = () => {
  trackDashboard('email_verified');
};

/**
 * Track domain addition
 * Call this when user adds a domain
 */
export const trackDomainAdded = (domainData = {}) => {
  trackDashboard('domain_added', {
    is_first_domain: domainData.isFirst || false,
    domain_count: domainData.count || 1
  });
};

/**
 * Track mailbox creation
 * Call this when user creates mailboxes
 */
export const trackMailboxCreated = (mailboxData = {}) => {
  trackDashboard('mailbox_created', {
    count: mailboxData.count || 1,
    total_mailboxes: mailboxData.total || 1,
    is_first: mailboxData.isFirst || false,
    plan_type: mailboxData.planType || 'trial'
  });
};

/**
 * Track integration connection
 * Call this when user connects an email platform
 */
export const trackIntegrationConnected = (platform) => {
  trackDashboard('integration_connected', {
    platform: platform.toLowerCase(),
    setup_time: new Date().toISOString()
  });
};

/**
 * Track first email sent
 * Call this when user sends their first email campaign
 */
export const trackFirstEmailSent = () => {
  trackDashboard('first_email_sent', {
    time_to_value: calculateTimeToValue()
  });
};

/**
 * Track trial start
 * Call this when user starts their trial
 */
export const trackTrialStarted = (planType = 'professional') => {
  trackDashboard('trial_started', {
    plan: planType,
    trial_days: '7'
  });
};

/**
 * Track payment method addition
 * Call this when user adds payment details
 */
export const trackPaymentMethodAdded = (paymentData = {}) => {
  trackDashboard('payment_method_added', {
    type: paymentData.type || 'card',
    trial_active: paymentData.trialActive || true
  });
};

/**
 * Track subscription activation
 * Call this when user's subscription becomes active
 */
export const trackSubscriptionActivated = (subscriptionData = {}) => {
  trackDashboard('subscription_activated', {
    plan: subscriptionData.plan || 'professional',
    billing_period: subscriptionData.billingPeriod || 'monthly',
    price: subscriptionData.price || 0,
    mailbox_count: subscriptionData.mailboxCount || 12
  });
};

/**
 * Track daily active user
 * Call this on dashboard page load
 */
export const trackDailyActive = (userId) => {
  // Hash the user ID for privacy
  const hashedId = userId ? hashUserId(userId) : 'anonymous';
  
  trackDashboard('dashboard_viewed', {
    user_id: hashedId,
    session_start: new Date().toISOString()
  });
};

/**
 * Track feature usage
 * Call this when user uses specific features
 */
export const trackFeatureUsed = (featureName, featureData = {}) => {
  trackDashboard(`feature_${featureName.toLowerCase()}`, featureData);
};

/**
 * Track errors and issues
 * Call this when errors occur
 */
export const trackError = (errorType, errorData = {}) => {
  trackDashboard('error_occurred', {
    error_type: errorType,
    error_message: errorData.message || 'Unknown error',
    error_page: window.location.pathname,
    ...errorData
  });
};

/**
 * Track user limits and upgrades
 * Call when user hits plan limits
 */
export const trackLimitReached = (limitType) => {
  trackDashboard('limit_reached', {
    limit_type: limitType,
    current_plan: getCurrentPlan(),
    upgrade_prompt_shown: true
  });
};

/**
 * Track plan upgrades
 * Call when user upgrades their plan
 */
export const trackPlanUpgraded = (upgradeData = {}) => {
  trackDashboard('plan_upgraded', {
    from_plan: upgradeData.fromPlan || 'trial',
    to_plan: upgradeData.toPlan || 'professional',
    reason: upgradeData.reason || 'limit_reached',
    new_price: upgradeData.price || 0
  });
};

/**
 * Track cancellations
 * Call when user cancels subscription
 */
export const trackSubscriptionCancelled = (reason = 'unknown') => {
  trackDashboard('subscription_cancelled', {
    cancellation_reason: reason,
    plan_type: getCurrentPlan(),
    days_active: getDaysActive()
  });
};

// Helper functions

/**
 * Get UTM parameter from URL
 */
function getUTMParam(param) {
  if (typeof window === 'undefined') return null;
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param) || null;
}

/**
 * Simple hash function for user ID privacy
 */
function hashUserId(userId) {
  if (!userId) return 'anonymous';
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `user_${Math.abs(hash)}`;
}

/**
 * Calculate time from signup to first value
 */
function calculateTimeToValue() {
  // This should be calculated based on actual signup time
  // For now, return a placeholder
  return 'calculated_on_server';
}

/**
 * Get current plan (should be fetched from your app state)
 */
function getCurrentPlan() {
  // Replace with actual plan detection
  return 'professional';
}

/**
 * Get days since signup (should be calculated from actual data)
 */
function getDaysActive() {
  // Replace with actual calculation
  return '30';
}

// Export all functions for use in dashboard
export default {
  initDataFastDashboard,
  trackDashboard,
  trackSignupCompleted,
  trackEmailVerified,
  trackDomainAdded,
  trackMailboxCreated,
  trackIntegrationConnected,
  trackFirstEmailSent,
  trackTrialStarted,
  trackPaymentMethodAdded,
  trackSubscriptionActivated,
  trackDailyActive,
  trackFeatureUsed,
  trackError,
  trackLimitReached,
  trackPlanUpgraded,
  trackSubscriptionCancelled
};