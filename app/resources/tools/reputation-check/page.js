'use client'

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Activity,
  Check,
  AlertTriangle,
  X,
  ArrowRight,
  Shield,
  Globe,
  Server,
  TrendingUp,
  TrendingDown,
  Mail,
  AlertCircle,
  XCircle,
  CheckCircle,
  Plus,
  Minus
} from "lucide-react";
import { trackClick } from '@/lib/datafast';
import ScoreCircle from "@/components/ScoreCircle";

export default function ReputationCheckPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [openItems, setOpenItems] = useState(new Set([0]));

  const checkReputation = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/tools/reputation-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      });

      if (!response.ok) {
        throw new Error('Failed to check reputation');
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error checking reputation:', error);
      setResults({
        error: true,
        message: 'Unable to check reputation. Please verify the input and try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setInput("");
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
      question: "What is sender reputation?",
      answer: "Sender reputation is a score assigned by Internet Service Providers (ISPs) to an organization's sending IP address and domain. It determines whether your emails are delivered to the inbox, sent to the spam folder, or rejected entirely."
    },
    {
      question: "How do I improve my sender reputation?",
      answer: "Improve reputation by sending relevant content to engaged users, removing inactive subscribers, authenticating your emails (SPF, DKIM, DMARC), and avoiding spam triggers in your content."
    },
    {
      question: "What are blacklists?",
      answer: "Blacklists (or blocklists) are databases of IP addresses and domains known to send spam. ISPs use these lists to filter incoming email. Being listed can severely impact your email deliverability."
    },
    {
      question: "How often should I check my reputation?",
      answer: "It's recommended to monitor your reputation continuously, especially if you send large volumes of email. Regular checks help you catch and resolve issues before they cause significant delivery failures."
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
            <span className="text-gray-600">Reputation Check</span>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="text-center pt-12 pb-16 max-w-3xl mx-auto">
            <p className="font-mono text-xs uppercase tracking-widest text-[#1240cc] mb-5">Free tool</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-black mb-5">Sender reputation checker</h1>
            <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
              Check domain and IP reputation across major blacklists.
              Analyze email sender reputation and authentication status.
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
                  <label htmlFor="input" className="block text-sm font-medium text-black mb-2">
                    Domain or IP to analyze
                  </label>
                  <div className="relative">
                    <Input
                      id="input"
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="example.com or 192.0.2.1"
                      className="w-full px-4 h-[52px] py-0 text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1240cc] focus:border-transparent transition-all placeholder:text-gray-400"
                      disabled={loading}
                      onKeyDown={(e) => e.key === 'Enter' && input && checkReputation()}
                    />
                  </div>
                </div>

                <button
                  onClick={checkReputation}
                  disabled={!input || loading}
                  className="w-full px-8 py-4 bg-[#1240cc] text-white font-semibold rounded-full hover:bg-[#0b34b4] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Checking reputation...
                    </span>
                  ) : (
                    'Check Reputation'
                  )}
                </button>

                {/* Info Box */}
                <div className="p-6 bg-white border border-gray-200 rounded-xl">
                  <h3 className="text-sm font-medium text-black mb-2">
                    What reputation check analyzes
                  </h3>
                  <div className="space-y-3 text-sm text-gray-500">
                    <div className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-[#1240cc] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-black">Blacklist Status</p>
                        <p className="text-xs">Checks major spam blacklists like Spamhaus, Barracuda</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Activity className="w-4 h-4 text-[#1240cc] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-black">Reputation Score</p>
                        <p className="text-xs">Calculates overall sender reputation rating</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Mail className="w-4 h-4 text-[#1240cc] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-black">Authentication</p>
                        <p className="text-xs">Validates SPF, DKIM, and DMARC configuration</p>
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
                      {results.domain || results.ipAddress || input}
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
                  {/* Reputation Score Card */}
                  {results.reputation && (
                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                      <div className="md:col-span-1">
                        <div className="text-center">
                          <ScoreCircle score={results.reputation.score} />
                          <p className="mt-4 text-sm font-medium text-black">
                            Reputation Score
                          </p>
                        </div>
                      </div>

                      <div className="md:col-span-2 space-y-6">
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-sm font-medium text-gray-500">Status:</span>
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${results.reputation.status === 'excellent' || results.reputation.status === 'good' ? 'bg-green-50 text-green-700 border border-green-200' :
                                results.reputation.status === 'fair' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                                  'bg-red-50 text-red-700 border border-red-200'
                              }`}>
                              {results.reputation.status.charAt(0).toUpperCase() + results.reputation.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 leading-relaxed">
                            {results.reputation.status === 'excellent' ? 'Excellent sender reputation with minimal risk of delivery issues.' :
                              results.reputation.status === 'good' ? 'Good reputation with some areas for improvement.' :
                                results.reputation.status === 'fair' ? 'Fair reputation that needs attention to improve deliverability.' :
                                  'Poor reputation requiring immediate action to prevent blocking.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Key Information Grid */}
                  <div className="grid md:grid-cols-2 gap-4 mb-8">
                    {results.ipAddress && (
                      <div className="p-4 border border-gray-200 rounded-xl">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center">
                            <Globe className="w-5 h-5 text-[#1240cc]" />
                          </div>
                          <div>
                            <p className="text-base font-semibold text-black">
                              {results.ipAddress}
                            </p>
                            <p className="text-xs text-gray-500">IP Address</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {results.mailServer?.ptr && (
                      <div className="p-4 border border-gray-200 rounded-xl">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center">
                            <Server className="w-5 h-5 text-[#1240cc]" />
                          </div>
                          <div className="flex-1">
                            <p className="text-base font-semibold text-black truncate">
                              {results.mailServer.ptr}
                            </p>
                            <p className="text-xs text-gray-500">
                              PTR Record {results.mailServer.validPTR ? '(Valid)' : '(Invalid)'}
                            </p>
                          </div>
                          {results.mailServer.validPTR ? (
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                          ) : (
                            <X className="w-4 h-4 text-red-600 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Blacklist Status */}
                  {results.blacklists && (
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-black mb-6">
                        Blacklist Status
                      </h3>

                      <div className="p-6 bg-white border border-gray-200 rounded-xl">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-sm font-medium text-black">
                              Checked {results.blacklists.checked?.length || 0} major blacklists
                            </p>
                          </div>
                          <span className={`px-4 py-2 text-sm font-semibold rounded-full flex items-center gap-2 ${results.blacklists.listed && results.blacklists.listed.length === 0
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                            {results.blacklists.listed && results.blacklists.listed.length === 0 ? (
                              <>
                                <Check className="w-4 h-4" />
                                Clean
                              </>
                            ) : (
                              <>
                                <X className="w-4 h-4" />
                                Listed on {results.blacklists.listed?.length || 0}
                              </>
                            )}
                          </span>
                        </div>

                        {results.blacklists.listed && results.blacklists.listed.length > 0 && (
                          <div className="pt-4 border-t border-gray-200">
                            <p className="text-sm font-medium text-black mb-3">Blacklists detected on:</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {results.blacklists.listed.map((list, idx) => (
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

                  {/* Email Authentication */}
                  {results.authentication && (
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-black mb-6">
                        Email Authentication
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="p-4 border border-gray-200 rounded-xl">
                          <div className="flex items-center gap-2">
                            {results.authentication.spf ? (
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
                                {results.authentication.spf ? 'Configured' : 'Missing'}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 border border-gray-200 rounded-xl">
                          <div className="flex items-center gap-2">
                            {results.authentication.dkim ? (
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
                                {results.authentication.dkim ? 'Configured' : 'Missing'}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 border border-gray-200 rounded-xl">
                          <div className="flex items-center gap-2">
                            {results.authentication.dmarc ? (
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
                                {results.authentication.dmarc ? 'Configured' : 'Missing'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Issues */}
                  {results.reputation?.issues && results.reputation.issues.length > 0 && (
                    <div className="p-6 bg-white border border-yellow-200 rounded-xl mb-8">
                      <h3 className="text-base font-semibold text-black mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        Issues Found
                      </h3>
                      <ul className="space-y-2">
                        {results.reputation.issues.map((issue, index) => (
                          <li key={index} className="text-sm text-gray-500">
                            • {issue}
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
                            </div>
                            <p className="text-sm text-gray-500 leading-relaxed">
                              {rec.action}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="p-8 bg-[#1240cc] rounded-xl">
                    <h3 className="text-xl font-bold text-white mb-3">
                      Improve your sender reputation
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Infrabox continuously monitors your sender reputation, provides blacklist alerts,
                      and helps maintain optimal email deliverability.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link
                        href="https://app.infrabox.software/signup"
                        onClick={() => trackClick('tool_cta', { tool: 'reputation-check', action: 'monitoring' })}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 text-[#1240cc] rounded-full transition-all text-sm font-semibold"
                      >
                        Start Monitoring
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
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
                onClick={() => trackClick('tool_navigation', { from: 'reputation-check', to: 'deliverability-score' })}
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                  Deliverability Score
                </h3>
                <p className="text-sm text-gray-500">
                  Complete email deliverability analysis.
                </p>
              </Link>

              <Link
                href="/resources/tools/spf-checker"
                onClick={() => trackClick('tool_navigation', { from: 'reputation-check', to: 'spf-checker' })}
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                  SPF Checker
                </h3>
                <p className="text-sm text-gray-500">
                  Validate SPF record configuration.
                </p>
              </Link>

              <Link
                href="/resources/tools/dkim-checker"
                onClick={() => trackClick('tool_navigation', { from: 'reputation-check', to: 'dkim-checker' })}
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                  DKIM Checker
                </h3>
                <p className="text-sm text-gray-500">
                  Verify DKIM signatures and keys.
                </p>
              </Link>

              <Link
                href="/resources/tools/dmarc-checker"
                onClick={() => trackClick('tool_navigation', { from: 'reputation-check', to: 'dmarc-checker' })}
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                  DMARC Checker
                </h3>
                <p className="text-sm text-gray-500">
                  Analyze DMARC policy configuration.
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
              Understanding sender reputation
            </h2>

            <p className="text-base text-gray-500 leading-relaxed mb-8">
              Sender reputation is a score that Internet Service Providers (ISPs) assign to organizations
              that send email. It's a crucial factor in determining whether your emails reach the inbox
              or get filtered as spam.
            </p>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-lg font-semibold text-black mb-4">
                  What affects reputation
                </h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Blacklist status
                    </p>
                    <p className="text-sm text-gray-500">
                      Being listed on spam blacklists severely impacts deliverability.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Authentication
                    </p>
                    <p className="text-sm text-gray-500">
                      Proper SPF, DKIM, and DMARC configuration builds trust.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Engagement rates
                    </p>
                    <p className="text-sm text-gray-500">
                      Low opens and high complaints hurt reputation scores.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      List quality
                    </p>
                    <p className="text-sm text-gray-500">
                      High bounce rates indicate poor list hygiene.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-black mb-4">
                  How to improve
                </h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Start gradually
                    </p>
                    <p className="text-sm text-gray-500">
                      Build reputation with small volumes to engaged recipients.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Clean your list
                    </p>
                    <p className="text-sm text-gray-500">
                      Remove inactive subscribers and bounced addresses regularly.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Monitor continuously
                    </p>
                    <p className="text-sm text-gray-500">
                      Check blacklists and reputation scores proactively.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Send quality content
                    </p>
                    <p className="text-sm text-gray-500">
                      Provide value that recipients actually want to receive.
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

      {/* CTA Section */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl pb-4 w-full border-x border-gray-200 border-dashed px-4">
          <div className="py-20 text-center max-w-xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-black mb-4">
              Protect your sender reputation
            </h2>
            <p className="text-base text-gray-500 mb-8 max-w-xl mx-auto">
              Infrabox monitors reputation 24/7, alerts you to issues, and helps maintain high deliverability
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="https://app.infrabox.software/signup"
                onClick={() => trackClick('tool_cta', { tool: 'reputation-check', action: 'signup' })}
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