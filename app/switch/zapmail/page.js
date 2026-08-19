import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Mail, Cloud, Server, Zap, Star, Activity, Flame, Inbox } from "lucide-react";
import HeroSwitch from "./HeroSwitch";
import Reveal from "./Reveal";
import ScaleOnScroll from "./ScaleOnScroll";
import TestimonialMarquee from "./TestimonialMarquee";

// Campaign landing page for paid traffic ("Switch from Zapmail. Save up to 28%.").
// Intentionally noindex/nofollow so it does NOT cannibalize the SEO ranking of
// /compare/zapmail or /alternatives/zapmail-vs-infrabox — those own organic search;
// this URL exists purely as a high-intent ad destination.
const PAGE_URL = "https://www.infrabox.software/switch/zapmail";
const PAGE_TITLE = "Switch from Zapmail to Infrabox | Save up to 28% per mailbox";
const PAGE_DESCRIPTION =
  "Moving off Zapmail? Migrate in an afternoon, cut mailbox costs by up to 28%, and get a guaranteed 95% inbox placement rate with 24/7 InfraGuard monitoring. Google, Microsoft 365 & Azure mailboxes. Switch to Infrabox today.";

export const metadata = {
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESCRIPTION,
  // Paid-only landing page — keep it out of the index so it never competes with
  // the organic Zapmail comparison pages.
  robots: "noindex, nofollow",
  alternates: { canonical: PAGE_URL },
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

// Verified proof points used in the trust bar. Figures sourced from third-party
// review aggregators and Infrabox's published specs (G2 rating, 95% inbox
// placement guarantee, Official Google Cloud Partner, 24+ integrations).
const PROOF_STATS = [
  { value: "4.9★", label: "Rated on G2" },
  { value: "95%", label: "Inbox placement guarantee" },
  { value: "Built-in", label: "Warmup on every plan" },
  { value: "24+", label: "Sequencer integrations" },
  { value: "3", label: "Providers: Google · Microsoft · Azure" },
  { value: "24/7", label: "InfraGuard monitoring" },
];

// Headline savings figures. Sourced from the same numbers on
// /alternatives/zapmail-vs-infrabox:
//   per-mailbox: $2.50 (Infrabox) vs $3.50 (Zapmail) => ~28% cheaper
//   100 mailboxes: $250/mo (Infrabox Enterprise, annual) vs $299/mo (Zapmail Pro)
// Single combined table: pricing rows + the main feature differentiators pulled
// in from the old feature-comparison table. infrabox/zapmail cells accept
// true/false (rendered as ✓/✗) or a text value.
const COST_ROWS = [
  { label: "Add-on mailbox (each)", infrabox: "from $2.50", zapmail: "$3.00 – $3.50", win: "Up to 28% less" },
  { label: "Entry plan (10 mailboxes)", infrabox: "$31 – $39/mo", zapmail: "$39/mo", win: "Cheaper on annual" },
  { label: "100 mailboxes / month", infrabox: "$250 (annual)", zapmail: "$299 (Pro)", win: "Save $49/mo" },
  { label: "Annual billing discount", infrabox: "Up to 20% off", zapmail: false, win: "Lower total cost" },
  { label: "Microsoft Azure mailboxes", infrabox: true, zapmail: false, win: "Azure included" },
  { label: "Built-in email warmup", infrabox: true, zapmail: false, win: "Free on every plan" },
  { label: "InfraGuard 24/7 monitoring", infrabox: true, zapmail: false, win: "Issues caught early" },
  { label: "Mailbox placement tracking", infrabox: true, zapmail: false, win: "Inbox vs spam visibility" },
  { label: "95% inbox placement guarantee", infrabox: true, zapmail: false, win: "Guaranteed" },
  { label: "Inbox placement testing", infrabox: "Unlimited", zapmail: "3 / 10 / 30 by tier", win: "No caps" },
  { label: "Full API access on every plan", infrabox: true, zapmail: false, win: "No upsell" },
  { label: "Platform integrations", infrabox: "24+", zapmail: "5", win: "5× more" },
];

const STEPS = [
  {
    step: "01",
    title: "Generate your domains & mailboxes",
    body: "Use the AI generators to bulk-create mailboxes across Google, Microsoft 365, and Azure in a few clicks.",
  },
  {
    step: "02",
    title: "We auto-configure DNS",
    body: "SPF, DKIM, and DMARC are set automatically for every domain. No copy-pasting records — ready in ~10 minutes.",
  },
  {
    step: "03",
    title: "Point your sequencer & send",
    body: "Connect any of 24+ tools you already use. Campaigns move over without a rebuild, InfraGuard watches 24/7.",
  },
];

const TESTIMONIALS = [
  { name: "Luka", role: "Manyreach", quote: "Burned through 9 domains in 6 weeks with our old setup. Same domains have been running fine on Infrabox since March.", image: "/testimonials/luka.jpeg" },
  { name: "Dimitar Petkov", role: "Leadhaste", quote: "My reply rate jumped from 2% to 11% and I literally changed nothing except moving to Infrabox infrastructure.", image: "/testimonials/dimitar-petkov.png" },
  { name: "Walter Winn", role: "Anevo Marketing", quote: "Our agency manages 40 client accounts now. Would have been impossible before this.", image: "/testimonials/walter-winn.jpeg" },
  { name: "Jayson DeMers", role: "EmailAnalytics", quote: "The unified inbox thing sounded like a gimmick until I realized my SDRs were missing replies across 30 different accounts.", image: "/testimonials/jayson-demers.jpeg" },
  { name: "Benjamin Douablin", role: "Fullenrich", quote: "Went from sending 800 emails a day to 12,000. Deliverability got better somehow. Still don't fully understand it.", image: "/testimonials/benjamin-douablin.jpeg" },
  { name: "Jesse Oulette", role: "Leadmagic", quote: "Finally stopped waking up to suspended Google accounts. It's been 6 months now and everything is still clean.", image: "/testimonials/jesse-oulette.jpeg" },
  { name: "Atishay Jain", role: "Eagle Info Services", quote: "Our ops guy used to manually configure DNS for every mailbox. Now he's actually doing ops work instead.", image: "/testimonials/atishay-jain.png" },
  { name: "Abbas Somji", role: "The Playbook Agency", quote: "Consolidated our entire email stack into one dashboard. Saved us 6 hours a week just in context switching.", image: "/testimonials/abbas-somji.jpeg" },
  { name: "Naufal", role: "Understory", quote: "I used to spend every Monday morning setting up new domains because the old ones kept dying. Haven't done that in months.", image: "/testimonials/naufal-understory.png" },
];

const FAQS = [
  {
    question: "How long does it take to switch from Zapmail to Infrabox?",
    answer:
      "Most teams migrate in a single afternoon. The AI Mailbox Generator and AI Domain Generator handle bulk provisioning, and each domain is ready to send in about 10 minutes with SPF, DKIM, and DMARC configured automatically. Your existing sequencer keeps running — Infrabox integrates with 24+ tools including Smartlead, Instantly, Lemlist, Apollo, Reply, SalesForge, and Saleshandy.",
  },
  {
    question: "Which mailbox providers does Infrabox support?",
    answer:
      "All of them: Google Workspace, Microsoft 365, and Microsoft Azure mailboxes, plus custom SMTP sending. Infrabox is the only Official Google Cloud Partner in this space, and Azure support is something Zapmail doesn't offer — useful when you want to diversify infrastructure across providers for resilience and spread sending risk.",
  },
  {
    question: "How much will I actually save versus Zapmail?",
    answer:
      "Add-on mailboxes start at $2.50 on Infrabox versus $3.00–$3.50 on Zapmail — up to 28% less per mailbox. A 100-mailbox setup is $250/month on Infrabox's Enterprise annual plan compared to $299/month on Zapmail's Pro tier, and annual billing takes up to 20% off. On top of the lower price you also get unlimited placement testing, InfraGuard monitoring, and a 95% delivery guarantee Zapmail doesn't include at any tier.",
  },
  {
    question: "Do I have to rebuild my campaigns?",
    answer:
      "No. Infrabox connects to the sequencer you already run, so your campaigns, sequences, and copy stay exactly where they are. You're swapping the underlying mailbox infrastructure, not your outreach tool — point your sequencer at the new mailboxes and keep sending.",
  },
  {
    question: "Is Infrabox's deliverability really better?",
    answer:
      "Infrabox is the only provider in this space that publishes a 95% inbox placement rate guarantee — Zapmail's pricing page makes no delivery promise. Every mailbox runs on premium US-only IP infrastructure, and InfraGuard performs 24/7 blacklist checks, DNS monitoring, and bounce tracking so problems are caught before reply rates drop. You also get unlimited placement testing, while Zapmail caps it by tier.",
  },
  {
    question: "Is there a contract or can I leave anytime?",
    answer:
      "There's no long-term lock-in. You can start on monthly billing to test the switch and move to annual once you see the deliverability and savings — annual simply unlocks up to 20% off and the $2.50 per-mailbox rate.",
  },
];

function Check({ className = "w-5 h-5 text-emerald-500" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function Cross({ className = "w-5 h-5 text-red-400" }) {
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

/* ── Coded HTML mockups (replace static images in the reason cards) ──
   Styled to match the home page's dashboard mockups (Highlights1.js). */

function ProviderMockup() {
  const providers = [
    { icon: Mail, name: "Google Workspace", meta: "US-IP · 42 mailboxes", status: "Active" },
    { icon: Mail, name: "Microsoft 365", meta: "US-IP · 30 mailboxes", status: "Active" },
    { icon: Cloud, name: "Microsoft Azure", meta: "Tenant · 18 mailboxes", status: "Active" },
    { icon: Server, name: "Custom SMTP", meta: "Relay · 12 senders", status: "Active" },
  ];
  return (
    <div aria-hidden="true" className="p-6 sm:p-8 pb-0 overflow-hidden bg-gray-100 rounded-2xl">
      <div className="p-4 mx-auto -mb-1 bg-white rounded-t-xl shadow-sm outline outline-gray-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-flex p-3 rounded-lg bg-gray-100"><Mail className="size-4 text-[#1240cc]" /></div>
            <div>
              <p className="text-xs text-gray-500">Connected providers</p>
              <p className="text-sm font-medium text-black">All mailboxes, one dashboard</p>
            </div>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">4 / 4 live</span>
        </div>
        <div className="pt-4 mt-4 border-t border-gray-100 space-y-3">
          {providers.map((p) => (
            <div key={p.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="inline-flex p-2 rounded-md bg-white border border-gray-200"><p.icon className="size-4 text-[#1240cc]" /></div>
                <div>
                  <div className="text-sm font-medium text-black">{p.name}</div>
                  <div className="text-xs text-gray-500">{p.meta}</div>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700">
                <span className="w-2 h-2 bg-green-500 rounded-full" />{p.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PricingMockup() {
  return (
    <div aria-hidden="true" className="p-6 sm:p-8 pb-0 overflow-hidden bg-gray-100 rounded-2xl">
      <div className="p-5 mx-auto -mb-1 bg-white rounded-t-xl shadow-sm outline outline-gray-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Monthly bill · 100 mailboxes</p>
            <p className="text-base font-medium text-black">Cost comparison</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700">
            <Zap className="size-3" /> Save $49/mo
          </span>
        </div>
        <div className="pt-5 mt-4 border-t border-gray-100 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-[#1240cc]">Infrabox</span>
              <span className="text-sm font-semibold text-black">$250<span className="text-xs font-normal text-gray-500">/mo</span></span>
            </div>
            <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden"><div className="h-full rounded-full bg-[#1240cc]" style={{ width: "84%" }} /></div>
            <p className="text-xs text-gray-500 mt-1">$2.50 / mailbox · annual</p>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-gray-500">Zapmail</span>
              <span className="text-sm font-semibold text-gray-500">$299<span className="text-xs font-normal text-gray-400">/mo</span></span>
            </div>
            <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden"><div className="h-full rounded-full bg-gray-300" style={{ width: "100%" }} /></div>
            <p className="text-xs text-gray-400 mt-1">$3.00–$3.50 / mailbox</p>
          </div>
        </div>
        <div className="pt-4 mt-4 border-t border-gray-100 grid grid-cols-3 gap-y-3">
          <div><p className="text-xs text-gray-500">Per mailbox</p><p className="text-sm font-medium text-emerald-600">−28%</p></div>
          <div><p className="text-xs text-gray-500">Annual saving</p><p className="text-sm font-medium text-black">$588</p></div>
          <div><p className="text-xs text-gray-500">Placement tests</p><p className="text-sm font-medium text-black">Unlimited</p></div>
        </div>
      </div>
    </div>
  );
}

function InfraGuardMockup() {
  const checks = [
    { label: "Inbox placement", status: "95%+", color: "bg-green-500" },
    { label: "Blacklist status", status: "Clean", color: "bg-green-500" },
    { label: "DNS records", status: "Healthy", color: "bg-green-500" },
    { label: "Bounce rate", status: "1.2%", color: "bg-green-500" },
  ];
  return (
    <div aria-hidden="true" className="p-6 sm:p-8 pb-0 overflow-hidden bg-gray-100 rounded-2xl">
      <div className="p-4 mx-auto -mb-1 bg-white rounded-t-xl shadow-sm outline outline-gray-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-flex p-3 rounded-lg bg-gray-100"><Shield className="size-4 text-[#1240cc]" /></div>
            <div>
              <p className="text-xs text-gray-500">InfraGuard</p>
              <p className="text-sm font-medium text-black">Deliverability monitor</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700">
            <Activity className="size-3.5" /> Live 24/7
          </span>
        </div>
        <div className="pt-4 mt-4 border-t border-gray-100 space-y-3">
          {checks.map((c) => (
            <div key={c.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 ${c.color} rounded-full`} />
                <span className="text-sm text-gray-700">{c.label}</span>
              </div>
              <span className="text-sm font-medium text-green-700">{c.status}</span>
            </div>
          ))}
        </div>
        <div className="pt-4 mt-4 border-t border-gray-100 grid grid-cols-3 gap-y-3">
          <div><p className="text-xs text-gray-500">Protected</p><p className="text-sm font-medium text-black">24</p></div>
          <div><p className="text-xs text-gray-500">IPT tests</p><p className="text-sm font-medium text-black">156</p></div>
          <div><p className="text-xs text-gray-500">Health</p><p className="text-sm font-medium text-green-700">98/100</p></div>
        </div>
      </div>
    </div>
  );
}

// Compact mockups for the "Built into Infrabox — not Zapmail" feature trio.
function MonitoringMockup() {
  const checks = [
    { label: "Blacklist", status: "Clean" },
    { label: "DNS records", status: "Healthy" },
    { label: "Bounce rate", status: "1.2%" },
  ];
  return (
    <div aria-hidden="true" className="rounded-xl bg-gray-50 border border-gray-200 p-4 space-y-2">
      {checks.map((c) => (
        <div key={c.label} className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-gray-100">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full" />
            <span className="text-xs text-gray-700">{c.label}</span>
          </div>
          <span className="text-xs font-medium text-green-700">{c.status}</span>
        </div>
      ))}
    </div>
  );
}

function PlacementMockup() {
  const tabs = [
    { label: "Primary", pct: 95, color: "bg-[#1240cc]" },
    { label: "Promotions", pct: 4, color: "bg-amber-400" },
    { label: "Spam", pct: 1, color: "bg-red-400" },
  ];
  return (
    <div aria-hidden="true" className="rounded-xl bg-gray-50 border border-gray-200 p-4 space-y-3">
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Placement · last 500 sends</span>
        <span className="inline-flex items-center gap-1 text-green-700 font-medium"><Inbox className="size-3" /> Live</span>
      </div>
      {tabs.map((t) => (
        <div key={t.label}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-700">{t.label}</span>
            <span className="text-xs font-semibold text-gray-900">{t.pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
            <div className={`h-full rounded-full ${t.color}`} style={{ width: `${t.pct}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function WarmupMockup() {
  return (
    <div aria-hidden="true" className="rounded-xl bg-gray-50 border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="inline-flex items-center gap-1.5 text-xs text-gray-700"><Flame className="size-3.5 text-[#1240cc]" /> Warmup active</span>
        <span className="text-xs font-medium text-green-700">92% health</span>
      </div>
      <div className="flex items-end gap-1 h-16 mb-3">
        {[20, 30, 38, 46, 55, 64, 72, 80, 88, 100].map((h, i) => (
          <div key={i} className="flex-1 rounded-t bg-[#1240cc]/80" style={{ height: `${h}%` }} />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-y-2 border-t border-gray-200 pt-3">
        <div><p className="text-[10px] text-gray-500">Daily volume</p><p className="text-xs font-medium text-black">2 → 40</p></div>
        <div><p className="text-[10px] text-gray-500">Inbox rate</p><p className="text-xs font-medium text-black">96.1%</p></div>
        <div><p className="text-[10px] text-gray-500">Providers</p><p className="text-xs font-medium text-black">3</p></div>
      </div>
    </div>
  );
}

// The three features Zapmail doesn't offer — leveraged as a dedicated trio.
const ZAPMAIL_GAPS = [
  {
    icon: Shield,
    title: "Domain monitoring (InfraGuard)",
    body: "24/7 blacklist checks, DNS watchdog, and bounce tracking on every domain — you get alerted before deliverability drops.",
    Mockup: MonitoringMockup,
  },
  {
    icon: Inbox,
    title: "Mailbox placement tracking",
    body: "See exactly how many emails land in Primary vs Promotions vs Spam across Google and Outlook — not a guess, a measurement.",
    Mockup: PlacementMockup,
  },
  {
    icon: Flame,
    title: "Built-in email warmup",
    body: "Automated sender-reputation warmup ramps volume from 2 to 40/day across Google, Microsoft & Azure — included, not an afterthought.",
    Mockup: WarmupMockup,
  },
];

const REASONS = [
  {
    eyebrow: "Reason #1",
    title: "Every provider — including Azure",
    body: "Infrabox runs Google Workspace, Microsoft 365, Microsoft Azure mailboxes, and custom SMTP from one dashboard. Zapmail has no Azure support. Spread your sending across providers so one bad day never takes down a campaign.",
    bullets: [
      "Google Workspace + Microsoft 365 + Azure mailboxes",
      "Custom SMTP sending Zapmail doesn't offer",
      "Only Official Google Cloud Partner in the space",
    ],
    Mockup: ProviderMockup,
  },
  {
    eyebrow: "Reason #2",
    title: "You keep more margin on every mailbox",
    body: "Add-on mailboxes start at $2.50 versus Zapmail's $3.00–$3.50, and annual billing takes up to 20% more off. At 100 mailboxes that's $588 back in your pocket every year — with unlimited placement testing on top.",
    bullets: [
      "From $2.50 per add-on mailbox (Zapmail: $3.00–$3.50)",
      "100 mailboxes for $250/mo vs Zapmail's $299/mo",
      "Up to 20% annual discount Zapmail doesn't offer",
    ],
    Mockup: PricingMockup,
  },
  {
    eyebrow: "Reason #3",
    title: "Deliverability you can actually hold us to",
    body: "Infrabox guarantees a 95% inbox placement rate and runs InfraGuard 24/7 to catch blacklist, DNS, and bounce issues before they tank your reply rate. Zapmail makes no delivery promise.",
    bullets: [
      "95% guaranteed inbox placement rate",
      "InfraGuard 24/7 blacklist, DNS & bounce monitoring",
      "Unlimited inbox placement testing on every plan",
    ],
    Mockup: InfraGuardMockup,
  },
];

export default function SwitchFromZapmailPage() {
  return (
    <>
      <Header />

      <main className="bg-white">
        {/* HERO — home-page style with floating review toasts */}
        <HeroSwitch />

        {/* VERIFIED PROOF BAR */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-gray-200 rounded-2xl overflow-hidden border border-gray-200">
              {PROOF_STATS.map((s) => (
                <div key={s.label} className="bg-white px-4 py-6 text-center">
                  <div className="text-2xl sm:text-3xl font-semibold text-[#1240cc]">{s.value}</div>
                  <div className="text-xs text-gray-500 mt-1.5 leading-snug">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BUILT-IN FEATURES ZAPMAIL DOESN'T HAVE — placed right after the hero */}
        <section className="bg-gray-50 border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20">
            <div className="text-center mb-14">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-4">Built in — not on Zapmail</span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight mb-3">Three things you only get with Infrabox</h2>
              <p className="text-base text-gray-600 max-w-2xl mx-auto">Monitoring, placement tracking, and warmup ship on every plan — Zapmail offers none of them.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ZAPMAIL_GAPS.map((f) => {
                const Mockup = f.Mockup;
                const Icon = f.icon;
                return (
                  <div key={f.title} className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="inline-flex p-2.5 rounded-lg bg-[#1240cc]/5"><Icon className="size-5 text-[#1240cc]" /></div>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-500">
                        <Cross className="w-3.5 h-3.5 text-red-400" /> Not on Zapmail
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-5">{f.body}</p>
                    <div className="mt-auto"><Mockup /></div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* COST STRIP — the money shot (now also carries the key feature points) */}
        <section className="bg-white">
          <div className="max-w-5xl mx-auto px-6 lg:px-8 py-20">
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 rounded-full bg-[#1240cc]/10 text-[#1240cc] text-xs font-semibold uppercase tracking-wider mb-4">The math</span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight">Same outreach, lower bill</h2>
              <p className="text-base text-gray-600 max-w-2xl mx-auto mt-3">Lower cost and more included — what you pay and get on Zapmail versus Infrabox, line by line.</p>
            </div>
            <div className="overflow-x-auto -mx-6 lg:mx-0 px-6 lg:px-0">
              <div className="border border-gray-200 rounded-2xl overflow-hidden min-w-[640px] bg-white">
                <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] bg-white border-b border-gray-200">
                  <div className="px-6 py-5" />
                  <div className="px-6 py-5 text-center border-l border-gray-100">
                    <div className="inline-flex items-center gap-2">
                      <img src="/logo.png" alt="Infrabox" className="h-6 w-auto" />
                      <span className="text-sm font-semibold text-[#1240cc]">Infrabox</span>
                    </div>
                  </div>
                  <div className="px-6 py-5 text-center border-l border-gray-100"><span className="text-sm font-semibold text-gray-500">Zapmail</span></div>
                  <div className="px-6 py-5 text-center border-l border-gray-100"><span className="text-sm font-semibold text-emerald-600">You get</span></div>
                </div>
                {COST_ROWS.map((row, idx) => (
                  <div key={row.label} className={`grid grid-cols-[1.4fr_1fr_1fr_1fr] border-b border-gray-100 last:border-b-0 ${idx % 2 === 1 ? "bg-gray-50/40" : "bg-white"}`}>
                    <div className="px-6 py-4 text-sm text-gray-700">{row.label}</div>
                    <div className="px-6 py-4 border-l border-gray-100 bg-[#1240cc]/[0.03] flex items-center justify-center text-sm font-semibold text-gray-900">
                      {typeof row.infrabox === "boolean" ? <FeatureCell value={row.infrabox} /> : row.infrabox}
                    </div>
                    <div className="px-6 py-4 border-l border-gray-100 flex items-center justify-center text-sm text-gray-500">
                      {typeof row.zapmail === "boolean" ? <FeatureCell value={row.zapmail} /> : row.zapmail}
                    </div>
                    <div className="px-6 py-4 border-l border-gray-100 text-center text-sm font-semibold text-emerald-600">{row.win}</div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-400 text-center mt-4">Pricing reflects published rates at time of writing. Annual billing required for lowest per-mailbox cost.</p>
          </div>
        </section>

        {/* WHY SWITCH — reason cards with HTML mockups */}
        <section className="bg-white">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20">
            <div className="text-center mb-14">
              <span className="inline-block px-3 py-1 rounded-full bg-[#1240cc]/10 text-[#1240cc] text-xs font-semibold uppercase tracking-wider mb-4">Why teams switch</span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight mb-3">Three reasons teams move off Zapmail</h2>
              <p className="text-base text-gray-600 max-w-2xl mx-auto">More providers, lower cost, and deliverability you can hold us to.</p>
            </div>
            <div className="space-y-8">
              {REASONS.map((reason, idx) => {
                const reverse = idx % 2 === 1;
                const Mockup = reason.Mockup;
                const buttonDelay = 450 + reason.bullets.length * 100 + 100;
                return (
                  <ScaleOnScroll
                    key={reason.title}
                    className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 md:p-10 ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}
                  >
                    <div className="md:px-4">
                      <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#1240cc]/70 mb-3">{reason.eyebrow}</span>
                      <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900 leading-tight mb-4">{reason.title}</h3>
                      <p className="text-[15px] text-gray-600 leading-relaxed mb-5">{reason.body}</p>
                      <ul className="space-y-2.5 mb-6">
                        {reason.bullets.map((b) => (
                          <li key={b} className="flex items-start gap-2.5 text-sm text-gray-700">
                            <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                      <Reveal as="div" direction="down" delay={buttonDelay}>
                        <a
                          href="https://app.infrabox.software/signup"
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                          style={{ background: "radial-gradient(85% 100% at 50% 0%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 70%), linear-gradient(135deg, #001a68 0%, #1240cc 50%, #0b34b4 100%)" }}
                        >
                          Switch to Infrabox
                          <span aria-hidden="true">→</span>
                        </a>
                      </Reveal>
                    </div>
                    <Mockup />
                  </ScaleOnScroll>
                );
              })}
            </div>
          </div>
        </section>

        {/* MIGRATION STEPS */}
        <section className="bg-gray-50 border-y border-gray-100">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20">
            <div className="text-center mb-14">
              <span className="inline-block px-3 py-1 rounded-full bg-[#1240cc]/10 text-[#1240cc] text-xs font-semibold uppercase tracking-wider mb-4">Migration</span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight mb-3">Switch in three steps</h2>
              <p className="text-base text-gray-600 max-w-2xl mx-auto">No downtime, no campaign rebuild. Be sending from new infrastructure the same day.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {STEPS.map((s) => (
                <div key={s.step} className="rounded-2xl border border-gray-200 bg-white p-8">
                  <div className="text-3xl font-bold text-[#1240cc]/20 mb-4">{s.step}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS + G2 BADGE */}
        <section className="bg-white">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20">
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 rounded-full bg-[#1240cc]/10 text-[#1240cc] text-xs font-semibold uppercase tracking-wider mb-4">Testimonials</span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight mb-3">Teams that already made the switch</h2>
              <p className="text-base text-gray-600 max-w-2xl mx-auto mb-4">Real stories from operators running email at scale on Infrabox.</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white">
                <div className="flex items-center gap-0.5 text-amber-400" aria-label="4.9 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-900">4.9 / 5</span>
                <span className="text-xs text-gray-500">rated on G2</span>
              </div>
            </div>
            <TestimonialMarquee testimonials={TESTIMONIALS} />
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-gray-50 border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-6 lg:px-8 py-20">
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 rounded-full bg-[#1240cc]/10 text-[#1240cc] text-xs font-semibold uppercase tracking-wider mb-4">FAQ</span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight mb-3">Switching questions, answered</h2>
              <p className="text-base text-gray-600">Everything you need to know before moving off Zapmail.</p>
            </div>
            <div className="space-y-3">
              {FAQS.map((faq) => (
                <details key={faq.question} className="group rounded-xl border border-gray-200 bg-white open:shadow-sm transition-shadow">
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
              <div className="absolute inset-0 opacity-25 pointer-events-none" style={{ background: "radial-gradient(50% 60% at 80% 0%, rgba(78, 173, 167, 0.35) 0%, rgba(18, 64, 204, 0) 70%)" }} />
              <div className="relative">
                <h2 className="text-3xl sm:text-4xl font-semibold leading-tight mb-3">Ready to switch from Zapmail?</h2>
                <p className="text-base text-white/70 max-w-lg mb-7">Spin up cheaper mailboxes across Google, Microsoft & Azure, keep your sequencer, and let InfraGuard guard deliverability — all before the day's out.</p>
                <div className="flex flex-wrap gap-3">
                  <a href="https://app.infrabox.software/signup" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-[#1240cc] text-sm font-semibold hover:bg-gray-100 transition-colors">
                    Start switching free
                    <span aria-hidden="true">→</span>
                  </a>
                  <a href="/#book-call" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 border border-white/20 text-white text-sm font-semibold hover:bg-white/15 transition-colors">
                    Book a migration call
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
