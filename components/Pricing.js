"use client";

import React, { useState } from 'react';
import { Check, X, Minus, ArrowRight } from 'lucide-react';
import { pricingData } from '@/data/pricing';

const GoogleLogo = ({ className = "h-4 w-4" }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const MicrosoftLogo = ({ className = "h-4 w-4" }) => (
  <svg className={className} viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="1" y="1" width="10" height="10" fill="#f25022"/>
    <rect x="12" y="1" width="10" height="10" fill="#7fba00"/>
    <rect x="1" y="12" width="10" height="10" fill="#00a4ef"/>
    <rect x="12" y="12" width="10" height="10" fill="#ffb900"/>
  </svg>
);

const AzureLogo = ({ className = "h-4 w-4" }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M7.242 1.613A1.11 1.11 0 018.295.857h6.977L8.03 22.316a1.11 1.11 0 01-1.052.755h-5.43a1.11 1.11 0 01-1.053-1.466L7.242 1.613z" fill="url(#azure-fill-0)"/>
    <path d="M18.397 15.296H7.4a.51.51 0 00-.347.882l7.066 6.595c.206.192.477.298.758.298h6.226l-2.706-7.775z" fill="#0078D4"/>
    <path d="M15.272.857H7.497L0 23.071h7.775l1.596-4.73 5.068 4.73h6.665l-2.707-7.775h-7.998L15.272.857z" fill="url(#azure-fill-1)"/>
    <path d="M17.193 1.613a1.11 1.11 0 00-1.052-.756h-7.81.035c.477 0 .9.304 1.052.756l6.748 19.992a1.11 1.11 0 01-1.052 1.466h-.12 7.895a1.11 1.11 0 001.052-1.466L17.193 1.613z" fill="url(#azure-fill-2)"/>
    <defs>
      <linearGradient gradientUnits="userSpaceOnUse" id="azure-fill-0" x1="8.247" x2="1.002" y1="1.626" y2="23.03">
        <stop stopColor="#114A8B"/>
        <stop offset="1" stopColor="#0669BC"/>
      </linearGradient>
      <linearGradient gradientUnits="userSpaceOnUse" id="azure-fill-1" x1="14.042" x2="12.324" y1="15.302" y2="15.888">
        <stop stopOpacity=".3"/>
        <stop offset=".071" stopOpacity=".2"/>
        <stop offset=".321" stopOpacity=".1"/>
        <stop offset=".623" stopOpacity=".05"/>
        <stop offset="1" stopOpacity="0"/>
      </linearGradient>
      <linearGradient gradientUnits="userSpaceOnUse" id="azure-fill-2" x1="12.841" x2="20.793" y1="1.626" y2="22.814">
        <stop stopColor="#3CCBF4"/>
        <stop offset="1" stopColor="#2892DF"/>
      </linearGradient>
    </defs>
  </svg>
);

export default function UpdatedPricingSection() {
  const [selectedBilling, setSelectedBilling] = useState('annual');

  const currentPricing = pricingData[selectedBilling];

  const billingOptions = ['monthly', 'quarterly', 'annual'];

  const handleBillingKeyDown = (e) => {
    const idx = billingOptions.indexOf(selectedBilling);
    let newIdx;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      newIdx = (idx + 1) % billingOptions.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      newIdx = (idx - 1 + billingOptions.length) % billingOptions.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      newIdx = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      newIdx = billingOptions.length - 1;
    } else {
      return;
    }
    setSelectedBilling(billingOptions[newIdx]);
    document.getElementById(`billing-tab-${billingOptions[newIdx]}`)?.focus();
  };

  const plans = [
    {
      name: 'Professional',
      description: 'For small teams getting started.',
      price: currentPricing.professional.price,
      period: currentPricing.professional.period,
      additionalMailbox: currentPricing.professional.additionalMailbox,
      popular: false,
      includedMailboxes: currentPricing.professional.includedMailboxes,
      features: [
        'Official admin panel (1 per domain) with 2FA',
        'Real-time monitoring & alerts',
        '24+ platform integrations',
        'Unlimited team members & workspaces',
        'Full API access with webhooks',
        'Email & chat support'
      ]
    },
    {
      name: 'Agency',
      description: 'For growing teams at scale.',
      price: currentPricing.agency.price,
      period: currentPricing.agency.period,
      additionalMailbox: currentPricing.agency.additionalMailbox,
      popular: true,
      includedMailboxes: currentPricing.agency.includedMailboxes,
      features: [
        'Official admin panel (1 per domain) with 2FA',
        'Real-time monitoring & alerts',
        '24+ platform integrations',
        'Unlimited team members & workspaces',
        'Full API access with webhooks',
        'Email & chat support'
      ]
    },
    {
      name: 'Enterprise',
      description: 'For high-volume campaigns.',
      price: currentPricing.enterprise.price,
      period: currentPricing.enterprise.period,
      additionalMailbox: currentPricing.enterprise.additionalMailbox,
      popular: false,
      includedMailboxes: currentPricing.enterprise.includedMailboxes,
      features: [
        'Official admin panel (1 per domain) with 2FA',
        'Real-time monitoring & alerts',
        '24+ platform integrations',
        'Unlimited team members & workspaces',
        'Full API access with webhooks',
        'Dedicated Slack support'
      ]
    }
  ];

  const getIcon = (value) => {
    return <Check className="size-4 mx-auto text-[#1240cc]" />;
  };

  const getDisplayValue = (value) => {
    return value;
  };

  return (
    <section id="pricing" className=" border-gray-200 border-dashed scroll-mt-24">
      <div className="mx-auto 2xl:max-w-6xl 2xl:px-12 w-full max-w-6xl border-x border-gray-200 border-dashed px-4 pt-12 pb-12">
        
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight text-black">
            Choose the right plan <br className="md:block"/>for your team
          </h2>
          <p className="mt-2 text-sm text-gray-600">Flexible pricing that scales with your team.</p>
          
          {/* Billing Toggle */}
          <div className="flex flex-col gap-6 items-center justify-center mt-8 mb-6">
            <div className="inline-flex bg-gray-100 rounded-lg p-1" role="tablist" aria-label="Billing frequency">
              <button
                id="billing-tab-monthly"
                onClick={() => setSelectedBilling('monthly')}
                onKeyDown={handleBillingKeyDown}
                tabIndex={selectedBilling === 'monthly' ? 0 : -1}
                className={`px-6 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  selectedBilling === 'monthly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                type="button"
                role="tab"
                aria-selected={selectedBilling === 'monthly'}
              >
                Monthly
              </button>
              <button
                id="billing-tab-quarterly"
                onClick={() => setSelectedBilling('quarterly')}
                onKeyDown={handleBillingKeyDown}
                tabIndex={selectedBilling === 'quarterly' ? 0 : -1}
                className={`px-6 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  selectedBilling === 'quarterly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                type="button"
                role="tab"
                aria-selected={selectedBilling === 'quarterly'}
              >
                Quarterly
              </button>
              <button
                id="billing-tab-annual"
                onClick={() => setSelectedBilling('annual')}
                onKeyDown={handleBillingKeyDown}
                tabIndex={selectedBilling === 'annual' ? 0 : -1}
                className={`px-6 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  selectedBilling === 'annual'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                type="button"
                role="tab"
                aria-selected={selectedBilling === 'annual'}
              >
                Annual
              </button>
            </div>
            {selectedBilling === 'annual' && (
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                Save up to 20%
              </span>
            )}
            {selectedBilling === 'quarterly' && (
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                Save up to 10%
              </span>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`flex flex-col h-full justify-between p-4 rounded-xl ${
                plan.popular ? 'bg-gray-100 ring-1 ring-[#1240cc]' : 'bg-gray-50'
              }`}
            >
              <div className="flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-base font-medium text-black">
                    {plan.name}
                  </h3>
                  {plan.popular && (
                    <div className="inline-flex items-center justify-center px-2 py-1 bg-[#1240cc] text-white text-xs font-medium rounded-full">
                      Most Popular
                    </div>
                  )}
                </div>

                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium flex items-baseline tracking-tighter mt-2 text-black">
                  ${plan.price}
                  <span className="text-sm font-normal tracking-normal text-gray-600">
                    /month
                  </span>
                </p>

                <p className="text-sm mt-2 text-gray-600">
                  {plan.description}
                </p>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs font-medium uppercase text-gray-600">
                    Plan includes:
                  </p>
                  <ul className="flex flex-col mt-4 text-sm gap-y-3 text-black" role="list">
                    <li className="flex items-start gap-2">
                      <Check className="size-4 shrink-0 text-[#1240cc] mt-0.5" />
                      <span className="flex items-center gap-1 flex-wrap">{plan.includedMailboxes} <GoogleLogo className="h-3.5 w-3.5 inline-block" /> / <MicrosoftLogo className="h-3.5 w-3.5 inline-block" /> mailbox slots</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="size-4 shrink-0 text-[#1240cc] mt-0.5" />
                      <span className="flex items-center gap-1">$30 per <AzureLogo className="h-3.5 w-3.5 inline-block" /> Azure tenant</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="size-4 shrink-0 text-[#1240cc] mt-0.5" />
                      <span>${plan.additionalMailbox} per additional mailbox</span>
                    </li>
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <Check className="size-4 shrink-0 text-[#1240cc] mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs font-medium uppercase text-gray-600 mb-3">Add-ons</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>Email Warmup</span>
                        <span>$3/mailbox/mo</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>InfraGuard</span>
                        <span>1st month free</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full mt-8">
                <a href="https://app.infrabox.software/signup" className="flex transition text-center rounded-full items-center duration-300 justify-center focus:ring-2 focus:outline-none focus:ring-offset-2 h-9 px-4 py-2 text-sm w-full gap-2 text-white bg-[#1240cc] hover:bg-[#0b34b4] focus:ring-emerald-600" aria-label={`Get started with ${plan.name} plan`}>
                  Get Started
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </a>
              </div>
            </div>
          ))}
        </div>

      

      </div>
    </section>
  );
}