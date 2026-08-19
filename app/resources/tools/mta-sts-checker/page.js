'use client'

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Lock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Shield,
  Server,
  Globe,
  Check,
  X,
  ExternalLink,
  FileText,
  Plus,
  Minus
} from "lucide-react";
import { trackClick } from '@/lib/datafast';

export default function MTASTSCheckerPage() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [openItems, setOpenItems] = useState(new Set([0]));

  const checkMTASTS = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/tools/mta-sts-checker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain }),
      });

      if (!response.ok) {
        throw new Error('Failed to check MTA-STS');
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error checking MTA-STS:', error);
      setResults({
        error: true,
        message: 'Unable to check MTA-STS configuration. Please verify the domain and try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setDomain("");
    setResults(null);
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
      question: "What is MTA-STS?",
      answer: "MTA-STS (Mail Transfer Agent Strict Transport Security) is a security standard that allows domain owners to declare their ability to receive Transport Layer Security (TLS) secure SMTP connections and to specify whether sending SMTP servers should refuse to deliver to MX hosts that do not offer TLS with a trusted server certificate."
    },
    {
      question: "Why is MTA-STS important?",
      answer: "It prevents downgrade attacks and man-in-the-middle attacks by enforcing TLS encryption for email transmission. This ensures that emails are not intercepted or read by unauthorized parties during transit."
    },
    {
      question: "How do I implement MTA-STS?",
      answer: "Implementation involves publishing a DNS TXT record at _mta-sts.yourdomain.com and hosting a policy file at https://mta-sts.yourdomain.com/.well-known/mta-sts.txt. The policy file specifies the enforcement mode and allowed MX hosts."
    },
    {
      question: "What are the MTA-STS modes?",
      answer: "There are three modes: 'none' (MTA-STS is disabled), 'testing' (reports are generated but delivery is not blocked on failure), and 'enforce' (TLS is required, and delivery fails if validation fails)."
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
            <span className="text-gray-600">MTA-STS Checker</span>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="text-center pt-12 pb-16 max-w-3xl mx-auto">
            <p className="font-mono text-xs uppercase tracking-widest text-[#1240cc] mb-5">Free tool</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-black mb-5">MTA-STS checker</h1>
            <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
              Validate Mail Transfer Agent Strict Transport Security configuration.
              Ensure TLS encryption is properly enforced for email delivery.
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
                  <label htmlFor="domain" className="block text-sm font-medium text-black mb-2">
                    Domain to analyze
                  </label>
                  <div className="relative">
                    <Input
                      id="domain"
                      type="text"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      placeholder="yourdomain.com"
                      className="w-full px-4 h-[52px] py-0 text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1240cc] focus:border-transparent transition-all placeholder:text-gray-400"
                      disabled={loading}
                      onKeyDown={(e) => e.key === 'Enter' && domain && checkMTASTS()}
                    />
                  </div>
                </div>

                <button
                  onClick={checkMTASTS}
                  disabled={!domain || loading}
                  className="w-full px-8 py-4 bg-[#1240cc] text-white font-semibold rounded-full hover:bg-[#0b34b4] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Checking MTA-STS...
                    </span>
                  ) : (
                    'Check MTA-STS'
                  )}
                </button>

                {/* Info Box */}
                <div className="p-6 bg-white border border-gray-200 rounded-xl">
                  <h3 className="text-sm font-medium text-black mb-2">
                    What MTA-STS checks
                  </h3>
                  <div className="space-y-3 text-sm text-gray-500">
                    <div className="flex items-start gap-2">
                      <Lock className="w-4 h-4 text-[#1240cc] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-black">DNS Record</p>
                        <p className="text-xs">Verifies MTA-STS TXT record at _mta-sts.domain</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 text-[#1240cc] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-black">Policy File</p>
                        <p className="text-xs">Checks HTTPS-hosted policy at mta-sts.domain</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Server className="w-4 h-4 text-[#1240cc] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-black">MX Validation</p>
                        <p className="text-xs">Ensures policy matches mail server configuration</p>
                      </div>
                    </div>
                  </div>
                </div>
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
                      {results.domain || domain}
                    </h2>
                  </div>
                  <button
                    onClick={reset}
                    className="px-5 py-2.5 text-sm font-medium text-black border border-gray-300 rounded-full hover:border-[#1240cc] hover:text-[#1240cc] transition-all"
                  >
                    New Check
                  </button>
                </div>
              </div>

              {results.error ? (
                <div className="p-6 bg-white border border-red-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-black">Error</h3>
                      <p className="text-gray-500 mt-1">{results.message}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Status Overview Grid */}
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* DNS Record Status */}
                    <div className="p-6 bg-white border border-gray-200 rounded-xl">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <h3 className="text-base font-semibold text-black">
                            DNS Record
                          </h3>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${results.dns?.exists
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                            {results.dns?.exists ? 'Found' : 'Not Found'}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">
                        TXT record at _mta-sts.{results.domain || domain}
                      </p>
                      {results.dns?.exists ? (
                        <>
                          <div className="p-3 bg-white border border-gray-200 rounded-lg">
                            <code className="text-xs text-black/80 font-mono break-all">
                              {results.dns.record}
                            </code>
                          </div>
                          {results.dns.id && (
                            <p className="text-xs text-gray-500 mt-2">
                              Policy ID: <span className="font-mono">{results.dns.id}</span>
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          No MTA-STS DNS record found
                        </p>
                      )}
                    </div>

                    {/* Policy File Status */}
                    <div className="p-6 bg-white border border-gray-200 rounded-xl">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <h3 className="text-base font-semibold text-black">
                            Policy File
                          </h3>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${results.policy?.exists
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                            {results.policy?.exists ? 'Found' : 'Not Found'}
                          </span>
                        </div>
                      </div>
                      {results.policy?.url && (
                        <div className="space-y-3">
                          <p className="text-sm text-gray-500">
                            Expected location:
                          </p>
                          <div className="p-3 bg-white border border-gray-200 rounded-lg">
                            <code className="text-xs text-black/80 font-mono break-all">
                              {results.policy.url}
                            </code>
                          </div>
                          <a
                            href={results.policy.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-[#1240cc] hover:text-[#0b34b4] font-medium"
                          >
                            View Policy File <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Policy Format */}
                  {results.policyFormat && (
                    <div className="p-6 bg-white border border-gray-200 rounded-xl mb-8">
                      <h3 className="text-base font-semibold text-black mb-4">
                        Expected Policy Format
                      </h3>
                      <div className="p-4 bg-white border border-gray-200 rounded-lg">
                        <pre className="text-xs text-black/80 font-mono overflow-x-auto">
                          {`version: ${results.policyFormat.version}
mode: ${results.policyFormat.mode}
mx: ${results.policyFormat.mx.join(', ')}
max_age: ${results.policyFormat.max_age}`}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Errors */}
                  {results.errors && results.errors.length > 0 && (
                    <div className="p-6 bg-white border border-red-200 rounded-xl mb-8">
                      <h3 className="text-base font-semibold text-black mb-3 flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-600" />
                        Issues Found
                      </h3>
                      <ul className="space-y-2">
                        {results.errors.map((error, index) => (
                          <li key={index} className="text-sm text-gray-500">
                            • {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Warnings */}
                  {results.warnings && results.warnings.length > 0 && (
                    <div className="p-6 bg-white border border-yellow-200 rounded-xl mb-8">
                      <h3 className="text-base font-semibold text-black mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        Warnings
                      </h3>
                      <ul className="space-y-2">
                        {results.warnings.map((warning, index) => (
                          <li key={index} className="text-sm text-gray-500">
                            • {warning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommendations */}
                  {results.recommendations && results.recommendations.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-black mb-6">
                        Recommendations
                      </h3>
                      <div className="space-y-4">
                        {results.recommendations.map((rec, index) => (
                          <div key={index} className="p-6 bg-white border border-gray-200 rounded-xl hover:border-[#1240cc] transition-colors">
                            <div className="flex items-start justify-between mb-3">
                              <h4 className="text-base font-semibold text-black">
                                {rec.message}
                              </h4>
                              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${rec.level === 'critical' ? 'bg-red-50 text-red-700 border border-red-200' :
                                  rec.level === 'warning' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                                    'bg-blue-50 text-blue-700 border border-blue-200'
                                }`}>
                                {rec.level === 'critical' ? 'Critical' :
                                  rec.level === 'warning' ? 'Warning' : 'Info'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 leading-relaxed">
                              {rec.action}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTA for improvement */}
                  {!results.valid && (
                    <div className="p-8 bg-[#1240cc] rounded-xl">
                      <h3 className="text-xl font-bold text-white mb-3">
                        Implement MTA-STS for enhanced security
                      </h3>
                      <p className="text-gray-500 mb-6">
                        MTA-STS prevents email interception and downgrade attacks by enforcing TLS encryption.
                        Infrabox helps you implement MTA-STS correctly with automated policy management.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                          href="https://app.infrabox.software/signup"
                          onClick={() => trackClick('tool_cta', { tool: 'mta-sts-checker', action: 'signup' })}
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 text-[#1240cc] rounded-full transition-all text-sm font-semibold"
                        >
                          Setup MTA-STS
                          <ArrowRight className="w-4 h-4" />
                        </Link>
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
                onClick={() => trackClick('tool_navigation', { from: 'mta-sts-checker', to: 'deliverability-score' })}
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                  Deliverability Score
                </h3>
                <p className="text-sm text-gray-500">
                  Complete email infrastructure analysis.
                </p>
              </Link>

              <Link
                href="/resources/tools/dns-validator"
                onClick={() => trackClick('tool_navigation', { from: 'mta-sts-checker', to: 'dns-validator' })}
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                  DNS Validator
                </h3>
                <p className="text-sm text-gray-500">
                  Comprehensive DNS record validation.
                </p>
              </Link>

              <Link
                href="/resources/tools/spf-checker"
                onClick={() => trackClick('tool_navigation', { from: 'mta-sts-checker', to: 'spf-checker' })}
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                  SPF Checker
                </h3>
                <p className="text-sm text-gray-500">
                  Validate your SPF record configuration.
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
              Understanding MTA-STS
            </h2>

            <p className="text-base text-gray-500 leading-relaxed mb-8">
              MTA-STS (Mail Transfer Agent Strict Transport Security) is a security standard that enforces
              Transport Layer Security (TLS) for email exchanges between mail servers, preventing downgrade
              attacks and man-in-the-middle interception.
            </p>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-lg font-semibold text-black mb-4">
                  How it works
                </h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      DNS announcement
                    </p>
                    <p className="text-sm text-gray-500">
                      TXT record at _mta-sts.domain signals MTA-STS support with a policy ID.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Policy retrieval
                    </p>
                    <p className="text-sm text-gray-500">
                      Sending servers fetch the policy via HTTPS from mta-sts.domain.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      TLS enforcement
                    </p>
                    <p className="text-sm text-gray-500">
                      Policy defines which MX servers accept mail and enforces encrypted connections.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-black mb-4">
                  Policy modes
                </h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Testing mode
                    </p>
                    <p className="text-sm text-gray-500">
                      Monitor TLS usage without blocking mail. Use for initial deployment.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Enforce mode
                    </p>
                    <p className="text-sm text-gray-500">
                      Require TLS for all connections. Mail fails if encryption unavailable.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      None mode
                    </p>
                    <p className="text-sm text-gray-500">
                      Disable MTA-STS while keeping DNS record. Used for maintenance.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h3 className="text-lg font-semibold text-black mb-4">
                Implementation steps
              </h3>

              <div className="space-y-3">
                {[
                  'Create subdomain mta-sts.yourdomain.com with HTTPS certificate',
                  'Host policy file at /.well-known/mta-sts.txt',
                  'Start with mode: testing to monitor without blocking',
                  'Add DNS TXT record at _mta-sts.yourdomain.com',
                  'Implement TLS-RPT for failure reporting',
                  'Monitor for 2-4 weeks before enforcing',
                  'Switch to mode: enforce when confident'
                ].map((step, index) => (
                  <div key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-black">
                      {index + 1}
                    </span>
                    <p className="text-sm text-gray-500">{step}</p>
                  </div>
                ))}
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

      {/* CTA Section */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl pb-4 w-full border-x border-gray-200 border-dashed px-4">
          <div className="py-20 text-center max-w-xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-black mb-4">
              Secure your email with MTA-STS
            </h2>
            <p className="text-base text-gray-500 mb-8 max-w-xl mx-auto">
              Infrabox automates MTA-STS deployment and monitoring, ensuring encrypted email delivery
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="https://app.infrabox.software/signup"
                onClick={() => trackClick('tool_cta', { tool: 'mta-sts-checker', action: 'signup' })}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 text-[#1240cc] rounded-full transition-all text-sm font-semibold"
              >
                Deploy MTA-STS
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