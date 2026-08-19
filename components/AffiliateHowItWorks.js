import React from 'react';
import { UserPlus, Link, DollarSign, BarChart3, ArrowRight } from 'lucide-react';

export default function AffiliateHowItWorks() {
  const steps = [
    {
      number: "01",
      icon: UserPlus,
      title: "Sign Up",
      description: "Join our affiliate program in seconds. No fees, no minimum requirements.",
      action: "Get instant approval"
    },
    {
      number: "02", 
      icon: Link,
      title: "Share Your Link",
      description: "Get your unique referral link and share it with your network, clients, or audience.",
      action: "Multiple sharing options"
    },
    {
      number: "03",
      icon: DollarSign,
      title: "Earn Commissions",
      description: "Earn 10% lifetime commission on every customer you refer. Average customer = $125+/month!",
      action: "Lifetime recurring revenue"
    },
    {
      number: "04",
      icon: BarChart3,
      title: "Track & Get Paid",
      description: "Monitor your earnings in real-time and receive automatic quarterly payouts via Stripe.",
      action: "Transparent tracking"
    }
  ];

  return (
    <section className="border-gray-200 border-dashed bg-gray-50">
      <div className="mx-auto 2xl:max-w-6xl 2xl:px-12 w-full max-w-5xl border-x border-gray-200 border-dashed px-4 py-16">
        
        {/* Section Header */}
        <div className="text-center text-balance mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-black">
            Start Earning in 4 Simple Steps
          </h2>
          <p className="text-base max-w-2xl mt-4 text-gray-600 mx-auto">
            From signup to your first commission in less than 24 hours
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connection Line - Hidden on mobile */}
          <div className="hidden lg:block absolute top-20 left-[12.5%] right-[12.5%] h-0.5 bg-gray-300">
            <div className="absolute inset-0 bg-gradient-to-r from-[#1240cc] to-[#1240cc] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-1000"></div>
          </div>
          
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative group">
                <div className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 h-full">
                  {/* Step Number */}
                  <div className="absolute -top-3 -right-3 w-12 h-12 bg-[#1240cc] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                    {step.number}
                  </div>
                  
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200 group-hover:bg-gray-100 transition-colors">
                    <Icon className="w-8 h-8 text-[#1240cc] transition-colors" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {step.description}
                  </p>
                  
                  {/* Action */}
                  <div className="text-xs font-medium text-[#1240cc]">
                    {step.action}
                  </div>
                </div>
                
                {/* Arrow between steps - Hidden on mobile and last item */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-20 -right-3 z-10">
                    <ArrowRight className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-12 bg-gray-50 rounded-2xl p-8 text-center border-2 border-dashed border-gray-300">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Ready to Start Your Journey?
          </h3>
          <p className="text-gray-600 mb-6">
            Join 500+ partners already earning with Infrabox
          </p>
          <a 
            href="https://partner.infrabox.software/register"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex transition text-center rounded-full items-center duration-300 justify-center focus:ring-2 focus:outline-none focus:ring-offset-2 text-white bg-[#1240cc] hover:bg-[#0b34b4] focus:ring-[#1240cc] h-11 px-8 py-3 text-base shadow-lg shadow-[#1240cc]/25 gap-2"
          >
            Become an Affiliate Now
            <ArrowRight className="w-4 h-4" />
          </a>
          
          <div className="mt-6 flex items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#1240cc] rounded-full"></div>
              <span>Instant Approval</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#1240cc] rounded-full"></div>
              <span>No Fees</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#1240cc] rounded-full"></div>
              <span>Start Today</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}