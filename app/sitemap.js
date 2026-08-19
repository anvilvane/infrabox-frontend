import { getAllLearnSlugs, getAllLearnArticles } from './learn/[slug]/learn-data';
import { getAllCaseStudies } from './case-studies/[slug]/case-studies-data';
import { getPartners } from '@/lib/partner-directory';
import { getAllAuthorSlugs } from '@/lib/authors';

// Lazy imports for compare/alternatives - may not exist yet during build
let getAllComparisonSlugs, getAllAlternativesSlugs, getAllVsSlugs;
try {
  ({ getAllComparisonSlugs } = require('./compare/[slug]/compare-data'));
} catch { getAllComparisonSlugs = () => []; }
try {
  ({ getAllAlternativesSlugs } = require('./alternatives/[slug]/alternatives-data'));
} catch { getAllAlternativesSlugs = () => []; }
try {
  ({ getSelfCanonicalVsSlugs: getAllVsSlugs } = require('./alternatives/_vs/vs-data'));
} catch { getAllVsSlugs = () => []; }

export default async function sitemap() {
  const baseUrl = 'https://www.infrabox.software';
  // Evergreen pages (legal, product) keep a fixed date — bumping lastmod without a real
  // content change is a false-freshness signal Google discounts.
  const staticLastModified = new Date('2026-06-19');
  // Hub/index pages aggregate continuously-growing content (new learn articles, case
  // studies, tools), so each deploy genuinely refreshes them. Use the build time as their
  // honest lastmod so newly published children surface a fresh signal on their parent hub.
  const hubLastModified = new Date();

  // Core pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: hubLastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    // Product pages
    {
      url: `${baseUrl}/azure-mailboxes`,
      lastModified: staticLastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/email-warmup`,
      lastModified: staticLastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/email-deliverability`,
      lastModified: staticLastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/agency-email-solution`,
      lastModified: staticLastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    // Pricing
    {
      url: `${baseUrl}/pricing`,
      lastModified: staticLastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    // Knowledge Base
    {
      url: `${baseUrl}/resources/knowledge-base`,
      lastModified: staticLastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/resources/knowledge-base/dns-management`,
      lastModified: staticLastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/resources/knowledge-base/google-workspace-accounts`,
      lastModified: staticLastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/resources/knowledge-base/google-panel-checker`,
      lastModified: staticLastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/resources/knowledge-base/google-disruption`,
      lastModified: staticLastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/resources/knowledge-base/google-suspension`,
      lastModified: staticLastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Partnership
    {
      url: `${baseUrl}/affiliates`,
      lastModified: staticLastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/partners`,
      lastModified: staticLastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/partners/become-a-partner`,
      lastModified: staticLastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/creators`,
      lastModified: staticLastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified: staticLastModified,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    // Resources hub
    {
      url: `${baseUrl}/resources`,
      lastModified: hubLastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Guides index only; individual /resources/guides/* pages 301 to /learn/*-guide (see next.config.js) and are excluded from the sitemap.
    {
      url: `${baseUrl}/resources/guides`,
      lastModified: staticLastModified,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // Tools hub
    {
      url: `${baseUrl}/resources/tools`,
      lastModified: hubLastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Tutorials
    {
      url: `${baseUrl}/tutorials`,
      lastModified: staticLastModified,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // Authors hub (E-E-A-T)
    {
      url: `${baseUrl}/authors`,
      lastModified: staticLastModified,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Tools pages
  const toolSlugs = [
    'bimi-checker', 'bimi-generator', 'blacklist-checker', 'deliverability-score',
    'dkim-checker', 'dkim-generator', 'dmarc-checker', 'dmarc-generator',
    'dns-checker', 'dns-validator', 'domain-scanner', 'email-header-analyzer',
    'email-permutator', 'email-verifier', 'mailbox-calculator', 'mta-sts-checker',
    'reputation-check', 'spam-checker', 'spf-checker', 'spf-generator', 'spf-raw-checker',
  ];

  const toolPages = toolSlugs.map((slug) => ({
    url: `${baseUrl}/resources/tools/${slug}`,
    lastModified: staticLastModified,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Compare pages
  let comparePages = [];
  try {
    // These /compare slugs 301-redirect to their /alternatives equivalent
    // (see next.config.js redirects), so they must not appear in the sitemap —
    // the canonical /alternatives/* URLs are emitted from getAllAlternativesSlugs() below.
    const REDIRECTED_COMPARE_SLUGS = new Set(['apollo', 'gmass', 'lemlist', 'salesforge']);
    const compareSlugs = getAllComparisonSlugs().filter(
      (slug) => !REDIRECTED_COMPARE_SLUGS.has(slug)
    );
    comparePages = [
      {
        url: `${baseUrl}/compare`,
        lastModified: hubLastModified,
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      ...compareSlugs.map((slug) => ({
        url: `${baseUrl}/compare/${slug}`,
        lastModified: staticLastModified,
        changeFrequency: 'monthly',
        priority: 0.8,
      })),
    ];
  } catch { /* compare pages not created yet */ }

  // Alternatives pages
  let alternativesPages = [];
  try {
    const altSlugs = getAllAlternativesSlugs();
    alternativesPages = [
      {
        url: `${baseUrl}/alternatives`,
        lastModified: hubLastModified,
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      ...altSlugs.map((slug) => ({
        url: `${baseUrl}/alternatives/${slug}`,
        lastModified: staticLastModified,
        changeFrequency: 'monthly',
        priority: 0.8,
      })),
    ];
  } catch { /* alternatives pages not created yet */ }

  // Head-to-head "<competitor>-vs-infrabox" landing pages (static folders under
  // /alternatives). zapmail-vs-infrabox predates the shared vs-data module, so it
  // is listed explicitly alongside the data-driven slugs.
  let vsPages = [];
  try {
    const vsSlugs = getAllVsSlugs();
    vsPages = vsSlugs.map((slug) => ({
      url: `${baseUrl}/alternatives/${slug}`,
      lastModified: staticLastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    }));
  } catch { /* vs pages not created yet */ }

  // Learn pages
  let learnPages = [];
  try {
    const learnArticles = getAllLearnArticles();
    learnPages = [
      {
        url: `${baseUrl}/learn`,
        lastModified: hubLastModified,
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      ...learnArticles.map((article) => ({
        url: `${baseUrl}/learn/${article.slug}`,
        lastModified: article.updatedAt ? new Date(article.updatedAt) : staticLastModified,
        changeFrequency: 'monthly',
        priority: 0.7,
      })),
    ];
  } catch {
    learnPages = [{
      url: `${baseUrl}/learn`,
      lastModified: hubLastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    }];
  }

  // Case study pages
  let caseStudyPages = [];
  try {
    const caseStudies = getAllCaseStudies();
    caseStudyPages = [
      {
        url: `${baseUrl}/customer-stories/case-studies`,
        lastModified: hubLastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      ...caseStudies.map((study) => ({
        url: `${baseUrl}/case-studies/${study.slug}`,
        lastModified: study.updatedAt ? new Date(study.updatedAt) : staticLastModified,
        changeFrequency: 'monthly',
        priority: 0.7,
      })),
    ];
  } catch {
    caseStudyPages = [{
      url: `${baseUrl}/case-studies`,
      lastModified: hubLastModified,
      changeFrequency: 'weekly',
      priority: 0.7,
    }];
  }

  // Customer Stories — Wall of Love, G2 Reviews, and Video Testimonials (indexable real content)
  const customerStoriesPages = [
    'wall-of-love',
    'g2-reviews',
    'video-testimonials',
  ].map((slug) => ({
    url: `${baseUrl}/customer-stories/${slug}`,
    lastModified: hubLastModified,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Legal pages
  const legalPages = [
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: staticLastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/refund-policy`,
      lastModified: staticLastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: staticLastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/acceptable-use-policy`,
      lastModified: staticLastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Partner directory profiles (data from API; falls back to empty on failure)
  let partnerPages = [];
  try {
    const grouped = await getPartners();
    const all = Object.values(grouped || {}).flat();
    partnerPages = all
      .filter((p) => p && p.slug)
      .map((p) => ({
        url: `${baseUrl}/partners/${p.slug}`,
        lastModified: staticLastModified,
        changeFrequency: 'monthly',
        priority: 0.6,
      }));
  } catch {
    partnerPages = [];
  }

  // Author profile pages (E-E-A-T). Source: lib/authors.js
  let authorPages = [];
  try {
    authorPages = getAllAuthorSlugs().map((slug) => ({
      url: `${baseUrl}/author/${slug}`,
      lastModified: staticLastModified,
      changeFrequency: 'monthly',
      priority: 0.4,
    }));
  } catch {
    authorPages = [];
  }

  return [
    ...staticPages,
    ...toolPages,
    ...comparePages,
    ...alternativesPages,
    ...vsPages,
    ...learnPages,
    ...caseStudyPages,
    ...customerStoriesPages,
    ...partnerPages,
    ...authorPages,
    ...legalPages,
  ];
}
