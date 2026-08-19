'use client'

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  Mail,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Shield,
  Route,
  Clock,
  RefreshCw,
  Copy,
  FileText,
  Lock,
  AlertCircle,
  Server,
  Check,
  X,
  Plus,
  Minus
} from "lucide-react";
import { trackClick } from '@/lib/datafast';

export default function EmailHeaderAnalyzerPage() {
  const [headers, setHeaders] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [openItems, setOpenItems] = useState(new Set([0]));

  const analyzeHeaders = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/tools/email-header-analyzer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ headers }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze headers');
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error analyzing headers:', error);
      setResults({
        error: true,
        message: 'Unable to analyze email headers. Please check the format and try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setHeaders("");
    setResults(null);
  };

  const loadExample = () => {
    setHeaders(`Delivered-To: user@example.com
Received: by 2002:a05:6512:3b29:b0:4f5:5e19:70b8 with SMTP id f41csp2838501lfv;
        Mon, 15 Jan 2024 06:45:32 -0800 (PST)
Authentication-Results: mx.google.com;
       spf=pass (google.com: domain of sender@example.org designates 192.0.2.1 as permitted sender) smtp.mailfrom=sender@example.org;
       dkim=pass header.i=@example.org header.s=selector1 header.b=AbCdEfGh;
       dmarc=pass (p=QUARANTINE sp=NONE dis=NONE) header.from=example.org
Return-Path: <sender@example.org>
From: Sender Name <sender@example.org>
To: Recipient <user@example.com>
Subject: Test Email
Date: Mon, 15 Jan 2024 14:45:00 +0000
Message-ID: <1234567890@example.org>`);
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
      question: "What information is in email headers?",
      answer: "Email headers contain technical details about an email's journey, including sender and recipient information, timestamps, authentication results (SPF, DKIM, DMARC), and the path taken through various mail servers."
    },
    {
      question: "How do I find email headers?",
      answer: "The process varies by email client. In Gmail, open the email, click the three dots, and select 'Show original'. In Outlook, open the email, go to File > Properties. In Apple Mail, press Command+Shift+H."
    },
    {
      question: "Why should I analyze email headers?",
      answer: "Analyzing headers helps troubleshoot delivery delays, verify if an email is legitimate or spoofed, identify the source of spam, and check if your own emails are passing authentication checks."
    },
    {
      question: "Is this tool secure?",
      answer: "Yes, we process the headers locally or securely on our servers to provide the analysis. We do not store the content of your email headers after the analysis is complete."
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
            <span className="text-gray-600">Email Header Analyzer</span>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="text-center pt-12 pb-16 max-w-3xl mx-auto">
            <p className="font-mono text-xs uppercase tracking-widest text-[#1240cc] mb-5">Free tool</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-black mb-5">Email header analyzer</h1>
            <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
              Analyze email headers for authentication and routing information. Detect security
              issues, trace email paths, and verify sender authenticity.
            </p>
          </div>
        </div>
      </section>

      {/* Main Tool Section */}
      <section className="bg-white min-h-[600px]">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8 pb-16">
          {!results ? (
            // Input Form - Modern Clean Design
            <div className="max-w-xl mx-auto">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="headers" className="block text-sm font-medium text-black">
                      Email headers
                    </label>
                    <button
                      onClick={loadExample}
                      className="text-sm text-[#1240cc] hover:text-[#0b34b4] transition-colors"
                    >
                      Load Example
                    </button>
                  </div>
                  <div className="relative">
                    <textarea
                      id="headers"
                      value={headers}
                      onChange={(e) => setHeaders(e.target.value)}
                      placeholder="Paste your email headers here..."
                      className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1240cc] focus:border-transparent transition-all placeholder:text-gray-400 font-mono text-sm resize-vertical"
                      rows={10}
                      disabled={loading}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    In Gmail: Open email → Three dots menu → Show original → Copy headers
                  </p>
                </div>

                <button
                  onClick={analyzeHeaders}
                  disabled={!headers || loading}
                  className="w-full px-8 py-4 bg-[#1240cc] text-white font-semibold rounded-full hover:bg-[#0b34b4] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing headers...
                    </span>
                  ) : (
                    'Analyze Headers'
                  )}
                </button>
              </div>
            </div>
          ) : (
            // Results Display - Modern Clean Layout
            <div className="max-w-5xl mx-auto">
              {/* Results Header */}
              <div className="border-b border-gray-200 pb-6 mb-8">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#1240cc] mb-2">
                      ANALYSIS RESULTS
                    </p>
                    <h2 className="text-3xl font-bold text-black">
                      Header Analysis
                    </h2>
                  </div>
                  <button
                    onClick={reset}
                    className="px-5 py-2.5 text-sm font-medium text-black border border-gray-300 rounded-full hover:border-[#1240cc] hover:text-[#1240cc] transition-all"
                  >
                    New Analysis
                  </button>
                </div>
              </div>

              {results.error ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-red-900">Analysis Failed</h3>
                      <p className="text-red-700 mt-1">{results.message}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Authentication Results */}
                  {results.authentication && (
                    <div className="mb-12">
                      <h3 className="text-xl font-bold text-black mb-6">
                        Authentication Results
                      </h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        {/* SPF */}
                        <div className="p-4 border border-gray-200 rounded-xl">
                          <div className="flex items-center gap-3 mb-3">
                            {results.authentication.spf?.pass ? (
                              <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                                <Check className="w-5 h-5 text-green-600" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center">
                                <X className="w-5 h-5 text-red-600" />
                              </div>
                            )}
                            <div>
                              <p className="text-base font-semibold text-black">SPF</p>
                              <p className="text-xs text-gray-500">
                                Sender Policy Framework
                              </p>
                            </div>
                          </div>
                          <p className={`text-sm font-semibold ${results.authentication.spf?.pass ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {results.authentication.spf?.result || 'Not found'}
                          </p>
                          {results.authentication.spf?.details && (
                            <p className="text-xs text-gray-500 mt-2">
                              {results.authentication.spf.details.details}
                            </p>
                          )}
                        </div>

                        {/* DKIM */}
                        <div className="p-4 border border-gray-200 rounded-xl">
                          <div className="flex items-center gap-3 mb-3">
                            {results.authentication.dkim?.pass ? (
                              <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                                <Check className="w-5 h-5 text-green-600" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center">
                                <X className="w-5 h-5 text-red-600" />
                              </div>
                            )}
                            <div>
                              <p className="text-base font-semibold text-black">DKIM</p>
                              <p className="text-xs text-gray-500">
                                DomainKeys Identified Mail
                              </p>
                            </div>
                          </div>
                          <p className={`text-sm font-semibold ${results.authentication.dkim?.pass ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {results.authentication.dkim?.result || 'Not found'}
                          </p>
                          {results.authentication.dkim?.details && (
                            <p className="text-xs text-gray-500 mt-2">
                              {results.authentication.dkim.details.details}
                            </p>
                          )}
                        </div>

                        {/* DMARC */}
                        <div className="p-4 border border-gray-200 rounded-xl">
                          <div className="flex items-center gap-3 mb-3">
                            {results.authentication.dmarc?.pass ? (
                              <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                                <Check className="w-5 h-5 text-green-600" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center">
                                <X className="w-5 h-5 text-red-600" />
                              </div>
                            )}
                            <div>
                              <p className="text-base font-semibold text-black">DMARC</p>
                              <p className="text-xs text-gray-500">
                                Message Authentication
                              </p>
                            </div>
                          </div>
                          <p className={`text-sm font-semibold ${results.authentication.dmarc?.pass ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {results.authentication.dmarc?.result || 'Not found'}
                          </p>
                          {results.authentication.dmarc?.details && (
                            <p className="text-xs text-gray-500 mt-2">
                              {results.authentication.dmarc.details.details}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Routing Information */}
                  {results.routing?.hops && results.routing.hops.length > 0 && (
                    <div className="mb-12">
                      <h3 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
                        <Route className="w-5 h-5" />
                        Email Routing Path
                        {results.routing.totalTime && (
                          <span className="text-sm font-normal text-gray-500">
                            ({results.routing.totalTime})
                          </span>
                        )}
                      </h3>
                      <div className="space-y-4">
                        {results.routing.hops.map((hop, index) => (
                          <div key={index} className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-[#1240cc] text-white rounded-full flex items-center justify-center text-sm font-bold">
                              {hop.number}
                            </div>
                            <div className="flex-1 p-4 bg-white border border-gray-200 rounded-xl">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold text-black">
                                  {hop.server}
                                </span>
                                <div className="flex items-center gap-2">
                                  {hop.tls && (
                                    <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                      <Lock className="w-3 h-3" />
                                      TLS
                                    </span>
                                  )}
                                  <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                                    {hop.protocol}
                                  </span>
                                </div>
                              </div>
                              {hop.timestamp && (
                                <p className="text-xs text-gray-500">
                                  {hop.timestamp}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Metadata */}
                  {results.metadata && (
                    <div className="mb-12">
                      <h3 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
                        <Mail className="w-5 h-5" />
                        Email Metadata
                      </h3>
                      <div className="p-6 bg-white border border-gray-200 rounded-xl">
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {results.metadata.from && (
                            <div>
                              <dt className="text-sm font-medium text-black mb-1">From:</dt>
                              <dd className="text-sm text-gray-500">{results.metadata.from}</dd>
                            </div>
                          )}
                          {results.metadata.to && (
                            <div>
                              <dt className="text-sm font-medium text-black mb-1">To:</dt>
                              <dd className="text-sm text-gray-500">{results.metadata.to}</dd>
                            </div>
                          )}
                          {results.metadata.subject && (
                            <div className="md:col-span-2">
                              <dt className="text-sm font-medium text-black mb-1">Subject:</dt>
                              <dd className="text-sm text-gray-500">{results.metadata.subject}</dd>
                            </div>
                          )}
                          {results.metadata.date && (
                            <div>
                              <dt className="text-sm font-medium text-black mb-1">Date:</dt>
                              <dd className="text-sm text-gray-500">{results.metadata.date}</dd>
                            </div>
                          )}
                          {results.metadata.messageId && (
                            <div className="md:col-span-2">
                              <dt className="text-sm font-medium text-black mb-1">Message-ID:</dt>
                              <dd className="text-sm text-gray-500 font-mono text-xs break-all">
                                {results.metadata.messageId}
                              </dd>
                            </div>
                          )}
                        </dl>
                      </div>
                    </div>
                  )}

                  {/* Security Warnings */}
                  {results.security?.warnings && results.security.warnings.length > 0 && (
                    <div className="mb-12">
                      <h3 className="text-xl font-bold text-black mb-6">
                        Security Warnings
                      </h3>
                      <div className="space-y-4">
                        {results.security.warnings.map((warning, index) => (
                          <div key={index} className="p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
                            <div className="flex items-start gap-3">
                              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm text-yellow-800 leading-relaxed">
                                  {warning}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {results.recommendations && results.recommendations.length > 0 && (
                    <div className="mb-12">
                      <h3 className="text-xl font-bold text-black mb-6">
                        Recommendations
                      </h3>
                      <div className="space-y-4">
                        {results.recommendations.map((rec, index) => (
                          <div key={index} className="p-6 bg-white border border-gray-200 rounded-xl hover:border-[#1240cc] transition-colors">
                            <div className="flex items-start gap-3">
                              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="font-medium text-black mb-1">{rec.message}</p>
                                <p className="text-sm text-gray-500">{rec.action}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Related Tools */}
      <section className="bg-white border-t border-gray-200">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="py-16 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold tracking-tight text-black mb-8">
              Related tools
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <Link
                href="/resources/tools/deliverability-score"
                onClick={() => trackClick('tool_navigation', { from: 'email-header-analyzer', to: 'deliverability-score' })}
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                  Deliverability Score
                </h3>
                <p className="text-sm text-gray-500">
                  Get a comprehensive deliverability score for your domain.
                </p>
              </Link>

              <Link
                href="/resources/tools/domain-scanner"
                onClick={() => trackClick('tool_navigation', { from: 'email-header-analyzer', to: 'domain-scanner' })}
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                  Domain Scanner
                </h3>
                <p className="text-sm text-gray-500">
                  Comprehensive domain analysis for all email records.
                </p>
              </Link>

              <Link
                href="/resources/tools/spf-checker"
                onClick={() => trackClick('tool_navigation', { from: 'email-header-analyzer', to: 'spf-checker' })}
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                  SPF Record Checker
                </h3>
                <p className="text-sm text-gray-500">
                  Validate your SPF records and ensure proper email authentication.
                </p>
              </Link>

              <Link
                href="/resources/tools/dkim-checker"
                onClick={() => trackClick('tool_navigation', { from: 'email-header-analyzer', to: 'dkim-checker' })}
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                  DKIM Record Checker
                </h3>
                <p className="text-sm text-gray-500">
                  Verify DKIM signatures and public key configuration.
                </p>
              </Link>

              <Link
                href="/resources/tools/spam-checker"
                onClick={() => trackClick('tool_navigation', { from: 'email-header-analyzer', to: 'spam-checker' })}
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                  Spam Score Checker
                </h3>
                <p className="text-sm text-gray-500">
                  Test your emails against spam filters and improve deliverability.
                </p>
              </Link>

              <Link
                href="/resources/tools/mailbox-calculator"
                onClick={() => trackClick('tool_navigation', { from: 'email-header-analyzer', to: 'mailbox-calculator' })}
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                  Mailbox Calculator
                </h3>
                <p className="text-sm text-gray-500">
                  Calculate optimal mailbox counts for your email infrastructure.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Educational Content */}
      <section className="bg-white border-t border-gray-200">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="py-16 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold tracking-tight text-black mb-6">
              Understanding email header analysis
            </h2>

            <p className="text-base text-gray-500 leading-relaxed mb-8">
              Email headers contain crucial information about an email's journey from sender to recipient,
              including authentication results, routing paths, and security indicators that help identify
              legitimate emails and detect potential threats.
            </p>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-lg font-semibold text-black mb-4">
                  What headers reveal
                </h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Authentication results
                    </p>
                    <p className="text-sm text-gray-500">
                      SPF, DKIM, and DMARC verification status from receiving servers.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Routing information
                    </p>
                    <p className="text-sm text-gray-500">
                      Complete path showing each server the email passed through.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Security indicators
                    </p>
                    <p className="text-sm text-gray-500">
                      TLS encryption status and potential security warnings.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-black mb-4">
                  Why analyze headers
                </h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Detect spoofing
                    </p>
                    <p className="text-sm text-gray-500">
                      Identify authentication failures that indicate potential email spoofing.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Troubleshoot delivery
                    </p>
                    <p className="text-sm text-gray-500">
                      Find delays or issues in email routing and delivery paths.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Verify authenticity
                    </p>
                    <p className="text-sm text-gray-500">
                      Confirm legitimate senders through proper authentication.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
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

      {/* CTA Section */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl pb-4 w-full border-x border-gray-200 border-dashed px-4">
          <div className="py-20 text-center max-w-xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-black mb-4">
              Need complete email infrastructure?
            </h2>
            <p className="text-base text-gray-500 mb-8 max-w-xl mx-auto">
              Infrabox provides everything you need for guaranteed deliverability and security monitoring
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="https://app.infrabox.software/signup"
                onClick={() => trackClick('tool_cta', { tool: 'email-header-analyzer', action: 'signup' })}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 text-[#1240cc] rounded-full transition-all text-sm font-semibold"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/learn/email-deliverability-guide"
                className="inline-flex items-center justify-center px-6 py-3 border border-white text-white hover:bg-white/10 rounded-full transition-all text-sm font-semibold"
              >
                Read Full Guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}