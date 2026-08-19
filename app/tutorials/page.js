'use client'

import React, { useState } from 'react';
import { 
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trackClick, trackGoal } from '@/lib/datafast';

export default function TutorialsPage() {
  const [expandedSection, setExpandedSection] = useState(0);

  const toggleSection = (index) => {
    setExpandedSection(expandedSection === index ? -1 : index);
    trackGoal('tutorial_section_toggled', {
      section_index: index
    });
  };

  const tutorialSections = [
    {
      number: "01",
      title: "Domain Setup",
      subtitle: "Purchase or Connect Domains",
      content: [
        {
          heading: "Navigate to Domains",
          text: "Log in to your Infrabox dashboard at app.infrabox.software. Click 'Domains' in the left sidebar to view your domain stats. You'll see All Domains, Assignable, and Mailboxes counts."
        },
        {
          heading: "Buy Domain Process", 
          text: "Click 'Buy Domain' to access the marketplace. Search for available domains or browse suggestions. Add domains to cart (multiple selection supported). Proceed to checkout at /domains/buy-domain/payment."
        },
        {
          heading: "Alternative - Connect Existing",
          text: "If you already own domains, use 'Connect Existing Domain' to add your own domains to Infrabox and configure DNS settings automatically."
        }
      ],
      tip: "Start with 2-3 mailboxes on 1 domain for optimal deliverability. This helps maintain a healthy sender reputation while keeping costs manageable."
    },
    {
      number: "02",
      title: "Mailbox Creation", 
      subtitle: "Google Workspace or Microsoft 365",
      content: [
        {
          heading: "Navigate to Mailbox Creation",
          text: "Go to 'Mailboxes' in the sidebar. Click 'Buy Mailbox' to start the creation wizard. Select platform: Google Workspace ($2.50 per mailbox with US IP) or Microsoft 365."
        },
        {
          heading: "Configuration Options",
          text: "Naming: Choose custom names or auto-generate random professional names. You can create multiple mailboxes at once. Domain Selection: Select from your available domains. Username Validation: Usernames are automatically validated for compliance."
        },
        {
          heading: "Authentication Setup",
          text: "SPF Record automatically configured. DKIM Signing with 1024-bit encryption. DMARC Policy set to p=none (recommended)."
        }
      ],
      tip: "Google Workspace accounts include full admin panel access per domain with 2FA authentication and app password setup."
    },
    {
      number: "03",
      title: "Connect Sequencer",
      subtitle: "17+ Platform Integrations",
      content: [
        {
          heading: "Navigate to Sequencers",
          text: "Click 'Sequencers' in the sidebar. View your sequencer stats: Total, Active, and Connected. Click 'Add New Sequencer' or 'Connect' to add a sequencer."
        },
        {
          heading: "Supported Platforms",
          text: "Instantly, SmartLead, Emelia, Pipl, Sales Handy, Truly Inbox, Warmforge, Salesforge, Warmly, Email Bison, Reply.io, Zazu, Apollo, Snov.io, Lemlist, Woodpecker, Mail Toaster and more."
        },
        {
          heading: "Connection Process",
          text: "Enter Your Credentials: Email (your sequencer platform login), Password (your sequencer platform password), API Key (optional for some platforms). System will verify your credentials automatically."
        }
      ],
      tip: "Most platforms require temporary 2FA disable during connection. Re-enable immediately after connecting."
    },
    {
      number: "04",
      title: "Export Mailboxes",
      subtitle: "Sync to Your Sequencer",
      content: [
        {
          heading: "Navigate to Exports",
          text: "Click 'Exports' in the sidebar. View export statistics: Total, Completed, and Pending. Create new export jobs or manage existing ones."
        },
        {
          heading: "Create Export Job",
          text: "Click 'Create Export' Button. Select Your Sequencer (must be in 'Active' status). Filter and Select Mailboxes by domain, tags, creation date, or search specific names. Click 'Create Export Jobs' to queue for processing."
        },
        {
          heading: "Export Status",
          text: "Pending: Export queued for processing. Processing: Syncing mailboxes (5-15 minutes). Completed: Export successful, check sequencer. Failed: Retry or contact support."
        },
        {
          heading: "Export Options",
          text: "Manual CSV Export: Download accounts as CSV for manual import. Automated Sync: Auto-sync to your connected sequencer."
        }
      ],
      tip: "Export jobs are queued and processed automatically. Bulk exports are handled efficiently in parallel."
    },
    {
      number: "05",
      title: "Monitor & Scale",
      subtitle: "Performance Tracking",
      content: [
        {
          heading: "Monitor Export Status",
          text: "Track your export jobs with real-time status updates. View details like job names, status (Active/Scheduled), mailbox counts, and last run times."
        },
        {
          heading: "Best Practices",
          text: "Warm Before Sending: Allow 2-4 weeks of warmup before cold outreach. Monitor Performance: Check dashboard daily for inbox placement and domain health. Rotate Domains: Use 2-3 domains per 10 mailboxes. Scale Gradually: Start with 5-10 mailboxes and increase as you monitor results."
        }
      ],
      tip: "New mailboxes need proper warmup. Use our automated system for gradual reputation building."
    }
  ];

  const troubleshooting = [
    {
      issue: "Export not starting",
      solution: "Ensure your sequencer shows 'Connected' status and you've selected mailboxes to export."
    },
    {
      issue: "Domain stuck in 'Pending'",
      solution: "DNS can take up to 48 hours. Check status in your Domains dashboard."
    },
    {
      issue: "Sequencer connection failed",
      solution: "Double-check your login credentials and try reconnecting."
    },
    {
      issue: "Low inbox placement",
      solution: "Complete warmup (2-4 weeks) before starting campaigns."
    }
  ];

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="bg-white ">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="text-center pt-24 pb-12 max-w-4xl mx-auto">
            <p className="text-xs uppercase tracking-wider text-[#1240cc] mb-6">COMPLETE SETUP GUIDE</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-black leading-[0.95] mb-6">
              Master your email
              <br />
              <span className="text-[#1240cc]">infrastructure</span> in 5 steps
            </h1>
            <p className="text-base md:text-lg text-black/70 leading-relaxed max-w-2xl mx-auto">
              From domain setup to campaign launch - everything you need to build 
              a professional email outreach system that delivers results.
            </p>
          </div>
        </div>
      </section>

      {/* Prerequisites */}
      <section className="bg-white pb-12">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs uppercase tracking-wider text-[#1240cc]/70 mb-3">BEFORE YOU BEGIN</p>
            <p className="text-sm text-black/80">
              You&apos;ll need: <span className="text-[#1240cc] font-medium">Infrabox account</span> at <a href="https://app.infrabox.software" target='_blank'>app.infrabox.software</a> · Valid payment method · 
              Sequencer account (SmartLead, Instantly, or similar)
            </p>
          </div>
        </div>
      </section>

      {/* Main Tutorial Content */}
      <section className="bg-white ">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="py-12">
            <div className="space-y-4">
              {tutorialSections.map((section, index) => (
                <div key={index} className="bg-gray-50 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleSection(index)}
                    className="w-full text-left p-6 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex gap-6">
                        <span className="text-2xl font-bold text-[#1240cc]">
                          {section.number}
                        </span>
                        <div>
                          <h2 className="text-base font-semibold text-black">
                            {section.title}
                          </h2>
                          <p className="text-sm text-black/60 mt-0.5">
                            {section.subtitle}
                          </p>
                        </div>
                      </div>
                      <ChevronDown 
                        className={`w-5 h-5 text-black/40 transition-transform flex-shrink-0 mt-1 ${
                          expandedSection === index ? 'rotate-180' : ''
                        }`} 
                      />
                    </div>
                  </button>

                  <div 
                    style={{
                      maxHeight: expandedSection === index ? '1000px' : '0px',
                      opacity: expandedSection === index ? 1 : 0,
                      transition: 'max-height 0.4s ease-in-out, opacity 0.3s ease-in-out',
                      overflow: 'hidden'
                    }}
                  >
                    <div className="px-6 pb-6">
                      <div className="pt-6 space-y-6">
                        {section.content.map((item, contentIndex) => (
                          <div key={contentIndex}>
                            <h3 className="text-sm font-semibold text-black mb-2">
                              {item.heading}
                            </h3>
                            <p className="text-sm text-black/70 leading-relaxed">
                              {item.text}
                            </p>
                          </div>
                        ))}
                        
                        {section.tip && (
                          <div className="mt-6 p-4 bg-white rounded-lg">
                            <p className="text-xs font-semibold text-black mb-1">PRO TIP</p>
                            <p className="text-xs text-black/70 leading-relaxed">
                              {section.tip}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="bg-white ">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl py-12 font-bold tracking-tight text-black mb-8">
              Quick Troubleshooting
            </h2>
            
            <div className="space-y-4">
              {troubleshooting.map((item, index) => (
                <div key={index}>
                    <h3 className="text-sm font-semibold text-black mb-1">
                      {item.issue}
                    </h3>
                    <p className="text-sm text-black/70">
                      {item.solution}
                    </p>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-8">
              <p className="text-sm text-black/60 mb-4">Need More Help?</p>
              <div className="flex gap-6 text-sm">
                <a 
                  href="https://docs.infrabox.software" 
                  className="text-[#1240cc] font-medium hover:underline"
                >
                  API Documentation
                </a>
                <span className="text-black/20">·</span>
                <a 
                  href="/#book-call" 
                  className="text-[#1240cc] font-medium hover:underline"
                >
                  Expert Support
                </a>
                <span className="text-black/20">·</span>
                <a 
                  href="/resources" 
                  className="text-[#1240cc] font-medium hover:underline"
                >
                  Best Practices
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 py-16">
          <div className="p-12 text-center rounded-xl bg-[#1240cc]">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              Ready to Scale Your Outreach?
            </h2>
            <p className="text-base text-white/80 mb-8 max-w-xl mx-auto">
              Join 5,000+ businesses using Infrabox to power their email campaigns
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://app.infrabox.software/signup" 
                onClick={() => trackClick('tutorial_cta', { location: 'bottom' })}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 text-[#1240cc] rounded-full transition-all text-sm font-semibold"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </a>
              <a 
                href="/#book-call" 
                className="inline-flex items-center justify-center px-6 py-3 border border-white text-white hover:bg-white/10 rounded-full transition-all text-sm font-semibold"
              >
                Book a Demo
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}