import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "./Reveal";
import ScaleOnScroll from "./ScaleOnScroll";
import TestimonialMarquee from "./TestimonialMarquee";
import {
  JsonLd,
  createWebPageSchema,
  createBreadcrumbSchema,
  createToolFaqSchema,
} from "@/components/seo/json-ld";

const PAGE_URL = "https://www.infrabox.software/alternatives/zapmail-vs-infrabox";
const PAGE_TITLE = "Meet the #1 Zapmail Alternative | Infrabox";
const PAGE_DESCRIPTION =
  "Discover the top alternative to Zapmail with Infrabox. Compare features, pricing, and benefits for your email setup. Make an informed choice today.";

export const metadata = {
  // `absolute` stops the root "%s | Infrabox" template doubling the suffix that
  // PAGE_TITLE already carries. Canonical points to /compare/zapmail so this
  // head-to-head conversion page doesn't cannibalize the same query (SEO audit).
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "https://www.infrabox.software/compare/zapmail" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    siteName: "Infrabox",
    type: "website",
    locale: "en_US",
    images: [{ url: "https://www.infrabox.software/opengraph-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

const FEATURE_GROUPS = [
  {
    title: "Pricing",
    rows: [
      { label: "Add-on mailbox cost", infrabox: "From $2.50", zapmail: "$3.00–$3.50" },
      { label: "Annual billing discount", infrabox: "Up to 20% off", zapmail: false },
      { label: "Entry plan (10 mailboxes)", infrabox: "$31–$39/mo", zapmail: "$39/mo" },
    ],
  },
  {
    title: "Mailbox Providers",
    rows: [
      { label: "Google Workspace", infrabox: true, zapmail: true },
      { label: "Microsoft 365", infrabox: true, zapmail: true },
      { label: "Microsoft Azure mailboxes", infrabox: true, zapmail: false },
      { label: "Official Google Cloud Partner", infrabox: true, zapmail: false },
      { label: "US-only IP infrastructure", infrabox: true, zapmail: false },
    ],
  },
  {
    title: "Core Features",
    rows: [
      { label: "Bulk mailbox setup", infrabox: true, zapmail: true },
      { label: "Automated DNS (SPF, DKIM, DMARC)", infrabox: true, zapmail: true },
      { label: "Built-in email warmup", infrabox: true, zapmail: false },
      { label: "Unlimited inbox placement testing", infrabox: true, zapmail: false },
      { label: "InfraGuard 24/7 domain monitoring", infrabox: true, zapmail: false },
      { label: "95% inbox delivery rate", infrabox: true, zapmail: false },
    ],
  },
  {
    title: "Others",
    rows: [
      { label: "Full API access on every plan", infrabox: true, zapmail: false },
      { label: "Platform integrations", infrabox: "24+", zapmail: "5" },
      { label: "Real-time monitoring & alerts", infrabox: true, zapmail: false },
      { label: "Live-chat support", infrabox: true, zapmail: true },
    ],
  },
];

const REASONS = [
  {
    eyebrow: "Reason #1",
    title: "Official Google Cloud Partner",
    body: "The only Official Google Cloud Partner in this space — with Azure mailbox support Zapmail doesn't offer.",
    bullets: [
      "Google Workspace + Microsoft 365",
      "Microsoft Azure mailboxes (Zapmail: not supported)",
      "Premium US-only IP infrastructure",
    ],
    image: "/images/dashboard/mailboxes.png",
    imageAlt: "Infrabox mailbox creation across providers",
  },
  {
    eyebrow: "Reason #2",
    title: "Fast setup, zero manual work",
    body: "Connect a domain in one click and start sending in about 10 minutes. DNS records configured automatically.",
    bullets: [
      "AI Mailbox Generator + AI Domain Generator",
      "Automated SPF, DKIM, DMARC for every domain",
      "Ready to send in ~10 minutes",
    ],
    image: "/images/dashboard/quick-setup.png",
    imageAlt: "Infrabox instant domain setup",
  },
  {
    eyebrow: "Reason #3",
    title: "Deliverability that's actually monitored",
    body: "95% inbox placement rate guaranteed, plus 24/7 InfraGuard monitoring. Zapmail offers neither.",
    bullets: [
      "95% guaranteed inbox placement rate",
      "InfraGuard 24/7 blacklist, DNS, and bounce monitoring",
      "Unlimited inbox placement testing on every plan",
    ],
    image: "/images/dashboard/infraguard.png",
    imageAlt: "Infrabox InfraGuard deliverability monitoring",
  },
];

const TESTIMONIALS = [
  {
    name: "Luka",
    role: "Manyreach",
    quote:
      "Burned through 9 domains in 6 weeks with our old setup. Same domains have been running fine on Infrabox since March.",
    image: "/testimonials/luka.jpeg",
  },
  {
    name: "Jayson DeMers",
    role: "EmailAnalytics",
    quote:
      "The unified inbox thing sounded like a gimmick until I realized my SDRs were missing replies across 30 different accounts.",
    image: "/testimonials/jayson-demers.jpeg",
  },
  {
    name: "Walter Winn",
    role: "Anevo Marketing",
    quote:
      "Our agency manages 40 client accounts now. Would have been impossible before this.",
    image: "/testimonials/walter-winn.jpeg",
  },
  {
    name: "Atishay Jain",
    role: "Eagle Info Services",
    quote:
      "Our ops guy used to manually configure DNS for every mailbox. Now he's actually doing ops work instead.",
    image: "/testimonials/atishay-jain.png",
  },
  {
    name: "Dimitar Petkov",
    role: "Leadhaste",
    quote:
      "My reply rate jumped from 2% to 11% and I literally changed nothing except moving to Infrabox infrastructure.",
    image: "/testimonials/dimitar-petkov.png",
  },
  {
    name: "Benjamin Douablin",
    role: "Fullenrich",
    quote:
      "Went from sending 800 emails a day to 12,000. Deliverability got better somehow. Still don't fully understand it.",
    image: "/testimonials/benjamin-douablin.jpeg",
  },
  {
    name: "Jesse Oulette",
    role: "Leadmagic",
    quote:
      "Finally stopped waking up to suspended Google accounts. It's been 6 months now and everything is still clean.",
    image: "/testimonials/jesse-oulette.jpeg",
  },
  {
    name: "Abbas Somji",
    role: "The Playbook Agency",
    quote:
      "Consolidated our entire email stack into one dashboard. Saved us 6 hours a week just in context switching.",
    image: "/testimonials/abbas-somji.jpeg",
  },
  {
    name: "Naufal",
    role: "Understory",
    quote:
      "I used to spend every Monday morning setting up new domains because the old ones kept dying. Haven't done that in months.",
    image: "/testimonials/naufal-understory.png",
  },
];

const FAQS = [
  {
    question: "What is Zapmail and how does Infrabox compare?",
    answer:
      "Zapmail is an email infrastructure provider offering pre-warmed Google Workspace and Microsoft 365 mailboxes, with AI tools like Domain Genie and Smart Mailbox Namer. Pricing starts at $39/month for 10 mailboxes and scales to $299/month for 100, with API access gated behind the top-tier Pro plan. Infrabox is the only Official Google Cloud Partner in this space and adds what Zapmail doesn't: Microsoft Azure mailbox support, a guaranteed 95% inbox delivery rate, InfraGuard 24/7 domain monitoring, full API access on every plan, and 24+ sequencer integrations (vs Zapmail's 5).",
  },
  {
    question: "Why do teams switch from Zapmail to Infrabox?",
    answer:
      "Three reasons keep showing up. (1) Deliverability accountability — Infrabox guarantees a 95% inbox placement rate and runs InfraGuard 24/7 to catch blacklist, DNS, and bounce issues; Zapmail offers no delivery guarantee and no equivalent monitoring. (2) Provider depth — Infrabox adds Microsoft Azure mailboxes on top of Google Workspace and Microsoft 365, which Zapmail doesn't support, plus you're using an Official Google Cloud Partner. (3) Cost & integrations — Infrabox's add-on mailboxes start at $2.50 vs Zapmail's $3.00–$3.50, with 24+ sequencer integrations versus around 5 on Zapmail.",
  },
  {
    question: "Is Infrabox cheaper than Zapmail?",
    answer:
      "Yes. On entry pricing both start at $39/month for 10 mailboxes, but Infrabox's annual billing drops the Professional plan to $31/month, and add-on mailboxes run from $2.50 on the Enterprise annual plan versus Zapmail's $3.00–$3.50. For a team running 100 mailboxes, Infrabox's Enterprise tier is $250/month (annual) compared to Zapmail's Pro at $299/month — and Infrabox ships unlimited placement testing, InfraGuard monitoring, Azure support, and a 95% delivery rate guarantee that Zapmail doesn't include at any tier.",
  },
  {
    question: "Does Infrabox have better deliverability than Zapmail?",
    answer:
      "Infrabox is the only provider in this space that publishes a 95% inbox placement rate guarantee — Zapmail's own pricing page makes no delivery promise. Every Infrabox mailbox is provisioned on premium US-only IP infrastructure (Zapmail uses US/EU IPs), and InfraGuard runs 24/7 blacklist checks, DNS watchdog, and bounce tracking so issues are caught before reply rates drop. You also get unlimited inbox placement testing on every plan, while Zapmail caps placement credits at 3 / 10 / 30 per month depending on tier — so above those limits you can't actually verify your placement.",
  },
  {
    question: "How easy is it to migrate from Zapmail to Infrabox?",
    answer:
      "Most teams migrate in a single afternoon. Infrabox's AI Mailbox Generator and AI Domain Generator handle bulk provisioning and the platform is ready to send in about 10 minutes per domain, with SPF, DKIM, and DMARC configured automatically. Your existing sequencer keeps running — Infrabox integrates with 24+ tools including Smartlead, Instantly, Lemlist, Apollo, Reply, SalesForge, and Saleshandy, so campaigns and sequences move over without rebuild.",
  },
  {
    question: "Can I use Zapmail for free?",
    answer:
      "No — Zapmail doesn't offer a free tier and the cheapest plan is $39/month for 10 mailboxes (with only 3 placement test credits and 3 AI Insights credits per month). Infrabox also starts at $39/month for 10 mailboxes on monthly billing (and $31/month on annual), but every plan ships with unlimited inbox placement testing, full API access with webhooks, real-time monitoring and alerts, and 24+ platform integrations — features that on Zapmail are either capped or locked behind the $299/month Pro tier.",
  },
  {
    question: "Are there other Zapmail alternatives besides Infrabox?",
    answer:
      "Yes. The most common Zapmail alternatives are Infrabox (Official Google Cloud Partner, 95% inbox rate, Azure + Microsoft + Google, InfraGuard, 24+ integrations), Mailforge (around $3.00/mailbox, Google-only with limited tooling), Primeforge (from $2.88/mailbox), and Hypertide (Azure-focused, 4–6 hour setup). For teams that care about deliverability accountability, multi-provider support, and API access at every tier, Infrabox is the strongest all-around alternative — which is why teams switching off Zapmail consistently land here.",
  },
];

function Check({ className = "w-5 h-5 text-emerald-500" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function Cross({ className = "w-5 h-5 text-red-500" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function FeatureCell({ value }) {
  if (value === true) return <div className="flex justify-center"><Check /></div>;
  if (value === false) return <div className="flex justify-center"><Cross /></div>;
  return <div className="text-sm text-gray-700 text-center">{value}</div>;
}

export default function ZapmailVsInfraboxPage() {
  const breadcrumbData = createBreadcrumbSchema([
    { name: "Home", url: "https://www.infrabox.software" },
    { name: "Alternatives", url: "https://www.infrabox.software/alternatives" },
    { name: "Zapmail vs Infrabox", url: PAGE_URL },
  ]);

  const webPageData = createWebPageSchema({
    name: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
  });

  const faqData = createToolFaqSchema(FAQS);

  return (
    <>
      <JsonLd data={breadcrumbData} />
      <JsonLd data={webPageData} />
      <JsonLd data={faqData} />
      <Header />

      <main className="bg-white">
        {/* HERO — inset rounded card with breathing room on all sides */}
        <section className="bg-white">
          <div className="p-3 sm:p-4 lg:p-5">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#001a68] via-[#1240cc] to-[#0b34b4] text-white min-h-[72vh] md:min-h-[80vh] flex items-center justify-center">
              {/* Top radial highlight */}
              <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                aria-hidden="true"
                style={{
                  background:
                    "radial-gradient(60% 50% at 50% 0%, rgba(78, 173, 167, 0.35) 0%, rgba(18, 64, 204, 0) 70%)",
                }}
              />

              <div className="relative w-full max-w-6xl mx-auto px-6 lg:px-8 py-24 text-center">
                <div className="mb-7">
                  <Link
                    href="/compare/zapmail"
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-medium text-white/85 hover:bg-white/15 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Compare Infrabox vs. Zapmail
                  </Link>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight max-w-4xl mx-auto mb-6">
                  Meet the #1 Zapmail Alternative
                </h1>
                <p className="text-base sm:text-lg text-white/70 leading-relaxed max-w-2xl mx-auto mb-10">
                  Get more from your email setup with a powerful, easy-to-use, and cost-effective alternative to Zapmail.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <a
                    href="https://app.infrabox.software/signup"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-[#1240cc] text-sm font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Switch to Infrabox
                    <span aria-hidden="true">→</span>
                  </a>
                  <a
                    href="/#book-call"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 border border-white/20 text-white text-sm font-semibold hover:bg-white/15 transition-colors"
                  >
                    Book a demo
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SOCIAL PROOF — homepage marquee with custom header */}
        {/* FEATURE COMPARISON TABLE */}
        <section className="bg-white">
          <div className="max-w-5xl mx-auto px-6 lg:px-8 py-20">
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 rounded-full bg-[#1240cc]/10 text-[#1240cc] text-xs font-semibold uppercase tracking-wider mb-4">
                Feature Overview
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight">
                How does Zapmail compare with Infrabox?
              </h2>
            </div>

            <div className="overflow-x-auto -mx-6 lg:mx-0 px-6 lg:px-0">
              <div className="border border-gray-200 rounded-2xl overflow-hidden min-w-[640px] bg-white">
                {/* Sticky-feeling header */}
                <div className="grid grid-cols-[1.6fr_1fr_1fr] bg-white border-b border-gray-200">
                  <div className="px-6 py-5" />
                  <div className="px-6 py-5 text-center border-l border-gray-100">
                    <div className="inline-flex items-center gap-2">
                      <img src="/logo.png" alt="Infrabox" className="h-6 w-auto" />
                      <span className="text-sm font-semibold text-[#1240cc]">Infrabox</span>
                    </div>
                  </div>
                  <div className="px-6 py-5 text-center border-l border-gray-100">
                    <span className="text-sm font-semibold text-gray-500">Zapmail</span>
                  </div>
                </div>

                {FEATURE_GROUPS.map((group) => (
                  <div key={group.title}>
                    <div className="grid grid-cols-[1.6fr_1fr_1fr] bg-gray-50 border-b border-gray-200">
                      <div className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        {group.title}
                      </div>
                      <div className="border-l border-gray-100" />
                      <div className="border-l border-gray-100" />
                    </div>
                    {group.rows.map((row, idx) => (
                      <div
                        key={row.label}
                        className={`grid grid-cols-[1.6fr_1fr_1fr] border-b border-gray-100 ${
                          idx % 2 === 1 ? "bg-gray-50/40" : "bg-white"
                        }`}
                      >
                        <div className="px-6 py-4 text-sm text-gray-700">{row.label}</div>
                        <div className="px-6 py-4 border-l border-gray-100 bg-[#1240cc]/[0.03]">
                          <FeatureCell value={row.infrabox} />
                        </div>
                        <div className="px-6 py-4 border-l border-gray-100">
                          <FeatureCell value={row.zapmail} />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE — 3 ALTERNATING BLOCKS */}
        <section className="bg-gray-50 border-y border-gray-100">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20">
            <div className="text-center mb-14">
              <span className="inline-block px-3 py-1 rounded-full bg-[#1240cc]/10 text-[#1240cc] text-xs font-semibold uppercase tracking-wider mb-4">
                Comparison
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight mb-3">
                Why choose Infrabox over Zapmail?
              </h2>
              <p className="text-base text-gray-600 max-w-2xl mx-auto">
                See why 3,000+ companies prefer Infrabox over Zapmail for their cold outreach infrastructure.
              </p>
            </div>

            <div className="space-y-24">
              {REASONS.map((reason, idx) => {
                const reverse = idx % 2 === 1;
                const bulletBase = 450;
                const bulletStep = 100;
                const buttonDelay = bulletBase + reason.bullets.length * bulletStep + 100;
                return (
                  <ScaleOnScroll
                    key={reason.title}
                    className={`grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center rounded-2xl border border-gray-200 bg-white p-8 sm:p-12 md:p-16 ${
                      reverse ? "md:[&>*:first-child]:order-2" : ""
                    }`}
                  >
                    <div>
                      <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#1240cc]/70 mb-3">
                        {reason.eyebrow}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900 leading-tight mb-4">
                        {reason.title}
                      </h3>
                      <p className="text-[15px] text-gray-600 leading-relaxed mb-5">
                        {reason.body}
                      </p>
                      <ul className="space-y-2.5 mb-6">
                        {reason.bullets.map((b) => (
                          <li
                            key={b}
                            className="flex items-start gap-2.5 text-sm text-gray-700"
                          >
                            <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                      <Reveal as="div" direction="down" delay={buttonDelay}>
                        <Link
                          href="/compare/zapmail"
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                          style={{
                            background:
                              "radial-gradient(85% 100% at 50% 0%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 70%), linear-gradient(135deg, #001a68 0%, #1240cc 50%, #0b34b4 100%)",
                          }}
                        >
                          Learn more
                          <span aria-hidden="true">→</span>
                        </Link>
                      </Reveal>
                    </div>
                    <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm">
                      <Image
                        src={reason.image}
                        alt={reason.imageAlt}
                        width={800}
                        height={500}
                        className="w-full h-auto"
                      />
                    </div>
                  </ScaleOnScroll>
                );
              })}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="bg-white">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20">
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 rounded-full bg-[#1240cc]/10 text-[#1240cc] text-xs font-semibold uppercase tracking-wider mb-4">
                Testimonials
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight mb-3">
                Don't take our word for it. Take theirs.
              </h2>
              <p className="text-base text-gray-600 max-w-2xl mx-auto mb-3">
                See why our users love Infrabox. Real stories, real success, real impact.
              </p>
              <div className="flex items-center justify-center gap-1 text-amber-400" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.446a1 1 0 00-.364 1.118l1.287 3.957c.3.922-.755 1.688-1.54 1.118L10 14.347l-3.366 2.446c-.785.57-1.84-.196-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.65 8.384c-.784-.57-.381-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                  </svg>
                ))}
              </div>
            </div>

            <TestimonialMarquee testimonials={TESTIMONIALS} />
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-gray-50 border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-6 lg:px-8 py-20">
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 rounded-full bg-[#1240cc]/10 text-[#1240cc] text-xs font-semibold uppercase tracking-wider mb-4">
                FAQ
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight mb-3">
                Frequently Asked Questions
              </h2>
              <p className="text-base text-gray-600">
                Have additional questions on why Infrabox is an excellent alternative to Zapmail?
              </p>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-xl border border-gray-200 bg-white open:shadow-sm transition-shadow"
                >
                  <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none select-none">
                    <span className="text-[15px] font-semibold text-gray-900">{faq.question}</span>
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center transition-transform group-open:rotate-45">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed">{faq.answer}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL DARK CTA */}
        <section className="bg-white">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#001a68] via-[#1240cc] to-[#0b34b4] px-8 py-14 sm:px-12 sm:py-16 text-white">
              <div
                className="absolute inset-0 opacity-25 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(50% 60% at 80% 0%, rgba(78, 173, 167, 0.35) 0%, rgba(18, 64, 204, 0) 70%)",
                }}
              />

              <div className="relative">
                <h2 className="text-3xl sm:text-4xl font-semibold leading-tight mb-3">
                  Get started now
                </h2>
                <p className="text-base text-white/70 max-w-lg mb-7">
                  You're just one click away from a top-notch email infrastructure with Infrabox.
                </p>
                <div>
                  <a
                    href="https://app.infrabox.software/signup"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-[#1240cc] text-sm font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Get Started
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
