export const article = {
  slug: "infrabox-api-integration-guide",
  title:
    "Infrabox API Integration Guide",
  metaDescription:
    "Complete Infrabox API guide with 70+ endpoints. Orders, domains, mailboxes, Cloudflare integration, webhooks, DNS, warmup, and inbox placement.",
  headline: "Infrabox API Integration Guide",
  publishedAt: "2026-04-01",
  updatedAt: "2026-04-01",
  author: "Mohit Mimani",
  category: "Guides",
  readingTime: "25 min read",
  tags: [
    "Infrabox API",
    "email infrastructure API",
    "REST API",
    "automation",
    "webhooks",
    "mailbox provisioning",
    "domain management",
    "developer guide",
    "Cloudflare integration",
  ],
  excerpt:
    "Infrabox exposes 70+ REST API endpoints across 14 categories including orders, domains, mailboxes, Cloudflare integration, webhooks, DNS, warmup, inbox placement, and more. This guide covers authentication, real request/response examples, rate limits, and a complete endpoint reference for developers and agencies automating email infrastructure at scale.",
  type: "educational",
  sections: [
    {
      heading: "API Overview and Getting Started",
      content: `Infrabox provides a full REST API with **70+ public endpoints across 14 categories**, giving you full programmatic control over your email infrastructure. Everything you can do in the dashboard: ordering domains, provisioning mailboxes, configuring DNS, managing warmup, running inbox placement tests, you can automate through the API.

**API categories at a glance:**

| Category | Endpoints | What It Covers |
|----------|-----------|----------------|
| **Orders** | 2 | Place orders for domain registration + mailbox provisioning |
| **Workspaces** | 6 | Create, list, update, delete workspaces; configure webhooks |
| **Domains** | 16 | Search, register, configure forwarding, catch-all, DMARC, nameservers |
| **Cloudflare Domains** | 5 | Connect, list, disconnect Cloudflare-managed domains |
| **Mailboxes** | 14 | Create, list, manage credentials, signatures, profile pictures, TOTP |
| **DNS** | Multiple | DNS record management and validation |
| **Warmup** | Multiple | Warmup subscription management |
| **Tags** | Multiple | Tag management for organizing resources |
| **Webhooks** | 1 | Status change notifications |
| **Account** | 1 | Account details |
| **Inbox Placement** | Multiple | Deliverability testing and monitoring |
| **InfraGuard** | Multiple | Infrastructure health monitoring |
| **Email Insights** | 14 | Mailbox analytics and reporting |
| **Prewarm** | Multiple | Pre-warming service |

**Base URL:** \`https://api.infrabox.software/v1\`

**Getting your API key:**
1. Log in to the Infrabox Dashboard at [app.infrabox.software](https://app.infrabox.software)
2. Navigate to **Settings > API & Integrations**
3. Click **Generate New Key**
4. Copy the key immediately. It will not be shown again

**Quick test: verify your API key works:**

\`\`\`bash
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://api.infrabox.software/v1/api/account
\`\`\`

If you receive a 200 response with your account details, you are authenticated and ready to go. Full API reference: [docs.infrabox.software](https://docs.infrabox.software)`,
      callout: {
        variant: "info",
        title: "Workspace-Scoped Operations",
        text: 'Most API operations are workspace-scoped and require the X-Workspace-Id header in addition to your API key. Retrieve your workspace IDs via GET /v1/api/workspaces, then pass the appropriate ID with every request.',
      },
    },
    {
      heading: "Authentication and Rate Limits",
      content: `All API requests require a Bearer token passed in the \`Authorization\` header. Additionally, workspace-scoped operations require the \`X-Workspace-Id\` header.

**Required headers:**

\`\`\`bash
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
X-Workspace-Id: your-workspace-uid   # Required for workspace-scoped operations
\`\`\`

**JavaScript example with all required headers:**

\`\`\`javascript
const INFRABOX_BASE = 'https://api.infrabox.software/v1';

async function infraboxRequest(path, options = {}) {
  const response = await fetch(\`\${INFRABOX_BASE}\${path}\`, {
    ...options,
    headers: {
      'Authorization': \`Bearer \${process.env.INFRABOX_API_KEY}\`,
      'Content-Type': 'application/json',
      'X-Workspace-Id': process.env.INFRABOX_WORKSPACE_ID,
      ...options.headers,
    },
  });

  if (response.status === 429) {
    const resetAt = response.headers.get('X-RateLimit-Reset');
    const waitMs = (Number(resetAt) * 1000) - Date.now();
    console.log(\`Rate limited. Retrying in \${Math.ceil(waitMs / 1000)}s\`);
    await new Promise(r => setTimeout(r, Math.max(waitMs, 1000)));
    return infraboxRequest(path, options);
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(\`Infrabox API error \${response.status}: \${JSON.stringify(error)}\`);
  }

  return response.json();
}

// Usage
const account = await infraboxRequest('/api/account');
const workspaces = await infraboxRequest('/api/workspaces');
\`\`\`

**Rate limits by operation type:**

| Operation | Rate Limit |
|-----------|-----------|
| Standard API calls | 10 requests/second, 100 requests/minute |
| Domain availability checks | 20 requests/hour |
| Bulk mailbox provisioning | 5 requests/minute |
| Reputation monitoring | 50 requests/hour |

**Rate limit response headers:**
- \`X-RateLimit-Remaining\`: requests left in the current window
- \`X-RateLimit-Reset\`: Unix timestamp when the window resets

When you exceed a rate limit, the API returns HTTP 429 with these headers. Implement exponential backoff: wait 1 second on the first retry, 2 seconds on the second, 4 on the third, up to a maximum of 60 seconds.

**Common error codes:**

| Status | Meaning | Action |
|--------|---------|--------|
| **401** | Invalid or missing API key | Verify your Authorization header |
| **403** | Insufficient permissions | Check API key scope and workspace access |
| **404** | Resource not found | Verify the resource ID or path |
| **422** | Validation error | Check required fields in request body |
| **429** | Rate limit exceeded | Wait for X-RateLimit-Reset and retry |
| **500** | Server error | Retry with exponential backoff |`,
    },
    {
      heading: "Orders API: Domain Registration and Mailbox Provisioning",
      content: `The Orders API is the primary way to provision new email infrastructure. A single order can register domains and create mailboxes across Google Workspace, Microsoft 365, and Azure, all in one API call.

**Create an order: POST /v1/api/orders**

\`\`\`bash
curl -X POST https://api.infrabox.software/v1/api/orders \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -H "X-Workspace-Id: your-workspace-uid" \\
  -d '{
    "domains": [
      {
        "name": "outreach-leads.com",
        "redirect_url": "https://yourcompany.com",
        "registration_years": 1,
        "mailboxes": [
          {
            "first_name": "Sarah",
            "last_name": "Johnson",
            "email": "sarah@outreach-leads.com",
            "platform": "GOOGLE"
          },
          {
            "first_name": "Mike",
            "last_name": "Chen",
            "email": "mike@outreach-leads.com",
            "platform": "GOOGLE"
          }
        ]
      },
      {
        "name": "sales-connect.io",
        "redirect_url": "https://yourcompany.com",
        "mailboxes": [
          {
            "first_name": "Lisa",
            "last_name": "Park",
            "email": "lisa@sales-connect.io",
            "platform": "MICROSOFT"
          }
        ]
      }
    ]
  }'
\`\`\`

**Response:**

\`\`\`json
{
  "order_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "queued",
  "domains": [
    { "status": "outreach-leads.com queued" },
    { "status": "sales-connect.io queued" }
  ]
}
\`\`\`

**Order status lifecycle:** An order progresses through these stages:

| Status | Meaning |
|--------|---------|
| \`queued\` | Order received, waiting to be processed |
| \`processing\` | Order is actively being fulfilled |
| \`done\` | All domains and mailboxes successfully provisioned |
| \`error\` | One or more items in the order failed |

**Per-domain status progression:**

\`queued\` -> \`checking_availability\` -> \`registering\` -> \`waiting_for_activation\` -> \`creating_mailboxes\` -> \`generating_consent_url\` -> \`completed\`

If something goes wrong, a domain may enter \`error\` or \`warning\` status.

**Track order progress: GET /v1/api/orders/:id**

\`\`\`bash
curl https://api.infrabox.software/v1/api/orders/550e8400-e29b-41d4-a716-446655440000 \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "X-Workspace-Id: your-workspace-uid"
\`\`\`

**Response:**

\`\`\`json
{
  "order_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "processing",
  "created_at": "2026-04-01T10:00:00Z",
  "workspace": "your-workspace-uid",
  "domains": [
    {
      "name": "outreach-leads.com",
      "status": "creating_mailboxes",
      "mailboxes": [
        { "email": "sarah@outreach-leads.com", "status": "provisioning" },
        { "email": "mike@outreach-leads.com", "status": "provisioning" }
      ]
    },
    {
      "name": "sales-connect.io",
      "status": "waiting_for_activation",
      "mailboxes": []
    }
  ]
}
\`\`\`

**Order request body fields:**

| Field | Required | Description |
|-------|----------|-------------|
| \`domains[].name\` | Yes | Domain name to register |
| \`domains[].redirect_url\` | Yes | URL to redirect the domain to |
| \`domains[].mailboxes[].first_name\` | Yes | Mailbox user first name |
| \`domains[].mailboxes[].last_name\` | Yes | Mailbox user last name |
| \`domains[].mailboxes[].email\` | Yes | Full email address |
| \`domains[].mailboxes[].platform\` | Yes | \`GOOGLE\`, \`MICROSOFT\`, or \`AZURE\` |
| \`domains[].mailboxes[].profile_pic_url\` | No | URL of profile picture to set |
| \`domains[].registration_years\` | No | Years to register domain (default: 1) |
| \`domains[].contact_details\` | No | Domain registrant contact info |
| \`domains[].sequencer\` | No | Auto-connect to a sequencer |
| \`domains[].consent_screen_url\` | No | OAuth consent screen URL |
| \`contact_details\` | No | Default contact details for all domains |`,
      callout: {
        variant: "tip",
        title: "Bulk Provisioning Best Practice",
        text: "You can include multiple domains with multiple mailboxes each in a single order. However, bulk mailbox provisioning is rate-limited to 5 requests/minute. For large-scale provisioning (50+ domains), submit orders in batches and poll GET /v1/api/orders/:id to track progress.",
      },
    },
    {
      heading: "Domain Management API",
      content: `The Domains API provides 16 endpoints for complete domain lifecycle management: from searching available domains through registration, DNS configuration, forwarding, catch-all setup, DMARC, and nameserver management.

**Search available domains: POST /v1/api/domains/search**

\`\`\`bash
curl -X POST https://api.infrabox.software/v1/api/domains/search \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -H "X-Workspace-Id: your-workspace-uid" \\
  -d '{ "query": "outreach-leads" }'
\`\`\`

**Check if a domain is banned: GET /v1/api/domains/banned/:domain**

\`\`\`bash
curl https://api.infrabox.software/v1/api/domains/banned/spammy-domain.com \\
  -H "Authorization: Bearer YOUR_API_KEY"
\`\`\`

**Check domain availability: GET /v1/api/domains/availability/:domain**

\`\`\`bash
curl https://api.infrabox.software/v1/api/domains/availability/outreach-leads.com \\
  -H "Authorization: Bearer YOUR_API_KEY"
\`\`\`

Note: Domain availability checks are rate-limited to 20 requests/hour.

**Register domains: POST /v1/api/domains/register**

\`\`\`bash
curl -X POST https://api.infrabox.software/v1/api/domains/register \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -H "X-Workspace-Id: your-workspace-uid" \\
  -d '{
    "domains": ["outreach-leads.com", "sales-connect.io"],
    "redirect_url": "https://yourcompany.com",
    "registration_years": 1
  }'
\`\`\`

**List domains: POST /v1/api/domains/list**

\`\`\`bash
curl -X POST https://api.infrabox.software/v1/api/domains/list \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -H "X-Workspace-Id: your-workspace-uid" \\
  -d '{ "page": 1, "limit": 50 }'
\`\`\`

**Configure domain forwarding: POST /v1/api/domains/forwarding**

\`\`\`bash
curl -X POST https://api.infrabox.software/v1/api/domains/forwarding \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -H "X-Workspace-Id: your-workspace-uid" \\
  -d '{
    "domain": "outreach-leads.com",
    "redirect_url": "https://yourcompany.com"
  }'
\`\`\`

**Set catch-all email: POST /v1/api/domains/catch-all**

\`\`\`bash
curl -X POST https://api.infrabox.software/v1/api/domains/catch-all \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -H "X-Workspace-Id: your-workspace-uid" \\
  -d '{
    "domain": "outreach-leads.com",
    "email": "catchall@outreach-leads.com"
  }'
\`\`\`

**Set DMARC configuration: POST /v1/api/domains/dmarc**

\`\`\`bash
curl -X POST https://api.infrabox.software/v1/api/domains/dmarc \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -H "X-Workspace-Id: your-workspace-uid" \\
  -d '{
    "domain": "outreach-leads.com",
    "policy": "quarantine",
    "rua": "mailto:dmarc-reports@outreach-leads.com"
  }'
\`\`\`

**Nameserver management:**

\`\`\`bash
# Get nameservers for a domain
curl -X POST https://api.infrabox.software/v1/api/domains/nameservers \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -H "X-Workspace-Id: your-workspace-uid" \\
  -d '{ "domain": "outreach-leads.com" }'

# Check nameserver propagation
curl -X POST https://api.infrabox.software/v1/api/domains/nameservers/check \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -H "X-Workspace-Id: your-workspace-uid" \\
  -d '{ "domain": "outreach-leads.com" }'

# Regenerate nameservers
curl -X POST https://api.infrabox.software/v1/api/domains/nameservers/regenerate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -H "X-Workspace-Id: your-workspace-uid" \\
  -d '{ "domain": "outreach-leads.com" }'
\`\`\`

**All 16 domain endpoints:**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /v1/api/domains/search | Search available domains |
| GET | /v1/api/domains/banned/:domain | Check if domain is banned |
| GET | /v1/api/domains/availability/:domain | Check domain availability |
| POST | /v1/api/domains/register | Register domains |
| POST | /v1/api/domains/list | List domains |
| GET | /v1/api/domains/assignable | List assignable domains |
| POST | /v1/api/domains/remove | Remove domains |
| POST | /v1/api/domains/forwarding | Set domain forwarding |
| POST | /v1/api/domains/catch-all | Set catch-all email |
| DELETE | /v1/api/domains/catch-all | Remove catch-all email |
| POST | /v1/api/domains/nameservers | Get nameservers |
| POST | /v1/api/domains/nameservers/check | Check NS propagation |
| POST | /v1/api/domains/workspace-availability | Check workspace availability |
| POST | /v1/api/domains/dmarc | Set DMARC configuration |
| DELETE | /v1/api/domains/dmarc | Remove DMARC configuration |
| POST | /v1/api/domains/nameservers/regenerate | Regenerate nameservers |`,
    },
    {
      heading: "Mailbox Operations API",
      content: `The Mailboxes API provides 14 endpoints covering the full mailbox lifecycle: creation, credential management, signatures, profile pictures, password changes, TOTP generation, and more.

**List mailboxes: POST /v1/api/mailboxes/list**

\`\`\`bash
curl -X POST https://api.infrabox.software/v1/api/mailboxes/list \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -H "X-Workspace-Id: your-workspace-uid" \\
  -d '{ "page": 1, "limit": 50 }'
\`\`\`

**Buy mailboxes: POST /v1/api/mailboxes/buy**

\`\`\`bash
curl -X POST https://api.infrabox.software/v1/api/mailboxes/buy \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -H "X-Workspace-Id: your-workspace-uid" \\
  -d '{
    "domain": "outreach-leads.com",
    "mailboxes": [
      {
        "first_name": "Alex",
        "last_name": "Rivera",
        "email": "alex@outreach-leads.com",
        "platform": "GOOGLE"
      }
    ]
  }'
\`\`\`

**Get mailbox details: GET /v1/api/mailboxes/:id**

\`\`\`bash
curl https://api.infrabox.software/v1/api/mailboxes/mailbox-uuid-here \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "X-Workspace-Id: your-workspace-uid"
\`\`\`

**Show mailbox credentials: GET /v1/api/mailboxes/:id/credentials**

\`\`\`bash
curl https://api.infrabox.software/v1/api/mailboxes/mailbox-uuid-here/credentials \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "X-Workspace-Id: your-workspace-uid"
\`\`\`

This returns SMTP/IMAP credentials needed to connect the mailbox to sequencers like Instantly, SmartLead, or Apollo.

**Add or update mailbox signature: POST /v1/api/mailboxes/signature**

\`\`\`bash
curl -X POST https://api.infrabox.software/v1/api/mailboxes/signature \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -H "X-Workspace-Id: your-workspace-uid" \\
  -d '{
    "mailbox_id": "mailbox-uuid-here",
    "signature": "<p>Sarah Johnson</p><p>Sales Director | YourCompany</p><p><a href=\\"https://yourcompany.com\\">yourcompany.com</a></p>"
  }'
\`\`\`

**Update profile picture: POST /v1/api/mailboxes/:id/profile-picture**

\`\`\`bash
curl -X POST https://api.infrabox.software/v1/api/mailboxes/mailbox-uuid-here/profile-picture \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -H "X-Workspace-Id: your-workspace-uid" \\
  -d '{ "profile_pic_url": "https://yourcdn.com/photos/sarah.jpg" }'
\`\`\`

**Change mailbox password: POST /v1/api/mailboxes/:id/password**

\`\`\`bash
curl -X POST https://api.infrabox.software/v1/api/mailboxes/mailbox-uuid-here/password \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -H "X-Workspace-Id: your-workspace-uid" \\
  -d '{ "new_password": "newSecurePassword123!" }'
\`\`\`

**Change username: POST /v1/api/mailboxes/:id/username**

\`\`\`bash
curl -X POST https://api.infrabox.software/v1/api/mailboxes/mailbox-uuid-here/username \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -H "X-Workspace-Id: your-workspace-uid" \\
  -d '{ "new_username": "sarah.j" }'
\`\`\`

**Generate TOTP: GET /v1/api/mailboxes/:id/totp**

\`\`\`bash
curl https://api.infrabox.software/v1/api/mailboxes/mailbox-uuid-here/totp \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "X-Workspace-Id: your-workspace-uid"
\`\`\`

**All 14 mailbox endpoints:**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /v1/api/mailboxes/list | List mailboxes |
| POST | /v1/api/mailboxes/buy | Buy new mailboxes |
| GET | /v1/api/mailboxes/:id | Get mailbox details |
| GET | /v1/api/mailboxes/:id/credentials | Show credentials (SMTP/IMAP) |
| POST | /v1/api/mailboxes/:id/update | Update mailbox settings |
| POST | /v1/api/mailboxes/signature | Add/update email signature |
| POST | /v1/api/mailboxes/signature/delete | Delete signature |
| POST | /v1/api/mailboxes/:id/profile-picture | Update profile picture |
| POST | /v1/api/mailboxes/:id/username | Change username |
| POST | /v1/api/mailboxes/:id/password | Change password |
| GET | /v1/api/mailboxes/:id/totp | Generate TOTP code |
| GET | /v1/api/mailboxes/:id/availability | Check mailbox availability |
| POST | /v1/api/mailboxes/status | Check mailbox status |
| POST | /v1/api/mailboxes/cancel | Cancel mailboxes |`,
      callout: {
        variant: "warning",
        title: "Credential Security",
        text: "The GET /v1/api/mailboxes/:id/credentials endpoint returns plaintext SMTP and IMAP credentials. Never log these in production. Store them encrypted and transmit only over HTTPS.",
      },
    },
    {
      heading: "Cloudflare Integration API",
      content: `If you manage domains through Cloudflare, Infrabox provides 5 dedicated endpoints to connect, manage, and disconnect Cloudflare-managed domains without leaving the API.

**Connect a Cloudflare domain:**

\`\`\`javascript
// Connect a domain from your Cloudflare account
const result = await infraboxRequest('/api/cloudflare-domains/connect', {
  method: 'POST',
  body: JSON.stringify({
    zone_id: 'your-cloudflare-zone-id',
    domain: 'outreach-leads.com',
    api_token: 'your-cloudflare-api-token'
  }),
});
console.log(result);
// { status: "connected", domain: "outreach-leads.com" }
\`\`\`

**List Cloudflare zones:**

\`\`\`javascript
// List available Cloudflare zones to connect
const zones = await infraboxRequest('/api/cloudflare-domains/zones', {
  method: 'GET',
});
console.log(zones);
// [{ zone_id: "...", name: "outreach-leads.com", status: "active" }, ...]
\`\`\`

**List connected Cloudflare domains:**

\`\`\`javascript
const domains = await infraboxRequest('/api/cloudflare-domains/list', {
  method: 'GET',
});
\`\`\`

**Get Cloudflare domain details:**

\`\`\`javascript
const details = await infraboxRequest('/api/cloudflare-domains/outreach-leads.com', {
  method: 'GET',
});
\`\`\`

**Disconnect a Cloudflare domain:**

\`\`\`javascript
await infraboxRequest('/api/cloudflare-domains/disconnect', {
  method: 'POST',
  body: JSON.stringify({ domain: 'outreach-leads.com' }),
});
\`\`\`

**Cloudflare integration endpoints summary:**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /v1/api/cloudflare-domains/connect | Connect a Cloudflare-managed domain |
| GET | /v1/api/cloudflare-domains/list | List connected Cloudflare domains |
| GET | /v1/api/cloudflare-domains/:domain | Get Cloudflare domain details |
| POST | /v1/api/cloudflare-domains/disconnect | Disconnect a Cloudflare domain |
| GET | /v1/api/cloudflare-domains/zones | List available Cloudflare zones |

This is especially useful for agencies that already manage client DNS through Cloudflare. You can connect domains to Infrabox without changing nameservers, since Cloudflare handles DNS propagation.`,
    },
    {
      heading: "Webhooks and Status Tracking",
      content: `Infrabox uses webhooks to push real-time status change notifications to your application. Instead of polling order or mailbox status, configure a webhook URL and receive updates as they happen.

**Configure your webhook URL:**

Use the workspace webhook endpoint to set your callback URL:

\`\`\`bash
curl -X POST https://api.infrabox.software/v1/api/workspaces/your-workspace-uid/webhook \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "webhook_url": "https://yourapp.com/webhooks/infrabox"
  }'
\`\`\`

**Status change webhook: POST /v1/api/webhooks/status-change**

When domain or mailbox statuses change, Infrabox sends a POST request to your configured webhook URL. This covers order progress, domain registration status, mailbox provisioning, and error notifications.

**Webhook handler example (Node.js/Express):**

\`\`\`javascript
const express = require('express');
const app = express();
app.use(express.json());

app.post('/webhooks/infrabox', (req, res) => {
  const { event, data } = req.body;

  switch (data.status) {
    case 'completed':
      console.log(\`Domain \${data.domain} fully provisioned with \${data.mailboxes?.length} mailboxes\`);
      // Trigger sequencer connection, CRM update, etc.
      notifyTeam(\`Ready: \${data.domain}\`);
      break;

    case 'creating_mailboxes':
      console.log(\`Mailboxes being created for \${data.domain}\`);
      break;

    case 'error':
      console.error(\`Error on \${data.domain}: \${data.message}\`);
      alertOpsTeam(data);
      break;

    case 'warning':
      console.warn(\`Warning on \${data.domain}: \${data.message}\`);
      break;

    default:
      console.log(\`Status update: \${data.domain} -> \${data.status}\`);
  }

  res.sendStatus(200);
});

app.listen(3000);
\`\`\`

**Polling as a fallback:**

If webhooks are not suitable for your architecture, you can poll order status:

\`\`\`javascript
async function pollOrderUntilComplete(orderId, interval = 10000) {
  while (true) {
    const order = await infraboxRequest(\`/api/orders/\${orderId}\`);

    if (order.status === 'done') {
      console.log('Order complete:', order);
      return order;
    }

    if (order.status === 'error') {
      throw new Error(\`Order failed: \${JSON.stringify(order)}\`);
    }

    console.log(\`Order status: \${order.status}. Checking again in \${interval / 1000}s...\`);
    await new Promise(r => setTimeout(r, interval));
  }
}

const completedOrder = await pollOrderUntilComplete('550e8400-e29b-41d4-a716-446655440000');
\`\`\`

**Workspace management for multi-tenant setups:**

Agencies managing multiple clients can create separate workspaces per client, each with its own webhook URL:

\`\`\`javascript
// Create a workspace for a new client
const workspace = await infraboxRequest('/api/workspaces', {
  method: 'POST',
  body: JSON.stringify({
    name: 'Client - Acme Corp',
  }),
});

// Set webhook for this workspace
await infraboxRequest(\`/api/workspaces/\${workspace.id}/webhook\`, {
  method: 'POST',
  body: JSON.stringify({
    webhook_url: 'https://yourapp.com/webhooks/acme-corp',
  }),
});
\`\`\`

**All 6 workspace endpoints:**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /v1/api/workspaces | List all workspaces |
| GET | /v1/api/workspaces/:id | Get workspace details |
| POST | /v1/api/workspaces | Create a new workspace |
| PUT | /v1/api/workspaces/:id | Update workspace settings |
| DELETE | /v1/api/workspaces/:id | Delete a workspace |
| POST | /v1/api/workspaces/:id/webhook | Set workspace webhook URL |`,
      callout: {
        variant: "info",
        title: "Webhook Reliability",
        text: "Infrabox retries failed webhook deliveries with exponential backoff. Your endpoint should return a 2xx status code within 10 seconds. If your endpoint is consistently unreachable, webhook delivery will be paused and you will need to re-enable it from the dashboard.",
      },
    },
    {
      heading: "Complete Endpoint Reference",
      content: `Below is the full reference of all Infrabox API endpoint categories and their key endpoints. The API currently exposes **70+ public endpoints across 14 categories**.

**Orders (2 endpoints)**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /v1/api/orders | Create order for domain registration + mailbox setup |
| GET | /v1/api/orders/:id | Get order details with domain/mailbox status |

**Account (1 endpoint)**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /v1/api/account | Get account details |

**Webhooks (1 endpoint)**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /v1/api/webhooks/status-change | Status change webhook callback |

**Workspaces (6 endpoints)**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /v1/api/workspaces | List workspaces |
| GET | /v1/api/workspaces/:id | Get workspace details |
| POST | /v1/api/workspaces | Create workspace |
| PUT | /v1/api/workspaces/:id | Update workspace |
| DELETE | /v1/api/workspaces/:id | Delete workspace |
| POST | /v1/api/workspaces/:id/webhook | Update workspace webhook |

**Domains (16 endpoints)**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /v1/api/domains/search | Search available domains |
| GET | /v1/api/domains/banned/:domain | Check if domain is banned |
| GET | /v1/api/domains/availability/:domain | Check domain availability |
| POST | /v1/api/domains/register | Register domains |
| POST | /v1/api/domains/list | List domains |
| GET | /v1/api/domains/assignable | List assignable domains |
| POST | /v1/api/domains/remove | Remove domains |
| POST | /v1/api/domains/forwarding | Set domain forwarding |
| POST | /v1/api/domains/catch-all | Set catch-all email |
| DELETE | /v1/api/domains/catch-all | Remove catch-all email |
| POST | /v1/api/domains/nameservers | Get nameservers for domain |
| POST | /v1/api/domains/nameservers/check | Check nameserver propagation |
| POST | /v1/api/domains/workspace-availability | Check workspace availability |
| POST | /v1/api/domains/dmarc | Set DMARC configuration |
| DELETE | /v1/api/domains/dmarc | Remove DMARC configuration |
| POST | /v1/api/domains/nameservers/regenerate | Regenerate nameservers |

**Cloudflare Domains (5 endpoints)**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /v1/api/cloudflare-domains/connect | Connect Cloudflare domain |
| GET | /v1/api/cloudflare-domains/list | List connected Cloudflare domains |
| GET | /v1/api/cloudflare-domains/:domain | Get Cloudflare domain details |
| POST | /v1/api/cloudflare-domains/disconnect | Disconnect Cloudflare domain |
| GET | /v1/api/cloudflare-domains/zones | List Cloudflare zones |

**Mailboxes (14 endpoints)**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /v1/api/mailboxes/list | List mailboxes |
| POST | /v1/api/mailboxes/buy | Buy new mailboxes |
| GET | /v1/api/mailboxes/:id | Get mailbox details |
| GET | /v1/api/mailboxes/:id/credentials | Show SMTP/IMAP credentials |
| POST | /v1/api/mailboxes/:id/update | Update mailbox |
| POST | /v1/api/mailboxes/signature | Add/update signature |
| POST | /v1/api/mailboxes/signature/delete | Delete signature |
| POST | /v1/api/mailboxes/:id/profile-picture | Update profile picture |
| POST | /v1/api/mailboxes/:id/username | Change username |
| POST | /v1/api/mailboxes/:id/password | Change password |
| GET | /v1/api/mailboxes/:id/totp | Generate TOTP |
| GET | /v1/api/mailboxes/:id/availability | Check mailbox availability |
| POST | /v1/api/mailboxes/status | Check mailbox status |
| POST | /v1/api/mailboxes/cancel | Cancel mailboxes |

**DNS (multiple endpoints)**

| Category | Description |
|----------|-------------|
| DNS Records | Read, validate, and manage DNS records for connected domains |

**Warmup (multiple endpoints)**

| Category | Description |
|----------|-------------|
| Warmup Subscriptions | Enable, disable, and manage warmup subscriptions for mailboxes |

**Tags (multiple endpoints)**

| Category | Description |
|----------|-------------|
| Tag Management | Create, list, update, and delete tags for organizing domains and mailboxes |

**Inbox Placement (multiple endpoints)**

| Category | Description |
|----------|-------------|
| Deliverability Testing | Run inbox placement tests, check inbox vs. spam placement rates |

**InfraGuard (multiple endpoints)**

| Category | Description |
|----------|-------------|
| Infrastructure Monitoring | Blacklist monitoring, DNS health checks, reputation tracking |

**Email Insights (14 endpoints)**

| Category | Description |
|----------|-------------|
| Mailbox Analytics | Sending volume, bounce rates, engagement metrics, deliverability trends |

**Prewarm (multiple endpoints)**

| Category | Description |
|----------|-------------|
| Pre-warming Service | Pre-warm domains and mailboxes before ramping up sending volume |

For the complete and always-up-to-date endpoint reference with request/response schemas, visit [docs.infrabox.software](https://docs.infrabox.software).`,
    },
  ],
  faqs: [
    {
      question: "What is the Infrabox API base URL?",
      answer:
        "The base URL for all Infrabox API requests is https://api.infrabox.software/v1. All endpoints are prefixed with /v1/api/ followed by the resource category (e.g., /v1/api/orders, /v1/api/domains/list, /v1/api/mailboxes/list).",
    },
    {
      question: "How do I authenticate with the Infrabox API?",
      answer:
        'All requests require an API key sent as a Bearer token in the Authorization header: "Authorization: Bearer YOUR_API_KEY". You can generate API keys from the Infrabox Dashboard under Settings > API & Integrations. Most workspace-scoped operations also require the X-Workspace-Id header.',
    },
    {
      question: "What are the API rate limits?",
      answer:
        "Standard API calls are limited to 10 requests/second and 100 requests/minute. Domain availability checks allow 20 requests/hour. Bulk mailbox provisioning is limited to 5 requests/minute. Reputation monitoring allows 50 requests/hour. Check X-RateLimit-Remaining and X-RateLimit-Reset response headers to track your usage.",
    },
    {
      question: "Can I register domains and create mailboxes in a single API call?",
      answer:
        'Yes. The POST /v1/api/orders endpoint accepts an array of domains, each with an array of mailboxes. Infrabox handles the entire flow (domain registration, DNS configuration, and mailbox provisioning) from a single request. You can mix platforms (GOOGLE, MICROSOFT, AZURE) within the same order.',
    },
    {
      question: "How do I get mailbox SMTP/IMAP credentials via the API?",
      answer:
        "Use GET /v1/api/mailboxes/:id/credentials with the mailbox UUID. This returns the SMTP host, SMTP port, IMAP host, IMAP port, and app password needed to connect the mailbox to any sequencer or email client. Keep these credentials encrypted. The endpoint returns them in plaintext.",
    },
    {
      question: "How do webhooks work in Infrabox?",
      answer:
        "Configure a webhook URL on your workspace using POST /v1/api/workspaces/:id/webhook. Infrabox will POST status change notifications to that URL as domains and mailboxes progress through provisioning stages (queued, checking_availability, registering, creating_mailboxes, completed, error). Your endpoint should return a 2xx status within 10 seconds.",
    },
    {
      question: "Can I connect Cloudflare-managed domains to Infrabox?",
      answer:
        "Yes. Infrabox provides 5 dedicated Cloudflare integration endpoints. You can connect domains by Cloudflare zone, list connected domains, get domain details, and disconnect domains, all without changing your nameservers since Cloudflare handles DNS.",
    },
    {
      question: "How many API endpoints does Infrabox provide?",
      answer:
        "Infrabox provides 70+ public API endpoints across 14 categories: Orders, Account, Webhooks, Workspaces, Domains (16 endpoints), Cloudflare Domains (5), Mailboxes (14), DNS, Warmup, Tags, Inbox Placement, InfraGuard, Email Insights (14), and Prewarm. Full documentation is at docs.infrabox.software.",
    },
  ],
  sources: [
    {
      title: "Infrabox API Documentation",
      url: "https://docs.infrabox.software",
      date: "2026",
    },
    {
      title: "Infrabox Orders API Reference",
      url: "https://docs.infrabox.software/place-order-20826769e0",
      date: "2026",
    },
    {
      title: "Infrabox Domains API Reference",
      url: "https://docs.infrabox.software",
      date: "2026",
    },
    {
      title: "Infrabox Mailboxes API Reference",
      url: "https://docs.infrabox.software",
      date: "2026",
    },
    {
      title: "Infrabox Webhooks Documentation",
      url: "https://docs.infrabox.software",
      date: "2026",
    },
    {
      title: "Infrabox Cloudflare Integration",
      url: "https://docs.infrabox.software/connect-cloudflare-domains-28724829e0",
      date: "2026",
    },
  ],
  screenshots: [
    {
      src: "/images/dashboard/dashboard-home.png",
      alt: "Infrabox API keys management in dashboard settings",
      caption:
        "Generate and manage API keys from your Infrabox Dashboard under Settings > API & Integrations for programmatic access to all 70+ endpoints",
    },
  ],
  relatedSlugs: [
    "infrabox-review",
    "what-is-infrabox",
    "infrabox-pricing",
    "agency-workflows-guide",
    "email-infrastructure-setup-guide",
  ],
};
