import React from 'react';
import { ArrowRight, DollarSign, Rocket } from 'lucide-react';

export default function AffiliateCTA() {
  return (
    <section className="border-gray-200 border-dashed bg-gradient-to-br from-[#1240cc] to-emerald-800">
      <div className="mx-auto 2xl:max-w-6xl 2xl:px-12 w-full max-w-5xl border-x border-gray-200 border-dashed px-4 py-16">
        <div className="text-center text-white">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
              <Rocket className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Ready to Start Earning?
          </h2>
          
          {/* Subheading */}
          <p className="text-lg md:text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join 500+ successful affiliates earning substantial recurring income with Infrabox
          </p>

          {/* Benefits */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span className="text-emerald-100">10% Lifetime Commissions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span className="text-emerald-100">$125+ Per Customer Monthly</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span className="text-emerald-100">Instant Approval</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="https://partner.infrabox.software/register"
              target="_blank"
              rel="noopener noreferrer"
              className="flex transition text-center rounded-full items-center duration-300 justify-center focus:ring-2 focus:outline-none focus:ring-offset-2 text-[#1240cc] bg-white hover:bg-gray-100 focus:ring-white h-12 px-8 py-3 text-base font-medium shadow-lg gap-2 w-full sm:w-auto"
            >
              Start Earning Now
              <DollarSign className="w-5 h-5" />
            </a>
            
            <a 
              href="https://partner.infrabox.software/login"
              target="_blank"
              rel="noopener noreferrer"
              className="flex transition text-center rounded-full items-center duration-300 justify-center text-white border-2 border-white/30 hover:border-white hover:bg-white/10 h-12 px-8 py-3 text-base font-medium gap-2 w-full sm:w-auto"
            >
              Login to Dashboard
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Trust Badge */}
          <div className="mt-10 inline-flex items-center gap-3 text-sm text-emerald-100">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold">JD</div>
              <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold">MK</div>
              <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold">SP</div>
              <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold">+</div>
            </div>
            <span>Join 500+ affiliates earning with Infrabox</span>
          </div>
        </div>
      </div>
    </section>
  );
}