# Infrabox Dashboard Documentation

## Product Overview

Infrabox is a comprehensive email infrastructure platform that helps businesses achieve 95%+ inbox placement rates. The platform provides tools for email deliverability, DNS management, Google Workspace integration, and agency solutions.

### Key Metrics
- **5,000+** Active Companies
- **95%+** Inbox Placement Rate
- **100M+** Emails Delivered
- **4.9/5** Average Rating

## Dashboard Architecture

### Technology Stack
- **Framework**: Next.js 14.2.30 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Custom components + Radix UI
- **Image Optimization**: Next.js Image component
- **State Management**: React hooks (useState, useEffect)

## Main Dashboard Components

### 1. Header Component (`/components/Header.js`)
**Purpose**: Primary navigation and user actions
**Features**:
- Logo with link to homepage
- Navigation menu: Features, Pricing, Affiliates, API Documentation, Resources
- CTA buttons: Login, Get Started
- Mobile responsive hamburger menu
- Recent update: Added Pricing link to navigation

### 2. Hero Section (`/components/Hero.js`)
**Purpose**: Main value proposition and immediate user action
**Content**:
- Headline: "The All-in-One Email Infrastructure Platform"
- Subheadline: Email deliverability and management benefits
- Primary CTA: "Start Free Trial"
- Secondary CTA: "View Demo"
- Trust indicators and social proof

### 3. Testimonial Carousel (`/components/TestimonialCarousel.js`)
**Purpose**: Build trust through customer success stories
**Features**:
- 7 company logos in infinite scroll animation
- Companies: 11x, CB Insights, Gorgias, Polar Analytics, SalesHawk, SmartLead, SalesForge
- Testimonial cards with ratings and quotes
- Company logos only (no author names for privacy)
- Smooth CSS animations with hover pause
- Recent fixes: 
  - Single array for logos to prevent duplication
  - Reduced logo size to w-32 h-16 to prevent overflow

### 4. Pricing Calculator (`/components/Calculator.js`)
**Purpose**: Interactive cost estimation based on usage
**Features**:
- Slider range: 35-500 replies per day (initial value: 35)
- Real-time price calculation
- Shows monthly cost with dollar sign
- Math.round() for clean display
- Visual feedback with color-coded savings

### 5. Pricing Section (`/components/Pricing.js`)
**Purpose**: Clear pricing tiers and feature comparison
**Tiers**:
1. **Starter ($47/month)**
   - Up to 10 mailboxes
   - Basic deliverability tools
   - Email warmup
   - DNS management

2. **Growth ($97/month)**
   - Up to 50 mailboxes
   - Advanced analytics
   - Priority support
   - API access

3. **Scale ($297/month)**
   - Unlimited mailboxes
   - White-label options
   - Dedicated account manager
   - Custom integrations

### 6. Features Sections
- **ScaleFeatures** (`/components/ScaleFeatures.js`): Enterprise capabilities
- **AgencySection** (`/components/AgencySection.js`): Agency-specific features
- **Comparison** (`/components/Comparison.js`): Competitor comparison table
- **FAQ** (`/components/FAQ.js`): Common questions and answers

## Page Routes and Navigation

### Landing Pages
- `/` - Main dashboard with all sections
- `/demo` - Product demonstration
- `/contact` - Contact form
- `/pricing` - Detailed pricing page

### Product Pages
- `/email-deliverability` - Email deliverability features
- `/google-workspace-accounts` - Google Workspace integration
- `/dns-management` - DNS configuration tools
- `/email-warmup` - Email warmup services
- `/agency-email-solution` - Agency management features

### Resource Tools (`/resources/tools/`)
Complete suite of 17 email infrastructure tools:
- **SPF Tools**: checker, generator, raw-checker
- **DKIM Tools**: checker, generator
- **DMARC Tools**: checker, generator
- **BIMI Tools**: checker, generator
- **DNS Tools**: checker, validator, domain-scanner
- **Analysis Tools**: spam-checker, reputation-check, email-header-analyzer
- **Other Tools**: mta-sts-checker, deliverability-score, mailbox-calculator

### Resource Content
- `/resources/guides/` - Implementation guides
- `/resources/blog/` - Blog articles
- `/resources/case-studies/` - Customer success stories

## User Interface Patterns

### Design System
- **Primary Color**: #103938 (dark green)
- **Typography**: System fonts with Tailwind defaults
- **Spacing**: Consistent padding/margin using Tailwind classes
- **Shadows**: Subtle shadows for depth (shadow-lg, shadow-xl)
- **Borders**: Light gray borders (border-gray-100)

### Interactive Elements
- **Buttons**: 
  - Primary: Dark background with white text
  - Secondary: Light background with dark text
  - Hover states with transitions
- **Forms**: Clean input fields with validation feedback
- **Cards**: Rounded corners with hover elevation
- **Animations**: Smooth transitions (300ms default)

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Collapsible navigation on mobile
- Stack layouts on smaller screens

## Component State Management

### Calculator Component
```javascript
const [repliesPerDay, setRepliesPerDay] = useState(35);
// Calculates price based on slider value
// Updates display in real-time
```

### Testimonial Carousel
```javascript
// Duplicated array for infinite scroll
const duplicatedTestimonials = [...testimonials, ...testimonials];
// CSS animations for continuous movement
```

### Header Navigation
```javascript
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
// Toggle mobile menu visibility
```

## Recent Updates Log

### Latest Changes (Current Session)
1. **Calculator Fix**: Changed initial slider value from 30 to 35 to match display
2. **Build Errors**: Fixed 100+ ESLint errors with .eslintrc.json configuration
3. **Testimonial Carousel**: 
   - Created new component with 7 company testimonials
   - Removed author names for privacy
   - Fixed logo duplication issue
   - Adjusted logo dimensions to prevent overflow
4. **Trust Metrics**: Updated from 10K to 5K companies, 500M to 100M emails
5. **Navigation**: Added Pricing link to header

### Component Additions
- TestimonialCarousel component with infinite scroll
- Glassmorphism effects on cards
- Hover animations on logos

## API Integration Points

### Tool APIs (`/app/api/tools/`)
All tools follow similar pattern:
- POST request with domain/email input
- Server-side processing
- JSON response with results
- Rate limiting and caching implemented

### Key APIs
- `/api/deliverability/check` - Email deliverability scoring
- `/api/tools/dns-checker` - DNS record validation
- `/api/tools/spam-checker` - Spam analysis
- `/api/tools/reputation-check` - Domain reputation

## Performance Optimizations

### Image Loading
- Next.js Image component for optimization
- Lazy loading for below-fold images
- Proper sizing with `sizes` attribute
- WebP format conversion

### Code Splitting
- Dynamic imports for heavy components
- Route-based code splitting
- Minimal initial bundle size

### Caching Strategy
- Static generation for marketing pages
- API response caching
- Browser caching headers

## Development Workflow

### Setup
```bash
npm install
npm run dev
```

### Build
```bash
npm run build
npm run start
```

### Environment Variables
Required in `.env.local`:
- API keys for external services
- Database connection strings
- Authentication secrets

## Common User Journeys

### 1. New Visitor Flow
Landing → Hero CTA → Pricing Calculator → Sign Up

### 2. Tool Usage Flow
Resources → Select Tool → Input Data → View Results → Sign Up for More

### 3. Enterprise Flow
Landing → Agency Section → Book Demo → Custom Onboarding

## Troubleshooting Guide

### Common Issues
1. **Slider not matching display**: Ensure initial state matches UI
2. **Logo overflow**: Check image dimensions and container sizes
3. **Animation stuttering**: Verify CSS animation keyframes
4. **Build errors**: Check ESLint configuration

## File Structure

```
/components/           # All React components
  Calculator.js       # Pricing calculator
  Header.js          # Navigation header
  Hero.js            # Landing hero section
  TestimonialCarousel.js  # Customer testimonials
  Pricing.js         # Pricing tiers
  ...

/app/                # Next.js app router pages
  page.js           # Main landing page
  /resources/tools/ # All tool pages
  /api/tools/      # Tool API endpoints
  ...

/public/            # Static assets
  /testimonials/   # Company logos
  ...

/lib/              # Utility functions
/data/             # Static data files
```

## Questions This Documentation Answers

1. **Navigation**: How users move through the dashboard
2. **Components**: What each UI component does and how it works
3. **Styling**: How the design system is implemented
4. **Features**: What tools and features are available
5. **Updates**: Recent changes and improvements
6. **Structure**: How the codebase is organized
7. **User Experience**: Common user flows and interactions
8. **Technical Details**: Implementation specifics for developers

This documentation provides comprehensive context for AI assistants to understand and answer questions about the Infrabox dashboard interface, user experience, and frontend implementation.
---

## Branding & Domains (Infrabox rebrand)

This site was rebranded from InboxKit to **Infrabox**. There are no InboxKit strings,
links, assets or vendor connections left in anything that ships to the browser.

| Thing | Value |
|---|---|
| App name / domain | `Infrabox` / `infrabox.software` (set in `config.js`) |
| Canonical host | `www.infrabox.software` (apex → www 308 in `next.config.js`) |
| Backend API | `https://api.infrabox.software/v1` (`lib/infrabox-api.js`) |
| Dashboard / partner / docs | `app.` / `partner.` / `docs.infrabox.software` |
| Support email | `support@infrabox.software` |
| Brand mark | `public/logo.png` — the single source for every logo slot |
| Favicon / touch icon / social card | `app/icon.png`, `app/apple-icon.png`, `app/opengraph-image.png`, `app/twitter-image.png` (all generated from `public/logo.png`) |

Images that used to load from InboxKit's DigitalOcean Spaces CDN are now committed under
`public/image-assets/` and served locally, so the site has no third-party image dependency.

### Analytics & support vendors

Every third-party analytics/support script in `components/DeferredAnalytics.js` previously
carried a **hardcoded InboxKit account ID**. Those IDs were removed during the rebrand — each
vendor is now gated behind its own env var and renders nothing when the var is unset (the
current state: no vendor loads, no data leaves the site).

To switch a vendor back on, create the Infrabox-owned account and set its var:

| Vendor | Env var |
|---|---|
| Google Analytics 4 | `NEXT_PUBLIC_GA_ID` |
| DataFast | `NEXT_PUBLIC_DATAFAST_WEBSITE_ID`, `NEXT_PUBLIC_DATAFAST_DOMAIN` |
| Vector | `NEXT_PUBLIC_VECTOR_ID` |
| PostHog | `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` |
| Partnero | `NEXT_PUBLIC_PARTNERO_PROGRAM` |
| Gleap (support widget) | `NEXT_PUBLIC_GLEAP_KEY` |
| Microsoft Clarity | `NEXT_PUBLIC_CLARITY_ID` |
| HappierLeads | `NEXT_PUBLIC_HAPPIERLEADS_CLIENT_ID` |

The Gleap widget's button icon comes from the Gleap project dashboard, not from this repo —
upload the Infrabox logo there when creating the project, otherwise the widget will show
whatever logo that project is configured with.

### Booking (Calendly)

Every booking surface reads from `lib/booking.js` — there are no hardcoded Calendly URLs left.
The handle is unset by default, because `calendly.com/infrabox` does not exist yet and an embed
pointing at a missing handle renders Calendly's own 404 inside the page.

While it is unset, each surface renders `components/BookingFallback.js` instead: an Infrabox-branded
panel with "Email the team" / "Get started now". Create the Calendly account, then set:

| Env var | Default | Used by |
|---|---|---|
| `NEXT_PUBLIC_CALENDLY_HANDLE` | *(unset — fallback shows)* | all booking surfaces |
| `NEXT_PUBLIC_CALENDLY_EVENT_SALES` | `30min` | `BookCall`, `ExitIntentModal`, `PricingCalculator` |
| `NEXT_PUBLIC_CALENDLY_EVENT_PARTNER` | `partner-program-connect` | `PartnerCalendarModal`, `/creators` |
| `NEXT_PUBLIC_CALENDLY_EVENT_AUDIT` | `infrabox-fix-your-email-infrastructure` | `/resources/knowledge-base/google-panel-checker` |

Setting `NEXT_PUBLIC_CALENDLY_HANDLE` alone switches every embed on — no code change.

### Brand colour

Sampled from `public/logo.png` (the blue cube). Primary is `#1240cc` — 8.0:1 on white,
comfortably above WCAG AA. The palette was migrated twice: the original InboxKit green,
then a cyan/teal reading of the first logo, and finally this blue when the logo changed.

| Role | Value |
|---|---|
| Primary — buttons, headings, links | `#1240cc` |
| Hover / pressed | `#0b34b4` |
| Deep surfaces | `#001040` · `#001050` · `#001a68` · `#001f7a` · `#0033bb` |
| Companion / gradient | `#2060f0` |
| Tints — borders, chips, panels | `#6f9ef5` → `#e8f0fe` |
| Off-white surface | `#f5f8ff` |

Semantic green/emerald Tailwind classes are success indicators, not brand colour, and are
left alone.

### Logo assets

| File | Use |
|---|---|
| `public/logo.png` | square mark + stacked wordmark — small/inline slots (table cells, bylines, avatars) |
| `public/logo-horizontal.png` | horizontal lockup (5.17:1), generated from `logo.png` — header, footer, modals, booking panel |

The header logo is responsive (`h-9 lg:h-8 xl:h-10`): the desktop nav starts at `lg`, and at exactly
1024px a full-size lockup pushes the nav onto a second line.

### Typography

| Role | Family | Source |
|---|---|---|
| Headings (`h1`–`h6`) | **Geist Sans** | `geist` npm package (`geist/font/sans`) — Geist is not in Next 14's `next/font/google` list |
| Body / paragraphs | **Figtree** | `next/font/google` |
| Code, DNS records, SPF/DKIM strings | system mono stack | pinned in `tailwind.config.js` |

Wiring: `app/layout.js` puts both variables (`--font-geist-sans`, `--font-figtree`) on `<html>`;
`app/globals.css` maps `body` → Figtree and `h1..h6` → Geist Sans; `tailwind.config.js` exposes
`font-sans` (Figtree), `font-heading` (Geist Sans) and a pinned `font-mono`.

Because the rule keys off real `h1`–`h6` tags, headings pick up Geist automatically — 901 of them
across the site are semantic. About 80 elements are large-text `div`/`span`/`p` (stat numbers,
prices, step numerals); those render in Figtree. Add `font-heading` to any that should read as a
display heading.

Known font gaps:
- `app/learn/[slug]/opengraph-image.js` and `app/case-studies/[slug]/opengraph-image.js` render via
  `next/og` `ImageResponse`, which cannot read CSS variables. They still use `system-ui`; branding
  them needs font buffers passed to `ImageResponse({ fonts })`.
- `app/partners/[slug]/page.js:457` keeps a `Georgia, serif` decorative quote glyph — the only serif
  in the codebase, left as a deliberate flourish.

### Sister brands removed (SendKit / Enrich)

The old company promoted two sister brands across this site. All of it is gone:
the `BrandStack` promo component (rendered on every case study), the `sameAs` entry in
Organization structured data, the `DOFOLLOW_HOSTS` link-equity allowlist, the
`## Sister Brand` block in `public/llms.txt`, the "SendKit Access" creator perk, the demo
domains in `components/Highlights1.js`, and every prose mention across 22 learn articles.

Two routes were retired and now 301 (see `next.config.js`):

| Retired | Redirects to |
|---|---|
| `/learn/sendkit-review` | `/learn/best-email-sequencers-2026` |
| `/learn/infrabox-sendkit-integration` | `/learn/email-sequencer-integration-guide` |

`best-email-sequencers-2026` was re-ranked 7 → 6 tools, and integration counts moved
`24+` → `23+` site-wide to stay accurate.

**Not changed on purpose:** `app/customer-stories/wall-of-love/page.js` holds two real
customer testimonials whose quoted words name SendKit. Editing a person's quote would
falsify a testimonial — remove the two entries outright if they must go.

### Social / OG image

Every page's OG + Twitter card used to load `infraboxmockup.webp` from the previous
company's Cloudflare R2 bucket. That file is a screenshot reading "Welcome to InboxKit"
with `inboxkitmarketing.com` and a personal `@enrich.so` address in it — and the rebrand's
URL rename had already broken it to a 404. All 11 references now point at
`public/og-default.png`, the generated Infrabox card. The R2 host is gone from
`next.config.js`, and `app/api/admin/blog/upload-image/route.js` no longer falls back to
that bucket when `R2_PUBLIC_URL` is unset.

### Navigation and homepage

The site was cut back to a small surface. The header carries only **Home**, **What is
Infrabox**, **Developers** (disabled, "Coming soon") and a **Resources** dropdown with
Compare / Alternatives / Learn / Case Studies. The footer holds ten links: Product,
Resources and the four legal pages.

The other ~400 pages were deliberately **not deleted** — they still build, still resolve
and stay in the sitemap. They are simply no longer linked from the UI.

Removed from the homepage hero, because all of it was the previous brand's social proof:
the "Trusted by" logo marquee (Merck, PwC, Zendesk, Gorgias…), the floating review toasts
("Unified inbox saved our sanity" etc.), the avatar cluster with its rotating customer
quote, the G2 4.9 / Google 4.8 rating widgets, and the G2 Spring 2026 award badges. In
their place is a metrics row built only from figures already present in this repo.

`components/TestimonialCarousel.js` and `components/FloatingBadges.js` were deleted once
nothing referenced them. `components/G2Badges.js` still renders on `/customer-stories`,
`/customer-stories/g2-reviews` and `/switch/zapmail` — those award badges belong to the
previous brand's G2 profile, so remove them there too if those pages are ever surfaced.

### Still pointing at handles that do not exist yet

- `g2.com/products/infrabox`, `crunchbase.com/organization/infrabox`, `twitter.com/infrabox`,
  `linkedin.com/company/infrabox`
- `lib/authors.js` — the COO's `linkedin` field was dropped because their real profile slug
  contains "inboxkit"; author cards render fine without it. Re-add once the profile URL changes.
