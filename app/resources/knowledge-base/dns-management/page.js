import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LearnToc from "@/components/learn/LearnToc";
import { LearnFaq } from "@/components/learn";
import { JsonLd, createWebPageSchema, createBreadcrumbSchema, createToolFaqSchema } from "@/components/seo/json-ld";

export const metadata = {
  title: "DNS Management Guide for Email: SPF, DKIM & DMARC Setup",
  description:
    "Complete guide to DNS management for email. Learn how Infrabox automates SPF, DKIM, and DMARC configuration in 60 seconds with zero errors.",
  alternates: { canonical: "https://www.infrabox.software/resources/knowledge-base/dns-management" },
};

const faqs = [
  {
    question: "What DNS records does Infrabox configure?",
    answer:
      "Infrabox automatically configures all essential email authentication records: SPF (Sender Policy Framework) to authorize sending servers, DKIM (DomainKeys Identified Mail) with 2048-bit encryption for message signing, DMARC policies with custom alignment settings, and MX records for routing. We also set optimal TTL values and configure BIMI for brand logo display when available.",
  },
  {
    question: "How long does DNS propagation take?",
    answer:
      "DNS propagation typically takes 24-48 hours globally. However, Infrabox sets optimal TTL values (300-3600 seconds) that achieve propagation within 1-4 hours for most regions. Our monitoring checks propagation status across 15+ global locations in real time.",
  },
  {
    question: "Can I use Infrabox with my existing DNS provider?",
    answer:
      "Yes. Infrabox integrates with Cloudflare (our recommended provider for automated setup), GoDaddy, Namecheap, AWS Route53, Google Cloud DNS, and more. For Cloudflare domains, setup is fully automated. For other providers, we generate the exact records you need with copy-paste instructions.",
  },
  {
    question: "What happens if I already have DNS records?",
    answer:
      "Infrabox scans your existing DNS configuration before making changes. We merge new requirements with existing records — for example, appending to an existing SPF record rather than overwriting it. If conflicts are detected, the system alerts you with specific resolution steps.",
  },
  {
    question: "What's the difference between SPF, DKIM, and DMARC?",
    answer:
      "SPF tells receiving mail servers which IPs are authorized to send email for your domain. DKIM adds a cryptographic signature to each email proving it hasn't been tampered with. DMARC ties SPF and DKIM together and tells receivers what to do when authentication fails (reject, quarantine, or none). All three are required for reliable email deliverability.",
  },
  {
    question: "Does Infrabox monitor DNS records after setup?",
    answer:
      "Yes. InfraGuard monitors your DNS records every 6 hours and alerts you immediately if any record is modified, deleted, or misconfigured. This catches issues like accidental record deletion, registrar changes, or provider updates before they impact deliverability.",
  },
];

const tocItems = [
  { id: "what-is-dns", label: "What Is DNS for Email?" },
  { id: "records-explained", label: "SPF, DKIM & DMARC Explained" },
  { id: "common-errors", label: "Common DNS Errors" },
  { id: "manual-vs-automated", label: "Manual vs Automated Setup" },
  { id: "how-infrabox-works", label: "How Infrabox DNS Works" },
  { id: "best-practices", label: "DNS Best Practices" },
  { id: "faq", label: "FAQ" },
];

export default function DNSManagementPage() {
  return (
    <>
      <JsonLd data={createWebPageSchema({
        name: "DNS Management for Email",
        description: "Complete guide to DNS management for email infrastructure. SPF, DKIM, DMARC setup and monitoring.",
        url: "https://www.infrabox.software/resources/knowledge-base/dns-management",
      })} />
      <JsonLd data={createBreadcrumbSchema([
        { name: "Home", url: "https://www.infrabox.software" },
        { name: "Resources", url: "https://www.infrabox.software/resources" },
        { name: "Knowledge Base", url: "https://www.infrabox.software/resources/knowledge-base" },
        { name: "DNS Management", url: "https://www.infrabox.software/resources/knowledge-base/dns-management" },
      ])} />
      <JsonLd data={createToolFaqSchema(faqs.map((f) => ({ question: f.question, answer: f.answer })))} />

      <Header />

      <main className="bg-white min-h-screen">
        <div className="flex max-w-6xl mx-auto">
          {/* Sidebar TOC */}
          <div className="hidden lg:block w-[280px] shrink-0 border-r border-gray-200 relative">
            <div className="sticky top-0 h-screen overflow-y-auto">
              <div className="p-6">
                <LearnToc items={tocItems} />
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0 px-6 lg:px-12">
            {/* Hero */}
            <div className="pt-8 pb-6 max-w-3xl">
              <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-8">
                <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
                <span>/</span>
                <Link href="/resources/knowledge-base" className="hover:text-gray-600 transition-colors">Knowledge Base</Link>
                <span>/</span>
                <span className="text-gray-600">DNS Management</span>
              </nav>

              <p className="font-mono text-xs font-medium uppercase tracking-[0.48px] text-[#1240cc] mb-4">DNS & Email Authentication</p>

              <h1 className="text-[32px] sm:text-[40px] md:text-[48px] font-bold text-gray-900 leading-[1.12] tracking-tight mb-5">
                DNS Management for Email
              </h1>

              <p className="text-base text-gray-500 leading-relaxed max-w-2xl mb-6">
                SPF, DKIM, and DMARC are the foundation of email deliverability. One misconfigured record can send every email to spam. This guide covers what each record does, common mistakes, and how Infrabox automates the entire process in under 60 seconds.
              </p>

              <div className="flex items-center gap-3 text-sm text-gray-400">
                <span>12 min read</span>
                <span>|</span>
                <span>Updated {new Date().toLocaleDateString("en-US", { year: "numeric", month: "short" })}</span>
              </div>
            </div>

            {/* Content */}
            <div className="max-w-3xl pb-16">

              {/* What Is DNS for Email */}
              <section id="what-is-dns" className="mb-12 scroll-mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What Is DNS for Email?</h2>
                <p className="text-[15px] text-gray-600 leading-[1.75] mb-4">
                  DNS (Domain Name System) is the internet's phone book — it translates domain names into IP addresses and stores configuration records that tell the world how your domain handles email. For email, three DNS records matter more than anything else: SPF, DKIM, and DMARC.
                </p>
                <p className="text-[15px] text-gray-600 leading-[1.75] mb-4">
                  Without these records, your emails have no way to prove they're legitimate. Gmail, Outlook, and other providers will either reject them outright or route them straight to spam. As of February 2024, Google and Yahoo require all bulk senders to have valid SPF, DKIM, and DMARC records — this is no longer optional.
                </p>
                <p className="text-[15px] text-gray-600 leading-[1.75]">
                  The challenge is that DNS configuration is technical, error-prone, and tedious to maintain across multiple domains. A single typo in an SPF record can break authentication for your entire domain. Infrabox solves this by automating the entire process through Cloudflare integration.
                </p>
              </section>

              {/* SPF, DKIM & DMARC Explained */}
              <section id="records-explained" className="mb-12 scroll-mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">SPF, DKIM & DMARC Explained</h2>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">SPF (Sender Policy Framework)</h3>
                    <p className="text-[15px] text-gray-600 leading-[1.75] mb-3">
                      SPF tells receiving mail servers which IP addresses and servers are authorized to send email on behalf of your domain. It's published as a TXT record in your DNS. When an email arrives, the receiving server checks the sending IP against your SPF record — if it doesn't match, the email fails SPF authentication.
                    </p>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3">
                      <p className="text-xs font-mono text-gray-500 mb-1">Example SPF Record</p>
                      <code className="text-sm font-mono text-gray-800">v=spf1 include:_spf.google.com ~all</code>
                    </div>
                    <p className="text-sm text-gray-500">
                      <strong>Key rule:</strong> You can only have ONE SPF record per domain. Multiple SPF records cause authentication to fail entirely. Infrabox automatically merges SPF includes when configuring new domains.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">DKIM (DomainKeys Identified Mail)</h3>
                    <p className="text-[15px] text-gray-600 leading-[1.75] mb-3">
                      DKIM adds a cryptographic signature to each outgoing email. The sending server signs the email with a private key, and the public key is published in your DNS as a TXT record. The receiving server uses the public key to verify the signature — proving the email hasn't been tampered with in transit and genuinely came from your domain.
                    </p>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3">
                      <p className="text-xs font-mono text-gray-500 mb-1">Example DKIM Record (selector: google)</p>
                      <code className="text-sm font-mono text-gray-800 break-all">v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNA...</code>
                    </div>
                    <p className="text-sm text-gray-500">
                      <strong>Key rule:</strong> DKIM uses selectors to support multiple signing keys. Each email provider (Google, Microsoft) has its own selector. Infrabox configures the correct selectors automatically for each provider.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">DMARC (Domain-based Message Authentication, Reporting & Conformance)</h3>
                    <p className="text-[15px] text-gray-600 leading-[1.75] mb-3">
                      DMARC ties SPF and DKIM together and tells receiving servers what to do when authentication fails. It has three policy levels: <strong>none</strong> (monitor only), <strong>quarantine</strong> (send to spam), and <strong>reject</strong> (block entirely). DMARC also provides reporting — you can receive aggregate reports showing who's sending email from your domain.
                    </p>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3">
                      <p className="text-xs font-mono text-gray-500 mb-1">Example DMARC Record</p>
                      <code className="text-sm font-mono text-gray-800">v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com; pct=100</code>
                    </div>
                    <p className="text-sm text-gray-500">
                      <strong>Best practice:</strong> Start with <code className="font-mono bg-gray-100 px-1 rounded">p=none</code> for monitoring, then move to <code className="font-mono bg-gray-100 px-1 rounded">p=quarantine</code> after confirming legitimate emails pass. Infrabox sets <code className="font-mono bg-gray-100 px-1 rounded">p=quarantine</code> by default for email domains.
                    </p>
                  </div>
                </div>
              </section>

              {/* Common DNS Errors */}
              <section id="common-errors" className="mb-12 scroll-mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Common DNS Errors That Kill Deliverability</h2>
                <p className="text-[15px] text-gray-600 leading-[1.75] mb-6">
                  These are the most frequent DNS mistakes we see across thousands of domains. Any one of them can cause all your emails to land in spam.
                </p>

                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2.5 text-left font-semibold text-gray-700 border-b border-gray-200">Error</th>
                        <th className="px-4 py-2.5 text-left font-semibold text-gray-700 border-b border-gray-200">Impact</th>
                        <th className="px-4 py-2.5 text-left font-semibold text-gray-700 border-b border-gray-200">Frequency</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Multiple SPF records on same domain", "SPF check fails entirely — all emails affected", "31% of domains"],
                        ["SPF syntax errors (missing spaces, wrong format)", "All emails marked as spam or rejected", "45% of domains"],
                        ["Missing or incorrect DKIM selector", "Email authentication fails silently", "38% of domains"],
                        ["DMARC policy set to reject too early", "Legitimate emails blocked before warmup completes", "52% of domains"],
                        ["TTL values set too high", "DNS changes take days instead of hours to propagate", "60% of domains"],
                        ["Forgetting to add MX records", "Reply emails bounce — can't receive any mail", "15% of domains"],
                      ].map(([error, impact, freq], i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                          <td className="px-4 py-2 text-gray-900 font-medium border-b border-gray-100">{error}</td>
                          <td className="px-4 py-2 text-gray-600 border-b border-gray-100">{impact}</td>
                          <td className="px-4 py-2 text-red-600 font-medium border-b border-gray-100">{freq}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Manual vs Automated */}
              <section id="manual-vs-automated" className="mb-12 scroll-mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Manual vs Automated DNS Setup</h2>
                <p className="text-[15px] text-gray-600 leading-[1.75] mb-6">
                  Setting up DNS manually for email requires researching record formats, accessing your registrar's panel, creating records one-by-one, and verifying each one propagated correctly. For a single domain, this takes about 2 hours. For 50 domains, it's a full week of work.
                </p>

                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2.5 text-left font-semibold text-gray-700 border-b border-gray-200">Step</th>
                        <th className="px-4 py-2.5 text-left font-semibold text-gray-700 border-b border-gray-200">Manual</th>
                        <th className="px-4 py-2.5 text-left font-semibold text-[#1240cc] border-b border-gray-200">
                          <span className="inline-flex items-center gap-1.5">
                            <img src="/logo.png" alt="" className="h-3.5 w-auto" />
                            Infrabox
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Research DNS requirements", "30 min", "Automatic"],
                        ["Access DNS management panel", "5 min", "10 seconds"],
                        ["Create & format records", "45 min", "Automatic"],
                        ["Add records to DNS", "15 min", "5 seconds"],
                        ["Wait for propagation", "24-48 hours", "24-48 hours"],
                        ["Verify records work", "20 min", "Automatic"],
                        ["Total active time", "~2 hours", "< 1 minute"],
                      ].map(([step, manual, infrabox], i) => (
                        <tr key={i} className={i === 6 ? "bg-emerald-50/50 font-semibold" : i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                          <td className="px-4 py-2 text-gray-900 border-b border-gray-100">{step}</td>
                          <td className="px-4 py-2 text-gray-600 border-b border-gray-100">{manual}</td>
                          <td className="px-4 py-2 text-[#1240cc] border-b border-gray-100">{infrabox}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* How Infrabox DNS Works */}
              <section id="how-infrabox-works" className="mb-12 scroll-mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">How Infrabox DNS Automation Works</h2>
                <p className="text-[15px] text-gray-600 leading-[1.75] mb-6">
                  Infrabox uses Cloudflare's API to automate the entire DNS configuration process. Here's what happens when you connect a domain:
                </p>

                <div className="space-y-6">
                  {[
                    {
                      step: "01",
                      title: "Domain connection",
                      desc: "You enter your domain in the Infrabox dashboard. If your domain is on Cloudflare, Infrabox connects via API for fully automated setup. For other registrars, you point your nameservers to Cloudflare (a one-time 2-minute change), and Infrabox handles everything from there.",
                    },
                    {
                      step: "02",
                      title: "Existing record scan",
                      desc: "Infrabox scans all existing DNS records on your domain. This prevents conflicts — for example, if you already have an SPF record for another service, Infrabox will merge the includes rather than creating a duplicate that would break authentication.",
                    },
                    {
                      step: "03",
                      title: "Record generation & deployment",
                      desc: "Based on whether you're setting up Google Workspace, Microsoft 365, or Azure, Infrabox generates the correct SPF, DKIM, DMARC, and MX records with optimal values. All records are deployed simultaneously via the Cloudflare API — no manual copying or pasting.",
                    },
                    {
                      step: "04",
                      title: "Verification & monitoring",
                      desc: "Infrabox verifies all records propagated correctly across global DNS servers. InfraGuard then monitors these records every 6 hours, alerting you instantly if anything changes. If a record is accidentally deleted or modified, you'll know within 6 hours — not when your bounce rate spikes.",
                    },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-5">
                      <span className="text-xl font-bold text-[#1240cc] shrink-0 mt-0.5">{item.step}</span>
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">{item.title}</h3>
                        <p className="text-[15px] text-gray-600 leading-[1.75]">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Best Practices */}
              <section id="best-practices" className="mb-12 scroll-mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">DNS Best Practices for Email</h2>

                <div className="space-y-4">
                  {[
                    {
                      title: "One SPF record per domain",
                      desc: "Never create multiple SPF TXT records. If you need to authorize multiple senders, combine all includes into a single record. Infrabox handles this merge automatically.",
                    },
                    {
                      title: "Start DMARC on quarantine, not reject",
                      desc: "Setting p=reject before your domain is warmed can block legitimate emails. Use p=quarantine during warmup, then upgrade to p=reject once you've confirmed all sending sources pass authentication.",
                    },
                    {
                      title: "Set TTL values between 300-3600 seconds",
                      desc: "Lower TTL values (300s = 5 minutes) mean DNS changes propagate faster but increase DNS lookup load. For email domains where you make infrequent changes, 3600s (1 hour) is optimal. Infrabox sets this automatically.",
                    },
                    {
                      title: "Use 2048-bit DKIM keys",
                      desc: "1024-bit DKIM keys are still common but increasingly considered weak. Infrabox configures 2048-bit keys by default for stronger cryptographic signing.",
                    },
                    {
                      title: "Monitor DNS records continuously",
                      desc: "DNS records can change due to registrar migrations, provider updates, or accidental edits. InfraGuard checks every 6 hours and alerts on any changes so issues are caught before they impact deliverability.",
                    },
                    {
                      title: "Keep SPF lookups under 10",
                      desc: "SPF has a 10-lookup limit. Exceeding this causes a permanent fail. If you use multiple email services (Google, Microsoft, marketing tools), your SPF includes can easily exceed this limit. Infrabox monitors your SPF lookup count and alerts you if you're approaching the limit.",
                    },
                  ].map((item, i) => (
                    <div key={i}>
                      <h3 className="text-base font-semibold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-[15px] text-gray-600 leading-[1.75]">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* CTA Banner */}
              <section className="mb-12">
                <div className="bg-[#1240cc] rounded-xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-white font-semibold text-lg">Automate your DNS setup</p>
                    <p className="text-white/60 text-sm">SPF, DKIM, DMARC configured in under 60 seconds. Zero errors.</p>
                  </div>
                  <a
                    href="https://app.infrabox.software/signup"
                    className="inline-flex items-center gap-2 bg-white text-[#1240cc] font-semibold text-sm px-6 py-2.5 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
                  >
                    Get Started
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                    </svg>
                  </a>
                </div>
              </section>

              {/* FAQ */}
              <section id="faq" className="mb-12 scroll-mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                <LearnFaq items={faqs} />
              </section>

              {/* Related */}
              <section className="mb-16">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Related Resources</h2>
                <div className="space-y-0">
                  {[
                    ["/resources/tools/spf-checker", "SPF Record Checker"],
                    ["/resources/tools/dkim-checker", "DKIM Record Checker"],
                    ["/resources/tools/dmarc-generator", "DMARC Record Generator"],
                    ["/resources/tools/dns-validator", "DNS Validator"],
                    ["/learn/email-infrastructure-setup-guide", "Email Infrastructure Setup Guide"],
                  ].map(([href, label]) => (
                    <Link key={href} href={href} className="flex items-center justify-between py-3 border-b border-gray-100 group">
                      <span className="text-sm text-gray-700 group-hover:text-[#1240cc] transition-colors">{label}</span>
                      <svg className="w-4 h-4 text-gray-300 group-hover:text-[#1240cc] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
