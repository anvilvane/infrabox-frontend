'use client'

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle, X, Flame, Link2, Settings, BarChart3, Activity, Zap, TrendingUp, Server } from "lucide-react";
import { trackClick } from '@/lib/datafast';
import { JsonLd, createWebPageSchema, createBreadcrumbSchema } from '@/components/seo/json-ld';

export default function ColdEmailWarmupPage() {
  const heroStats = [
    { number: "14", label: "Days to Full Capacity" },
    { number: "97%+", label: "Inbox Placement" },
    { number: "<2%", label: "Bounce Rate" },
    { number: "24+", label: "Sequencer Integrations" }
  ];

  const builtInFeatures = [
    "Auto volume scaling from starting volume to target/day",
    "Real-time health score with weighted formula",
    "Inbox, promotions, and spam rate tracking",
    "Configurable reply rates and sending patterns",
    "Supports Google Workspace, Microsoft 365, and Azure mailboxes",
    "Sparkline analytics per mailbox in the dashboard",
    "Pause, resume, and adjust settings anytime"
  ];

  const sequencerFeatures = [
    "One-click export with warmup pre-configured",
    "Smart presets for Google (25/day limit, 55% reply rate, 20min gap) and Microsoft",
    "Azure-specific scaling presets based on mailbox count (10/25/50/100)",
    "Warmup tag filtering enabled by default",
    "Validation ranges enforced per platform to prevent misconfiguration",
    "Works with 24+ sequencer platforms"
  ];

  const timelineSteps = [
    {
      title: "Set Up Mailboxes",
      description: "Create Google Workspace or Azure mailboxes through Infrabox. DNS records (SPF, DKIM, DMARC) are configured automatically via Cloudflare. Propagation takes 1–2 hours."
    },
    {
      title: "Enable Warmup",
      description: "Choose built-in warmup or connect your sequencer. Infrabox applies optimized defaults: starting volume of 2 emails/day, daily increase of 2, target of 40/day, with inbox reply rate 30–50% and promotions reply rate 2–3%."
    },
    {
      title: "Gradual Scaling (Days 1–14)",
      description: "Volume increases automatically each day. The system sends and receives emails with realistic reply patterns, building sender reputation with ISPs like Gmail, Outlook, and Yahoo."
    },
    {
      title: "Launch Campaigns",
      description: "After 14 days, your mailboxes are warmed and ready. Begin cold outreach at 10–15 emails/mailbox/day (Rule of 3: max 3 mailboxes per domain). Keep warmup running alongside campaigns for ongoing reputation maintenance."
    }
  ];

  const sequencerPlatforms = [
    "Instantly", "SmartLead", "Lemlist", "Reply.io", "Apollo", "Salesforge",
    "EmailBison", "Warmy", "Snov.io", "TrulyInbox", "ReachInbox", "ManyReach",
    "WarmForge", "PlusVibe", "MasterInbox", "MailToaster"
  ];

  const healthTiers = [
    { range: "90–100", status: "Excellent", color: "bg-green-500", meaning: "Mailbox is performing optimally. Ready for full campaigns." },
    { range: "70–89", status: "Good", color: "bg-blue-500", meaning: "Solid reputation. Minor adjustments may help." },
    { range: "50–69", status: "Warning", color: "bg-yellow-500", meaning: "Deliverability at risk. Review warmup settings and DNS." },
    { range: "0–49", status: "Critical", color: "bg-red-500", meaning: "Immediate action needed. Pause campaigns and investigate." }
  ];

  const formulaWeights = [
    { metric: "Inbox Rate", weight: "40%", description: "Primary goal" },
    { metric: "Spam Avoidance", weight: "35%", description: "Critical for reputation" },
    { metric: "Bounce Avoidance", weight: "15%", description: "Sender rep" },
    { metric: "Promotions Avoidance", weight: "10%", description: "Less critical" }
  ];

  const withoutWarmup = [
    "New domains have zero sender reputation with ISPs",
    "Emails flagged as spam immediately — deliverability under 30%",
    "Domain and IP blacklisted within days",
    "SPF/DKIM misalignment compounds the problem",
    "80% of email campaign failures stem from infrastructure issues, not copy"
  ];

  const withWarmup = [
    "Gradual volume increase builds trust with Gmail, Outlook, Yahoo",
    "97%+ inbox placement after 14-day warmup period",
    "Bounce rates maintained below 2% (critical alerts above 5%)",
    "DNS health monitored alongside warmup for full-stack reputation",
    "Warmup continues alongside campaigns for ongoing maintenance",
    "Inbox placement scores below 50% trigger automatic warmup adjustments"
  ];

  const azurePresets = [
    { mailboxes: "10", warmupLimit: "40/day", replyRate: "60%", emailLimit: "20/day", gap: "20 min" },
    { mailboxes: "25", warmupLimit: "20/day", replyRate: "60%", emailLimit: "8/day", gap: "20 min" },
    { mailboxes: "50", warmupLimit: "10/day", replyRate: "60%", emailLimit: "4/day", gap: "20 min" },
    { mailboxes: "100", warmupLimit: "5/day", replyRate: "60%", emailLimit: "2/day", gap: "20 min" }
  ];

  return (
    <>
      <JsonLd data={createWebPageSchema({
        name: "Email Warmup",
        description: "Automated email warmup with 24+ sequencer integrations. Build sender reputation in 14 days with isolated warmup for Google, Microsoft, and Azure mailboxes.",
        url: "https://www.infrabox.software/email-warmup",
      })} />
      <JsonLd data={createBreadcrumbSchema([
        { name: "Home", url: "https://www.infrabox.software" },
        { name: "Email Warmup", url: "https://www.infrabox.software/email-warmup" },
      ])} />
      <Header />

      {/* Section 1: Hero */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="text-center pt-24 pb-16 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-200 mb-6">
              <Zap className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">Built-in Warmup Now Live</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-black leading-[0.95] mb-6">
              Warm up mailboxes.
              <br />
              <span className="text-[#1240cc]">Land in inbox.</span>
            </h1>

            <p className="text-base md:text-lg text-black/70 leading-relaxed max-w-2xl mx-auto mb-8">
              Use Infrabox&apos;s built-in warmup engine or connect to 24+ sequencer platforms. Smart volume scaling, real-time health scores, and automated reputation building — all from one dashboard.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a
                href="https://app.infrabox.software/signup"
                onClick={() => trackClick('warmup_hero_cta', { action: 'signup' })}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1240cc] hover:bg-[#0b34b4] text-white rounded-full transition-all text-sm font-semibold"
              >
                Start Warming Up
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#how-it-works"
                onClick={() => trackClick('warmup_hero_cta', { action: 'how_it_works' })}
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-black hover:bg-gray-50 rounded-full transition-all text-sm font-semibold"
              >
                See How It Works
              </a>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center mb-16">
              {heroStats.map((stat, index) => (
                <div key={index}>
                  <div className="text-2xl md:text-3xl font-bold text-[#1240cc] mb-1">
                    {stat.number}
                  </div>
                  <div className="text-xs text-black/60">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Hero Visual: Warmup Dashboard Mockup */}
            <div className="bg-gray-100 rounded-xl p-6">
              <div className="bg-white rounded-xl shadow-sm outline outline-gray-300 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-[#1240cc]" />
                    <span className="text-sm font-semibold text-black">Warmup Dashboard</span>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 bg-green-50 border border-green-200 rounded-full text-xs font-medium text-green-700">
                    Day 12 of 14
                  </span>
                </div>

                {/* Sparkline Bars */}
                <div className="flex items-end gap-1 h-20 mb-6">
                  {[30, 40, 45, 50, 55, 60, 65, 70, 75, 78, 82, 88].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col gap-0.5">
                      <div className="bg-[#1240cc] rounded-t" style={{ height: `${h}%` }}></div>
                      <div className="bg-yellow-400 rounded" style={{ height: `${Math.max(3, 15 - i)}%` }}></div>
                      <div className="bg-red-400 rounded-b" style={{ height: `${Math.max(2, 8 - i * 0.5)}%` }}></div>
                    </div>
                  ))}
                </div>

                {/* Metric Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-black/50 mb-1">Inbox Rate</div>
                    <div className="text-lg font-bold text-[#1240cc]">94.2%</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-black/50 mb-1">Promotions</div>
                    <div className="text-lg font-bold text-yellow-600">3.1%</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-black/50 mb-1">Spam Rate</div>
                    <div className="text-lg font-bold text-red-500">0.8%</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-black/50 mb-1">Health Score</div>
                    <div className="text-lg font-bold text-green-600">87</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Two Paths */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="py-16 max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs uppercase tracking-wider text-[#1240cc]/70 mb-4">CHOOSE YOUR APPROACH</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-black mb-6">
                Two ways to warm up your mailboxes
              </h2>
              <p className="text-base text-black/70 leading-relaxed max-w-2xl mx-auto">
                Use our built-in warmup engine for a zero-config experience, or connect to a sequencer you already use. Both approaches give you full visibility and control from your Infrabox dashboard.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Card A: Built-in Warmup */}
              <div className="bg-white rounded-xl shadow-sm outline outline-gray-300 p-6 relative">
                <div className="absolute -top-3 left-6">
                  <span className="inline-flex items-center px-3 py-1 bg-[#1240cc] text-white rounded-full text-xs font-medium">
                    Recommended
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-4 mt-2">
                  <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                    <Flame className="w-5 h-5 text-orange-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-black">Built-in Warmup</h3>
                </div>
                <p className="text-sm text-black/70 mb-6">
                  Infrabox&apos;s native warmup engine handles everything — volume scaling, reply simulation, inbox/spam/promotions tracking, and health scoring. No external tool needed.
                </p>
                <ul className="space-y-3 mb-6">
                  {builtInFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-black/80">
                      <CheckCircle className="w-4 h-4 text-[#1240cc] mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm text-black/60 mb-4">$3/mailbox/month</p>
                  <a
                    href="https://app.infrabox.software/signup"
                    onClick={() => trackClick('warmup_builtin_cta', { action: 'signup' })}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#1240cc] hover:bg-[#0b34b4] text-white rounded-full transition-all text-sm font-semibold"
                  >
                    Enable Built-in Warmup
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Card B: Sequencer Warmup */}
              <div className="bg-white rounded-xl shadow-sm outline outline-gray-300 p-6 relative">
                <div className="absolute -top-3 left-6">
                  <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    Popular
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-4 mt-2">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Link2 className="w-5 h-5 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-black">Connect Your Sequencer</h3>
                </div>
                <p className="text-sm text-black/70 mb-6">
                  Already using Instantly, SmartLead, or another warmup platform? Connect it directly and Infrabox will auto-configure optimal warmup settings per mailbox during export.
                </p>
                <ul className="space-y-3 mb-6">
                  {sequencerFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-black/80">
                      <CheckCircle className="w-4 h-4 text-[#1240cc] mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm text-black/60 mb-4">Included with your sequencer subscription</p>
                  <a
                    href="https://app.infrabox.software/signup"
                    onClick={() => trackClick('warmup_sequencer_cta', { action: 'signup' })}
                    className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-black hover:bg-gray-50 rounded-full transition-all text-sm font-semibold"
                  >
                    Connect Sequencer
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: How It Works */}
      <section id="how-it-works" className="bg-white">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="py-16 max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs uppercase tracking-wider text-[#1240cc]/70 mb-4">STEP BY STEP</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-black mb-6">
                How warmup works
              </h2>
            </div>

            <div className="space-y-0">
              {timelineSteps.map((step, index) => (
                <div key={index} className="flex gap-6">
                  {/* Timeline line + number */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-[#1240cc] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    {index < timelineSteps.length - 1 && (
                      <div className="w-px h-full bg-gray-200 my-2"></div>
                    )}
                  </div>
                  {/* Content */}
                  <div className={index < timelineSteps.length - 1 ? "pb-10" : "pb-0"}>
                    <h3 className="text-base font-semibold text-black mb-2">{step.title}</h3>
                    <p className="text-sm text-black/70 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Configurable Warmup Settings */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="py-16 max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs uppercase tracking-wider text-[#1240cc]/70 mb-4">CONFIGURATION</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-black mb-6">
                Full control over your warmup
              </h2>
              <p className="text-base text-black/70 leading-relaxed max-w-2xl mx-auto">
                Infrabox&apos;s warmup engine comes with sensible defaults, but every parameter is tunable. Adjust volume curves, reply rates, and sending patterns to match your infrastructure.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Card A: Volume Settings */}
              <div className="bg-white rounded-xl shadow-sm outline outline-gray-300 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-5 h-5 text-[#1240cc]" />
                  <h3 className="text-sm font-semibold text-black">Volume Settings</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-black/70">Starting Volume</span>
                    <span className="text-sm font-medium text-black">2 emails/day</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-black/70">Daily Increase</span>
                    <span className="text-sm font-medium text-black">2 emails/day</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-black/70">Target Volume</span>
                    <span className="text-sm font-medium text-black">40 emails/day</span>
                  </div>
                </div>
                <p className="text-xs text-black/50 mt-4">
                  These settings are optimized for best deliverability. Only change them if you know what you&apos;re doing.
                </p>
              </div>

              {/* Card B: Reply Rate Settings */}
              <div className="bg-white rounded-xl shadow-sm outline outline-gray-300 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="w-5 h-5 text-[#1240cc]" />
                  <h3 className="text-sm font-semibold text-black">Reply Rate Settings</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-black/70">Inbox Reply Rate</span>
                    <span className="text-sm font-medium text-black">30%–50%</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-black/70">Promotions Reply Rate</span>
                    <span className="text-sm font-medium text-black">2%–3%</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-black/70">Spam Rate</span>
                    <span className="text-sm font-medium text-black">1%</span>
                  </div>
                </div>
                <p className="text-xs text-black/50 mt-4">
                  Reset to defaults button available in the dashboard.
                </p>
              </div>

              {/* Card C: Sequencer Presets */}
              <div className="bg-white rounded-xl shadow-sm outline outline-gray-300 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Settings className="w-5 h-5 text-[#1240cc]" />
                  <h3 className="text-sm font-semibold text-black">Sequencer Presets</h3>
                </div>
                <p className="text-xs text-black/50 mb-3">Google & Microsoft Default</p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-black/70">Daily Warmup Limit</span>
                    <span className="text-sm font-medium text-black">25</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-black/70">Reply Rate</span>
                    <span className="text-sm font-medium text-black">55%</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-black/70">Warmup Tag Filter</span>
                    <span className="text-sm font-medium text-green-600">Enabled</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-black/70">Daily Email Limit</span>
                    <span className="text-sm font-medium text-black">15</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-black/70">Sending Gap</span>
                    <span className="text-sm font-medium text-black">20 minutes</span>
                  </div>
                </div>
              </div>

              {/* Card D: Azure Scaling Presets */}
              <div className="bg-white rounded-xl shadow-sm outline outline-gray-300 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Server className="w-5 h-5 text-[#1240cc]" />
                  <h3 className="text-sm font-semibold text-black">Azure Scaling Presets</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-black/50">
                        <th className="pb-2 font-medium">Mailboxes</th>
                        <th className="pb-2 font-medium">Warmup</th>
                        <th className="pb-2 font-medium">Reply</th>
                        <th className="pb-2 font-medium">Email</th>
                        <th className="pb-2 font-medium">Gap</th>
                      </tr>
                    </thead>
                    <tbody>
                      {azurePresets.map((preset, index) => (
                        <tr key={index} className="border-t border-gray-100">
                          <td className="py-2 font-medium text-black">{preset.mailboxes}</td>
                          <td className="py-2 text-black/70">{preset.warmupLimit}</td>
                          <td className="py-2 text-black/70">{preset.replyRate}</td>
                          <td className="py-2 text-black/70">{preset.emailLimit}</td>
                          <td className="py-2 text-black/70">{preset.gap}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-black/50 mt-4">
                  Azure domains support up to 100 mailboxes per domain. Warmup limits scale inversely to prevent throttling.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Supported Sequencer Platforms */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="py-16 max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-wider text-[#1240cc]/70 mb-4">INTEGRATIONS</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-black mb-6">
                Works with every major sequencer
              </h2>
              <p className="text-base text-black/70 leading-relaxed max-w-2xl mx-auto">
                Connect your mailboxes to 24+ email sequencing platforms. Infrabox auto-configures warmup settings and validates ranges per platform to prevent deliverability issues.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {sequencerPlatforms.map((platform, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-black/80"
                >
                  {platform}
                </span>
              ))}
            </div>

            <p className="text-sm text-black/60 text-center max-w-2xl mx-auto leading-relaxed">
              Each platform has enforced warmup validation ranges. For example, Instantly allows 1–50 daily warmup limit and 1–120 min sending gap, while EmailBison caps at 30 warmup limit and 90 min gap. Infrabox prevents misconfiguration automatically.
            </p>
          </div>
        </div>
      </section>

      {/* Section 6: Health Scoring System */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="py-16 max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs uppercase tracking-wider text-[#1240cc]/70 mb-4">MONITORING</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-black mb-6">
                Real-time health scoring for every mailbox
              </h2>
              <p className="text-base text-black/70 leading-relaxed max-w-2xl mx-auto">
                Infrabox calculates a 0–100 health score using a weighted formula across four key deliverability metrics. Scores update with every sync.
              </p>
            </div>

            {/* Health Score Tiers */}
            <div className="mb-12">
              <h3 className="text-sm font-semibold text-black mb-4">Health Score Tiers</h3>
              <div className="bg-white rounded-xl shadow-sm outline outline-gray-300 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left text-xs text-black/50">
                      <th className="px-4 py-3 font-medium">Score</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">What it means</th>
                    </tr>
                  </thead>
                  <tbody>
                    {healthTiers.map((tier, index) => (
                      <tr key={index} className="border-t border-gray-100">
                        <td className="px-4 py-3 font-medium text-black">{tier.range}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-2.5 h-2.5 rounded-full ${tier.color}`}></div>
                            <span className="font-medium text-black">{tier.status}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-black/70">{tier.meaning}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Formula Breakdown */}
            <div className="mb-12">
              <h3 className="text-sm font-semibold text-black mb-4">Health Score Formula</h3>
              <div className="space-y-4">
                {formulaWeights.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-32 sm:w-44 text-sm text-black font-medium flex-shrink-0">{item.metric}</div>
                    <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-[#1240cc] h-full rounded-full"
                        style={{ width: item.weight }}
                      ></div>
                    </div>
                    <div className="w-12 text-sm font-semibold text-[#1240cc] text-right flex-shrink-0">{item.weight}</div>
                    <div className="hidden sm:block w-40 text-xs text-black/50 flex-shrink-0">{item.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tracked Metrics */}
            <div>
              <h3 className="text-sm font-semibold text-black mb-4">Tracked Metrics per Mailbox</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  "Emails sent / received",
                  "Inbox rate, spam rate, promotions rate",
                  "Reply rate, bounce rate",
                  "Current volume vs. target volume",
                  "Warmup day (out of 14)",
                  "DNS health score",
                  "Last email sent timestamp",
                  "Volume adjustments with reasons",
                  "14-day sparkline chart"
                ].map((metric, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm text-black/70">
                    <div className="w-1.5 h-1.5 bg-[#1240cc] rounded-full mt-2 flex-shrink-0"></div>
                    {metric}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Why Warmup Matters */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="py-16 max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-wider text-[#1240cc]/70 mb-4">WHY WARMUP MATTERS</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-black mb-6">
                Skip warmup, land in spam
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-black">Without Warmup</h3>
                <ul className="space-y-3 text-sm text-black/80">
                  {withoutWarmup.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-black">With Infrabox Warmup</h3>
                <ul className="space-y-3 text-sm text-black/80">
                  {withWarmup.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-[#1240cc] mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: Final CTA */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 py-16">
          <div className="p-12 text-center rounded-xl bg-[#1240cc]">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              Ready to build sender reputation the right way?
            </h2>
            <p className="text-base text-white/80 mb-8 max-w-xl mx-auto">
              Create your mailboxes, enable warmup, and start landing in the inbox — not the spam folder. Setup takes under 2 minutes with Quick Setup.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://app.infrabox.software/signup"
                onClick={() => trackClick('warmup_cta', { location: 'bottom' })}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 text-[#1240cc] rounded-full transition-all text-sm font-semibold"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="/#book-call"
                onClick={() => trackClick('warmup_cta_sales', { location: 'bottom' })}
                className="inline-flex items-center justify-center px-6 py-3 border border-white text-white hover:bg-white/10 rounded-full transition-all text-sm font-semibold"
              >
                Talk to Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
