import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';

export default function AffiliateFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How much can I earn as an Infrabox affiliate?",
      answer: "You earn 10% lifetime commission on all customer payments. With our average customer purchasing 500+ mailboxes at around $1,250/month, you can earn $125+ per customer monthly. Many of our top affiliates earn $3,000+ per month."
    },
    {
      question: "When and how do I get paid?",
      answer: "You get paid automatically every quarter via Stripe, directly to your bank account. Payments are processed on the 1st of each quarter for the previous quarter's commissions. There's no minimum payout threshold."
    },
    {
      question: "How long do I earn commissions for?",
      answer: "You earn lifetime commissions! As long as the customer you referred remains active, you'll continue earning 10% of their monthly payments. Our average customer lifetime is 24+ months."
    },
    {
      question: "Is there a cost to join the affiliate program?",
      answer: "No! Joining our affiliate program is completely free. There are no fees, no minimum requirements, and you get instant approval."
    },
    {
      question: "What marketing materials do you provide?",
      answer: "We provide email templates, social media content, banners, landing pages, and detailed product information. You'll also get access to exclusive webinars and training materials."
    },
    {
      question: "Can I refer my own company?",
      answer: "Self-referrals are strictly prohibited and will result in account termination. The program is designed to reward partners who bring new customers to Infrabox."
    },
    {
      question: "How do I track my referrals and commissions?",
      answer: "You'll have access to a real-time dashboard through Partnero where you can track clicks, conversions, commissions, and payment history. You'll also receive email notifications for new conversions."
    },
    {
      question: "How long does the referral tracking last?",
      answer: "Our referral tracking uses a 7-day cookie lifetime. This means if someone clicks your affiliate link and signs up within 7 days, you'll receive credit for the referral."
    },
    {
      question: "Do you provide marketing materials?",
      answer: "Yes! We provide comprehensive marketing materials including email templates, social media content, banners, landing pages, and detailed product information to help you succeed."
    }
  ];

  return (
    <section className="border-gray-200 border-dashed bg-gray-50">
      <div className="mx-auto 2xl:max-w-6xl 2xl:px-12 w-full max-w-5xl border-x border-gray-200 border-dashed px-4 py-16">
        
        {/* Section Header */}
        <div className="text-center text-balance mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
              <HelpCircle className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-black">
            Frequently Asked Questions
          </h2>
          <p className="text-base max-w-2xl mt-4 text-gray-600 mx-auto">
            Everything you need to know about the Infrabox Affiliate Program
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-medium text-gray-900">{faq.question}</h3>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Still have questions? We&apos;re here to help!
          </p>
          <a 
            href="mailto:affiliates@infrabox.software"
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Contact Affiliate Support
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}