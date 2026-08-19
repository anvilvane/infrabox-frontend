'use client'

import React, { useState } from 'react';
import { Copy, Check, Mail, RefreshCw, ArrowRight } from 'lucide-react';
import Header from "@/components/Header";
import Link from "next/link";
import Footer from "@/components/Footer";
import { trackClick } from '@/lib/datafast';

export default function EmailPermutatorPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [domain, setDomain] = useState('');
  const [permutations, setPermutations] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [openItems, setOpenItems] = useState(new Set([0]));

  const generatePermutations = () => {
    if (!firstName || !lastName || !domain) return;

    const fn = firstName.toLowerCase().trim();
    const ln = lastName.toLowerCase().trim();
    const d = domain.toLowerCase().trim();
    const f = fn.charAt(0);
    const l = ln.charAt(0);

    const list = [
      `${fn}@${d}`,
      `${ln}@${d}`,
      `${fn}${ln}@${d}`,
      `${fn}.${ln}@${d}`,
      `${f}${ln}@${d}`,
      `${f}.${ln}@${d}`,
      `${fn}${l}@${d}`,
      `${fn}.${l}@${d}`,
      `${f}${l}@${d}`,
      `${f}.${l}@${d}`,
      `${ln}${fn}@${d}`,
      `${ln}.${fn}@${d}`,
      `${ln}${f}@${d}`,
      `${ln}.${f}@${d}`,
      `${l}${fn}@${d}`,
      `${l}.${fn}@${d}`,
      `${fn}-${ln}@${d}`,
      `${f}-${ln}@${d}`,
      `${fn}-${l}@${d}`,
      `${f}-${l}@${d}`,
      `${ln}-${fn}@${d}`,
      `${ln}-${f}@${d}`,
      `${l}-${fn}@${d}`,
      `${fn}_${ln}@${d}`,
      `${f}_${ln}@${d}`,
      `${fn}_${l}@${d}`,
      `${f}_${l}@${d}`,
      `${ln}_${fn}@${d}`,
      `${ln}_${f}@${d}`,
      `${l}_${fn}@${d}`,
    ];

    setPermutations(list);
    trackClick('tool_use', { tool: 'Email Permutator' });
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    trackClick('copy_email', { tool: 'Email Permutator' });
  };

  const copyAll = () => {
    navigator.clipboard.writeText(permutations.join('\n'));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
    trackClick('copy_all_emails', { tool: 'Email Permutator' });
  };

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const faqs = [
    {
      question: "What is an email permutator?",
      answer: "An email permutator is a tool that generates multiple potential email address variations based on a person's first name, last name, and company domain. It helps sales professionals guess the correct email format for a prospect."
    },
    {
      question: "Is this email permutator free?",
      answer: "Yes, the Infrabox Email Permutator is 100% free to use with no limits on the number of searches you can perform."
    },
    {
      question: "How do I verify the generated emails?",
      answer: "After generating the list of potential emails, we recommend using a tool like the Infrabox Deliverability Score or an external email verifier to check which address is valid before sending."
    },
    {
      question: "Why do I need to find the right email format?",
      answer: "Sending emails to invalid addresses increases your bounce rate, which harms your sender reputation and can cause your emails to land in spam. Finding the correct format ensures your message reaches the inbox."
    }
  ];

  return (
    <>
      <Header />

      {/* Breadcrumb */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 pt-8 text-sm text-gray-400">
            <Link href="/" className="hover:text-[#1240cc] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/resources" className="hover:text-[#1240cc] transition-colors">Resources</Link>
            <span>/</span>
            <Link href="/resources/tools" className="hover:text-[#1240cc] transition-colors">Tools</Link>
            <span>/</span>
            <span className="text-gray-600">Email Permutator</span>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="text-center pt-12 pb-16 max-w-3xl mx-auto">
            <p className="font-mono text-xs uppercase tracking-widest text-[#1240cc] mb-5">Free tool</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-black mb-5">Email permutator</h1>
            <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
              Generate the most common email address formats for any prospect using their name and domain.
              Find the right email address in seconds.
            </p>
          </div>
        </div>
      </section>

      {/* Main Tool Section */}
      <section className="bg-white min-h-[600px]">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto pb-16">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Input Section */}
              <div className="md:col-span-1 space-y-6">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && generatePermutations()}
                        placeholder="John"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1240cc] focus:border-transparent outline-none transition-all hover:border-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && generatePermutations()}
                        placeholder="Doe"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1240cc] focus:border-transparent outline-none transition-all hover:border-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Domain
                      </label>
                      <input
                        type="text"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && generatePermutations()}
                        placeholder="company.com"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1240cc] focus:border-transparent outline-none transition-all hover:border-gray-400"
                      />
                    </div>

                    <button
                      onClick={generatePermutations}
                      disabled={!firstName || !lastName || !domain}
                      className="w-full flex items-center justify-center gap-2 bg-[#1240cc] text-white py-2.5 rounded-lg font-medium hover:bg-[#0b34b4] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Generate Emails
                    </button>
                  </div>
                </div>
              </div>

              {/* Results Section */}
              <div className="md:col-span-2">
                {permutations.length > 0 ? (
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                      <span className="font-medium text-gray-700">
                        {permutations.length} Permutations Generated
                      </span>
                      <button
                        onClick={copyAll}
                        className="flex items-center gap-2 text-sm text-[#1240cc] hover:text-[#0b34b4] font-medium transition-colors"
                      >
                        {copiedAll ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copied All
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy All
                          </>
                        )}
                      </button>
                    </div>

                    <div className="max-h-[500px] overflow-y-auto p-2">
                      <div className="grid sm:grid-cols-2 gap-2">
                        {permutations.map((email, index) => (
                          <button
                            key={index}
                            onClick={() => copyToClipboard(email, index)}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 group transition-all text-left"
                          >
                            <span className="text-gray-600 font-mono text-sm truncate">
                              {email}
                            </span>
                            <span className="text-gray-400 group-hover:text-[#1240cc]">
                              {copiedIndex === index ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <Copy className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                              )}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 bg-gray-50/50">
                    <Mail className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-lg font-medium text-gray-900 mb-1">
                      Ready to generate
                    </p>
                    <p className="text-sm">
                      Enter a name and domain to see email combinations
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Educational Content */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="py-12 max-w-5xl mx-auto border-t border-gray-200 border-dashed pt-16">
            <h2 className="text-2xl font-bold tracking-tight text-black mb-6">
              How to find anyone's email address
            </h2>

            <p className="text-base text-gray-500 leading-relaxed mb-8">
              Most companies follow specific patterns for their employee email addresses (like first.last@company.com).
              This tool automatically generates the most common permutations so you can find the right one.
            </p>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-lg font-semibold text-black mb-4">
                  Why use an email permutator?
                </h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Manual Prospecting
                    </p>
                    <p className="text-sm text-gray-500">
                      Perfect for when you have a prospect's name and company but no email.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Higher Success Rate
                    </p>
                    <p className="text-sm text-gray-500">
                      One of these combinations is likely the correct inbox.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Verification Ready
                    </p>
                    <p className="text-sm text-gray-500">
                      Take these emails and run them through a verifier to confirm validity.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-black mb-4">
                  Pro tips for prospecting
                </h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Check the domain
                    </p>
                    <p className="text-sm text-gray-500">
                      Make sure you have the correct company website (e.g., getcompany.com vs company.com).
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Verify before sending
                    </p>
                    <p className="text-sm text-gray-500">
                      Always verify the generated emails to protect your domain reputation.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Look for patterns
                    </p>
                    <p className="text-sm text-gray-500">
                      If you find one email for a company, others usually follow the same format.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section (Accordion) */}
      <section className="bg-white border-t border-gray-200">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="py-16 max-w-3xl mx-auto">
            <p className="font-mono text-xs uppercase tracking-widest text-[#1240cc] mb-3 text-center">FAQ</p>
            <h2 className="text-2xl font-bold tracking-tight text-black mb-10 text-center">Frequently asked questions</h2>
            <div className="divide-y divide-gray-200 border-y border-gray-200">
              {faqs.map((faq, index) => (
                <div key={index}>
                  <button onClick={() => toggleItem(index)} className="w-full flex items-center justify-between py-5 text-left focus:outline-none">
                    <h3 className="text-sm font-medium text-black pr-4">{faq.question}</h3>
                    <div className="flex-shrink-0">
                      {openItems.has(index) ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1240cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                      )}
                    </div>
                  </button>
                  <div style={{ maxHeight: openItems.has(index) ? '300px' : '0px', opacity: openItems.has(index) ? 1 : 0, transition: 'max-height 0.3s ease, opacity 0.3s ease' }} className="overflow-hidden">
                    <p className="text-sm text-gray-500 leading-relaxed pb-5">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="bg-white border-gray-200">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="py-12 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold tracking-tight text-black mb-8">
              Related tools
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <Link
                href="/resources/tools/mailbox-calculator"
                onClick={() => trackClick('tool_navigation', { from: 'email-permutator', to: 'mailbox-calculator' })}
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                  Mailbox Calculator
                </h3>
                <p className="text-sm text-gray-500">
                  Calculate how many mailboxes you need for your volume.
                </p>
              </Link>

              <Link
                href="/resources/tools/deliverability-score"
                onClick={() => trackClick('tool_navigation', { from: 'email-permutator', to: 'deliverability-score' })}
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                  Deliverability Score
                </h3>
                <p className="text-sm text-gray-500">
                  Check your domain's health and inbox placement.
                </p>
              </Link>

              <Link
                href="/resources/tools/spam-checker"
                onClick={() => trackClick('tool_navigation', { from: 'email-permutator', to: 'spam-checker' })}
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                  Spam Words Checker
                </h3>
                <p className="text-sm text-gray-500">
                  Scan your email content for spam triggers.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl pb-4 w-full border-x border-gray-200 border-dashed px-4">
          <div className="py-20 text-center max-w-xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-black mb-4">
              Scale your email outreach
            </h2>
            <p className="text-base text-gray-500 mb-8 max-w-xl mx-auto">
              Infrabox provides complete email infrastructure with guaranteed deliverability and unlimited scaling.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="https://app.infrabox.software/signup"
                onClick={() => trackClick('tool_cta', { tool: 'email-permutator', action: 'signup' })}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 text-[#1240cc] rounded-full transition-all text-sm font-semibold"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
