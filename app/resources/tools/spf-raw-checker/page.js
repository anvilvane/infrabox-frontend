'use client'

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { trackClick } from "@/lib/datafast";
import {
  FileText,
  Check,
  AlertTriangle,
  X,
  ArrowRight,
  Shield,
  Search,
  Copy,
  RefreshCw,
  AlertTriangle as Alert,
  Database,
  Globe,
  Dot,
  Plus,
  Minus
} from "lucide-react";

export default function SPFRawCheckerPage() {
  const [spfRecord, setSPFRecord] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [openItems, setOpenItems] = useState(new Set([0]));

  const analyzeSPF = async () => {
    trackClick('spf-raw-checker-analyze', { spfRecord });
    setLoading(true);

    try {
      const response = await fetch('/api/tools/spf-raw-checker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ spfRecord }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze SPF record');
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error analyzing SPF:', error);
      setResults({
        error: true,
        message: 'Unable to analyze SPF record. Please check the format and try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSPFRecord("");
    setResults(null);
  };

  const loadExample = () => {
    setSPFRecord("v=spf1 include:_spf.google.com include:spf.protection.outlook.com ip4:192.0.2.1 ip4:198.51.100.0/24 mx a -all");
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

  const getQualifierSymbol = (qualifier) => {
    switch (qualifier) {
      case '+': return (
        <div className="flex items-center gap-1">
          <Check className="w-4 h-4" />
          Pass
        </div>
      );
      case '-': return (
        <div className="flex items-center gap-1">
          <X className="w-4 h-4" />
          Fail
        </div>
      );
      case '~': return (
        <div className="flex items-center gap-1">
          <AlertTriangle className="w-4 h-4" />
          Softfail
        </div>
      );
      case '?': return (
        <div className="flex items-center gap-1">
          <Alert className="w-4 h-4" />
          Neutral
        </div>
      );
      default: return qualifier;
    }
  };

  const getQualifierColor = (qualifier) => {
    switch (qualifier) {
      case '+': return 'text-black';
      case '-': return 'text-black';
      case '~': return 'text-black';
      case '?': return 'text-black';
      default: return 'text-black';
    }
  };

  const faqs = [
    {
      question: "What is an SPF raw checker?",
      answer: "An SPF raw checker allows you to validate the syntax of an SPF record string without needing to publish it to DNS first. This is useful for testing new configurations or debugging complex records before they go live."
    },
    {
      question: "How do I use this tool?",
      answer: "Simply paste your SPF record string (starting with v=spf1) into the text area and click 'Analyze SPF Record'. We will check the syntax, count the number of DNS lookups, and identify any potential errors or warnings."
    },
    {
      question: "Does this tool check my live DNS record?",
      answer: "No, this tool analyzes the text you provide. If you want to check the live SPF record published on your domain, please use our standard SPF Checker tool."
    },
    {
      question: "Why is syntax validation important?",
      answer: "Even a small syntax error in your SPF record can cause email delivery failures. Validating the syntax before publishing ensures that your record is correctly formatted and will be interpreted correctly by receiving mail servers."
    }
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
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
              <span className="text-gray-600">SPF Raw Checker</span>
            </div>
          </div>
        </section>

        {/* Hero Section */}
        <section className="bg-white">
          <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
            <div className="text-center pt-12 pb-16 max-w-3xl mx-auto">
              <p className="font-mono text-xs uppercase tracking-widest text-[#1240cc] mb-5">Free tool</p>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-black mb-5">SPF record raw checker</h1>
              <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
                Analyze SPF record syntax and mechanisms. Validate SPF without DNS lookup.
              </p>
            </div>
          </div>
        </section>

        {/* Main Tool Section */}
        <section className="bg-white min-h-[600px]">
          <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8 pb-16">
            {!results ? (
              // Input Form
              <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-8 max-w-3xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-black mb-2">
                    Analyze SPF Record
                  </h2>
                  <p className="text-gray-500">
                    Paste an SPF record to validate syntax and analyze mechanisms
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-black">
                        SPF Record
                      </label>
                      <button
                        onClick={loadExample}
                        className="text-sm text-[#1240cc] hover:text-[#0b34b4]"
                      >
                        Load Example
                      </button>
                    </div>
                    <textarea
                      value={spfRecord}
                      onChange={(e) => setSPFRecord(e.target.value)}
                      placeholder="v=spf1 include:_spf.google.com ~all"
                      className="w-full px-4 py-3 border border-black/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1240cc] focus:border-[#1240cc] font-mono text-sm"
                      rows={4}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          if (spfRecord) analyzeSPF();
                        }
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter the complete SPF record including v=spf1
                    </p>
                  </div>

                  <button
                    onClick={analyzeSPF}
                    disabled={!spfRecord || loading}
                    className="w-full px-6 py-3 bg-[#1240cc] text-white font-semibold rounded-full hover:bg-[#0b34b4] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-black/10"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Analyze SPF Record
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>

                {/* Features Grid */}
                <div className="mt-12 grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <FileText className="w-6 h-6 text-[#1240cc]" />
                    </div>
                    <h3 className="font-semibold text-black mb-2">Syntax Check</h3>
                    <p className="text-sm text-gray-500">
                      Validate SPF record format
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Database className="w-6 h-6 text-[#1240cc]" />
                    </div>
                    <h3 className="font-semibold text-black mb-2">DNS Lookups</h3>
                    <p className="text-sm text-gray-500">
                      Count DNS lookup mechanisms
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Shield className="w-6 h-6 text-[#1240cc]" />
                    </div>
                    <h3 className="font-semibold text-black mb-2">Best Practices</h3>
                    <p className="text-sm text-gray-500">
                      Get optimization suggestions
                    </p>
                  </div>
                </div>

                {/* CTA Box */}
                <div className="mt-8 bg-black/5 rounded-2xl p-6 border border-black/5">
                  <h3 className="font-semibold text-black mb-2">
                    Why Analyze SPF Records?
                  </h3>
                  <p className="text-gray-500 mb-4">
                    SPF records can fail due to syntax errors, too many DNS lookups, or incorrect mechanisms. This tool helps identify issues before deploying to DNS.
                  </p>
                  <Link
                    href="https://app.infrabox.software/signup"
                    className="inline-flex items-center gap-2 text-[#1240cc] font-medium hover:text-[#0b34b4]"
                  >
                    Get SPF Management Help
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              // Results Display
              <div className="space-y-8 max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-black">Analysis Results</h2>
                    <button
                      onClick={reset}
                      className="px-4 py-2 bg-black/5 text-black rounded-full hover:bg-black/10 transition"
                    >
                      Analyze Another
                    </button>
                  </div>

                  {results.error ? (
                    <div className="bg-black/5 border border-black/10 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <X className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-black">Error</h3>
                          <p className="text-gray-500 mt-1">{results.message}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Status Overview */}
                      <div className="mb-6">
                        <div className="flex items-center gap-3 mb-4">
                          {results.valid ? (
                            <Check className="w-6 h-6 text-black" />
                          ) : (
                            <X className="w-6 h-6 text-black" />
                          )}
                          <h3 className="text-lg font-semibold">
                            SPF Record is {results.valid ? 'Valid' : 'Invalid'}
                          </h3>
                        </div>

                        <div className="bg-black/5 rounded-2xl p-4 mb-4">
                          <pre className="text-sm text-gray-500 overflow-x-auto font-mono whitespace-pre-wrap break-all">
                            {results.record}
                          </pre>
                        </div>

                        {/* Key Metrics */}
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="bg-black/5 rounded-2xl p-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500">DNS Lookups</span>
                              <Database className="w-4 h-4 text-black/40" />
                            </div>
                            <p className="text-2xl font-bold text-black">
                              {results.dnsLookupCount}/10
                            </p>
                          </div>

                          <div className="bg-black/5 rounded-2xl p-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500">Character Count</span>
                              <FileText className="w-4 h-4 text-black/40" />
                            </div>
                            <p className="text-2xl font-bold text-black">
                              {results.characterCount}
                            </p>
                          </div>

                          <div className="bg-black/5 rounded-2xl p-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500">All Policy</span>
                              <Shield className="w-4 h-4 text-black/40" />
                            </div>
                            <p className={`text-2xl font-bold ${getQualifierColor(results.all)}`}>
                              {results.all ? getQualifierSymbol(results.all) : 'None'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Mechanisms Analysis */}
                      {results.mechanisms && results.mechanisms.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-black mb-4">
                            Mechanisms Analysis
                          </h3>
                          <div className="space-y-2">
                            {results.mechanisms.map((mech, index) => (
                              <div key={index} className="bg-black/5 rounded-2xl p-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <span className={`font-mono text-sm ${getQualifierColor(mech.qualifier)}`}>
                                    {mech.qualifier}
                                  </span>
                                  <span className="font-medium text-black">
                                    {mech.type}
                                  </span>
                                  {mech.value && (
                                    <span className="text-sm text-gray-500">
                                      {mech.value}
                                    </span>
                                  )}
                                </div>
                                {['include', 'a', 'mx', 'ptr', 'exists'].includes(mech.type) && (
                                  <span className="text-xs text-black/50">
                                    DNS lookup
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Includes */}
                      {results.includes && results.includes.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-black mb-4">
                            Include Statements
                          </h3>
                          <div className="bg-black/5 border border-black/10 rounded-2xl p-4">
                            <ul className="space-y-2">
                              {results.includes.map((include, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <Globe className="w-4 h-4 text-black" />
                                  <code className="text-sm text-gray-500">{include}</code>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* IP Addresses */}
                      {results.ipAddresses && results.ipAddresses.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-black mb-4">
                            IP Addresses
                          </h3>
                          <div className="bg-black/5 rounded-2xl p-4">
                            <ul className="space-y-2">
                              {results.ipAddresses.map((ip, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <span className="text-xs font-medium text-black/50">
                                    IPv{ip.version}
                                  </span>
                                  <code className="text-sm text-gray-500">{ip.address}</code>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Errors */}
                      {results.errors && results.errors.length > 0 && (
                        <div className="bg-black/5 border border-black/10 rounded-2xl p-4 mb-6">
                          <h3 className="font-semibold text-black mb-3 flex items-center gap-2">
                            <X className="w-4 h-4" />
                            Errors
                          </h3>
                          <ul className="space-y-2">
                            {results.errors.map((error, index) => (
                              <li key={index} className="text-sm text-gray-500 flex items-start gap-2">
                                <X className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                {error}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Warnings */}
                      {results.warnings && results.warnings.length > 0 && (
                        <div className="bg-black/5 border border-black/10 rounded-2xl p-4 mb-6">
                          <h3 className="font-semibold text-black mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Warnings
                          </h3>
                          <ul className="space-y-2">
                            {results.warnings.map((warning, index) => (
                              <li key={index} className="text-sm text-gray-500 flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                {warning}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Recommendations */}
                      {results.recommendations && results.recommendations.length > 0 && (
                        <div className="space-y-3 mb-6">
                          <h3 className="font-semibold text-black">Recommendations</h3>
                          {results.recommendations.map((rec, index) => (
                            <div key={index} className="bg-black/5 rounded-2xl p-4">
                              <div className="flex items-start gap-3">
                                <Alert className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="font-medium text-black">{rec.message}</p>
                                  <p className="text-sm text-gray-500 mt-1">{rec.action}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* CTA */}
                      <div className="bg-gradient-to-r from-black/5 to-black/10 rounded-2xl p-6 border border-black/5">
                        <h3 className="font-semibold text-black mb-2">
                          Need Help Optimizing SPF?
                        </h3>
                        <p className="text-gray-500 mb-4">
                          Infrabox helps manage complex SPF records, consolidate includes, and maintain authentication while staying under limits.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Link
                            href="https://app.infrabox.software/signup"
                            className="px-6 py-2.5 bg-[#1240cc] text-white text-sm font-medium rounded-full hover:bg-[#0b34b4] transition text-center shadow-lg shadow-black/10"
                            onClick={() => trackClick('spf-raw-checker-cta-optimize')}
                          >
                            Optimize SPF Record
                          </Link>
                          <Link
                            href="/resources/tools/spf-generator"
                            className="px-6 py-2.5 border border-black/20 text-black text-sm font-medium rounded-full hover:bg-black/5 transition text-center"
                            onClick={() => trackClick('spf-raw-checker-cta-generate')}
                          >
                            Generate New SPF
                          </Link>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Related Tools Section */}
        <section className="bg-white border-t border-gray-200">
          <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
            <div className="py-16">
              <h2 className="text-2xl font-bold tracking-tight text-black mb-8">
                Related SPF tools
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Link href="/resources/tools/spf-checker" className="block group">
                  <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                    SPF Checker
                  </h3>
                  <p className="text-sm text-gray-500">
                    Check SPF records directly from DNS queries.
                  </p>
                </Link>
                <Link href="/resources/tools/spf-generator" className="block group">
                  <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                    SPF Generator
                  </h3>
                  <p className="text-sm text-gray-500">
                    Create properly formatted SPF records easily.
                  </p>
                </Link>
                <Link href="/resources/tools/deliverability-score" className="block group">
                  <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                    Deliverability Score
                  </h3>
                  <p className="text-sm text-gray-500">
                    Complete domain authentication analysis.
                  </p>
                </Link>
                <Link href="/resources/tools/dns-checker" className="block group">
                  <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                    DNS Checker
                  </h3>
                  <p className="text-sm text-gray-500">
                    Verify all email authentication DNS records.
                  </p>
                </Link>
                <Link href="/resources/tools/dkim-checker" className="block group">
                  <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                    DKIM Checker
                  </h3>
                  <p className="text-sm text-gray-500">
                    Validate DKIM signatures and keys.
                  </p>
                </Link>
                <Link href="/resources/tools/dmarc-checker" className="block group">
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
            <div className="py-16">
              <div className="max-w-4xl mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-black mb-4">
                  SPF record analysis guide
                </h2>
                <p className="text-base text-gray-500 leading-relaxed">
                  Understanding SPF mechanisms, qualifiers, and common optimization techniques for better email authentication.
                </p>
              </div>

              <div className="space-y-12">
                <div>
                  <h3 className="text-xl font-semibold text-black mb-6">
                    SPF mechanism types
                  </h3>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <Dot className="w-6 h-6 text-[#1240cc] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-black mb-1">include: - Reference other SPF records</p>
                        <p className="text-sm text-gray-500">Authorizes servers from another domain's SPF record. Counts as one DNS lookup.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Dot className="w-6 h-6 text-[#1240cc] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-black mb-1">ip4/ip6 - Direct IP authorization</p>
                        <p className="text-sm text-gray-500">Directly authorizes specific IPv4 or IPv6 addresses. No DNS lookup required.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Dot className="w-6 h-6 text-[#1240cc] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-black mb-1">a/mx - Use domain records</p>
                        <p className="text-sm text-gray-500">Authorizes servers listed in A or MX records. Each counts as one DNS lookup.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Dot className="w-6 h-6 text-[#1240cc] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-black mb-1">all - Catch-all policy</p>
                        <p className="text-sm text-gray-500">Defines what to do with emails from unmatched servers. Usually ~all or -all.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-black mb-6">
                    Understanding qualifiers
                  </h3>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <Dot className="w-6 h-6 text-[#1240cc] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-black mb-1">+ Pass (default) - Authorize the server</p>
                        <p className="text-sm text-gray-500">If no qualifier is specified, + is assumed. Emails pass SPF authentication.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Dot className="w-6 h-6 text-[#1240cc] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-black mb-1">~ Softfail - Mark as suspicious</p>
                        <p className="text-sm text-gray-500">Recommended for ~all. Emails are marked but not rejected.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Dot className="w-6 h-6 text-[#1240cc] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-black mb-1">- Fail - Reject the server</p>
                        <p className="text-sm text-gray-500">Strong policy that rejects emails from unauthorized servers.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-black mb-6">
                    The 10 DNS lookup limit
                  </h3>
                  <div className="space-y-4 text-sm text-gray-500 leading-relaxed">
                    <p>
                      The most common SPF failure is exceeding the 10 DNS lookup limit. Each include, a, mx, ptr, and exists
                      mechanism counts toward this limit. Nested includes also count - a single include statement might trigger multiple lookups.
                    </p>
                    <p>
                      Large organizations often hit this limit when including multiple third-party services like Google Workspace,
                      Microsoft 365, Mailchimp, and SendGrid. The solution is to use IP addresses directly or consolidate includes through SPF flattening.
                    </p>
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
          <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4">
            <div className="py-20 text-center max-w-xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight text-black mb-4">
                Simplify SPF management
              </h2>
              <p className="text-base text-gray-500 mb-8 max-w-xl mx-auto">
                Infrabox automatically optimizes SPF records and manages the 10-lookup limit
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="https://app.infrabox.software/signup"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 text-[#1240cc] rounded-full transition-all text-sm font-semibold shadow-lg shadow-black/10"
                  onClick={() => trackClick('spf-raw-checker-cta-trial')}
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/#book-call"
                  className="inline-flex items-center justify-center px-6 py-3 border border-white text-white hover:bg-white/10 rounded-full transition-all text-sm font-semibold"
                  onClick={() => trackClick('spf-raw-checker-cta-demo')}
                >
                  Book Demo
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}