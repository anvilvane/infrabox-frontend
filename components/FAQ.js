import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { trackGoal } from '@/lib/datafast';

export default function FAQSection() {
  const [openItems, setOpenItems] = useState(new Set([0])); // First item open by default

  const toggleItem = (index, question) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
      trackGoal('faq_collapsed', {
        question_index: index,
        question_text: question
      });
    } else {
      newOpenItems.add(index);
      trackGoal('faq_expanded', {
        question_index: index,
        question_text: question
      });
    }
    setOpenItems(newOpenItems);
  };

  const faqs = [
    {
      question: "What does Infrabox provide?",
      answer: "Infrabox is your complete email infrastructure in one place. We deliver Google, Microsoft, and Azure mailboxes with zero setup fees—fully automated, fastest in the market, and integrated with 24+ sequencers. Manage all your mailboxes from a single dashboard with automated billing, InfraGuard protection, Email Analytics, Bounce Monitoring, and Inbox Placement Tests. Everything you need to land in primary, without the complexity."
    },
    {
      question: "What makes Infrabox different from other email platforms?",
      answer: "Infrabox provides official Google Workspace and Microsoft 365 accounts, achieving industry-leading 95% inbox placement rates. Unlike other providers, you get complete admin control over each domain, built-in 2FA security, app passwords for seamless integration with any email platform, and our proprietary warmup system that builds sender reputation automatically. Our infrastructure is built specifically for email outreach with advanced features like domain rotation, engagement tracking, and real-time deliverability monitoring."
    },
    {
      question: "How quickly can I get started with Infrabox?",
      answer: "Getting started takes less than 10 minutes with our completely automated setup process. Simply connect your domain, and our system instantly configures all DNS records (SPF, DKIM, DMARC), creates your mailbox account, enables 2FA security, generates app passwords for your outreach tools, and begins the automated warmup sequence. Most users see dramatic deliverability improvements within the first 24 hours, with full optimization achieved after our 14-day warmup protocol."
    },
    {
      question: "What integrations do you support?",
      answer: "We have 24+ integrations live in the platform directly, or you can build your own integration smoothly. Infrabox integrates seamlessly with major email platforms including Instantly, Smartlead, Apollo, Reply, Lemlist, Plusvibe, and many more. Our universal app password system works with any SMTP-compatible platform, ensuring 100% compatibility. We also provide a comprehensive REST API and webhook notifications for real-time events. Our technical team offers free integration support to help you connect any custom tools or workflows to your Infrabox infrastructure."
    },
    {
      question: "What kind of support do you provide?",
      answer: "We provide 24/7 expert technical support across all plans via live chat, email, and phone. Our support team consists of email deliverability specialists who can resolve complex issues quickly. Enterprise customers get a dedicated Slack channel with less than a one-hour SLA, a dedicated success manager for strategic guidance, and access to our technical implementation team for custom configurations. We also offer comprehensive onboarding, regular health checks, and proactive monitoring to prevent issues before they impact your campaigns."
    },
    {
      question: "How long does it take to get a mailbox?",
      answer: "For Google, Microsoft, and Azure mailboxes, we complete orders in 30 to 120 minutes automatically. This includes setting up the admin panel, configuring DKIM, adding profile pictures, making accounts public, and connecting with your email sending platform."
    },
    {
      question: "Can I migrate my existing campaigns to Infrabox?",
      answer: "Absolutely! Our white-glove migration service handles the complete transfer of your existing email infrastructure, campaigns, and data to Infrabox with zero downtime. The process includes: comprehensive audit of your current setup, automated data export and import, DNS record migration and optimization, campaign continuity planning, and parallel testing to ensure everything works perfectly. Most migrations complete within 24-48 hours, and our migration specialists provide step-by-step guidance throughout the process. We also offer rollback capabilities and 30 days of post-migration support to ensure a smooth transition."
    },
    {
      question: "What is Isolated Warmup?",
      answer: "Isolated Warmup is Infrabox's built-in email warmup service. It gradually increases your sending volume to build sender reputation with Google, Microsoft, and Azure mailboxes. Each mailbox warms up independently on an isolated schedule so one mailbox's activity doesn't affect another. Warmup is available as an add-on at $3 per mailbox per month from your Infrabox dashboard."
    },
    {
      question: "What is InfraGuard?",
      answer: "InfraGuard is Infrabox's always-on domain protection suite. It monitors your domains against blacklists every 6 hours, watches your DNS configuration for changes, tracks bounce rates across all mailboxes, and runs automated inbox placement tests. InfraGuard catches deliverability issues before they impact your campaigns. It's available as a separate add-on from your Infrabox dashboard, with the first month free."
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((f) => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": { "@type": "Answer", "text": f.answer }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <section id="faq" className=" border-gray-200 border-dashed" aria-label="Frequently asked questions">
      <div className="mx-auto 2xl:max-w-6xl 2xl:px-12 w-full max-w-6xl border-x border-gray-200 border-dashed px-4">
        <div className="text-center text-balance mt-8 mb-12">
          <h2 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl  font-medium tracking-tight text-black">
            Questions? We&apos;ve got answers
          </h2>
          <p className="text-sm max-w-xl mx-auto mt-4 text-gray-600">
            Quick answers to common questions.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-2">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-gray-100 rounded-xl overflow-hidden hover:bg-white duration-300 outline-transparent hover:outline hover:outline-gray-100"
              
            >
              <button
                id={`faq-button-${index}`}
                onClick={() => toggleItem(index, faq.question)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    document.getElementById(`faq-button-${Math.min(index + 1, faqs.length - 1)}`)?.focus();
                  }
                  if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    document.getElementById(`faq-button-${Math.max(index - 1, 0)}`)?.focus();
                  }
                  if (e.key === 'Home') {
                    e.preventDefault();
                    document.getElementById('faq-button-0')?.focus();
                  }
                  if (e.key === 'End') {
                    e.preventDefault();
                    document.getElementById(`faq-button-${faqs.length - 1}`)?.focus();
                  }
                }}
                className="w-full flex items-center justify-between p-2 text-left"
                aria-expanded={openItems.has(index)}
                aria-controls={`faq-answer-${index}`}
              >
                <h3 id={`faq-question-${index}`} className="text-sm font-medium text-black pr-4">
                  {faq.question}
                </h3>
                <div 
                  className="inline-flex p-2 bg-white rounded-lg group-hover:bg-gray-100 duration-300 w-fit"
                 
                >
                  {openItems.has(index) ? (
                    <Minus className="size-5 text-[#1240cc]" aria-hidden="true" />
                  ) : (
                    <Plus className="size-5 text-[#1240cc]" aria-hidden="true" />
                  )}
                </div>
              </button>
              
              <div
                id={`faq-answer-${index}`}
                role="region"
                aria-labelledby={`faq-question-${index}`}
                style={{
                  maxHeight: openItems.has(index) ? '500px' : '0px',
                  opacity: openItems.has(index) ? 1 : 0,
                  transition: 'max-height 0.3s ease, opacity 0.3s ease'
                }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4">
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>


      </div>
    </section>
    </>
  );
}