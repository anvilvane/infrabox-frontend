# DataFast Dashboard Tracking Implementation

This guide will help you implement DataFast tracking in your dashboard application (app.infrabox.io) to complete the visitor-to-conversion journey tracking.

## 📋 Quick Setup (5 minutes)

### Step 1: Add DataFast Scripts to Dashboard

Add this to your dashboard's main HTML file (in the `<head>` section):

```html
<!-- DataFast Queue Initialization -->
<script id="datafast-queue">
  window.datafast = window.datafast || function() {
    window.datafast.q = window.datafast.q || [];
    window.datafast.q.push(arguments);
  };
</script>

<!-- DataFast Main Script -->
<script 
  defer
  data-website-id="68a876611a0aec8d89c1d963"
  data-domain="app.infrabox.io"
  src="https://datafa.st/js/script.js"
></script>
```

### Step 2: Add the Tracking Utility

Copy the `lib/dashboard-datafast.js` file to your dashboard project and import it:

```javascript
// In your dashboard app
import { 
  initDataFastDashboard,
  trackSignupCompleted,
  trackDailyActive 
} from './utils/dashboard-datafast';

// Initialize on app load
initDataFastDashboard();
```

### Step 3: Track Essential Events

Add these tracking calls at the appropriate places in your dashboard:

## 🎯 Essential Events to Track

### 1. After Successful Signup
```javascript
import { trackSignupCompleted } from './utils/dashboard-datafast';

// After user creates account
trackSignupCompleted({
  method: 'email',
  referrer: document.referrer
});
```

### 2. After Email Verification
```javascript
import { trackEmailVerified } from './utils/dashboard-datafast';

// When email is verified
trackEmailVerified();
```

### 3. When Domain is Added
```javascript
import { trackDomainAdded } from './utils/dashboard-datafast';

// After domain is successfully added
trackDomainAdded({
  isFirst: true,  // true if this is their first domain
  count: 1        // total domains they have
});
```

### 4. When Mailboxes are Created
```javascript
import { trackMailboxCreated } from './utils/dashboard-datafast';

// After mailbox creation
trackMailboxCreated({
  count: 5,        // number created
  total: 5,        // total they now have
  isFirst: true,   // first time creating mailboxes
  planType: 'trial'
});
```

### 5. When Integration is Connected
```javascript
import { trackIntegrationConnected } from './utils/dashboard-datafast';

// After successful integration
trackIntegrationConnected('smartlead'); // or 'instantly', 'reply', etc.
```

### 6. When First Email is Sent
```javascript
import { trackFirstEmailSent } from './utils/dashboard-datafast';

// After first campaign email
trackFirstEmailSent();
```

### 7. When Payment Method is Added
```javascript
import { trackPaymentMethodAdded } from './utils/dashboard-datafast';

// After card details saved
trackPaymentMethodAdded({
  type: 'card',
  trialActive: true
});
```

### 8. When Subscription Activates
```javascript
import { trackSubscriptionActivated } from './utils/dashboard-datafast';

// After successful payment
trackSubscriptionActivated({
  plan: 'agency',
  billingPeriod: 'monthly',
  price: 99,
  mailboxCount: 50
});
```

### 9. Track Daily Active Users
```javascript
import { trackDailyActive } from './utils/dashboard-datafast';

// On dashboard page load
useEffect(() => {
  trackDailyActive(user.id); // Will be hashed for privacy
}, []);
```

### 10. Track Feature Usage
```javascript
import { trackFeatureUsed } from './utils/dashboard-datafast';

// When user uses a feature
trackFeatureUsed('dns_checker', {
  domain: 'example.com'
});
```

## 🔴 Track Drop-off Points

### Track Errors
```javascript
import { trackError } from './utils/dashboard-datafast';

// When errors occur
trackError('integration_failed', {
  message: 'Authentication failed',
  platform: 'instantly'
});
```

### Track Limits Reached
```javascript
import { trackLimitReached } from './utils/dashboard-datafast';

// When user hits plan limits
trackLimitReached('mailbox_limit');
```

### Track Plan Upgrades
```javascript
import { trackPlanUpgraded } from './utils/dashboard-datafast';

// When user upgrades
trackPlanUpgraded({
  fromPlan: 'professional',
  toPlan: 'agency',
  reason: 'needed_more_mailboxes',
  price: 99
});
```

### Track Cancellations
```javascript
import { trackSubscriptionCancelled } from './utils/dashboard-datafast';

// When user cancels
trackSubscriptionCancelled('too_expensive'); // or other reason
```

## 📊 Complete Conversion Funnel

With these events, you can track the complete funnel:

1. **Landing Page Visit** → `page_viewed` (marketing site)
2. **Signup Click** → `hero_cta_clicked` (marketing site)
3. **Account Created** → `signup_completed` (dashboard)
4. **Email Verified** → `email_verified` (dashboard)
5. **Domain Added** → `domain_added` (dashboard)
6. **Mailbox Created** → `mailbox_created` (dashboard)
7. **Integration Connected** → `integration_connected` (dashboard)
8. **First Email Sent** → `first_email_sent` (dashboard)
9. **Payment Added** → `payment_method_added` (dashboard)
10. **Subscription Active** → `subscription_activated` (dashboard)

## ✅ Testing Your Implementation

### 1. Check Browser Console
Open browser console and verify no errors when events fire.

### 2. Check Network Tab
1. Open Developer Tools → Network tab
2. Filter by "datafa.st" 
3. Perform actions and verify requests are sent
4. Check request payload contains your event data

### 3. Check DataFast Dashboard
1. Go to your DataFast dashboard
2. Check Real-time events
3. Verify events are appearing with correct data

## 🔗 UTM Parameter Tracking

The tracking automatically captures UTM parameters from the URL. Make sure your marketing site links include them:

```javascript
// Marketing site links should include UTM params:
`https://app.infrabox.io/signup?utm_source=hero_cta&utm_campaign=landing`
`https://app.infrabox.io/signup?utm_source=pricing_agency&utm_campaign=landing`
`https://app.infrabox.io/signup?utm_source=calculator&utm_campaign=landing`
```

## 💡 Best Practices

1. **Track immediately** - Don't wait for animations or redirects
2. **Include context** - Add relevant metadata to events
3. **Be consistent** - Use the same event names across your app
4. **Test thoroughly** - Verify events fire in all scenarios
5. **Handle errors** - Track failures to identify issues

## 📈 Key Metrics You Can Now Measure

- **Activation Rate**: Signups that create first mailbox
- **Time to Value**: Hours from signup to first email
- **Conversion Rate**: Trials that become paid
- **Feature Adoption**: % using each integration
- **Churn Points**: Where users drop off
- **Revenue Attribution**: Which sources convert best

## 🚀 Next Steps

1. Implement the tracking code in your dashboard
2. Test all events are firing correctly
3. Set up funnels in DataFast dashboard
4. Monitor conversion rates
5. Optimize based on data insights

## 📞 Need Help?

- Check DataFast documentation: https://datafa.st/docs
- Review the `dashboard-datafast.js` file for all available functions
- Test events in development before deploying to production