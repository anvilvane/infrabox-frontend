const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [require('remark-gfm')],
    rehypePlugins: [
      require('rehype-slug'),
      require('rehype-autolink-headings'),
      require('rehype-highlight')
    ],
  },
});

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  experimental: {
    optimizeCss: true,
  },

  images: {
    // AVIF first (≈30-50% smaller than WebP), WebP fallback. Cuts LCP image bytes site-wide.
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'logos-world.net',
      },
    ],
  },

  async headers() {
    return [
      {
        source: '/js/script.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
      // Baseline security headers on every route (HSTS is set at the edge/host).
      // CSP is intentionally limited to frame-ancestors (clickjacking protection)
      // so it doesn't break the many first-party-proxied and deferred third-party
      // scripts; a full resource-level CSP is a separate, test-heavy follow-up.
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
          { key: 'Content-Security-Policy', value: "frame-ancestors 'self'" },
        ],
      },
      {
        source: '/acceptable-use-policy',
        headers: [
          { key: 'X-Robots-Tag', value: 'noai, noimageai' },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: '/js/script.js',
        destination: 'https://datafa.st/js/script.js',
      },
      {
        source: '/api/events',
        destination: 'https://datafa.st/api/events',
      },
    ]
  },

  async redirects() {
    // Specific path redirects are listed FIRST with ABSOLUTE www destinations, so an
    // apex request to any legacy path resolves in a SINGLE 308 hop (not apex→www→path).
    // The apex→www catch-all is LAST and only fires for paths not handled above.
    const www = (p) => `https://www.infrabox.software${p}`;
    return [
      // Duplicate calculator consolidated onto the already-ranking tools URL.
      { source: '/pricing-calculator', destination: www('/resources/tools/mailbox-calculator'), permanent: true },
      // Articles reclassified from /case-studies to /learn (they read as guides, not case studies)
      { source: '/case-studies/leadhaste-scaling-client-campaigns-infrabox', destination: www('/learn/leadhaste-scaling-client-campaigns-infrabox'), permanent: true },
      { source: '/case-studies/outreachbloom-ai-seo-cold-email-reddit', destination: www('/learn/outreachbloom-ai-seo-email-reddit'), permanent: true },
      // Case studies listing moved under the Customer Stories hub (individual /case-studies/[slug] articles are unaffected)
      { source: '/case-studies', destination: www('/customer-stories/case-studies'), permanent: true },
      // Legacy guides → learn articles
      { source: '/resources/guides/dns-setup', destination: www('/learn/dns-setup-guide'), permanent: true },
      { source: '/resources/guides/cold-email-warmup', destination: www('/learn/email-warmup-guide'), permanent: true },
      { source: '/resources/guides/email-deliverability', destination: www('/learn/email-deliverability-guide'), permanent: true },
      { source: '/resources/guides/us-ip-benefits', destination: www('/learn/us-ip-benefits-guide'), permanent: true },
      { source: '/resources/guides/agency-workflows', destination: www('/learn/agency-workflows-guide'), permanent: true },
      // Legacy /compare slugs → /alternatives equivalents
      { source: '/compare/apollo', destination: www('/alternatives/apollo'), permanent: true },
      { source: '/compare/gmass', destination: www('/alternatives/gmass'), permanent: true },
      { source: '/compare/lemlist', destination: www('/alternatives/lemlist'), permanent: true },
      { source: '/compare/salesforge', destination: www('/alternatives/salesforge'), permanent: true },
      // Top-level product/SEO stubs → canonical knowledge-base pages. Moved out of
      // app/*/page.js redirect components so they serve ONE 308 with no dead metadata.
      { source: '/dns-management', destination: www('/resources/knowledge-base/dns-management'), permanent: true },
      { source: '/google-workspace-accounts', destination: www('/resources/knowledge-base/google-workspace-accounts'), permanent: true },
      { source: '/google-disruption', destination: www('/resources/knowledge-base/google-disruption'), permanent: true },
      { source: '/google-panel-checker', destination: www('/resources/knowledge-base/google-panel-checker'), permanent: true },
      { source: '/google-suspension', destination: www('/resources/knowledge-base/google-suspension'), permanent: true },
      // Legacy /author index + retired /resources/blog → consolidated destinations
      { source: '/author', destination: www('/authors'), permanent: true },
      { source: '/resources/blog/category/:category', destination: www('/learn'), permanent: true },
      // Retired blog posts whose /learn/:slug twin was never published - the wildcard
      // below would 301 them straight into a 404, so they get an explicit target and
      // MUST stay above it (first matching redirect wins).
      { source: '/resources/blog/email-sender-reputation-score', destination: www('/learn/sender-reputation-monitoring-tools'), permanent: true },
      { source: '/resources/blog/:slug', destination: www('/learn/:slug'), permanent: true },
      { source: '/resources/blog', destination: www('/learn'), permanent: true },
      // cold-email -> email slug migration (56 learn + 1 product). Old URLs 301 to new.
      { source: '/learn/best-cold-email-infrastructure-2026', destination: www('/learn/best-email-infrastructure-2026'), permanent: true },
      { source: '/learn/best-cold-email-infrastructure-high-volume', destination: www('/learn/best-email-infrastructure-high-volume'), permanent: true },
      { source: '/learn/best-cold-email-infrastructure-microsoft-365', destination: www('/learn/best-email-infrastructure-microsoft-365'), permanent: true },
      { source: '/learn/best-cold-email-infrastructure-startups-2026', destination: www('/learn/best-email-infrastructure-startups-2026'), permanent: true },
      { source: '/learn/best-cold-email-infrastructure-under-50-mailboxes', destination: www('/learn/best-email-infrastructure-under-50-mailboxes'), permanent: true },
      { source: '/learn/best-cold-email-sequencers-2026', destination: www('/learn/best-email-sequencers-2026'), permanent: true },
      { source: '/learn/best-domain-extensions-cold-email', destination: www('/learn/best-domain-extensions-email'), permanent: true },
      { source: '/learn/cheapest-cold-email-infrastructure-2026', destination: www('/learn/cheapest-email-infrastructure-2026'), permanent: true },
      { source: '/learn/cold-email-ab-testing-guide', destination: www('/learn/email-ab-testing-guide'), permanent: true },
      { source: '/learn/cold-email-bounce-rate-benchmarks', destination: www('/learn/email-bounce-rate-benchmarks'), permanent: true },
      { source: '/learn/cold-email-compliance-gdpr-can-spam', destination: www('/learn/email-compliance-gdpr-can-spam'), permanent: true },
      { source: '/learn/cold-email-deliverability-statistics-2026', destination: www('/learn/email-deliverability-statistics-2026'), permanent: true },
      { source: '/learn/cold-email-domain-setup-checklist', destination: www('/learn/email-domain-setup-checklist'), permanent: true },
      { source: '/learn/cold-email-infrastructure-australia', destination: www('/learn/email-infrastructure-australia'), permanent: true },
      { source: '/learn/cold-email-infrastructure-canada', destination: www('/learn/email-infrastructure-canada'), permanent: true },
      { source: '/learn/cold-email-infrastructure-comparison-2026', destination: www('/learn/email-infrastructure-comparison-2026'), permanent: true },
      { source: '/learn/cold-email-infrastructure-consulting', destination: www('/learn/email-infrastructure-consulting'), permanent: true },
      { source: '/learn/cold-email-infrastructure-ecommerce', destination: www('/learn/email-infrastructure-ecommerce'), permanent: true },
      { source: '/learn/cold-email-infrastructure-financial-services', destination: www('/learn/email-infrastructure-financial-services'), permanent: true },
      { source: '/learn/cold-email-infrastructure-france', destination: www('/learn/email-infrastructure-france'), permanent: true },
      { source: '/learn/cold-email-infrastructure-germany', destination: www('/learn/email-infrastructure-germany'), permanent: true },
      { source: '/learn/cold-email-infrastructure-healthcare', destination: www('/learn/email-infrastructure-healthcare'), permanent: true },
      { source: '/learn/cold-email-infrastructure-india', destination: www('/learn/email-infrastructure-india'), permanent: true },
      { source: '/learn/cold-email-infrastructure-legal', destination: www('/learn/email-infrastructure-legal'), permanent: true },
      { source: '/learn/cold-email-infrastructure-manufacturing', destination: www('/learn/email-infrastructure-manufacturing'), permanent: true },
      { source: '/learn/cold-email-infrastructure-netherlands', destination: www('/learn/email-infrastructure-netherlands'), permanent: true },
      { source: '/learn/cold-email-infrastructure-real-estate', destination: www('/learn/email-infrastructure-real-estate'), permanent: true },
      { source: '/learn/cold-email-infrastructure-recruitment', destination: www('/learn/email-infrastructure-recruitment'), permanent: true },
      { source: '/learn/cold-email-infrastructure-saas', destination: www('/learn/email-infrastructure-saas'), permanent: true },
      { source: '/learn/cold-email-infrastructure-setup-guide', destination: www('/learn/email-infrastructure-setup-guide'), permanent: true },
      { source: '/learn/cold-email-infrastructure-solo-founders', destination: www('/learn/email-infrastructure-solo-founders'), permanent: true },
      { source: '/learn/cold-email-infrastructure-staffing', destination: www('/learn/email-infrastructure-staffing'), permanent: true },
      { source: '/learn/cold-email-infrastructure-startups', destination: www('/learn/email-infrastructure-startups'), permanent: true },
      { source: '/learn/cold-email-infrastructure-uk', destination: www('/learn/email-infrastructure-uk'), permanent: true },
      { source: '/learn/cold-email-infrastructure-us', destination: www('/learn/email-infrastructure-us'), permanent: true },
      { source: '/learn/cold-email-latin-america-vs-us', destination: www('/learn/email-latin-america-vs-us'), permanent: true },
      { source: '/learn/cold-email-reply-rate-benchmarks-2026', destination: www('/learn/email-reply-rate-benchmarks-2026'), permanent: true },
      { source: '/learn/cold-email-sending-volume-limits-guide', destination: www('/learn/email-sending-volume-limits-guide'), permanent: true },
      { source: '/learn/cold-email-sequencer-integration-guide', destination: www('/learn/email-sequencer-integration-guide'), permanent: true },
      { source: '/learn/cold-email-warmup-guide', destination: www('/learn/email-warmup-guide'), permanent: true },
      { source: '/learn/cold-emails-going-to-spam-gmail-fix', destination: www('/learn/emails-going-to-spam-gmail-fix'), permanent: true },
      { source: '/learn/dkim-setup-cold-email', destination: www('/learn/dkim-setup-email'), permanent: true },
      { source: '/learn/dmarc-setup-cold-email', destination: www('/learn/dmarc-setup-email'), permanent: true },
      { source: '/learn/google-workspace-alternatives-cold-email', destination: www('/learn/google-workspace-alternatives-email'), permanent: true },
      { source: '/learn/google-workspace-vs-microsoft-365-cold-email', destination: www('/learn/google-workspace-vs-microsoft-365-email'), permanent: true },
      { source: '/learn/how-many-domains-cold-email', destination: www('/learn/how-many-domains-email'), permanent: true },
      { source: '/learn/ip-rotation-cold-email', destination: www('/learn/ip-rotation-email'), permanent: true },
      { source: '/learn/launch-cold-email-campaign-same-day', destination: www('/learn/launch-email-campaign-same-day'), permanent: true },
      { source: '/learn/mailtrap-alternatives-cold-email', destination: www('/learn/mailtrap-alternatives-email'), permanent: true },
      { source: '/learn/microsoft-365-alternatives-cold-email', destination: www('/learn/microsoft-365-alternatives-email'), permanent: true },
      { source: '/learn/microsoft-365-cold-email-spam-fix', destination: www('/learn/microsoft-365-email-spam-fix'), permanent: true },
      { source: '/learn/outreachbloom-ai-seo-cold-email-reddit', destination: www('/learn/outreachbloom-ai-seo-email-reddit'), permanent: true },
      { source: '/learn/scale-cold-email-100-to-10000', destination: www('/learn/scale-email-100-to-10000'), permanent: true },
      { source: '/learn/soft-bounce-cold-email-fix', destination: www('/learn/soft-bounce-email-fix'), permanent: true },
      { source: '/learn/spf-record-setup-cold-email', destination: www('/learn/spf-record-setup-email'), permanent: true },
      { source: '/learn/why-cold-emails-go-to-spam', destination: www('/learn/why-emails-go-to-spam'), permanent: true },
      { source: '/cold-email-warmup', destination: www('/email-warmup'), permanent: true },
      // Retired during the Infrabox rebrand: the SendKit review and integration guide
      // covered the old company's sister brand. Point them at the closest live pages.
      { source: '/learn/sendkit-review', destination: www('/learn/best-email-sequencers-2026'), permanent: true },
      { source: '/learn/infrabox-sendkit-integration', destination: www('/learn/email-sequencer-integration-guide'), permanent: true },
      // Apex → www catch-all (LAST — only paths not already redirected above)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'infrabox.software' }],
        destination: 'https://www.infrabox.software/:path*',
        permanent: true,
      },
    ];
  },
};

module.exports = withMDX(nextConfig);
