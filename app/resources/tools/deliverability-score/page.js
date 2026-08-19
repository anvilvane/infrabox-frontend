'use client'

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import ScoreCircle from "@/components/ScoreCircle";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Check,
  X,
} from "lucide-react";
import { trackClick } from '@/lib/datafast';

export default function DomainDeliverabilityScorePage() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [useRealCheck, setUseRealCheck] = useState(true);
  const [openItems, setOpenItems] = useState(new Set([0]));

  const checkDeliverability = async () => {
    setLoading(true);

    try {
      const endpoint = useRealCheck ? '/api/deliverability/real-check' : '/api/deliverability/check';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain }),
      });

      if (!response.ok) {
        throw new Error('Failed to check deliverability');
      }

      const data = await response.json();

      setResults({
        ...data,
        domain: data.domain || domain
      });
    } catch (error) {
      console.error('Error checking deliverability:', error);
      setResults({
        score: 0,
        riskLevel: 'High',
        grade: 'F',
        dns: {},
        recommendations: [{
          type: 'critical',
          title: 'Analysis Failed',
          description: 'Unable to analyze domain. Please check the domain name and try again.',
          impact: 'Critical'
        }]
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

  const getRiskDescription = (riskLevel) => {
    switch (riskLevel) {
      case 'Low': return 'Excellent email security configuration with minimal risk of delivery issues.';
      case 'Medium': return 'Good configuration with some areas for improvement to enhance security and deliverability.';
      case 'High': return 'Significant security vulnerabilities detected. Immediate action recommended.';
      default: return 'Unable to assess risk level.';
    }
  };

  const faqs = [
    {
      question: "What is an email deliverability score?",
      answer: "An email deliverability score is a metric that indicates the likelihood of your emails reaching the recipient's inbox. It's based on factors like DNS configuration, authentication protocols (SPF, DKIM, DMARC), and domain reputation."
    },
    {
      question: "How can I improve my deliverability score?",
      answer: "To improve your score, ensure you have valid SPF, DKIM, and DMARC records configured. Also, monitor your domain's reputation, avoid sending spam, and maintain a clean email list."
    },
    {
      question: "What is a good deliverability score?",
      answer: "A score above 90 is considered excellent. Scores between 80-90 are good but may have room for improvement. Scores below 80 indicate potential issues that could lead to emails landing in spam folders."
    },
    {
      question: "Does this tool check for blacklists?",
      answer: "Yes, this tool checks your domain and IP address against major email blacklists to see if you've been flagged for spamming."
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
            <span className="text-gray-600">Deliverability Score</span>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="text-center pt-12 pb-16 max-w-3xl mx-auto">
            <p className="font-mono text-xs uppercase tracking-widest text-[#1240cc] mb-5">
              Free tool
            </p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-black mb-5">
              Email deliverability score checker
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
              Analyze your domain's email deliverability health. Check DNS records, authentication
              protocols, and get actionable recommendations to improve inbox placement.
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
                      onKeyDown={(e) => e.key === 'Enter' && domain && checkDeliverability()}
                    />
                  </div>
                </div>

                <button
                  onClick={checkDeliverability}
                  disabled={!domain || loading}
                  className="w-full px-8 py-4 bg-[#1240cc] text-white font-semibold rounded-full hover:bg-[#0b34b4] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing domain...
                    </span>
                  ) : (
                    'Analyze Domain'
                  )}
                </button>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="realCheck"
                    checked={useRealCheck}
                    onCheckedChange={setUseRealCheck}
                    className="mt-1"
                  />
                  <label
                    htmlFor="realCheck"
                    className="text-sm cursor-pointer"
                  >
                    <span className="font-medium text-black">Deep analysis mode</span>
                    <p className="text-gray-500">
                      Performs live DNS queries for accurate real-time results
                    </p>
                  </label>
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
                    <p className="font-mono text-xs uppercase tracking-widest text-[#1240cc] mb-2">
                      Analysis results
                    </p>
                    <h2 className="text-3xl font-bold text-black">
                      {results.domain}
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

              {/* Score Card */}
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="md:col-span-1">
                  <div className="text-center">
                    <ScoreCircle score={results.score} />
                    <p className="mt-4 text-sm font-medium text-black">
                      Deliverability Score
                    </p>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm font-medium text-gray-500">Risk Level:</span>
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${results.riskLevel === 'Low' ? 'bg-green-50 text-green-700 border border-green-200' :
                          results.riskLevel === 'Medium' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                            'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                        {results.riskLevel}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {getRiskDescription(results.riskLevel)}
                    </p>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-200 rounded-xl">
                      <div className="flex items-center gap-2">
                        {results.dns?.spf?.exists ? (
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
                            {results.dns?.spf?.exists ? 'Configured' : 'Missing'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-xl">
                      <div className="flex items-center gap-2">
                        {results.dns?.dkim?.exists || results.dns?.dkim?.foundSelectors?.length > 0 ? (
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
                            {results.dns?.dkim?.exists || results.dns?.dkim?.foundSelectors?.length > 0 ? 'Configured' : 'Missing'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-xl">
                      <div className="flex items-center gap-2">
                        {results.dns?.dmarc?.exists ? (
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
                            {results.dns?.dmarc?.exists ? 'Configured' : 'Missing'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-xl">
                      <div className="flex items-center gap-2">
                        {results.dns?.mx?.exists ? (
                          <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                            <Check className="w-5 h-5 text-green-600" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center">
                            <X className="w-5 h-5 text-red-600" />
                          </div>
                        )}
                        <div>
                          <p className="text-base font-semibold text-black">MX</p>
                          <p className="text-xs text-gray-500">
                            {results.dns?.mx?.provider || (results.dns?.mx?.exists ? 'Configured' : 'Missing')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* DNS Records Details */}
              <div className="mb-12">
                <h3 className="text-xl font-bold text-black mb-6">
                  DNS Records Analysis
                </h3>
                <div className="divide-y divide-gray-200">
                  {[
                    {
                      name: 'SPF Record',
                      status: results.dns?.spf?.exists,
                      value: results.dns?.spf?.record,
                      description: 'Specifies which mail servers are authorized to send email on behalf of your domain'
                    },
                    {
                      name: 'DKIM Configuration',
                      status: results.dns?.dkim?.exists || results.dns?.dkim?.foundSelectors?.length > 0,
                      value: results.dns?.dkim?.foundSelectors?.join(', '),
                      description: 'Digital signature that verifies email authenticity'
                    },
                    {
                      name: 'DMARC Policy',
                      status: results.dns?.dmarc?.exists,
                      value: results.dns?.dmarc?.record,
                      description: 'Tells receivers what to do with emails that fail authentication'
                    },
                    {
                      name: 'MX Records',
                      status: results.dns?.mx?.exists,
                      value: results.dns?.mx?.provider,
                      description: 'Mail exchange servers that handle email for your domain'
                    }
                  ].map((record, index) => (
                    <div key={index} className="py-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h4 className="text-base font-semibold text-black">
                              {record.name}
                            </h4>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${record.status
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                              }`}>
                              {record.status ? 'Active' : 'Not Found'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {record.description}
                          </p>
                          {record.value && (
                            <div className="mt-3 p-3 bg-white border border-gray-200 rounded-lg">
                              <code className="text-xs text-black/80 font-mono break-all">
                                {record.value}
                              </code>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              {results.recommendations && results.recommendations.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-xl font-bold text-black mb-6">
                    Recommendations
                  </h3>
                  <div className="space-y-4">
                    {results.recommendations.map((rec, index) => (
                      <div key={index} className="p-6 bg-white border border-gray-200 rounded-xl hover:border-[#1240cc] transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-base font-semibold text-black">
                            {rec.title}
                          </h4>
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${rec.impact === 'Critical' ? 'bg-red-50 text-red-700 border border-red-200' :
                              rec.impact === 'High' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                                rec.impact === 'Medium' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                                  'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}>
                            {rec.impact} Priority
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed">
                          {rec.description}
                        </p>
                        {rec.suggestedRecord && (
                          <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg">
                            <p className="text-xs font-medium text-black mb-2">Suggested DNS Record:</p>
                            <code className="text-xs text-black/80 font-mono break-all">
                              {rec.suggestedRecord}
                            </code>
                          </div>
                        )}
                        {rec.instructions && (
                          <p className="mt-3 text-xs text-gray-500 italic">
                            {rec.instructions}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Blacklist Status */}
              {results.blacklists && (
                <div className="mb-12">
                  <h3 className="text-xl font-bold text-black mb-6">
                    Blacklist Status
                  </h3>
                  <div className="p-6 bg-white border border-gray-200 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm font-medium text-black">
                          Checked {results.blacklists.checked} major blacklists
                        </p>
                        {results.blacklists.ip && (
                          <p className="text-xs text-gray-500 mt-1">
                            IP Address: {results.blacklists.ip}
                          </p>
                        )}
                      </div>
                      <span className={`px-4 py-2 text-sm font-semibold rounded-full flex items-center gap-2 ${results.blacklists.listed === 0
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                        {results.blacklists.listed === 0 ? (
                          <>
                            <Check className="w-4 h-4" />
                            Clean
                          </>
                        ) : (
                          <>
                            <X className="w-4 h-4" />
                            Listed on {results.blacklists.listed}
                          </>
                        )}
                      </span>
                    </div>

                    {results.blacklists.lists && results.blacklists.lists.length > 0 && (
                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-sm font-medium text-black mb-3">Blacklists detected on:</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {results.blacklists.lists.map((list, idx) => (
                            <span key={idx} className="text-xs px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-lg">
                              {list}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Inline CTA banner */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="border-y border-gray-200 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-5xl mx-auto">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-[#1240cc] mb-1">
                  Automate everything
                </p>
                <p className="text-sm text-gray-500">
                  Infrabox automatically monitors and optimizes your email deliverability across all domains.
                </p>
              </div>
              <a
                href="https://app.infrabox.software/signup"
                onClick={() => trackClick('tool_cta_banner', { tool: 'deliverability-score' })}
                className="flex-shrink-0 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[#1240cc] hover:text-[#0b34b4] transition-colors"
              >
                Get Started
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="bg-gray-50 border-t border-gray-200">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="py-16 max-w-4xl mx-auto">
            <p className="font-mono text-xs uppercase tracking-widest text-[#1240cc] mb-3">
              Related
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-black mb-8">
              Related tools
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <Link
                href="/resources/tools/spf-checker"
                onClick={() => trackClick('tool_navigation', { from: 'deliverability-score', to: 'spf-checker' })}
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
                onClick={() => trackClick('tool_navigation', { from: 'deliverability-score', to: 'dkim-checker' })}
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
                href="/resources/tools/dmarc-checker"
                onClick={() => trackClick('tool_navigation', { from: 'deliverability-score', to: 'dmarc-checker' })}
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                  DMARC Policy Checker
                </h3>
                <p className="text-sm text-gray-500">
                  Analyze DMARC policies and email authentication alignment.
                </p>
              </Link>

              <Link
                href="/resources/tools/dns-validator"
                onClick={() => trackClick('tool_navigation', { from: 'deliverability-score', to: 'dns-validator' })}
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                  DNS Validator
                </h3>
                <p className="text-sm text-gray-500">
                  Complete DNS record validation for email authentication.
                </p>
              </Link>

              <Link
                href="/resources/tools/domain-scanner"
                onClick={() => trackClick('tool_navigation', { from: 'deliverability-score', to: 'domain-scanner' })}
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
                href="/resources/tools/reputation-check"
                onClick={() => trackClick('tool_navigation', { from: 'deliverability-score', to: 'reputation-check' })}
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                  Reputation Check
                </h3>
                <p className="text-sm text-gray-500">
                  Check your domain and IP reputation across major providers.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Educational Content */}
      <section className="bg-white border-t border-gray-200">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="py-16 max-w-4xl mx-auto">
            <p className="font-mono text-xs uppercase tracking-widest text-[#1240cc] mb-3">
              Overview
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-black mb-4">
              Understanding email deliverability
            </h2>

            <p className="text-base text-gray-500 leading-relaxed mb-8">
              Email deliverability is the ability to successfully deliver emails to recipients' inboxes
              rather than spam folders or being blocked entirely. It depends on multiple factors including
              your domain reputation, authentication protocols, and email content quality.
            </p>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-lg font-semibold text-black mb-4">
                  Why it matters
                </h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Revenue impact
                    </p>
                    <p className="text-sm text-gray-500">
                      Poor deliverability means lost sales opportunities and reduced customer engagement.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Sender reputation
                    </p>
                    <p className="text-sm text-gray-500">
                      ISPs track your sending behavior to determine future inbox placement.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Compliance requirements
                    </p>
                    <p className="text-sm text-gray-500">
                      Major providers require proper authentication to accept your emails.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-black mb-4">
                  Key protocols
                </h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      SPF
                    </p>
                    <p className="text-sm text-gray-500">
                      Defines which servers can send email for your domain.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      DKIM
                    </p>
                    <p className="text-sm text-gray-500">
                      Cryptographic signature proving email authenticity.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      DMARC
                    </p>
                    <p className="text-sm text-gray-500">
                      Policy for handling authentication failures.
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
            <p className="font-mono text-xs uppercase tracking-widest text-[#1240cc] mb-3 text-center">
              FAQ
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-black mb-10 text-center">
              Frequently asked questions
            </h2>

            <div className="divide-y divide-gray-200 border-y border-gray-200">
              {faqs.map((faq, index) => (
                <div key={index}>
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full flex items-center justify-between py-5 text-left focus:outline-none"
                  >
                    <h3 className="text-sm font-medium text-black pr-4">
                      {faq.question}
                    </h3>
                    <div className="flex-shrink-0">
                      {openItems.has(index) ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1240cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                      )}
                    </div>
                  </button>

                  <div
                    style={{
                      maxHeight: openItems.has(index) ? '300px' : '0px',
                      opacity: openItems.has(index) ? 1 : 0,
                      transition: 'max-height 0.3s ease, opacity 0.3s ease'
                    }}
                    className="overflow-hidden"
                  >
                    <p className="text-sm text-gray-500 leading-relaxed pb-5">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 border-t border-gray-200">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="py-20 text-center max-w-xl mx-auto">
            <p className="font-mono text-xs uppercase tracking-widest text-[#1240cc] mb-5">
              Get started
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-black mb-4">
              Need complete email infrastructure?
            </h2>
            <p className="text-base text-gray-500 mb-8">
              Infrabox provides everything you need for guaranteed deliverability.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://app.infrabox.software/signup"
                onClick={() => trackClick('tool_cta', { tool: 'deliverability-score', action: 'signup' })}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1240cc] text-white text-sm font-semibold rounded-full hover:bg-[#0b34b4] transition-colors"
              >
                Get Started
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </a>
              <Link
                href="/learn/email-deliverability-guide"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-black text-sm font-semibold rounded-full hover:border-gray-400 transition-colors"
              >
                Read full guide
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}