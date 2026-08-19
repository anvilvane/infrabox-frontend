'use client';

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PricingCalculator from "@/components/PricingCalculator";
import {
  JsonLd,
  createWebPageSchema,
  createBreadcrumbSchema,
  createToolFaqSchema,
  createHowToSchema,
  createWebApplicationSchema,
} from '@/components/seo/json-ld';

const FAQS = [
  {
    question: "How many mailboxes do I need for email?",
    answer:
      "It depends on your daily send volume. A safe deliverable rate is roughly 15 emails per day per Google Workspace mailbox and about 5 per Microsoft 365 mailbox. To send 1,000 emails a day on Google you need about 67 mailboxes. The calculator sizes this automatically from your target volume, or works backwards from the meetings you want to book.",
  },
  {
    question: "How many emails do I need to send to book one meeting?",
    answer:
      "Working backwards from typical email benchmarks: if about 1.5% of sent emails get a positive reply and about 30% of positive replies turn into a booked meeting, you need roughly 220 emails sent per meeting booked. Every account is different, so the calculator lets you edit both rates to match your real numbers.",
  },
  {
    question: "How many mailboxes can I put on one domain?",
    answer:
      "Infrabox provisions about 3 mailboxes per domain on Google Workspace and Microsoft 365 to protect sender reputation and avoid cross-contamination. Azure is billed per tenant rather than per domain. You can change the mailboxes-per-domain assumption in the calculator's advanced settings.",
  },
  {
    question: "How much does email infrastructure cost per mailbox?",
    answer:
      "Every Google or Microsoft mailbox is charged at one flat rate, and the rate drops as your volume grows: $3.90 a mailbox from 1 to 29, $3.25 from 30 to 99, and $2.99 from 100 to 199, on monthly billing. There is no platform fee or plan minimum on top, so 40 mailboxes is simply 40 x $3.25 = $130 a month. Azure is billed at $30 per tenant instead of per mailbox. Past 200 mailboxes (or 10 Azure tenants) pricing moves to a custom volume quote.",
  },
  {
    question: "Can I estimate cost from a meetings target instead of send volume?",
    answer:
      "Yes. Switch the calculator to reverse mode, enter how many meetings you want to book per month, and it works back through positive replies and emails sent to the daily volume, mailboxes, domains, and monthly cost required to hit that goal.",
  },
  {
    question: "What is included in the price per mailbox?",
    answer:
      "Each mailbox is a real Google Workspace, Microsoft 365, or Azure account on a US IP, with SPF, DKIM, and DMARC configured automatically and per-domain isolation to protect your sender reputation. Google and Microsoft mailboxes are charged at your volume band's flat rate, from $3.90 down to $2.99 a mailbox, with no separate platform fee, while Azure is billed at $30 per tenant. Volume pricing is custom past 200 mailboxes.",
  },
  {
    question: "What costs are not included in the monthly price?",
    answer:
      "Domains are billed once a year, separate from the recurring monthly cost, and you need about one domain for every 3 mailboxes. Warmup is an optional add-on priced per mailbox, and InfraGuard deliverability monitoring is priced per domain. Past 200 mailboxes (or 10 Azure tenants) pricing moves to a custom volume quote.",
  },
];

const PRICE_DETAILS = [
  {
    title: "What every mailbox includes",
    points: [
      "A real Google Workspace, Microsoft 365, or Azure account, not a grey-market or recycled one",
      "US-based sending IPs",
      "SPF, DKIM, and DMARC configured automatically, usually in under 10 minutes",
      "Per-domain isolation, so one bad mailbox does not drag down the rest",
    ],
  },
  {
    title: "Why the price scales the way it does",
    points: [
      "One flat rate per mailbox, stepping down with volume: $3.90 from 1 to 29 mailboxes, $3.25 from 30 to 99, $2.99 from 100 to 199",
      "Google and Microsoft mailboxes each have a safe daily send limit, about 15 a day on Google and 5 on Microsoft, so your volume is what drives the mailbox count",
      "Azure is billed at $30 per tenant, not per mailbox",
      "No platform fee and no plan minimum, so you pay for the mailboxes you actually run. Past 200 mailboxes (or 10 Azure tenants) you move to custom volume pricing",
    ],
  },
  {
    title: "Costs people forget to budget",
    points: [
      "Domains are billed once a year, separate from the monthly cost",
      "You need roughly one domain for every 3 mailboxes",
      "Warmup is an optional add-on, priced per mailbox",
      "InfraGuard deliverability monitoring is priced per domain",
    ],
  },
  {
    title: "What the price quietly protects you from",
    points: [
      "Domain burning and permanent sender-reputation damage",
      "Landing in spam instead of the primary inbox",
      "Cheap or fake accounts that get suspended mid-campaign",
      "Cross-contamination, where one bad mailbox infects the whole setup",
    ],
  },
];

const CALC_STEPS = [
  {
    title: "Start from sends, or a goal",
    text: "Enter a daily send volume. In reverse mode, enter a monthly meetings goal and we convert it through your reply rates into the emails per day you need to send.",
  },
  {
    title: "Size the domains",
    text: "Domains equal your daily volume divided by (mailboxes per domain times the per-mailbox daily limit), rounded up. The defaults are 3 mailboxes per domain and about 15 emails a day on Google, 5 on Microsoft.",
  },
  {
    title: "Fill in the mailboxes",
    text: "Mailboxes equal the domain count times the mailboxes per domain, so the total capacity always covers your target volume.",
  },
  {
    title: "Add up the cost",
    text: "Your mailbox count picks the rate band, then every mailbox is charged at that one rate: $3.90 from 1 to 29, $3.25 from 30 to 99, $2.99 from 100 to 199. Each Azure tenant adds $30, quarterly and annual billing carry their own lower rates rather than a discount stacked on top, domains are billed once a year separately, and past 200 mailboxes pricing becomes a custom volume quote.",
  },
];

const HOW_TO_STEPS = [
  {
    name: "Choose your starting point",
    text: "Pick 'I know my volume' to size from a daily send target, or 'I have a goal' to work backwards from monthly meetings booked.",
  },
  {
    name: "Set your numbers",
    text: "Enter your daily send volume, or your meetings goal plus your positive-reply and reply-to-meeting rates. The calculator converts a meetings goal into the emails-per-day you need to send.",
  },
  {
    name: "Split your provider mix",
    text: "Balance volume across Google Workspace, Microsoft 365, and Azure. The calculator sizes mailboxes and domains per provider.",
  },
  {
    name: "Review the cost",
    text: "See the mailboxes, domains, effective monthly cost, and first-year total, with optional warmup and InfraGuard add-ons and annual-billing discounts.",
  },
];

const DASHBOARD_SHOTS = [
  {
    src: "/images/dashboard/mailboxes.png",
    title: "Mailboxes",
    alt: "Infrabox dashboard showing provisioned Google and Microsoft mailboxes",
    caption: "Real Google, Microsoft, and Azure mailboxes, provisioned and ready to send.",
  },
  {
    src: "/images/dashboard/domains.png",
    title: "Domains",
    alt: "Infrabox dashboard showing domains with DNS records configured",
    caption: "Domains with SPF, DKIM, and DMARC configured automatically.",
  },
  {
    src: "/images/dashboard/infraguard.png",
    title: "InfraGuard",
    alt: "Infrabox InfraGuard deliverability and blacklist monitoring dashboard",
    caption: "Blacklist, DNS, and deliverability monitoring across your infrastructure.",
  },
];

export default function PricingCalculatorPage() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <>
      <JsonLd data={createWebPageSchema({
        name: "Email Cost Calculator | Infrabox",
        description: "Estimate your Infrabox email infrastructure cost. Size mailboxes, domains, and monthly cost from a daily send volume, or work backwards from the meetings you want to book.",
        url: "https://www.infrabox.software/pricing-calculator",
      })} />
      <JsonLd data={createBreadcrumbSchema([
        { name: "Home", url: "https://www.infrabox.software" },
        { name: "Pricing", url: "https://www.infrabox.software/pricing" },
        { name: "Pricing Calculator", url: "https://www.infrabox.software/pricing-calculator" },
      ])} />
      <JsonLd data={createToolFaqSchema(FAQS)} />
      <JsonLd data={createHowToSchema({
        name: "How to size your email infrastructure",
        description: "Work out how many mailboxes, domains, and dollars per month it takes to hit your sending volume or meetings goal.",
        tool: "Infrabox Pricing Calculator",
        totalTime: "PT2M",
        steps: HOW_TO_STEPS,
      })} />
      <JsonLd data={createWebApplicationSchema({
        name: "Email Cost Calculator",
        url: "https://www.infrabox.software/pricing-calculator",
        featureList: [
          "Size mailboxes by daily send volume",
          "Reverse-calculate from a monthly meetings goal",
          "Split across Google Workspace, Microsoft 365, and Azure",
          "Estimate monthly cost and first-year total",
        ],
      })} />

      <Header />

      <main id="main-content">
        <section className="border-gray-200 border-dashed">
          <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8 pt-24 pb-10">
            <div className="text-center max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 border-dashed bg-[#DAFCD5] px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider text-[#1240cc]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#1240cc]" aria-hidden="true" />
                Pricing Calculator
              </span>
              <h1 className="mt-5 text-[1.75rem] sm:text-4xl lg:text-[2.75rem] font-semibold leading-[1.1] tracking-tight text-[#001050] text-balance">
                How many mailboxes do you need, and what will it cost?
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 tool-description" data-speakable>
                Size your email infrastructure across Google Workspace, Microsoft 365, and Azure. Start from a daily send volume, or work backwards from the meetings you want to book, and see the mailboxes, domains, and monthly cost it takes to get there.
              </p>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600" data-speakable>
                To send 1,000 emails a day you need about 67 to 69 Google Workspace mailboxes across roughly 23 domains. Set your volume or meetings goal below to see your exact mailboxes, domains, and monthly cost.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-gray-500">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#1240cc]" aria-hidden="true" />
                  Live estimates
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2f6b69]" aria-hidden="true" />
                  No signup required
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#6f9ef5]" aria-hidden="true" />
                  Volume or meetings goal
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Calculator heading anchors the head term directly above the widget */}
        <section className="border-gray-200 border-dashed">
          <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8 pt-4 pb-5">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#001050]">
              Email cost calculator
            </h2>
            <p className="mt-2 text-base text-gray-600" data-speakable>
              Estimate mailboxes, domains, and monthly cost for Google Workspace, Microsoft 365, and Azure.
            </p>
          </div>
        </section>

        <PricingCalculator />

        {/* How many mailboxes do I need? extractable summary */}
        <section className="border-gray-200 border-dashed">
          <div className="mx-auto max-w-3xl w-full px-4 sm:px-6 lg:px-8 pt-14 pb-10">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#001050]">
              How many mailboxes do I need?
            </h2>
            <p className="mt-3 text-gray-600" data-speakable>
              A safe deliverable rate is about 15 emails per day per Google Workspace mailbox and about 5 per Microsoft 365 mailbox. To send 1,000 emails a day on Google you need about 67 mailboxes. The calculator sizes this automatically from your target volume, or works backwards from the meetings you want to book.
            </p>
          </div>
        </section>

        {/* What you are actually paying for (pricing details people miss) */}
        <section className="border-gray-200 border-dashed">
          <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 lg:px-8 pt-14 pb-10">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#001050] text-balance">
              What you are actually paying for
            </h2>
            <p className="mt-3 max-w-2xl text-gray-600">
              Email pricing looks like one per-mailbox number, but most of the value, and most of the surprises, sit underneath it. Here is what the price includes, what scales it, and the costs people forget to budget.
            </p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {PRICE_DETAILS.map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl border border-gray-200 p-5 sm:p-6"
                >
                  <h3 className="font-semibold text-[#001050]">{card.title}</h3>
                  <ul className="mt-3 space-y-2.5">
                    {card.points.map((point) => (
                      <li
                        key={point}
                        className="flex gap-2.5 text-sm leading-relaxed text-gray-600"
                      >
                        <span
                          className="mt-[7px] h-1.5 w-1.5 flex-none rounded-full bg-[#1240cc]"
                          aria-hidden="true"
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Product screenshots: what the sized infrastructure looks like in Infrabox */}
        <section className="border-gray-200 border-dashed">
          <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 lg:px-8 pt-14 pb-10">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#001050] text-balance">
              See it in the dashboard
            </h2>
            <p className="mt-3 max-w-2xl text-gray-600">
              The mailboxes and domains the calculator sizes are the same ones you manage in Infrabox, with deliverability monitoring built in.
            </p>
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {DASHBOARD_SHOTS.map((shot) => (
                <figure
                  key={shot.title}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
                >
                  <img
                    src={shot.src}
                    alt={shot.alt}
                    width={640}
                    height={400}
                    loading="lazy"
                    className="aspect-[16/10] w-full border-b border-gray-200 object-cover object-top"
                  />
                  <figcaption className="p-4">
                    <div className="text-sm font-semibold text-[#001050]">
                      {shot.title}
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">
                      {shot.caption}
                    </p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* How the number is calculated + FAQ */}
        <section className="border-gray-200 border-dashed">
          <div className="mx-auto max-w-3xl w-full px-4 sm:px-6 lg:px-8 pb-20">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#001050]">
              How is the price calculated?
            </h2>
            <p className="mt-3 text-gray-600">
              No black box. Every figure comes from four simple steps, and you can change any assumption in the calculator's advanced settings.
            </p>
            <ol className="mt-6 space-y-4">
              {CALC_STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-3.5">
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-[#DAFCD5] text-[0.8125rem] font-semibold text-[#1240cc]">
                    {i + 1}
                  </span>
                  <div>
                    <div className="font-semibold text-[#001050]">
                      {step.title}
                    </div>
                    <p className="mt-0.5 text-sm leading-relaxed text-gray-600">
                      {step.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-6 rounded-xl bg-[#f9fafb] p-5 text-sm leading-relaxed text-gray-600">
              <div className="font-semibold text-[#001050]">Worked example</div>
              <p className="mt-1.5">
                Say you want to send 1,000 emails a day, all on Google. Domains = 1,000 divided by (3 times 15) = 23 (rounded up). Mailboxes = 23 times 3 = 69. That lands in the 30 to 99 band, so every mailbox is $3.25: 69 x $3.25 = $224.25 a month, or $186.30 on annual billing at $2.70. Domains are billed once a year separately. Set the monthly volume to 22,000 (1,000 a day across 22 sending days) and pick the All Google preset, and you will see the same 69 mailboxes and 23 domains.
              </p>
            </div>

            <h2 className="mt-10 text-2xl sm:text-3xl font-semibold tracking-tight text-[#001050]">
              Frequently asked questions
            </h2>
            <div className="mt-4 divide-y divide-gray-200 divide-dashed border-y border-gray-200 border-dashed">
              {FAQS.map((faq, index) => {
                const isOpen = openFaq === index;
                const panelId = `faq-panel-${index}`;
                const buttonId = `faq-button-${index}`;
                return (
                  <div key={faq.question}>
                    <h3>
                      <button
                        type="button"
                        id={buttonId}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        className="flex w-full items-center justify-between gap-4 py-4 text-left font-semibold text-[#001050] transition-colors hover:text-[#1240cc]"
                      >
                        <span>{faq.question}</span>
                        <span
                          aria-hidden="true"
                          className={`shrink-0 text-[#1240cc] transition-transform duration-200 ${isOpen ? "rotate-45" : "rotate-0"}`}
                        >
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <line x1="9" y1="3.5" x2="9" y2="14.5" />
                            <line x1="3.5" y1="9" x2="14.5" y2="9" />
                          </svg>
                        </span>
                      </button>
                    </h3>
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      hidden={!isOpen}
                    >
                      <p className="pb-4 -mt-1 text-gray-600">{faq.answer}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-14 rounded-2xl border border-gray-200 bg-[#f9fafb] px-6 py-10 text-center">
              <p className="text-sm text-gray-500">Ready to compare plans?</p>
              <div className="mt-4 flex justify-center">
                <a
                  href="/pricing"
                  className="rounded-full bg-[#1240cc] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0b34b4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1240cc]"
                >
                  See Infrabox pricing
                </a>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                Or learn more about{' '}
                <a href="/learn" className="font-medium text-[#1240cc] underline underline-offset-2 hover:text-[#0b34b4]">
                  email infrastructure
                </a>.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
