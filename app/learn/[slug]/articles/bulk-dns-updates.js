export const article = {
  slug: "bulk-dns-updates",
  title: "Bulk DNS Updates for Email at Scale: A How-To Guide",
  metaDescription:
    "Manage SPF, DKIM, DMARC, and MX records across dozens or hundreds of email domains. Compare registrar APIs, Cloudflare API, and templates, avoid drift, and verify changes.",
  headline: "How to Run Bulk DNS Updates Across Hundreds of Email Domains",
  publishedAt: "2026-06-18",
  updatedAt: "2026-06-18",
  author: "Mohit Mimani",
  category: "Technical",
  readingTime: "11 min read",
  tags: ["bulk dns", "email", "cloudflare api", "dns automation"],
  excerpt:
    "Editing SPF, DKIM, DMARC, and MX records by hand stops working once you pass a handful of domains. This guide shows how to template records, push them through registrar and Cloudflare APIs, prevent configuration drift, and verify every domain at scale.",
  type: "how-to",
  sections: [
    {
      heading: "Why manual DNS editing breaks at scale",
      content:
        "If you run email across more than a few sending domains, the DNS console becomes the bottleneck. Every domain needs the same four record types working together: an SPF record, a DKIM key, a DMARC policy, and MX records pointing at the right mailbox provider. Edit them one at a time across 50 domains and you will make mistakes. A trailing space in a TXT value, a DKIM selector copied from the wrong domain, an SPF record that points at the previous provider, and your deliverability quietly degrades.\n\nThe core problem is repetition with small variations. Most of the record is identical across domains. Only a few fields change: the DKIM public key, sometimes the DMARC reporting address, occasionally the MX host. Bulk DNS work is about separating the parts that stay the same from the parts that vary, then applying both programmatically.\n\nThis guide covers three approaches in order of effort: registrar APIs, the Cloudflare API, and a template-driven workflow that sits on top of either. It also covers the part most people skip, which is verifying that what you pushed actually resolves correctly before you start sending. For the underlying record syntax, see the [DNS setup guide](/learn/dns-setup-guide) and the [email domain setup checklist](/learn/email-domain-setup-checklist).",
    },
    {
      heading: "What records you are actually updating",
      content:
        "Before automating anything, be precise about what each record does and which part of it varies per domain. Getting this wrong in bulk multiplies the damage.\n\n| Record | Type | What stays the same | What varies per domain |\n| --- | --- | --- | --- |\n| SPF | TXT at root | The mechanism set (for example `include:` for your provider) | Rarely anything if all domains use one provider |\n| DKIM | TXT at `selector._domainkey` | The selector name pattern | The public key value, which is unique per domain |\n| DMARC | TXT at `_dmarc` | Policy and percentage | The `rua`/`ruf` reporting address sometimes |\n| MX | MX at root | Priority values | The mail host, if providers differ |\n\nThe takeaway: SPF and DMARC are usually copy-paste across domains, MX is copy-paste within a provider, and DKIM is the one record that is genuinely unique to each domain because each domain has its own key pair. Any bulk system has to treat the DKIM key as a per-domain variable while treating the rest as a shared template. For deeper field-by-field detail, read [SPF record setup](/learn/spf-record-setup-email), [DKIM setup](/learn/dkim-setup-email), and [DMARC setup](/learn/dmarc-setup-email). The combined model is explained in [email authentication explained](/learn/email-authentication-spf-dkim-dmarc-explained).",
    },
    {
      heading: "Approach 1: registrar APIs",
      content:
        "If your domains are registered and DNS-hosted at a registrar like Namecheap, GoDaddy, or Porkbun, the simplest path is the registrar's own API. You authenticate once, then loop over your domain list and POST the records.\n\nThe upside is that nothing moves. Your DNS stays where the domain is registered, so there is no nameserver change and no propagation wait for delegation. The downside is fragmentation. Each registrar has a different API shape, different rate limits, and different record-formatting quirks. If your domains are spread across three registrars, you maintain three integrations.\n\nA typical loop looks like this in pseudocode:\n\n```\nfor domain in domains:\n    api.set_record(domain, type=\"TXT\", host=\"@\", value=spf_template)\n    api.set_record(domain, type=\"TXT\", host=\"_dmarc\", value=dmarc_template)\n    api.set_record(domain, type=\"TXT\", host=f\"{selector}._domainkey\", value=dkim_keys[domain])\n    for mx in mx_template:\n        api.set_record(domain, type=\"MX\", host=\"@\", value=mx.host, priority=mx.priority)\n```\n\nWatch the rate limits. Many registrar APIs cap you at a handful of requests per second, so a few hundred domains with four-plus records each means you need to throttle and add retry-with-backoff. Registrar APIs are a reasonable choice when your domains already live at one registrar and you do not want to move DNS hosting.",
    },
    {
      heading: "Approach 2: the Cloudflare API",
      content:
        "The cleaner approach for email at scale is to point all your domains' nameservers at Cloudflare and manage DNS through one consistent API. You consolidate dozens of registrar dialects into a single, well-documented interface.\n\nThe Cloudflare model has two layers. Each domain is a zone, and each record is created against that zone's ID. So the workflow is: list zones to map domain names to zone IDs, then create or update records per zone. The [Cloudflare DNS records API docs](https://developers.cloudflare.com/api/resources/dns/subresources/records/) describe the create, update, and list endpoints.\n\n```\n# 1. find the zone id for a domain\nGET https://api.cloudflare.com/client/v4/zones?name=example.com\n\n# 2. create a TXT record in that zone\nPOST https://api.cloudflare.com/client/v4/zones/{zone_id}/dns_records\n{ \"type\": \"TXT\", \"name\": \"example.com\", \"content\": \"v=spf1 include:... -all\", \"ttl\": 3600 }\n```\n\nCloudflare's API is consistent across every domain, has generous rate limits, and returns clear error objects when a record is malformed. The tradeoff is the one-time nameserver change at your registrar, which delegates DNS to Cloudflare and needs to propagate before records resolve. After that, every future bulk update runs through one API. This is the model Infrabox uses internally: it configures SPF, DKIM, DMARC, and MX automatically through Cloudflare in under 60 seconds per domain, which removes the per-domain scripting entirely.",
    },
    {
      heading: "Approach 3: template-driven workflows",
      content:
        "Whichever API you use, the layer that prevents mistakes is templating. Define your records once as a template with placeholders, store per-domain values separately, and render the final records at push time.\n\nA practical structure is two files. One template file holds the shared records with variables:\n\n```\n# template.yaml\nspf: \"v=spf1 include:_spf.{provider} -all\"\ndmarc: \"v=DMARC1; p=quarantine; rua=mailto:{rua}\"\nmx:\n  - { host: \"{mx_host}\", priority: 1 }\ndkim_selector: \"ik1\"\n```\n\nAnd one data file holds per-domain values, especially the DKIM keys that are unique per domain:\n\n```\n# domains.csv\ndomain,provider,rua,mx_host,dkim_key\nexample.com,_spf.google.com,dmarc@example.com,aspmx.l.google.com,\"v=DKIM1; k=rsa; p=MIGf...\"\n```\n\nA small renderer reads both, substitutes the variables, and produces the exact record set for each domain, which you then push through the chosen API. The benefit is that your shared policy lives in one place. Change the DMARC policy from `p=none` to `p=quarantine` once in the template and re-render, and every domain updates consistently. This is also how you avoid the silent drift covered next.",
    },
    {
      heading: "Avoiding configuration drift",
      content:
        "Drift is when domains that should be identical slowly diverge. Someone fixes one domain by hand in the console, a script half-runs and updates 80 of 100 domains, or a new batch gets a slightly different SPF include. Six weeks later you cannot answer the question \"are all my domains configured the same way?\" without checking each one.\n\nThree habits prevent drift:\n\n1. **Single source of truth.** The template plus data files are authoritative. Never edit a record directly in the console as a one-off, because the next render will not know about it. If a record needs changing, change the template or the data and re-render.\n2. **Idempotent pushes.** Write your update logic so re-running it produces the same end state. Look up the existing record, and if the value already matches, skip it; if it differs, update it; if it is missing, create it. Idempotent scripts are safe to re-run after a partial failure.\n3. **Continuous verification.** Periodically resolve the live records for every domain and compare them against what the template says they should be. Any mismatch is drift and gets flagged.\n\nFor managing many domains, automated DNS watching matters more than the initial push. Infrabox's InfraGuard monitors DNS records continuously and can auto-pause sending on a domain whose authentication breaks, which catches drift before it costs you inbox placement. If a domain shows up on a blocklist, the [check domain blacklisted guide](/learn/check-domain-blacklisted) covers next steps.",
    },
    {
      heading: "Verifying bulk changes before you send",
      content:
        "Pushing records is not the same as records being correct and live. Verification is a separate step, and at scale it has to be automated because eyeballing 200 domains is not realistic.\n\nResolve each record type directly against authoritative or public resolvers and check the value. Command-line `dig` is the workhorse:\n\n```\ndig +short TXT example.com               # SPF\ndig +short TXT _dmarc.example.com         # DMARC\ndig +short TXT ik1._domainkey.example.com # DKIM\ndig +short MX example.com                 # MX\n```\n\nWrap those in a loop over your domain list and assert that each returned value matches the template. Flag anything missing or mismatched. Two checks matter most for email: the SPF record must stay under the 10 DNS-lookup limit (an over-nested `include:` chain silently fails authentication), and the DKIM TXT value must match the key your provider expects exactly, with no line-wrap corruption.\n\n| Verification check | What pass looks like | Common failure |\n| --- | --- | --- |\n| SPF resolves and ends in `-all` or `~all` | One TXT, under 10 lookups | Multiple SPF TXTs, or over the lookup limit |\n| DKIM resolves at the selector | Public key matches provider | Wrong selector, or truncated key |\n| DMARC resolves at `_dmarc` | Valid `p=` policy | Syntax typo, missing `v=DMARC1` |\n| MX resolves to provider host | Correct host and priority | Stale host from old provider |\n\nFor a structured order of operations when something fails, follow the [DNS troubleshooting checklist](/learn/dns-troubleshooting-checklist). For a one-off web check, [MXToolbox](https://mxtoolbox.com/) covers SPF, DKIM, DMARC, and MX in a browser.",
    },
    {
      heading: "Choosing your method",
      content:
        "There is no single right answer, only a fit for your domain count, where DNS is hosted, and how much engineering time you want to spend.\n\n| Method | Best when | Effort | Drift risk |\n| --- | --- | --- | --- |\n| Manual console | Under ~5 domains | Low setup, high per-change | High |\n| Registrar API | Domains at one registrar, no DNS move wanted | Medium per registrar | Medium |\n| Cloudflare API | Many domains, want one interface | Medium setup, low ongoing | Low with idempotent pushes |\n| Template plus API | Any scale where consistency matters | Higher setup | Lowest |\n| Managed platform | You would rather not maintain scripts | Lowest ongoing | Lowest |\n\nMost email operators land on either the Cloudflare API with templates, or a managed platform. The build-it-yourself route gives full control and costs engineering time to maintain. A managed approach trades that control for speed. Infrabox sits in the managed category: it provisions real Google Workspace, Microsoft 365, and Azure mailboxes on US IPs, then writes SPF, DKIM, DMARC, and MX through Cloudflare in under 60 seconds per domain, with continuous monitoring after. See [what Infrabox is](/learn/what-is-infrabox) for how that fits a multi-domain setup, and [how many domains for email](/learn/how-many-domains-email) for sizing your fleet.",
    },
  ],
  faqs: [
    {
      question: "Can I change SPF, DKIM, DMARC, and MX across all domains at once?",
      answer:
        "Yes, but only DKIM is genuinely unique per domain because each domain has its own key pair. SPF, DMARC, and MX are usually identical across domains that share one mailbox provider, so you template those once and substitute the DKIM key per domain. A loop over your domain list through the Cloudflare API or a registrar API applies all four record types in one run.",
    },
    {
      question: "What causes DNS drift across email domains?",
      answer:
        "Drift happens when domains that should be identical diverge: someone edits one domain by hand, a script fails partway through a batch, or a new batch gets slightly different records. The fixes are a single source of truth (template plus data files), idempotent pushes you can safely re-run, and continuous verification that compares live records against the template.",
    },
    {
      question: "How do I verify bulk DNS changes are correct?",
      answer:
        "Resolve each record type with dig against your domain list and assert the returned value matches your template, or use a web tool like MXToolbox for spot checks. The two highest-value checks are that SPF stays under the 10 DNS-lookup limit and that the DKIM key resolves intact at the right selector. Automate this so you are checking every domain, not a sample.",
    },
    {
      question: "Should I use a registrar API or Cloudflare for bulk DNS?",
      answer:
        "Use a registrar API if all domains live at one registrar and you do not want to move DNS hosting. Use Cloudflare if your domains are spread across registrars or you want one consistent, well-documented API with high rate limits. Cloudflare requires a one-time nameserver change per domain but gives you a single interface for every future update.",
    },
  ],
  sources: [
    {
      title: "Cloudflare DNS Records API",
      url: "https://developers.cloudflare.com/api/resources/dns/subresources/records/",
      date: "2025",
    },
    {
      title: "MXToolbox SuperTool",
      url: "https://mxtoolbox.com/",
      date: "2025",
    },
  ],
  relatedSlugs: [
    "dns-setup-guide",
    "dns-troubleshooting-checklist",
    "email-domain-setup-checklist",
    "how-many-domains-email",
  ],
};
