export const article = {
  slug: "mx-records-explained",
  title: "MX Records Explained for Multi-Domain Email Routing (2026)",
  metaDescription:
    "How MX records work for multi-domain email routing at email scale. Priority values, example MX setups, common misconfigurations, and deliverability impact.",
  headline: "MX Records for Multi-Domain Email Routing",
  publishedAt: "2026-06-18",
  updatedAt: "2026-06-18",
  author: "Mohit Mimani",
  category: "Technical",
  readingTime: "11 min read",
  tags: ["MX records", "email routing", "multi-domain", "deliverability"],
  excerpt:
    "MX records decide where inbound mail for a domain goes. This guide covers how they work, what priority values mean, how to manage routing across many domains for email, and the misconfigurations that break replies.",
  type: "guide",
  sections: [
    {
      heading: "What MX Records Do",
      content:
        "An MX record (mail exchanger) tells the world which server accepts inbound email for a domain. When someone replies to your email, their mail server looks up the MX record for your domain to find out where to deliver the reply. No MX record, no inbound mail. That makes MX the routing layer of email.\n\nFor email this matters in two directions. Inbound, your MX has to point at the mailbox provider that actually holds the mailbox so replies land where you can read them. Outbound, the presence of a valid MX is one of the signals receivers use to judge whether a domain is a real mail domain rather than a throwaway.\n\nMX records are defined in [RFC 5321](https://www.rfc-editor.org/rfc/rfc5321), which specifies how a sender resolves a recipient domain to a mail exchanger and what the priority values mean. An MX record always points to a hostname, never directly to an IP address, and that hostname must itself resolve through an A or AAAA record.\n\n| Record | Points to | Purpose |\n|--------|-----------|---------|\n| MX | A hostname | Where inbound mail is delivered |\n| A / AAAA | An IP | Resolves the MX hostname |\n| SPF (TXT) | n/a | Authorizes outbound senders |\n\nA frequent misconception is that the MX record affects where your outbound mail comes from. It does not. Outbound sending is governed by SPF, DKIM, and the sending server. MX is strictly about where inbound mail arrives.",
    },
    {
      heading: "How Priority Values Work",
      content:
        "Each MX record carries a priority number, sometimes called the preference value. Lower numbers mean higher priority. A sending server tries the lowest-numbered MX first, and only moves to higher-numbered ones if the preferred server is unreachable.\n\nConsider a domain with two MX records, priority 1 and priority 5. Mail goes to the priority 1 host. If that host refuses the connection or times out, the sender falls back to the priority 5 host. This gives redundancy: a backup mail server can catch mail when the primary is down, then forward it on.\n\nWhen two MX records share the same priority, the sender picks between them roughly at random, which spreads load across equal servers. Mailbox providers use this to balance inbound traffic across their infrastructure.\n\n| Priority | Role | Used when |\n|----------|------|-----------|\n| 1 (lowest number) | Primary | Always tried first |\n| 5, 10 | Secondary / backup | Primary unreachable |\n| Equal values | Load balanced | Random among equals |\n\nThe priority numbers themselves are arbitrary; only their relative order matters. A domain with MX values of 1 and 5 behaves the same as one with 10 and 20. What matters is which number is lower. Google Workspace and Microsoft 365 publish their own recommended MX values, and you should use exactly what the provider specifies rather than inventing your own.",
    },
    {
      heading: "Example MX Setups",
      content:
        "The exact MX records depend on which mailbox provider holds the domain's mail. Below are the common patterns. Always copy the current values from your provider's admin console, since providers occasionally update them.\n\n| Provider | MX host | Priority |\n|----------|---------|----------|\n| Google Workspace (modern) | smtp.google.com | 1 |\n| Microsoft 365 | yourdomain-com.mail.protection.outlook.com | 0 |\n| Legacy Google (multi-record) | aspmx.l.google.com | 1 |\n| Legacy Google alt | alt1.aspmx.l.google.com | 5 |\n| Legacy Google alt | alt2.aspmx.l.google.com | 5 |\n\nGoogle Workspace now supports a single MX record, `smtp.google.com` at priority 1, which replaces the older five-record set. The older set still works but the single record is simpler and less error-prone. Microsoft 365 uses one MX record whose host is derived from your domain name, found under the domain's DNS records in the Microsoft admin center.\n\nA critical rule: a domain should point its MX at exactly one provider. Mixing Google and Microsoft MX records on the same domain causes unpredictable routing because the sender will sometimes pick the wrong provider's server, which then rejects mail for a mailbox it does not host. Pick one provider per domain.\n\nThe full set of records that accompany MX, including SPF, DKIM, and DMARC, are covered in the [DNS setup guide](/learn/dns-setup-guide). MX is one row in that table, but it is the row that controls replies.",
    },
    {
      heading: "Multi-Domain Routing for Email at Scale",
      content:
        "Email programs rarely run on one domain. To protect the primary brand domain and to spread sending volume, teams register multiple secondary domains, each with its own mailboxes. Every one of those domains needs its own MX record pointing at the provider that hosts its mailboxes.\n\nThe routing model is simple per domain but multiplies with scale. If you run 30 secondary domains across two mailbox providers, that is 30 MX configurations to get right and keep right. Each domain's MX is independent; there is no shared MX across domains.\n\n| Scale | Domains | MX configs to maintain | Risk area |\n|-------|---------|------------------------|-----------|\n| Small | 1 to 3 | 1 to 3 | Manual, low |\n| Mid | 5 to 20 | 5 to 20 | Copy errors, drift |\n| Large | 20+ | 20+ | Consistency at scale |\n\nThe failure mode at scale is inconsistency. One domain gets a typo in its MX host, another never had MX added, a third still points at an old provider after a migration. Each of those breaks replies for that domain silently, because the sender does not error visibly. Prospects who reply simply never reach you.\n\nThis is why bulk DNS management matters for multi-domain programs. Applying the same correct MX set across many domains in one operation, rather than editing each by hand, removes the drift. See [bulk DNS updates](/learn/bulk-dns-updates) for that workflow and the [email domain setup checklist](/learn/email-domain-setup-checklist) for the per-domain baseline.",
    },
    {
      heading: "Common MX Misconfigurations",
      content:
        "These are the mistakes that break inbound mail, ordered by how often they show up.\n\n1. **No MX record at all.** The domain was set up for outbound sending but never had an MX added. Replies bounce or vanish. Receivers also treat a domain with no MX as less likely to be a real mail domain, which can hurt outbound reputation.\n\n2. **MX pointing at the wrong provider.** After migrating from one provider to another, the old MX is left in place. Mail routes to a server that no longer hosts the mailbox and is rejected.\n\n3. **Mixed providers on one domain.** Both Google and Microsoft MX records present. The sender picks one at random by priority, and roughly half the mail hits the wrong server.\n\n4. **MX pointing at an IP address.** An MX record must point at a hostname, not an IP. Pointing it at an IP is invalid and many senders will refuse it.\n\n5. **MX host that does not resolve.** The MX points at a hostname with no A record. The lookup fails and mail cannot be delivered.\n\n6. **Wrong priority order or duplicate primary.** Two records both claiming the lowest priority, or a backup ranked above the primary, causing routing to the wrong server.\n\n| Misconfiguration | Symptom | Fix |\n|------------------|---------|-----|\n| No MX | Replies bounce or disappear | Add provider MX |\n| Wrong provider | Mail rejected | Update to current provider |\n| Mixed providers | Intermittent failures | Use one provider only |\n| MX to IP | Invalid record | Point at a hostname |\n| Unresolvable host | Lookup fails | Ensure A record exists |\n\nVerify any MX change with a lookup before trusting it. The [Google Workspace Toolbox](https://toolbox.googleapps.com/apps/dig/) and MXToolbox both show the live MX set for a domain.",
    },
    {
      heading: "How MX Interacts with Deliverability",
      content:
        "MX is mainly about inbound routing, but it touches outbound deliverability in two ways.\n\nFirst, a valid MX record is a positive signal. Receivers and filtering systems check whether a sending domain looks like a complete, real mail domain. A domain with MX, SPF, DKIM, and DMARC all present reads as legitimate. A domain sending email with no MX record at all looks half-configured and can attract extra scrutiny.\n\nSecond, MX makes replies possible, and replies are themselves a deliverability signal. Positive engagement, including replies, feeds mailbox provider reputation models. If your MX is broken, prospects who would have replied cannot, so you lose both the conversation and the engagement signal. A campaign that generates replies the system never receives is strictly worse than one where MX routes correctly.\n\n| Factor | MX role | Effect |\n|--------|---------|--------|\n| Domain completeness | MX present | Looks like a real mail domain |\n| Reply capture | MX routes inbound | Conversations reach you |\n| Engagement signal | Replies delivered | Feeds positive reputation |\n| Authentication | None directly | Handled by SPF/DKIM/DMARC |\n\nMX does not authenticate outbound mail; that is the job of SPF, DKIM, and DMARC, explained in [email authentication explained](/learn/email-authentication-spf-dkim-dmarc-explained). But a domain that cannot receive mail is incomplete, and incomplete domains underperform. Treat MX as a required part of the record set, not an afterthought, and confirm it on every domain you send from.",
    },
    {
      heading: "Managing MX Across Many Domains Without Drift",
      content:
        "The hard part of MX is not understanding it; the model is straightforward. The hard part is keeping it correct and identical across every domain in a multi-domain program as domains are added, migrated, and retired. Manual editing per domain is where typos and stale records creep in.\n\nTwo approaches keep MX consistent. The first is bulk DNS management, applying a vetted MX set across many domains in one operation and re-checking it on a schedule. The second is managed mailboxes, where the platform owns the record set per domain.\n\nThat is the Infrabox model. When a mailbox is created on real Google Workspace, Microsoft 365, or Azure infrastructure, the MX record is configured automatically through Cloudflare alongside SPF, DKIM, and DMARC, in under 60 seconds, pointing at the correct provider for that mailbox. InfraGuard then watches DNS continuously, so an MX record that drifts or gets overwritten is caught rather than silently breaking replies.\n\n| Approach | MX consistency | Effort per domain |\n|----------|----------------|-------------------|\n| Manual per domain | Drifts over time | High |\n| Bulk DNS updates | Consistent | Low |\n| Managed mailboxes | Maintained automatically | None |\n\nThe takeaway: MX is one record, but at scale it is one record times every domain, and every one has to be right or that domain loses its replies. Whether you manage it in bulk or through managed infrastructure, verify it on each domain and watch it for drift. For related routing topics see [reverse DNS and deliverability](/learn/reverse-dns-deliverability) and [bulk DNS updates](/learn/bulk-dns-updates).",
    },
  ],
  faqs: [
    {
      question: "What does an MX record actually do?",
      answer:
        "An MX record tells sending mail servers which server accepts inbound email for a domain. When someone replies to your email, their server looks up your domain's MX record to find where to deliver the reply. Without a valid MX record, inbound mail has nowhere to go and replies bounce or disappear.",
    },
    {
      question: "What do MX priority values mean?",
      answer:
        "Priority is a preference number where lower means higher priority. Senders try the lowest-numbered MX host first and fall back to higher-numbered hosts only if the primary is unreachable. The actual numbers are arbitrary; only their relative order matters. Equal priorities are load balanced roughly at random.",
    },
    {
      question: "Can I point one domain's MX at both Google and Microsoft?",
      answer:
        "No. A domain's mail should be hosted by one provider, and its MX should point only at that provider. Mixing Google and Microsoft MX records causes senders to route some mail to the wrong server, which rejects it because it does not host that mailbox. Pick one provider per domain.",
    },
    {
      question: "Does the MX record affect outbound email or just inbound?",
      answer:
        "MX governs inbound routing only. Outbound mail is governed by the sending server plus SPF, DKIM, and DMARC. That said, a valid MX makes a domain look like a complete mail domain, and it lets replies reach you, which feeds positive engagement signals, so it indirectly supports outbound deliverability.",
    },
    {
      question: "How do I keep MX records consistent across many email domains?",
      answer:
        "Use bulk DNS management to apply one vetted MX set across all domains at once and re-check on a schedule, or use managed mailboxes where the platform sets and watches MX per domain. Infrabox configures MX automatically through Cloudflare per mailbox and monitors it with InfraGuard to catch drift.",
    },
  ],
  sources: [
    {
      title: "RFC 5321: Simple Mail Transfer Protocol",
      url: "https://www.rfc-editor.org/rfc/rfc5321",
      date: "2025",
    },
    {
      title: "RFC 1035: Domain Names, Implementation and Specification",
      url: "https://www.rfc-editor.org/rfc/rfc1035",
      date: "2025",
    },
    {
      title: "Google Workspace: Set up MX records for email",
      url: "https://support.google.com/a/answer/140034",
      date: "2025",
    },
    {
      title: "Cloudflare DNS: Email records guidance",
      url: "https://developers.cloudflare.com/dns/manage-dns-records/how-to/email-records/",
      date: "2025",
    },
  ],
  relatedSlugs: [
    "dns-setup-guide",
    "bulk-dns-updates",
    "email-domain-setup-checklist",
    "reverse-dns-deliverability",
  ],
};
