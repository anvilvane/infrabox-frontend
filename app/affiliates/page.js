'use client'

import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trackClick } from '@/lib/datafast';

export default function Affiliates() {
  const [monthlyReferrals, setMonthlyReferrals] = useState(5);

  const calculateEarnings = (referrals) => {
    const averageMailboxes = 500;
    const pricePerMailbox = 2.5;
    const commissionRate = 0.1;
    const monthlyRevenue = averageMailboxes * pricePerMailbox * commissionRate;
    return {
      monthly: monthlyRevenue * referrals,
      annual: monthlyRevenue * referrals * 12,
      lifetime: monthlyRevenue * referrals * 24 // 2 year average
    };
  };

  const earnings = calculateEarnings(monthlyReferrals);

  const faqs = [
    {
      question: "How much commission do I earn?",
      answer: "You earn 10% lifetime recurring commission on all referred customers. With our average customer purchasing 500+ mailboxes, that's $125+ per month per customer, forever."
    },
    {
      question: "When do I get paid?",
      answer: "Commissions are paid quarterly via Stripe. You'll receive automatic payouts once your balance reaches $100. Full transparency with real-time tracking in your dashboard."
    },
    {
      question: "What marketing materials do you provide?",
      answer: "Access to email templates, landing pages, case studies, and co-branded materials. Plus dedicated affiliate support to help you succeed."
    },
    {
      question: "Are there any requirements to join?",
      answer: "No minimum requirements or fees. Instant approval for legitimate businesses. We simply ask that you have an audience interested in email marketing or cold outreach."
    },
    {
      question: "How long do cookies last?",
      answer: "90-day cookie duration ensures you get credit for referrals. Plus, we offer last-click attribution to maximize your earnings potential."
    }
  ];

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="bg-white ">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="text-center pt-24 max-w-4xl mx-auto">
            <p className="text-xs uppercase tracking-wider text-[#1240cc] mb-6">
              AFFILIATE PARTNER PROGRAM
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-black leading-[0.95] mb-6">
              Turn your network into
              <br />
              <span className="text-[#1240cc]">$3,000+ monthly income</span>
            </h1>
            <p className="text-base md:text-lg text-black/70 leading-relaxed max-w-2xl mx-auto mb-8">
              Join Infrabox's affiliate program and earn lifetime commissions. 
              Our average customer purchases 500+ mailboxes, earning you thousands in recurring revenue.
            </p>
            
            <a 
              href="https://partner.infrabox.software/register"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick('affiliate_hero_cta', { location: 'hero' })}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1240cc] hover:bg-[#0b34b4] text-white rounded-full transition-all text-sm font-medium"
            >
              Become an Affiliate
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Key Numbers */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl  py-16 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-3xl font-bold text-[#1240cc] mb-1">10%</p>
                <p className="text-sm text-black/70">Lifetime commission</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#1240cc] mb-1">$125+</p>
                <p className="text-sm text-black/70">Per customer monthly</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#1240cc] mb-1">500+</p>
                <p className="text-sm text-black/70">Average mailboxes per customer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold tracking-tight text-black mb-8">
              How it works
            </h2>
            
            <div className="space-y-8">
              <div className="flex gap-6">
                <span className="text-xl font-bold text-[#1240cc]">01</span>
                <div>
                  <h3 className="text-base font-semibold text-black mb-2">Sign up</h3>
                  <p className="text-sm text-black/70">
                    Join our affiliate program in seconds. No fees, no minimum requirements. 
                    Get instant approval and access to your dashboard.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <span className="text-xl font-bold text-[#1240cc]">02</span>
                <div>
                  <h3 className="text-base font-semibold text-black mb-2">Share your unique link</h3>
                  <p className="text-sm text-black/70">
                    Get your referral link and share it with your network, clients, or audience. 
                    90-day cookie duration ensures you get credit.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <span className="text-xl font-bold text-[#1240cc]">03</span>
                <div>
                  <h3 className="text-base font-semibold text-black mb-2">Earn lifetime commissions</h3>
                  <p className="text-sm text-black/70">
                    Earn 10% on every payment, forever. Average customer value of $1,250/month 
                    means $125+ monthly commission per referral.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <span className="text-xl font-bold text-[#1240cc]">04</span>
                <div>
                  <h3 className="text-base font-semibold text-black mb-2">Track and get paid</h3>
                  <p className="text-sm text-black/70">
                    Monitor your earnings in real-time. Receive automatic quarterly payouts 
                    via Stripe once you reach $100.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Commission Calculator */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl py-16 mx-auto">
            <h2 className="text-2xl font-bold tracking-tight text-black mb-2">
              Calculate your earnings
            </h2>
            <p className="text-sm text-black/70 mb-8">
              See how much you could earn based on your referral potential
            </p>

            <div className="bg-gray-100 rounded-xl p-8">
              <div className="mb-6">
                <label className="text-sm font-medium text-black mb-2 block">
                  How many customers can you refer per month?
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={monthlyReferrals}
                    onChange={(e) => setMonthlyReferrals(parseInt(e.target.value))}
                    className="flex-1 accent-[#1240cc]"
                  />
                  <span className="text-2xl font-bold text-[#1240cc] w-12">{monthlyReferrals}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                <div>
                  <p className="text-sm text-black/60 mb-1">Monthly earnings</p>
                  <p className="text-2xl font-bold text-black">
                    ${earnings.monthly.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-black/60 mb-1">Annual earnings</p>
                  <p className="text-2xl font-bold text-black">
                    ${earnings.annual.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-black/60 mb-1">2-year earnings</p>
                  <p className="text-2xl font-bold text-[#1240cc]">
                    ${earnings.lifetime.toLocaleString()}
                  </p>
                </div>
              </div>

              <p className="text-xs text-black/60 mt-6">
                *Based on average customer purchasing 500 mailboxes at $2.50 per mailbox
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white ">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl py-16 mx-auto">
            <h2 className="text-2xl font-bold tracking-tight text-black mb-8">
              Why partners choose Infrabox
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-base font-semibold text-black mb-2">
                  Lifetime recurring revenue
                </h3>
                <p className="text-sm text-black/70">
                  Earn 10% on every payment, forever. No caps, no limits, no expiration.
                </p>
              </div>

              <div>
                <h3 className="text-base font-semibold text-black mb-2">
                  High customer retention
                </h3>
                <p className="text-sm text-black/70">
                  95% customer retention rate means stable, predictable income for years.
                </p>
              </div>

              <div>
                <h3 className="text-base font-semibold text-black mb-2">
                  Premium product that sells itself
                </h3>
                <p className="text-sm text-black/70">
                  Industry-leading deliverability and support make conversions easy.
                </p>
              </div>

              <div>
                <h3 className="text-base font-semibold text-black mb-2">
                  Marketing resources provided
                </h3>
                <p className="text-sm text-black/70">
                  Email templates, landing pages, case studies, and dedicated support.
                </p>
              </div>

              <div>
                <h3 className="text-base font-semibold text-black mb-2">
                  Real-time tracking
                </h3>
                <p className="text-sm text-black/70">
                  Full transparency with live dashboard showing clicks, conversions, and earnings.
                </p>
              </div>

              <div>
                <h3 className="text-base font-semibold text-black mb-2">
                  90-day cookie window
                </h3>
                <p className="text-sm text-black/70">
                  Long attribution window ensures you get credit for your referrals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      {/* FAQ */}
      <section className="bg-white ">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto py-16">
            <h2 className="text-2xl font-bold tracking-tight text-black mb-8">
              Frequently asked questions
            </h2>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index}>
                  <h3 className="text-sm font-semibold text-black mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-sm text-black/70">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white pb-16">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4">
          <div className="p-12 text-center rounded-xl bg-[#1240cc]">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              Start earning today
            </h2>
            <p className="text-base text-white/80 mb-8 max-w-xl mx-auto">
              Join 500+ partners already earning lifetime commissions with Infrabox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://partner.infrabox.software/register"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackClick('affiliate_bottom_cta', { action: 'register' })}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 text-[#1240cc] rounded-full transition-all text-sm font-semibold"
              >
                Become an Affiliate
                <ArrowRight className="w-4 h-4" />
              </a>
              <a 
                href="mailto:partners@infrabox.software"
                className="inline-flex items-center justify-center px-6 py-3 border border-white text-white hover:bg-white/10 rounded-full transition-all text-sm font-semibold"
              >
                Contact Partner Team
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}