// Paths kept out of search and AI crawls: admin UI, all internal/tool APIs,
// short-link redirector /r/, and /v1/ - REST endpoint paths that live on
// api.infrabox.software but get resolved against this host when the API docs render
// them as relative links (5 such URLs showed up in GSC's 404 report).
// Per robots.txt rules, each per-agent block stands on its own - so we apply
// the same disallow list to every allow block.
const DISALLOW = ['/admin/', '/api/', '/r/', '/v1/'];
// AI-only disallow: keep the AUP out of training / AI-search crawls while
// leaving general search engines free to index it.
const AI_DISALLOW = [...DISALLOW, '/acceptable-use-policy'];

const allow = (userAgent, extra = {}) => ({
  userAgent,
  allow: '/',
  disallow: DISALLOW,
  ...extra,
});

const allowAI = (userAgent) => ({ userAgent, allow: '/', disallow: AI_DISALLOW });
const block = (userAgent) => ({ userAgent, disallow: '/' });

export default function robots() {
  return {
    rules: [
      allow('*'),
      allow('Googlebot'),
      allow('Bingbot', { crawlDelay: 1 }),
      // AI crawlers - allow for AEO/GEO visibility, but disallow /acceptable-use-policy
      allowAI('GPTBot'),
      allowAI('ChatGPT-User'),
      allowAI('OAI-SearchBot'),
      allowAI('Claude-Web'),
      allowAI('ClaudeBot'),
      allowAI('anthropic-ai'),
      allowAI('PerplexityBot'),
      allowAI('Google-Extended'),
      allowAI('cohere-ai'),
      allowAI('YouBot'),
      allowAI('meta-externalagent'),
      allowAI('Applebot-Extended'),
      allowAI('CCBot'),
      // SEO audit tools
      allow('SiteGuruCrawler'),
      // Block aggressive SEO crawlers
      block('AhrefsBot'),
      block('SemrushBot'),
      block('DotBot'),
      block('MJ12bot'),
      block('Bytespider'),
    ],
    sitemap: 'https://www.infrabox.software/sitemap.xml',
    host: 'https://www.infrabox.software',
  };
}
