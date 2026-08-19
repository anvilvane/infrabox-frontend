import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Slider } from './ui/slider';
import { trackCalculator, trackClick } from '@/lib/datafast';

export default function MailboxCalculatorSection() {
  const [repliesPerDay, setRepliesPerDay] = useState(35);
  const [replyRate, setReplyRate] = useState(3.5);
  const [hasInteracted, setHasInteracted] = useState(false);

  const calculateMailboxes = (replies) => {
    // Convert percentage to decimal
    const replyRateDecimal = replyRate / 100;
    const emailsNeeded = Math.ceil(replies / replyRateDecimal);
    const emailsPerMailbox = 15; // 15 emails per mailbox
    const rawMailboxes = Math.ceil(emailsNeeded / emailsPerMailbox);
    
    // Don't cap mailboxes - show actual need
    const recommendedMailboxes = Math.max(rawMailboxes, 10); // Minimum 10 for professional plan
    
    // Plan pricing (using monthly rates, matching data/pricing.js)
    const plans = {
      professional: { baseCost: 39, included: 10, addonCost: 3.5 },
      agency: { baseCost: 99, included: 30, addonCost: 3.25 },
      enterprise: { baseCost: 299, included: 100, addonCost: 2.99 }
    };
    
    // Calculate cost for each plan option
    const calculatePlanCost = (planData, mailboxes) => {
      if (mailboxes <= planData.included) {
        return { cost: planData.baseCost, addons: 0 };
      } else {
        const addons = mailboxes - planData.included;
        return { cost: planData.baseCost + (addons * planData.addonCost), addons };
      }
    };
    
    const professionalOption = calculatePlanCost(plans.professional, recommendedMailboxes);
    const agencyOption = calculatePlanCost(plans.agency, recommendedMailboxes);
    const enterpriseOption = calculatePlanCost(plans.enterprise, recommendedMailboxes);
    
    // Find the most cost-effective option
    let bestOption = { name: 'Professional', ...professionalOption, included: 10 };

    if (agencyOption.cost < bestOption.cost) {
      bestOption = { name: 'Agency', ...agencyOption, included: 30 };
    }
    if (enterpriseOption.cost < bestOption.cost) {
      bestOption = { name: 'Enterprise', ...enterpriseOption, included: 100 };
    }
    
    // Format the plan display
    let plan, planType;
    if (bestOption.addons > 0) {
      plan = `${bestOption.name} + ${bestOption.addons} add-on`;
      planType = `${bestOption.name}+`;
    } else {
      plan = `${bestOption.name} (${bestOption.included} mailboxes)`;
      planType = bestOption.name;
    }
    
    return {
      mailboxes: recommendedMailboxes,
      emailsPerDay: emailsNeeded,
      plan: plan,
      planType: planType,
      isAddonNeeded: bestOption.addons > 0,
      addonCount: bestOption.addons,
      basePlan: bestOption.name,
      monthlyCost: bestOption.cost,
      includedMailboxes: bestOption.included
    };
  };

  const result = calculateMailboxes(repliesPerDay);

  const handleSliderChange = (value) => {
    setRepliesPerDay(value);
    
    // Track first interaction
    if (!hasInteracted) {
      setHasInteracted(true);
      trackCalculator('opened', {
        initial_replies: repliesPerDay,
        initial_reply_rate: replyRate
      });
    }
    
    // Track calculation
    trackCalculator('calculated', {
      replies_per_day: value,
      reply_rate: replyRate,
      mailboxes_needed: calculateMailboxes(value).mailboxes,
      recommended_plan: calculateMailboxes(value).basePlan,
      monthly_cost: calculateMailboxes(value).monthlyCost
    });
  };

  const handleReplyRateChange = (value) => {
    setReplyRate(value);
    
    // Track first interaction
    if (!hasInteracted) {
      setHasInteracted(true);
      trackCalculator('opened', {
        initial_replies: repliesPerDay,
        initial_reply_rate: replyRate
      });
    }
    
    // Track reply rate change
    trackCalculator('reply_rate_changed', {
      replies_per_day: repliesPerDay,
      reply_rate: value,
      mailboxes_needed: calculateMailboxes(repliesPerDay).mailboxes,
      recommended_plan: calculateMailboxes(repliesPerDay).basePlan
    });
  };

  const getPlanColor = (planType) => {
    const basePlan = planType.replace('+', '');
    switch(basePlan) {
      case 'Professional': return 'text-white bg-[#1240cc]';
      case 'Agency': return 'text-white bg-[#1240cc]';
      case 'Enterprise': return 'text-white bg-[#1240cc]';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl py-16 mx-auto">
          {/* Section Header */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-black mb-2">
              Calculate your mailbox needs
            </h2>
            <p className="text-sm text-black/70 max-w-2xl">
              Tell us your reply goals and we'll recommend the perfect mailbox setup for optimal deliverability.
            </p>
          </div>

          {/* Calculator */}
          <div className="border border-gray-200 rounded-lg">
            
            {/* Input Section */}
            <div className="p-8 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                
                {/* Replies Per Day Input */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-4">
                    Replies per day target
                  </label>
                  <Slider
                    min={5}
                    max={100}
                    step={5}
                    value={[repliesPerDay]}
                    onValueChange={([val]) => handleSliderChange(val)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-black/40 mt-2">
                    <span>5</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-[#1240cc]">
                      {repliesPerDay}
                    </span>
                    <span className="text-sm text-black/50 ml-2">
                      replies/day
                    </span>
                  </div>
                </div>

                {/* Reply Rate Input */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-4">
                    Expected reply rate
                  </label>
                  
                  <div className="relative">
                    {/* Chat bubble popup */}
                    {replyRate >= 3 && replyRate <= 4 && (
                      <div className="absolute -top-12 left-[62%] transform -translate-x-1/2 z-10">
                        <div className="relative bg-[#1240cc] text-white text-xs px-3 py-2 rounded-lg shadow-lg">
                          <span className="whitespace-nowrap">Average on Infrabox</span>
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#1240cc] rotate-45"></div>
                        </div>
                      </div>
                    )}
                    
                    <Slider
                      min={1}
                      max={5}
                      step={0.1}
                      value={[replyRate]}
                      onValueChange={([val]) => handleReplyRateChange(val)}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-black/40 mt-2">
                      <span>1%</span>
                      <span>3%</span>
                      <span>5%</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-[#1240cc]">
                      {replyRate}%
                    </span>
                    <span className="text-sm text-black/50 ml-2">
                      reply rate
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Mailboxes Needed */}
                <div>
                  <p className="text-xs uppercase tracking-wider text-black/50 mb-2">MAILBOXES NEEDED</p>
                  <p className="text-3xl font-bold text-[#1240cc] mb-1">
                    {result.mailboxes}
                  </p>
                  <p className="text-xs text-black/60">
                    {Math.ceil(result.emailsPerDay / result.mailboxes)} emails per mailbox/day
                  </p>
                </div>

                {/* Monthly Cost */}
                <div>
                  <p className="text-xs uppercase tracking-wider text-black/50 mb-2">MONTHLY COST</p>
                  <p className="text-3xl font-bold text-[#1240cc] mb-1">
                    ${Math.round(result.monthlyCost)}
                  </p>
                  <p className="text-xs text-black/60">
                    Most cost-effective option
                  </p>
                </div>

                {/* Recommended Plan */}
                <div>
                  <p className="text-xs uppercase tracking-wider text-black/50 mb-2">RECOMMENDED PLAN</p>
                  <p className="text-xl font-bold text-black mb-1">
                    {result.plan}
                  </p>
                  <p className="text-xs text-black/60">
                    {result.isAddonNeeded 
                      ? `${result.includedMailboxes} base + ${result.addonCount} add-on`
                      : `${result.includedMailboxes} mailboxes included`
                    }
                  </p>
                </div>
              </div>

              {/* CTA Section */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-black">
                      Ready to get started with {result.mailboxes} mailboxes?
                    </p>
                    <p className="text-xs text-black/60 mt-1">
                      {result.isAddonNeeded 
                        ? `${result.basePlan} plan + ${result.addonCount} add-ons • $${result.monthlyCost}/month`
                        : `${result.basePlan} plan • $${result.monthlyCost}/month`
                      }
                    </p>
                  </div>
                  <a 
                    href="https://app.infrabox.software/signup?utm_source=calculator&utm_medium=button&utm_campaign=landing"
                    onClick={() => {
                      trackClick('calculator_cta', {
                        location: 'calculator_result',
                        recommended_plan: result.basePlan,
                        mailboxes_needed: result.mailboxes,
                        monthly_cost: result.monthlyCost,
                        destination: 'signup'
                      });
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#1240cc] hover:bg-[#0b34b4] text-white rounded-full transition-all text-sm font-medium"
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}