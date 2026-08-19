'use client';

import React, { useState, useEffect } from 'react';

const InboxDemo = () => {
  const [emails, setEmails] = useState([]);
  const [currentEmailIndex, setCurrentEmailIndex] = useState(0);
  const [newReplyCount, setNewReplyCount] = useState(0);

  // Pre-existing emails in inbox
  const existingEmails = [
    {
      id: 100,
      from: "Michael Brown",
      company: "Figma",
      subject: "Re: Design Partnership",
      snippet: "Thanks for the proposal! Our design team reviewed it and we're interested.",
      time: "1h ago",
      avatar: "/image-assets/demo-avatars/michael.svg",
      isNew: false
    },
    {
      id: 101,
      from: "Jennifer Liu",
      company: "Linear",
      subject: "Re: Product Integration",
      snippet: "This looks like exactly what we need for our email infrastructure.",
      time: "2h ago",
      avatar: "/image-assets/demo-avatars/jennifer.svg",
      isNew: false
    },
    {
      id: 102,
      from: "Robert Taylor",
      company: "Discord",
      subject: "Re: Email Solution Demo",
      snippet: "Great meeting yesterday! Can we schedule a follow-up for next week?",
      time: "3h ago",
      avatar: "/image-assets/demo-avatars/robert.svg",
      isNew: false
    }
  ];

  // New email replies that will come in
  const newEmailReplies = [
    {
      id: 1,
      from: "Sarah Chen",
      company: "Stripe",
      subject: "Re: Partnership Discussion",
      snippet: "Thanks for reaching out! I'd love to discuss this further. Are you available for a call next week?",
      time: "just now",
      avatar: "/image-assets/demo-avatars/sarah.svg",
      isNew: true
    },
    {
      id: 2,
      from: "Marcus Johnson",
      company: "Notion",
      subject: "Re: Integration Opportunity",
      snippet: "This sounds really interesting. Let me loop in our partnerships team. Can we schedule something?",
      time: "2m ago",
      avatar: "/image-assets/demo-avatars/marcus.svg",
      isNew: true
    },
    {
      id: 3,
      from: "Emily Rodriguez",
      company: "Airbnb",
      subject: "Re: Collaboration Proposal",
      snippet: "Perfect timing! We were just looking for a solution like this. When can we talk?",
      time: "4m ago",
      avatar: "/image-assets/demo-avatars/emily.svg",
      isNew: true
    },
    {
      id: 4,
      from: "David Kim",
      company: "OpenAI",
      subject: "Re: Your Email Solution",
      snippet: "Impressive deliverability rates! I'd like to learn more about your infrastructure.",
      time: "6m ago",
      avatar: "/image-assets/demo-avatars/david.svg",
      isNew: true
    },
    {
      id: 5,
      from: "Lisa Wang",
      company: "Shopify",
      subject: "Re: Infrabox Demo Request",
      snippet: "Just saw your email. This could solve our deliverability issues. Let's connect!",
      time: "8m ago",
      avatar: "/image-assets/demo-avatars/lisa.svg",
      isNew: true
    },
    {
      id: 6,
      from: "Alex Thompson",
      company: "GitHub",
      subject: "Re: Email Infrastructure",
      snippet: "Thanks for the detailed proposal. Our team is very interested in this solution.",
      time: "10m ago",
      avatar: "/image-assets/demo-avatars/alex.svg",
      isNew: true
    },
    {
      id: 7,
      from: "Rachel Green",
      company: "Slack",
      subject: "Re: Partnership Inquiry",
      snippet: "Love the approach! Can we set up a demo for our team next week?",
      time: "12m ago",
      avatar: "/image-assets/demo-avatars/rachel.svg",
      isNew: true
    },
    {
      id: 8,
      from: "James Wilson",
      company: "Microsoft",
      subject: "Re: Email Infrastructure Solution",
      snippet: "Your deliverability rates are impressive. Let's discuss integration with our systems.",
      time: "14m ago",
      avatar: "/image-assets/demo-avatars/james.svg",
      isNew: true
    },
    {
      id: 9,
      from: "Sophie Martinez",
      company: "Spotify",
      subject: "Re: Email Partnership",
      snippet: "We've been looking for this exact solution. Can we schedule a call this week?",
      time: "16m ago",
      avatar: "/image-assets/demo-avatars/sophie.svg",
      isNew: true
    },
    {
      id: 10,
      from: "Michael Chen",
      company: "Zoom",
      subject: "Re: Infrabox Demo",
      snippet: "Fantastic results! Our marketing team would love to learn more about this.",
      time: "18m ago",
      avatar: "/image-assets/demo-avatars/michael-2.svg",
      isNew: true
    },
    {
      id: 11,
      from: "Anna Thompson",
      company: "Canva",
      subject: "Re: Email Deliverability",
      snippet: "This could be a game changer for our outreach campaigns. Let's connect!",
      time: "20m ago",
      avatar: "/image-assets/demo-avatars/anna.svg",
      isNew: true
    },
    {
      id: 12,
      from: "Robert Garcia",
      company: "Tesla",
      subject: "Re: Partnership Opportunity",
      snippet: "Impressive metrics! We'd like to explore this for our recruitment outreach.",
      time: "22m ago",
      avatar: "/image-assets/demo-avatars/robert-2.svg",
      isNew: true
    },
    {
      id: 13,
      from: "Emma Davis",
      company: "Pinterest",
      subject: "Re: Email Marketing Solution",
      snippet: "97% inbox delivery sounds too good to be true. Can we see a demo?",
      time: "24m ago",
      avatar: "/image-assets/demo-avatars/emma.svg",
      isNew: true
    },
    {
      id: 14,
      from: "Carlos Rodriguez",
      company: "Uber",
      subject: "Re: Infrabox Integration",
      snippet: "We need this for our driver acquisition campaigns. When can we start?",
      time: "26m ago",
      avatar: "/image-assets/demo-avatars/carlos.svg",
      isNew: true
    },
    {
      id: 15,
      from: "Helen Park",
      company: "Adobe",
      subject: "Re: Email Infrastructure",
      snippet: "Your solution could help us reach more designers. Let's discuss pricing.",
      time: "28m ago",
      avatar: "/image-assets/demo-avatars/helen.svg",
      isNew: true
    }
  ];

  // Initialize with existing emails on component mount
  useEffect(() => {
    setEmails(existingEmails);
  }, []);

  // Add new emails one by one with animation and update timestamps
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentEmailIndex < newEmailReplies.length) {
        setEmails(prev => {
          // Create new email with "just now" timestamp
          const newEmail = { ...newEmailReplies[currentEmailIndex], time: "just now" };

          // Update timestamps for existing new emails
          const updatedEmails = prev.map((email, index) => {
            if (email.isNew && index === 0) {
              // Previous newest email becomes "1m ago"
              return { ...email, time: "1m ago" };
            } else if (email.isNew && index < currentEmailIndex) {
              // Increment other new emails' timestamps
              const minutes = index + 2;
              return { ...email, time: `${minutes}m ago` };
            }
            return email;
          });

          return [newEmail, ...updatedEmails];
        });
        setCurrentEmailIndex(prev => prev + 1);
        setNewReplyCount(prev => prev + 1);
      } else {
        // Reset and restart the cycle
        setEmails(existingEmails);
        setCurrentEmailIndex(0);
        setNewReplyCount(0);
      }
    }, 1800);

    return () => clearInterval(interval);
  }, [currentEmailIndex]);

  return (
    <section className="py-16 bg-gray-50 relative">
      {/* Dashed border container */}
      <div className="absolute inset-0 mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed pointer-events-none"></div>
      {/* Content container */}
      <div className="relative mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-7 gap-8 lg:gap-12 items-center">
          {/* Left side - Content */}
          <div className="lg:col-span-3">
            <div className="mb-6 lg:mb-8">
              <p className="text-xs uppercase tracking-wider text-[#1240cc] mb-4">
                RAPID RESPONSE MANAGEMENT
              </p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-black mb-4 lg:mb-6">
                Never miss a reply
              </h2>
              <p className="text-base lg:text-lg text-gray-600 mb-6 lg:mb-8">
                Superior deliverability means rapid responses from prospects. Our embedded MasterInbox integration helps you manage the influx of replies efficiently, so no opportunity is missed.
              </p>
            </div>

            {/* CTA Button */}
            <div>
              <a
                href="https://app.infrabox.software/signup?utm_source=inbox_demo_cta&utm_medium=button&utm_campaign=landing"
                className="relative inline-flex transition text-center rounded-full items-center duration-300 justify-center focus:ring-2 focus:outline-none focus:ring-offset-2 text-white bg-[#1240cc] hover:bg-[#0b34b4] focus:ring-[#1240cc] h-10 sm:h-11 px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base shadow-lg shadow-[#1240cc]/25 gap-2"
              >
                Get Started Now
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right side - Gmail-like Inbox */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden max-w-full">
              {/* Inbox header */}
              <div className="bg-gray-50 border-b border-gray-200 px-3 sm:px-4 py-3 flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
                  <span className="font-medium text-gray-900 text-sm sm:text-base">Unified inbox</span>
                  <a
                    href="https://masterinbox.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity flex-shrink-0"
                  >
                    <img
                      src="/image-assets/brand/partner-logo.png"
                      alt="MasterInbox logo"
                      width={48}
                      height={48}
                      className="h-4 sm:h-5 w-auto"
                    />
                  </a>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs sm:text-sm text-gray-500">Inbox</span>
                </div>
              </div>

              {/* Inbox content */}
              <div className="h-80 sm:h-96 overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {emails.map((email, index) => (
                    <div
                      key={email.id}
                      className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 hover:bg-gray-50 transition-all duration-200 animate-slide-down"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <img
                        src={email.avatar}
                        alt={email.from}
                        width={32}
                        height={32}
                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start sm:items-center gap-1 sm:gap-2 mb-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 min-w-0 flex-1">
                            <span className="font-medium text-gray-900 text-xs sm:text-sm truncate">{email.from}</span>
                            <span className="text-xs text-gray-500 hidden sm:inline">({email.company})</span>
                          </div>
                          <span className="text-xs text-gray-500 flex-shrink-0">{email.time}</span>
                        </div>
                        <div className="text-xs sm:text-sm font-medium text-gray-900 mb-1 truncate">{email.subject}</div>
                        <div className="text-xs sm:text-sm text-gray-600 line-clamp-2 sm:truncate">{email.snippet}</div>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" aria-hidden="true"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InboxDemo;