import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  BarChart3, 
  HeartHandshake, 
  Zap,
  CreditCard,
  Users,
  Shield
} from 'lucide-react';

export default function AffiliateBenefits() {
  const benefits = [
    {
      icon: DollarSign,
      title: "10% Lifetime Commissions",
      description: "Earn 10% commission on all customer payments, forever. No caps, no limits.",
      highlight: "Lifetime recurring revenue"
    },
    {
      icon: TrendingUp,
      title: "500+ Mailboxes Average",
      description: "Our average customer purchases 500+ mailboxes, meaning higher commissions for you.",
      highlight: "$125+ per customer monthly"
    },
    {
      icon: CreditCard,
      title: "Quarterly Stripe Payouts",
      description: "Get paid automatically every quarter directly to your bank account via Stripe.",
      highlight: "Reliable quarterly income"
    },
    {
      icon: BarChart3,
      title: "Real-time Dashboard",
      description: "Track clicks, conversions, and commissions in real-time with our partner dashboard.",
      highlight: "Full transparency"
    },
    {
      icon: HeartHandshake,
      title: "Dedicated Support",
      description: "Get access to a dedicated affiliate manager and priority support for all your needs.",
      highlight: "We're here to help you succeed"
    },
    {
      icon: Shield,
      title: "Trusted Partner Program",
      description: "Join a reputable affiliate program with transparent tracking and reliable payouts.",
      highlight: "Established & trusted"
    }
  ];


  return (
    <section className="border-gray-200 border-dashed">
      <div className="mx-auto 2xl:max-w-6xl 2xl:px-12 w-full max-w-5xl border-x border-gray-200 border-dashed px-4 py-16">
        
        {/* Section Header */}
        <div className="text-center text-balance mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Zap className="w-8 h-8 text-[#1240cc]" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-black">
            Why Partners Love Infrabox
          </h2>
          <p className="text-base max-w-2xl mt-4 text-gray-600 mx-auto">
            Join hundreds of successful affiliates earning substantial recurring income
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div 
                key={index}
                className="group relative bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gray-50 text-[#1240cc] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-gray-200">
                  <Icon className="w-7 h-7" />
                </div>
                
                {/* Content */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {benefit.description}
                </p>
                
                {/* Highlight */}
                <div className="text-xs font-medium text-[#1240cc] bg-gray-50 px-3 py-1 rounded-full inline-block border border-gray-200">
                  {benefit.highlight}
                </div>
              </div>
            );
          })}
        </div>

        {/* Visual Success Story */}
        <div className="bg-[#1240cc] rounded-2xl p-8 md:p-12 text-white border-2 border-dashed border-gray-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Success Story: Digital Agency Owner
              </h3>
              <p className="text-gray-100 mb-6">
                &ldquo;I referred 8 clients to Infrabox in my first 3 months. With their average purchase of 600+ mailboxes each, 
                I&apos;m now earning over <span className="font-bold text-white">$1,200 monthly</span> in passive income. 
                The best part? It&apos;s completely hands-off recurring revenue!&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-2xl font-bold">$14,400+</div>
                  <div className="text-sm text-gray-300">Annual Recurring Revenue</div>
                </div>
                <div className="w-px h-12 bg-gray-400"></div>
                <div>
                  <div className="text-2xl font-bold">8 Clients</div>
                  <div className="text-sm text-gray-300">In 3 Months</div>
                </div>
              </div>
            </div>
            
            {/* Visual Chart */}
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
              <div className="text-center mb-4">
                <div className="text-sm text-gray-200 mb-2">Monthly Earnings Growth</div>
                <div className="flex items-end justify-center gap-2 h-32">
                  <div className="w-8 bg-gray-400 rounded-t" style={{height: '30%'}}></div>
                  <div className="w-8 bg-gray-400 rounded-t" style={{height: '45%'}}></div>
                  <div className="w-8 bg-gray-400 rounded-t" style={{height: '60%'}}></div>
                  <div className="w-8 bg-gray-400 rounded-t" style={{height: '75%'}}></div>
                  <div className="w-8 bg-gray-400 rounded-t" style={{height: '90%'}}></div>
                  <div className="w-8 bg-white rounded-t" style={{height: '100%'}}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-300 mt-2">
                  <span>Month 1</span>
                  <span>Month 6</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Ready to build your own success story?
          </p>
          <a 
            href="https://partner.infrabox.software/register"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex transition text-center rounded-full items-center duration-300 justify-center focus:ring-2 focus:outline-none focus:ring-offset-2 text-white bg-[#1240cc] hover:bg-[#0b34b4] focus:ring-[#1240cc] h-11 px-8 py-3 text-base shadow-lg shadow-[#1240cc]/25 gap-2"
          >
            Join Our Affiliate Program
            <Users className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}