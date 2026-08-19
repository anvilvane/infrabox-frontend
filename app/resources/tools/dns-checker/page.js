'use client'

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { trackClick } from '@/lib/datafast';
import { Input } from "@/components/ui/input";
import {
  Globe,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Server,
  Mail,
  Shield,
  RefreshCw,
  Copy,
  Database,
  Lock,
  FileText,
  Network,
} from "lucide-react";

export default function DNSCheckerPage() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [copiedRecord, setCopiedRecord] = useState(null);
  const [openItems, setOpenItems] = useState(new Set([0]));

  const checkDNS = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/tools/dns-checker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain }),
      });

      if (!response.ok) {
        throw new Error('Failed to check DNS records');
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error checking DNS:', error);
      setResults({
        error: true,
        message: 'Unable to check DNS records. Please verify the domain and try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setDomain("");
    setResults(null);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedRecord(id);
    setTimeout(() => setCopiedRecord(null), 2000);
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

  const hasRecords = (records) => {
    return records && (
      records.A?.length > 0 ||
      records.AAAA?.length > 0 ||
      records.MX?.length > 0 ||
      records.TXT?.length > 0 ||
      records.NS?.length > 0 ||
      records.CNAME?.length > 0 ||
      records.SOA ||
      records.CAA?.length > 0
    );
  };

  const faqs = [
    {
      question: "What are DNS records?",
      answer: "DNS (Domain Name System) records are instructions that live in authoritative DNS servers and provide information about a domain, such as its IP address or mail servers."
    },
    {
      question: "What is an A record?",
      answer: "An A (Address) record points a domain or subdomain to an IPv4 address. It's the most common type of DNS record, used to map domain names to the server hosting the website."
    },
    {
      question: "What is an MX record?",
      answer: "MX (Mail Exchange) records specify the mail servers responsible for accepting email on behalf of your domain. They include a priority value to determine the order in which servers should be tried."
    },
    {
      question: "How long does DNS propagation take?",
      answer: "DNS propagation typically takes 24-48 hours, although many changes are visible much sooner. The time depends on the TTL (Time to Live) value set on your records and ISP caching."
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
            <span className="text-gray-600">DNS Checker</span>
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
              DNS record checker
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
              Comprehensive DNS record lookup and analysis. Check all DNS records for any domain
              including A, AAAA, MX, TXT, NS, CNAME and email authentication records.
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
                      onKeyDown={(e) => e.key === 'Enter' && domain && checkDNS()}
                    />
                  </div>
                </div>

                <button
                  onClick={checkDNS}
                  disabled={!domain || loading}
                  className="w-full px-8 py-4 bg-[#1240cc] text-white font-semibold rounded-full hover:bg-[#0b34b4] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Checking DNS records...
                    </span>
                  ) : (
                    'Check DNS Records'
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
                      DNS ANALYSIS RESULTS
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
                <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-red-900">Error</h3>
                      <p className="text-red-700 mt-1">{results.message}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Analysis Overview */}
                  {results.analysis && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                      <div className={`p-4 border border-gray-200 rounded-xl text-center ${results.analysis.hasWebsite ? 'bg-green-50' : 'bg-gray-50'}`}>
                        <Globe className={`w-6 h-6 mx-auto mb-2 ${results.analysis.hasWebsite ? 'text-green-600' : 'text-gray-400'}`} />
                        <p className="text-sm font-medium text-black">Website</p>
                        <p className="text-xs text-gray-500">
                          {results.analysis.hasWebsite ? 'Active' : 'Not Found'}
                        </p>
                      </div>
                      <div className={`p-4 border border-gray-200 rounded-xl text-center ${results.analysis.hasEmail ? 'bg-green-50' : 'bg-gray-50'}`}>
                        <Mail className={`w-6 h-6 mx-auto mb-2 ${results.analysis.hasEmail ? 'text-green-600' : 'text-gray-400'}`} />
                        <p className="text-sm font-medium text-black">Email</p>
                        <p className="text-xs text-gray-500">
                          {results.analysis.hasEmail ? 'Configured' : 'Missing'}
                        </p>
                      </div>
                      <div className={`p-4 border border-gray-200 rounded-xl text-center ${results.analysis.hasIPv6 ? 'bg-green-50' : 'bg-gray-50'}`}>
                        <Network className={`w-6 h-6 mx-auto mb-2 ${results.analysis.hasIPv6 ? 'text-green-600' : 'text-gray-400'}`} />
                        <p className="text-sm font-medium text-black">IPv6</p>
                        <p className="text-xs text-gray-500">
                          {results.analysis.hasIPv6 ? 'Supported' : 'Not Found'}
                        </p>
                      </div>
                      <div className={`p-4 border border-gray-200 rounded-xl text-center ${results.analysis.hasDNSSEC ? 'bg-green-50' : 'bg-gray-50'}`}>
                        <Lock className={`w-6 h-6 mx-auto mb-2 ${results.analysis.hasDNSSEC ? 'text-green-600' : 'text-gray-400'}`} />
                        <p className="text-sm font-medium text-black">DNSSEC</p>
                        <p className="text-xs text-gray-500">
                          {results.analysis.hasDNSSEC ? 'Enabled' : 'Disabled'}
                        </p>
                      </div>
                      <div className={`p-4 border border-gray-200 rounded-xl text-center ${results.analysis.hasCAA ? 'bg-green-50' : 'bg-gray-50'}`}>
                        <Shield className={`w-6 h-6 mx-auto mb-2 ${results.analysis.hasCAA ? 'text-green-600' : 'text-gray-400'}`} />
                        <p className="text-sm font-medium text-black">CAA</p>
                        <p className="text-xs text-gray-500">
                          {results.analysis.hasCAA ? 'Configured' : 'Missing'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* DNS Records */}
                  {hasRecords(results.records) && (
                    <div className="mb-12">
                      <h3 className="text-xl font-bold text-black mb-6">
                        DNS Records
                      </h3>
                      <div className="space-y-6">
                        {/* A Records */}
                        {results.records.A && results.records.A.length > 0 && (
                          <div className="p-6 bg-white border border-gray-200 rounded-xl hover:border-[#1240cc] transition-colors">
                            <h4 className="text-base font-semibold text-black mb-4 flex items-center gap-2">
                              <Server className="w-5 h-5 text-blue-600" />
                              A Records (IPv4)
                            </h4>
                            <div className="space-y-3">
                              {results.records.A.map((record, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <code className="text-sm text-black/80 font-mono">{record}</code>
                                  <button
                                    onClick={() => copyToClipboard(record, `a-${index}`)}
                                    className="p-2 text-gray-400 hover:text-[#1240cc] transition-colors"
                                  >
                                    {copiedRecord === `a-${index}` ? (
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                    ) : (
                                      <Copy className="w-4 h-4" />
                                    )}
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* AAAA Records */}
                        {results.records.AAAA && results.records.AAAA.length > 0 && (
                          <div className="p-6 bg-white border border-gray-200 rounded-xl hover:border-[#1240cc] transition-colors">
                            <h4 className="text-base font-semibold text-black mb-4 flex items-center gap-2">
                              <Server className="w-5 h-5 text-purple-600" />
                              AAAA Records (IPv6)
                            </h4>
                            <div className="space-y-3">
                              {results.records.AAAA.map((record, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <code className="text-sm text-black/80 font-mono break-all">{record}</code>
                                  <button
                                    onClick={() => copyToClipboard(record, `aaaa-${index}`)}
                                    className="p-2 text-gray-400 hover:text-[#1240cc] transition-colors flex-shrink-0"
                                  >
                                    {copiedRecord === `aaaa-${index}` ? (
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                    ) : (
                                      <Copy className="w-4 h-4" />
                                    )}
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* MX Records */}
                        {results.records.MX && results.records.MX.length > 0 && (
                          <div className="p-6 bg-white border border-gray-200 rounded-xl hover:border-[#1240cc] transition-colors">
                            <h4 className="text-base font-semibold text-black mb-4 flex items-center gap-2">
                              <Mail className="w-5 h-5 text-green-600" />
                              MX Records (Mail)
                            </h4>
                            <div className="space-y-3">
                              {results.records.MX.map((record, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <div className="flex-1">
                                    <span className="text-xs font-medium text-gray-500 block mb-1">Priority: {record.priority}</span>
                                    <code className="text-sm text-black/80 font-mono">{record.exchange}</code>
                                  </div>
                                  <button
                                    onClick={() => copyToClipboard(record.exchange, `mx-${index}`)}
                                    className="p-2 text-gray-400 hover:text-[#1240cc] transition-colors"
                                  >
                                    {copiedRecord === `mx-${index}` ? (
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                    ) : (
                                      <Copy className="w-4 h-4" />
                                    )}
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* TXT Records */}
                        {results.records.TXT && results.records.TXT.length > 0 && (
                          <div className="p-6 bg-white border border-gray-200 rounded-xl hover:border-[#1240cc] transition-colors">
                            <h4 className="text-base font-semibold text-black mb-4 flex items-center gap-2">
                              <FileText className="w-5 h-5 text-orange-600" />
                              TXT Records
                            </h4>
                            <div className="space-y-3">
                              {results.records.TXT.map((record, index) => (
                                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-start justify-between gap-3">
                                    <code className="text-xs text-black/80 font-mono break-all flex-1 leading-relaxed">
                                      {record}
                                    </code>
                                    <button
                                      onClick={() => copyToClipboard(record, `txt-${index}`)}
                                      className="p-2 text-gray-400 hover:text-[#1240cc] transition-colors flex-shrink-0"
                                    >
                                      {copiedRecord === `txt-${index}` ? (
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                      ) : (
                                        <Copy className="w-4 h-4" />
                                      )}
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* NS Records */}
                        {results.records.NS && results.records.NS.length > 0 && (
                          <div className="p-6 bg-white border border-gray-200 rounded-xl hover:border-[#1240cc] transition-colors">
                            <h4 className="text-base font-semibold text-black mb-4 flex items-center gap-2">
                              <Globe className="w-5 h-5 text-indigo-600" />
                              NS Records (Name Servers)
                            </h4>
                            <div className="space-y-2">
                              {results.records.NS.map((record, index) => (
                                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                  <code className="text-sm text-black/80 font-mono">{record}</code>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Email Authentication Records */}
                  {results.emailRecords && (
                    <div className="mb-12">
                      <h3 className="text-xl font-bold text-black mb-6">
                        Email Authentication Records
                      </h3>
                      <div className="space-y-4">
                        {/* SPF */}
                        <div className="p-6 bg-white border border-gray-200 rounded-xl hover:border-[#1240cc] transition-colors">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <h4 className="text-base font-semibold text-black">SPF Record</h4>
                              {results.emailRecords.spf ? (
                                <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                </div>
                              ) : (
                                <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center">
                                  <XCircle className="w-5 h-5 text-red-600" />
                                </div>
                              )}
                            </div>
                            {results.emailRecords.spf && (
                              <Link
                                href="/resources/tools/spf-checker"
                                onClick={() => trackClick('tool_navigation', { from: 'dns-checker', to: 'spf-checker' })}
                                className="text-sm text-[#1240cc] hover:text-[#0b34b4] transition-colors font-medium"
                              >
                                Analyze SPF →
                              </Link>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mb-3">
                            Specifies which mail servers are authorized to send email for your domain
                          </p>
                          {results.emailRecords.spf ? (
                            <div className="p-3 bg-white border border-gray-200 rounded-lg">
                              <code className="text-xs text-black/80 font-mono break-all">
                                {results.emailRecords.spf}
                              </code>
                            </div>
                          ) : (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                              <p className="text-sm text-red-700">No SPF record found</p>
                            </div>
                          )}
                        </div>

                        {/* DKIM */}
                        <div className="p-6 bg-white border border-gray-200 rounded-xl hover:border-[#1240cc] transition-colors">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <h4 className="text-base font-semibold text-black">DKIM Records</h4>
                              {results.emailRecords.dkim && results.emailRecords.dkim.length > 0 ? (
                                <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                </div>
                              ) : (
                                <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center">
                                  <XCircle className="w-5 h-5 text-red-600" />
                                </div>
                              )}
                            </div>
                            {results.emailRecords.dkim && results.emailRecords.dkim.length > 0 && (
                              <Link
                                href="/resources/tools/dkim-checker"
                                onClick={() => trackClick('tool_navigation', { from: 'dns-checker', to: 'dkim-checker' })}
                                className="text-sm text-[#1240cc] hover:text-[#0b34b4] transition-colors font-medium"
                              >
                                Analyze DKIM →
                              </Link>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mb-3">
                            Digital signature that verifies email authenticity
                          </p>
                          {results.emailRecords.dkim && results.emailRecords.dkim.length > 0 ? (
                            <div className="space-y-2">
                              {results.emailRecords.dkim.map((dkim, index) => (
                                <div key={index} className="p-3 bg-white border border-gray-200 rounded-lg">
                                  <span className="text-sm font-medium text-black">{dkim.selector}:</span>
                                  <span className="text-sm text-gray-500 ml-2">Found</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                              <p className="text-sm text-red-700">No DKIM records found</p>
                            </div>
                          )}
                        </div>

                        {/* DMARC */}
                        <div className="p-6 bg-white border border-gray-200 rounded-xl hover:border-[#1240cc] transition-colors">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <h4 className="text-base font-semibold text-black">DMARC Policy</h4>
                              {results.emailRecords.dmarc ? (
                                <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                </div>
                              ) : (
                                <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center">
                                  <XCircle className="w-5 h-5 text-red-600" />
                                </div>
                              )}
                            </div>
                            {results.emailRecords.dmarc && (
                              <Link
                                href="/resources/tools/dmarc-checker"
                                onClick={() => trackClick('tool_navigation', { from: 'dns-checker', to: 'dmarc-checker' })}
                                className="text-sm text-[#1240cc] hover:text-[#0b34b4] transition-colors font-medium"
                              >
                                Analyze DMARC →
                              </Link>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mb-3">
                            Tells receivers what to do with emails that fail authentication
                          </p>
                          {results.emailRecords.dmarc ? (
                            <div className="p-3 bg-white border border-gray-200 rounded-lg">
                              <code className="text-xs text-black/80 font-mono break-all">
                                {results.emailRecords.dmarc}
                              </code>
                            </div>
                          ) : (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                              <p className="text-sm text-red-700">No DMARC policy found</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Warnings */}
                  {results.warnings && results.warnings.length > 0 && (
                    <div className="mb-12">
                      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
                        <h3 className="text-base font-semibold text-yellow-900 mb-4 flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5" />
                          Configuration Warnings
                        </h3>
                        <div className="space-y-2">
                          {results.warnings.map((warning, index) => (
                            <div key={index} className="text-sm text-yellow-700 leading-relaxed">
                              • {warning}
                            </div>
                          ))}
                        </div>
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
                          <div key={index} className="p-6 bg-blue-50 border border-blue-200 rounded-xl">
                            <p className="text-sm text-blue-700 leading-relaxed">
                              {rec}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
                  Infrabox provides 24/7 DNS monitoring with instant alerts for unauthorized changes.
                </p>
              </div>
              <a
                href="https://app.infrabox.software/signup"
                onClick={() => trackClick('tool_cta_banner', { tool: 'dns-checker' })}
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
                onClick={() => trackClick('tool_navigation', { from: 'dns-checker', to: 'spf-checker' })}
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
                onClick={() => trackClick('tool_navigation', { from: 'dns-checker', to: 'dkim-checker' })}
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
                href="/resources/tools/dns-validator"
                onClick={() => trackClick('tool_navigation', { from: 'dns-checker', to: 'dns-validator' })}
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
                href="/resources/tools/deliverability-score"
                onClick={() => trackClick('tool_navigation', { from: 'dns-checker', to: 'deliverability-score' })}
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                  Deliverability Score
                </h3>
                <p className="text-sm text-gray-500">
                  Analyze your domain's email deliverability health score.
                </p>
              </Link>

              <Link
                href="/resources/tools/dmarc-checker"
                onClick={() => trackClick('tool_navigation', { from: 'dns-checker', to: 'dmarc-checker' })}
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
                href="/resources/tools/spam-checker"
                onClick={() => trackClick('tool_navigation', { from: 'dns-checker', to: 'spam-checker' })}
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                  Spam Score Checker
                </h3>
                <p className="text-sm text-gray-500">
                  Check if your emails are likely to be marked as spam.
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
              Understanding DNS records
            </h2>

            <p className="text-base text-gray-500 leading-relaxed mb-8">
              DNS records are the backbone of internet communication, directing traffic to the correct servers
              and enabling essential services like email delivery, website hosting, and domain verification.
            </p>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-lg font-semibold text-black mb-4">
                  Essential record types
                </h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      A & AAAA Records
                    </p>
                    <p className="text-sm text-gray-500">
                      Map your domain to IPv4 and IPv6 addresses for website hosting.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      MX Records
                    </p>
                    <p className="text-sm text-gray-500">
                      Direct email to your mail servers with priority routing.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      TXT Records
                    </p>
                    <p className="text-sm text-gray-500">
                      Store verification data, SPF, DKIM, and DMARC policies.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-black mb-4">
                  Best practices
                </h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Regular monitoring
                    </p>
                    <p className="text-sm text-gray-500">
                      Check DNS records regularly to detect unauthorized changes.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Proper TTL values
                    </p>
                    <p className="text-sm text-gray-500">
                      Set appropriate time-to-live values based on change frequency.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Backup configuration
                    </p>
                    <p className="text-sm text-gray-500">
                      Keep backups of DNS settings before making changes.
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
      <section className="bg-gray-50 border-t border-gray-200">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="py-20 text-center max-w-xl mx-auto">
            <p className="font-mono text-xs uppercase tracking-widest text-[#1240cc] mb-5">Get started</p>
            <h2 className="text-3xl font-bold tracking-tight text-black mb-4">
              Need DNS monitoring and management?
            </h2>
            <p className="text-base text-gray-500 mb-8">
              Infrabox provides 24/7 DNS monitoring with instant alerts for unauthorized changes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://app.infrabox.software/signup"
                onClick={() => trackClick('tool_cta', { tool: 'dns-checker', action: 'signup' })}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1240cc] text-white text-sm font-semibold rounded-full hover:bg-[#0b34b4] transition-colors"
              >
                Get Started
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </a>
              <Link
                href="/learn/dns-setup-guide"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-black text-sm font-semibold rounded-full hover:border-gray-400 transition-colors"
              >
                DNS setup guide
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}