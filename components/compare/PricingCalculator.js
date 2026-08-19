"use client";

import { useState } from "react";
import Image from "next/image";

const VOLUME_STEPS = [10, 30, 50, 100, 300, 1000];

/**
 * Infrabox plan-based pricing (from data/pricing.js).
 * Monthly: Professional $39 (10 slots, $3.50/extra), Agency $99 (30, $3.25/extra), Enterprise $299 (100, $2.99/extra)
 * Quarterly: Professional $35 ($3.40/extra), Agency $90 ($3/extra), Enterprise $290 ($2.90/extra)
 * Annual: Professional $31 ($3.10/extra), Agency $81 ($2.70/extra), Enterprise $250 ($2.50/extra)
 */
function calcInfrabox(volume, billing) {
  if (billing === "annual") {
    if (volume <= 10) return { cost: 31, plan: "Professional", included: 10, extra: 0, extraRate: 3.10 };
    if (volume <= 30) return { cost: 81, plan: "Agency", included: 30, extra: 0, extraRate: 2.70 };
    if (volume <= 100) {
      const extra = volume - 30;
      return { cost: 81 + extra * 2.70, plan: "Agency", included: 30, extra, extraRate: 2.70 };
    }
    const extra = volume - 100;
    return { cost: 250 + extra * 2.50, plan: "Enterprise", included: 100, extra, extraRate: 2.50 };
  }
  // Monthly
  if (volume <= 10) return { cost: 39, plan: "Professional", included: 10, extra: 0, extraRate: 3.50 };
  if (volume <= 30) return { cost: 99, plan: "Agency", included: 30, extra: 0, extraRate: 3.25 };
  if (volume <= 100) {
    const extra = volume - 30;
    return { cost: 99 + extra * 3.25, plan: "Agency", included: 30, extra, extraRate: 3.25 };
  }
  const extra = volume - 100;
  return { cost: 299 + extra * 2.99, plan: "Enterprise", included: 100, extra, extraRate: 2.99 };
}

function interpolate(tiers, volume) {
  if (!tiers || tiers.length === 0) return null;
  const sorted = [...tiers].sort((a, b) => a.volume - b.volume);
  if (volume <= sorted[0].volume) return sorted[0];
  if (volume >= sorted[sorted.length - 1].volume) return sorted[sorted.length - 1];
  for (let i = 0; i < sorted.length - 1; i++) {
    if (volume >= sorted[i].volume && volume <= sorted[i + 1].volume) {
      const ratio = (volume - sorted[i].volume) / (sorted[i + 1].volume - sorted[i].volume);
      return {
        volume,
        monthly: Math.round(sorted[i].monthly + ratio * (sorted[i + 1].monthly - sorted[i].monthly)),
        annual: Math.round(sorted[i].annual + ratio * (sorted[i + 1].annual - sorted[i].annual)),
      };
    }
  }
  return sorted[sorted.length - 1];
}

function StaticPricingCards({ infraboxPricing, competitorPricing, competitorName, competitorDomain }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="border-2 border-[#1240cc] bg-white rounded-xl overflow-hidden">
        <div className="bg-[#1240cc] px-5 py-2">
          <span className="text-white text-xs font-semibold">Recommended</span>
        </div>
        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
            <img src="/logo.png" alt="Infrabox" className="h-5 w-auto" />
            Infrabox
          </h3>
          <p className="text-sm text-gray-400 mb-4">infrabox.software</p>
          <ul className="space-y-3">
            {infraboxPricing.map((tier, i) => (
              <li key={i} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-medium text-gray-900">{tier.name}</span>
                  <span className="text-sm font-semibold text-[#1240cc]">{tier.price}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{tier.details}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border border-gray-200 bg-white rounded-xl overflow-hidden">
        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
            <img src={`https://www.google.com/s2/favicons?domain=${competitorDomain}&sz=32`} alt="" className="w-5 h-5 rounded-sm" />
            {competitorName}
          </h3>
          <p className="text-sm text-gray-400 mb-4">{competitorDomain}</p>
          <ul className="space-y-3">
            {competitorPricing.map((tier, i) => (
              <li key={i} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-medium text-gray-900">{tier.name}</span>
                  <span className="text-sm font-semibold text-gray-600">{tier.price}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{tier.details}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function PricingCalculator({
  pricingTiers,
  competitorName,
  competitorDomain,
  infraboxPricing,
  competitorPricing,
  pricingVerdict,
}) {
  const [volumeIndex, setVolumeIndex] = useState(3); // default 100
  const [billing, setBilling] = useState("annual");

  if (!pricingTiers) {
    return (
      <div>
        <StaticPricingCards
          infraboxPricing={infraboxPricing}
          competitorPricing={competitorPricing}
          competitorName={competitorName}
          competitorDomain={competitorDomain}
        />
        {pricingVerdict && (
          <div className="mt-5 bg-emerald-50 border border-emerald-200 rounded-xl p-5">
            <p className="text-sm text-emerald-900 leading-relaxed">
              <span className="font-semibold">Pricing Verdict:</span> {pricingVerdict}
            </p>
          </div>
        )}
      </div>
    );
  }

  const volume = VOLUME_STEPS[volumeIndex];
  const ik = calcInfrabox(volume, billing);
  const infraboxCost = Math.round(ik.cost);
  const competitorData = interpolate(pricingTiers.competitor, volume);
  const competitorCost = competitorData ? competitorData[billing] : 0;
  const savings = competitorCost - infraboxCost;
  const perMbInfrabox = volume > 0 ? (infraboxCost / volume).toFixed(2) : "0";
  const perMbCompetitor = volume > 0 ? (competitorCost / volume).toFixed(2) : "0";

  return (
    <div>
      {/* Controls */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
              Mailbox Volume: <span className="text-gray-900 text-sm normal-case">{volume} mailboxes</span>
            </label>
            <input
              type="range"
              min={0}
              max={VOLUME_STEPS.length - 1}
              step={1}
              value={volumeIndex}
              onChange={(e) => setVolumeIndex(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1240cc]"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              {VOLUME_STEPS.map((v) => (
                <span key={v}>{v}</span>
              ))}
            </div>
          </div>
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-4 py-2 text-xs font-semibold transition-colors ${
                billing === "monthly" ? "bg-[#1240cc] text-white" : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("annual")}
              className={`px-4 py-2 text-xs font-semibold transition-colors ${
                billing === "annual" ? "bg-[#1240cc] text-white" : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Annual
            </button>
          </div>
        </div>
      </div>

      {/* Price Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Infrabox */}
        <div className="border-2 border-[#1240cc] bg-white rounded-xl overflow-hidden">
          <div className="bg-[#1240cc] px-5 py-2">
            <span className="text-white text-xs font-semibold">Recommended</span>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="Infrabox" className="h-5 w-auto" />
              <span className="text-lg font-semibold text-gray-900">Infrabox</span>
            </div>
            <div className="mb-2">
              <span className="text-3xl font-bold text-[#1240cc]">${infraboxCost.toLocaleString()}</span>
              <span className="text-sm text-gray-500">/mo</span>
            </div>
            <p className="text-sm text-gray-500 mb-1">
              ${perMbInfrabox}/mailbox &middot; {volume} mailboxes &middot; {billing}
            </p>
            <p className="text-xs text-gray-400">
              {ik.plan} plan ({ik.included} included){ik.extra > 0 && ` + ${ik.extra} extra at $${ik.extraRate.toFixed(2)}/mb`}
            </p>
          </div>
        </div>
        {/* Competitor */}
        <div className="border border-gray-200 bg-white rounded-xl overflow-hidden">
          <div className="p-5 pt-[calc(1.25rem+28px)]">
            <div className="flex items-center gap-2 mb-4">
              <img src={`https://www.google.com/s2/favicons?domain=${competitorDomain}&sz=32`} alt="" className="w-5 h-5 rounded-sm" />
              <span className="text-lg font-semibold text-gray-900">{competitorName}</span>
            </div>
            <div className="mb-2">
              <span className="text-3xl font-bold text-gray-700">${competitorCost.toLocaleString()}</span>
              <span className="text-sm text-gray-500">/mo</span>
            </div>
            <p className="text-sm text-gray-500">
              ${perMbCompetitor}/mailbox &middot; {volume} mailboxes &middot; {billing}
            </p>
          </div>
        </div>
      </div>

      {/* Savings Callout */}
      {savings !== 0 && (
        <div className={`mt-4 rounded-xl p-4 text-sm font-medium ${
          savings > 0
            ? "bg-emerald-50 border border-emerald-200 text-emerald-900"
            : "bg-amber-50 border border-amber-200 text-amber-900"
        }`}>
          {savings > 0
            ? `Infrabox saves you $${savings.toLocaleString()}/mo ($${(savings * 12).toLocaleString()}/yr) at ${volume} mailboxes.`
            : `${competitorName} is $${Math.abs(savings).toLocaleString()}/mo cheaper at ${volume} mailboxes. Compare features above to see what's included at each price point.`}
        </div>
      )}

      {pricingVerdict && (
        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-700 leading-relaxed">
            <span className="font-semibold">Pricing Verdict:</span> {pricingVerdict}
          </p>
        </div>
      )}
    </div>
  );
}
