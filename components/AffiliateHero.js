import React from 'react';
import { ArrowRight, DollarSign, TrendingUp, Users, Zap } from 'lucide-react';

export default function AffiliateHero() {
  return (
    <div className="md:min-h-screen bg-white text-black relative overflow-hidden flex md:items-center items-start">
      <section className="relative w-full">
        <div className="mx-auto 2xl:max-w-6xl mt-24 md:mt-12 2xl:px-12 w-full max-w-5xl border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 lg:pt-16">
          
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-200">
              <Zap className="w-4 h-4 text-[#1240cc]" />
              <span className="text-sm font-medium text-gray-700">Lifetime Recurring Commissions</span>
            </div>
          </div>
          
          {/* Hero Content */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tighter text-black leading-[0.95] mb-6 sm:mb-8">
              Turn Your Network Into<br />
              <span className="relative mx-1 sm:mx-2 text-[#1240cc]">
                $3,000+ Monthly Income
              </span>
            </h1>
            <p className="text-sm sm:text-lg sm:max-w-3xl mx-auto text-gray-600 px-4 sm:px-0">
              Join the Infrabox Affiliate Program and earn lifetime commissions. <br className="hidden sm:block"/>
              Our average customer purchases <span className="font-semibold text-black">500+ mailboxes</span>, earning you thousands in recurring revenue.
            </p>
          </div>
          
          {/* Trust Elements */}
          <div className="hidden md:flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 text-xs sm:text-sm text-gray-500 px-4 sm:px-0">
            <div className="flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-[#1240cc]" />
              <span>10% Lifetime Commission</span>
            </div>
            <span className="hidden sm:inline text-gray-300">•</span>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-[#1240cc]" />
              <span>Top Affiliates Earn $3K+/Month</span>
            </div>
            <span className="hidden sm:inline text-gray-300">•</span>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3 text-[#1240cc]" />
              <span>500+ Active Partners</span>
            </div>
          </div>
          
          {/* CTA Button */}
          <div className="flex items-center justify-center w-full mb-8 sm:mb-12">
            <a 
              href="https://partner.infrabox.software/register"
              target="_blank"
              rel="noopener noreferrer"
              className="flex transition text-center rounded-full items-center duration-300 justify-center focus:ring-2 focus:outline-none focus:ring-offset-2 text-white bg-[#1240cc] hover:bg-[#0b34b4] focus:ring-[#1240cc] h-10 sm:h-11 px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base shadow-lg shadow-[#1240cc]/25 gap-2 w-full sm:w-auto max-w-xs sm:max-w-none"
            >
              Become an Affiliate
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </a>
          </div>

          {/* Earnings Preview */}
          <div className="relative w-full max-h-[500px] overflow-hidden rounded-xl md:rounded-3xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              
              {/* Average Customer Value */}
              <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto border border-gray-200">
                    <Users className="w-8 h-8 text-[#1240cc]" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-black mb-2">500+</h3>
                <p className="text-sm text-gray-600">Average Mailboxes<br />Per Customer</p>
              </div>
              
              {/* Monthly Earnings */}
              <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto border border-gray-200">
                    <DollarSign className="w-8 h-8 text-[#1240cc]" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-black mb-2">$125+</h3>
                <p className="text-sm text-gray-600">Average Monthly<br />Commission Per Customer</p>
              </div>
              
              {/* Lifetime Value */}
              <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto border border-gray-200">
                    <TrendingUp className="w-8 h-8 text-[#1240cc]" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-black mb-2">$3,000+</h3>
                <p className="text-sm text-gray-600">Average Customer<br />Lifetime Value</p>
              </div>
            </div>
            
            {/* Bottom text */}
            <div className="text-center mt-8">
              <p className="text-sm text-gray-600">
                Just <span className="font-semibold text-black">10 customers</span> could earn you 
                <span className="font-semibold text-[#1240cc]"> $1,250+ monthly</span> in recurring commissions
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}