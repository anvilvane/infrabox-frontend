'use client'

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Scan,
  Globe,
  Lock,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Server,
  Key,
  Mail,
  Activity,
  FileText,
  Check,
  X,
  Plus,
  Minus
} from "lucide-react";
import ScoreCircle from "@/components/ScoreCircle";
import { trackClick } from '@/lib/datafast';

export default function DomainScannerPage() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [openItems, setOpenItems] = useState(new Set([0]));

  const scanDomain = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/tools/domain-scanner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain }),
      });

      if (!response.ok) {
        throw new Error('Failed to scan domain');
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error scanning domain:', error);
      setResults({
        error: true,
        message: 'Unable to scan domain. Please verify the domain and try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setDomain("");
    setResults(null);
    setExpandedSections({});
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
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
      question: "What does the Domain Scanner check?",
      answer: "The Domain Scanner performs a comprehensive analysis of your domain's email authentication records (SPF, DKIM, DMARC, BIMI), MTA-STS configuration, and other security settings to identify potential issues."
    },
    {
      question: "Why is domain health important?",
      answer: "A healthy domain configuration is crucial for email deliverability. It ensures your emails are trusted by receiving servers, prevents spoofing, and maintains a good sender reputation."
    },
    {
      question: "How often should I scan my domain?",
      answer: "It's recommended to scan your domain whenever you make changes to your DNS records or email infrastructure. Regular periodic scans (e.g., monthly) can also help detect any unauthorized changes or issues."
    },
    {
      question: "What is a good security score?",
      answer: "A score of 8 or higher is considered excellent. Scores below 6 indicate potential security vulnerabilities or misconfigurations that should be addressed to improve deliverability and protection."
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
            <span className="text-gray-600">Domain Scanner</span>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="text-center pt-12 pb-16 max-w-3xl mx-auto">
            <p className="font-mono text-xs uppercase tracking-widest text-[#1240cc] mb-5">Free tool</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-black mb-5">Domain security scanner</h1>
            <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
              Comprehensive email authentication and security analysis. Check SPF, DKIM, DMARC,
              BIMI, MTA-STS and get actionable recommendations to improve your security score.
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
                      onKeyDown={(e) => e.key === 'Enter' && domain && scanDomain()}
                    />
                  </div>
                </div>

                <button
                  onClick={scanDomain}
                  disabled={!domain || loading}
                  className="w-full px-8 py-4 bg-[#1240cc] text-white font-semibold rounded-full hover:bg-[#0b34b4] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Scanning domain...
                    </span>
                  ) : (
                    'Scan Domain'
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
                      {results.domain || domain}
                    </h2>
                  </div>
                  <button
                    onClick={reset}
                    className="px-5 py-2.5 text-sm font-medium text-black border border-gray-300 rounded-full hover:border-[#1240cc] hover:text-[#1240cc] transition-all"
                  >
                    New Scan
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
                  {/* Overall Score */}
                  {results.score !== undefined && (
                    <div className="mb-12">
                      <div className="text-center">
                        <ScoreCircle score={results.score} />
                        <h3 className="text-lg font-semibold text-black mt-4">
                          Security Score
                        </h3>
                        <p className="text-sm text-gray-500">
                          {results.score >= 8 ? 'Excellent security configuration' :
                            results.score >= 6 ? 'Good configuration with room for improvement' :
                              results.score >= 4 ? 'Fair configuration, action recommended' : 'Poor configuration, immediate action needed'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Authentication Records */}
                  <div className="mb-12">
                    <h3 className="text-xl font-bold text-black mb-6">
                      Authentication Records Analysis
                    </h3>
                    <div className="space-y-4">
                      {/* SPF Section */}
                      <div className="border border-gray-200 rounded-xl">
                        <button
                          onClick={() => toggleSection('spf')}
                          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {results.spf?.exists ? (
                              <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                                <Check className="w-5 h-5 text-green-600" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center">
                                <X className="w-5 h-5 text-red-600" />
                              </div>
                            )}
                            <div className="text-left">
                              <span className="font-semibold text-black">SPF Record</span>
                              <p className="text-sm text-gray-500">Authorizes sending servers</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${results.spf?.exists
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                              }`}>
                              {results.spf?.exists ? 'Active' : 'Not Found'}
                            </span>
                            {expandedSections.spf ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                          </div>
                        </button>
                        {expandedSections.spf && results.spf && (
                          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                            {results.spf.record && (
                              <div className="mb-3">
                                <p className="text-sm font-medium text-black mb-2">Record:</p>
                                <div className="p-3 bg-white border border-gray-200 rounded-lg">
                                  <code className="text-xs text-black/80 font-mono break-all">
                                    {results.spf.record}
                                  </code>
                                </div>
                              </div>
                            )}
                            {results.spf.warnings && results.spf.warnings.length > 0 && (
                              <div className="mt-3">
                                <p className="text-sm font-medium text-yellow-700 mb-2">Warnings:</p>
                                <ul className="text-sm text-yellow-600 space-y-1">
                                  {results.spf.warnings.map((warning, i) => (
                                    <li key={i}>• {warning}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* DKIM Section */}
                      <div className="border border-gray-200 rounded-xl">
                        <button
                          onClick={() => toggleSection('dkim')}
                          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {results.dkim?.found > 0 ? (
                              <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                                <Check className="w-5 h-5 text-green-600" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center">
                                <X className="w-5 h-5 text-red-600" />
                              </div>
                            )}
                            <div className="text-left">
                              <span className="font-semibold text-black">DKIM Records</span>
                              <p className="text-sm text-gray-500">Cryptographic signatures</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${results.dkim?.found > 0
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                              }`}>
                              {results.dkim?.found > 0 ? `${results.dkim.found} Found` : 'Not Found'}
                            </span>
                            {expandedSections.dkim ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                          </div>
                        </button>
                        {expandedSections.dkim && results.dkim && (
                          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                            {results.dkim.selectors && results.dkim.selectors.length > 0 ? (
                              <div className="space-y-3">
                                <p className="text-sm font-medium text-black mb-2">Found Selectors:</p>
                                {results.dkim.selectors.map((selector, i) => (
                                  <div key={i} className="p-3 bg-white border border-gray-200 rounded-lg">
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium text-black">{selector.selector}</span>
                                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${selector.valid
                                          ? 'bg-green-50 text-green-700 border border-green-200'
                                          : 'bg-red-50 text-red-700 border border-red-200'
                                        }`}>
                                        {selector.valid ? 'Valid' : 'Invalid'}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">No DKIM records detected</p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* DMARC Section */}
                      <div className="border border-gray-200 rounded-xl">
                        <button
                          onClick={() => toggleSection('dmarc')}
                          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {results.dmarc?.exists ? (
                              <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                                <Check className="w-5 h-5 text-green-600" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center">
                                <X className="w-5 h-5 text-red-600" />
                              </div>
                            )}
                            <div className="text-left">
                              <span className="font-semibold text-black">DMARC Policy</span>
                              <p className="text-sm text-gray-500">Policy enforcement</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${results.dmarc?.exists
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                              }`}>
                              {results.dmarc?.exists ? `Policy: ${results.dmarc.policy}` : 'Not Found'}
                            </span>
                            {expandedSections.dmarc ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                          </div>
                        </button>
                        {expandedSections.dmarc && results.dmarc && (
                          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                            {results.dmarc.record && (
                              <div className="mb-3">
                                <p className="text-sm font-medium text-black mb-2">Record:</p>
                                <div className="p-3 bg-white border border-gray-200 rounded-lg">
                                  <code className="text-xs text-black/80 font-mono break-all">
                                    {results.dmarc.record}
                                  </code>
                                </div>
                              </div>
                            )}
                            {results.dmarc.policy && (
                              <div className="text-sm text-gray-500">
                                <strong>Policy:</strong> {results.dmarc.policy} ({results.dmarc.percentage || 100}%)
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* BIMI Section */}
                      <div className="border border-gray-200 rounded-xl">
                        <button
                          onClick={() => toggleSection('bimi')}
                          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {results.bimi?.exists ? (
                              <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                                <Check className="w-5 h-5 text-green-600" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center">
                                <FileText className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                            <div className="text-left">
                              <span className="font-semibold text-black">BIMI Record</span>
                              <p className="text-sm text-gray-500">Brand logo display</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${results.bimi?.exists
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-gray-50 text-gray-600 border border-gray-200'
                              }`}>
                              {results.bimi?.exists ? 'Configured' : 'Optional'}
                            </span>
                            {expandedSections.bimi ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                          </div>
                        </button>
                        {expandedSections.bimi && results.bimi && (
                          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                            {results.bimi.record ? (
                              <div>
                                <p className="text-sm font-medium text-black mb-2">Record:</p>
                                <div className="p-3 bg-white border border-gray-200 rounded-lg">
                                  <code className="text-xs text-black/80 font-mono break-all">
                                    {results.bimi.record}
                                  </code>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">BIMI not configured (optional for brand logo display)</p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* MTA-STS Section */}
                      <div className="border border-gray-200 rounded-xl">
                        <button
                          onClick={() => toggleSection('mta_sts')}
                          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {results.mta_sts?.exists ? (
                              <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                                <Check className="w-5 h-5 text-green-600" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center">
                                <Lock className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                            <div className="text-left">
                              <span className="font-semibold text-black">MTA-STS</span>
                              <p className="text-sm text-gray-500">TLS encryption policy</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${results.mta_sts?.exists
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-gray-50 text-gray-600 border border-gray-200'
                              }`}>
                              {results.mta_sts?.exists ? 'Configured' : 'Recommended'}
                            </span>
                            {expandedSections.mta_sts ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                          </div>
                        </button>
                        {expandedSections.mta_sts && results.mta_sts && (
                          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                            {results.mta_sts.dns ? (
                              <div className="space-y-2">
                                <div>
                                  <p className="text-sm font-medium text-black mb-1">DNS Record:</p>
                                  <p className="text-sm text-gray-500">{results.mta_sts.dns}</p>
                                </div>
                                {results.mta_sts.policy && (
                                  <div>
                                    <p className="text-sm font-medium text-black mb-1">Policy:</p>
                                    <p className="text-sm text-gray-500">{results.mta_sts.policy}</p>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">MTA-STS not configured (recommended for TLS enforcement)</p>
                            )}
                          </div>
                        )}
                      </div>
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
                            <div className="flex items-start gap-3">
                              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                  {rec}
                                </p>
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
                onClick={() => trackClick('tool_navigation', { from: 'domain-scanner', to: 'deliverability-score' })}
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
                href="/resources/tools/spf-checker"
                onClick={() => trackClick('tool_navigation', { from: 'domain-scanner', to: 'spf-checker' })}
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
                onClick={() => trackClick('tool_navigation', { from: 'domain-scanner', to: 'dkim-checker' })}
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
                href="/resources/tools/email-header-analyzer"
                onClick={() => trackClick('tool_navigation', { from: 'domain-scanner', to: 'email-header-analyzer' })}
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                  Email Header Analyzer
                </h3>
                <p className="text-sm text-gray-500">
                  Analyze email headers for authentication and routing information.
                </p>
              </Link>

              <Link
                href="/resources/tools/spam-checker"
                onClick={() => trackClick('tool_navigation', { from: 'domain-scanner', to: 'spam-checker' })}
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
                onClick={() => trackClick('tool_navigation', { from: 'domain-scanner', to: 'mailbox-calculator' })}
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
              Understanding domain security scanning
            </h2>

            <p className="text-base text-gray-500 leading-relaxed mb-8">
              Domain security scanning provides a comprehensive analysis of your email authentication setup,
              identifying vulnerabilities and configuration issues that could impact deliverability or expose
              your domain to spoofing attacks.
            </p>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-lg font-semibold text-black mb-4">
                  What we scan
                </h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Authentication records
                    </p>
                    <p className="text-sm text-gray-500">
                      SPF, DKIM, and DMARC validation for sender verification.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Advanced security
                    </p>
                    <p className="text-sm text-gray-500">
                      BIMI, MTA-STS, and TLS-RPT for enhanced protection.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      DNS infrastructure
                    </p>
                    <p className="text-sm text-gray-500">
                      MX records, A/AAAA records, and reverse DNS setup.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-black mb-4">
                  Why it matters
                </h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Prevent spoofing
                    </p>
                    <p className="text-sm text-gray-500">
                      Proper authentication prevents attackers from impersonating your domain.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Improve deliverability
                    </p>
                    <p className="text-sm text-gray-500">
                      Well-configured domains achieve better inbox placement rates.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Compliance requirements
                    </p>
                    <p className="text-sm text-gray-500">
                      Meet modern email provider requirements for bulk sending.
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
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="py-20 text-center max-w-xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-black mb-4">
              Need complete email infrastructure?
            </h2>
            <p className="text-base text-gray-500 mb-8 max-w-xl mx-auto">
              Infrabox provides everything you need for guaranteed deliverability and security
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="https://app.infrabox.software/signup"
                onClick={() => trackClick('tool_cta', { tool: 'domain-scanner', action: 'signup' })}
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