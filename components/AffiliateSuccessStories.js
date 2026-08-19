import React from 'react';
import { Star, Quote, TrendingUp } from 'lucide-react';

export default function AffiliateSuccessStories() {
  // TODO: Replace with real customer testimonials when available
  const stories = [
    {
      name: "S.C.",
      role: "Marketing Agency Owner",
      avatar: "SC",
      earnings: "$850/month",
      customers: 6,
      testimonial: "I recommended Infrabox to my agency clients who needed email outreach. Now I earn more from affiliate commissions than some of my retainer clients!",
      rating: 5
    },
    {
      name: "M.R.",
      role: "Sales Professional",
      avatar: "MR",
      earnings: "$1,520/month",
      customers: 12,
      testimonial: "Every sales team I consult with needs email infrastructure. Infrabox's quality makes it an easy recommendation, and the commissions are life-changing.",
      rating: 5
    },
    {
      name: "J.P.",
      role: "Business Coach",
      avatar: "JP",
      earnings: "$630/month",
      customers: 5,
      testimonial: "I love that I can help my clients grow their business while building a passive income stream. Infrabox's affiliate program is incredibly generous.",
      rating: 5
    }
  ];

  return (
    <section className="border-gray-200 border-dashed">
      <div className="mx-auto 2xl:max-w-6xl 2xl:px-12 w-full max-w-5xl border-x border-gray-200 border-dashed px-4 py-16">
        
        {/* Section Header */}
        <div className="text-center text-balance mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-black">
            Real Partners, Real Results
          </h2>
          <p className="text-base max-w-2xl mt-4 text-gray-600 mx-auto">
            See how our affiliates are building substantial recurring income streams
          </p>
        </div>

        {/* Success Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stories.map((story, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-emerald-700">{story.avatar}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{story.name}</h3>
                    <p className="text-sm text-gray-600">{story.role}</p>
                  </div>
                </div>
                <Quote className="w-6 h-6 text-gray-300" />
              </div>

              {/* Testimonial */}
              <p className="text-sm text-gray-700 mb-4 italic">
                {story.testimonial}
              </p>

              {/* Stats */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-2xl font-bold text-emerald-600">{story.earnings}</p>
                    <p className="text-xs text-gray-600">Monthly Earnings</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">{story.customers} Clients</p>
                    <p className="text-xs text-gray-600">Referred</p>
                  </div>
                </div>
                
                {/* Rating */}
                <div className="flex items-center gap-1 mt-3">
                  {[...Array(story.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-12 bg-gray-50 rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-[#1240cc]">50+</p>
              <p className="text-sm text-gray-600">Active Affiliates</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#1240cc]">$100K+</p>
              <p className="text-sm text-gray-600">Paid in Commissions</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#1240cc]">98%</p>
              <p className="text-sm text-gray-600">Partner Satisfaction</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#1240cc]">12+ Months</p>
              <p className="text-sm text-gray-600">Avg Customer Lifetime</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}