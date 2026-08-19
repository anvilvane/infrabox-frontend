'use client'

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { trackClick } from '@/lib/datafast';
import { Input } from "@/components/ui/input";
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Server,
  Key,
  FileCheck,
  Copy,
  RefreshCw,
  Info,
  Mail,
} from "lucide-react";

export default function DNSValidatorPage() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [copiedRecord, setCopiedRecord] = useState(null);
  const [openItems, setOpenItems] = useState(new Set([0]));

  const validateDNS = async () => {
    setLoading(true);

    try {
      // Make real API calls to check DNS records
      const [spfResponse, dkimResponse, dmarcResponse] = await Promise.all([
        fetch('/api/tools/spf-checker', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domain })
        }),
        fetch('/api/tools/dkim-checker', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domain, autoDetect: true })
        }),
        fetch('/api/tools/dmarc-checker', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domain })
        })
      ]);

      const [spfData, dkimData, dmarcData] = await Promise.all([
        spfResponse.json(),
        dkimResponse.json(),
        dmarcResponse.json()
      ]);

      // Also check MX records using the domain scanner API
      const scanResponse = await fetch('/api/tools/domain-scanner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain })
      });
      const scanData = await scanResponse.json();

      const results = {
        domain: domain,
        timestamp: new Date().toISOString(),
        records: {
          spf: {
            found: !!spfData.exists,
            value: spfData.record || null,
            valid: !!spfData.valid,
            issues: spfData.analysis?.warnings || [],
            recommendation: !spfData.exists ? "v=spf1 include:_spf.google.com ~all" : null
          },
          dkim: {
            found: !!(dkimData.records && Array.isArray(dkimData.records) && dkimData.records.length > 0),
            selector: dkimData.records?.[0]?.selector || null,
            value: dkimData.records?.[0]?.record || null,
            valid: !!(dkimData.records?.[0]?.valid),
            issues: dkimData.records?.[0]?.analysis?.warnings || [],
            recommendation: (!dkimData.records || dkimData.records.length === 0) ? "Configure DKIM with your email service provider" : null
          },
          dmarc: {
            found: !!dmarcData.exists,
            value: dmarcData.record || null,
            valid: !!dmarcData.valid,
            policy: dmarcData.policy || null,
            issues: Array.isArray(dmarcData.issues) ? dmarcData.issues : dmarcData.warnings || [],
            recommendation: !dmarcData.exists ? `v=DMARC1; p=quarantine; rua=mailto:dmarc@${domain}` : null
          },
          mx: {
            found: !!scanData.mx?.exists,
            records: scanData.mx?.records?.map(r => ({
              priority: r.priority,
              server: r.exchange
            })) || [],
            valid: !!scanData.mx?.exists
          }
        }
      };

      // Add additional validation messages
      if (results.records.dmarc.found && results.records.dmarc.policy === "none") {
        results.records.dmarc.issues.push("DMARC policy is set to 'none' - not protecting domain");
      }

      setResults(results);
    } catch (error) {
      console.error('DNS validation error:', error);
      setResults({
        domain: domain,
        error: true,
        message: 'Failed to validate DNS records'
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, recordType) => {
    navigator.clipboard.writeText(text);
    setCopiedRecord(recordType);
    setTimeout(() => setCopiedRecord(null), 2000);
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

  const getStatusIcon = (record) => {
    if (!record.found) return <XCircle className="w-5 h-5 text-red-500" />;
    if (!record.valid) return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    return <CheckCircle className="w-5 h-5 text-green-500" />;
  };

  const getStatusText = (record) => {
    if (!record.found) return "Not Found";
    if (!record.valid) return "Invalid";
    return "Valid";
  };

  const faqs = [
    {
      question: "Why is DNS validation important?",
      answer: "DNS validation ensures your email authentication records (SPF, DKIM, DMARC) are correctly configured, which is crucial for email deliverability and preventing domain spoofing."
    },
    {
      question: "What records does this tool check?",
      answer: "This tool validates SPF (Sender Policy Framework), DKIM (DomainKeys Identified Mail), DMARC (Domain-based Message Authentication, Reporting, and Conformance), and MX (Mail Exchange) records."
    },
    {
      question: "How often should I validate my DNS records?",
      answer: "It's recommended to validate your DNS records whenever you make changes to your email infrastructure or DNS configuration. Regular checks help ensure continuous email deliverability."
    },
    {
      question: "Can this tool fix my DNS issues?",
      answer: "While this tool identifies issues and provides recommendations, you'll need to log in to your DNS provider's dashboard (e.g., GoDaddy, Cloudflare, AWS Route53) to make the actual changes."
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
            <span className="text-gray-600">DNS Validator</span>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="text-center pt-12 pb-16 max-w-3xl mx-auto">
            <p className="font-mono text-xs uppercase tracking-widest text-[#1240cc] mb-5">Free tool</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-black mb-5">
              DNS records validator
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
              Comprehensive validation of your SPF, DKIM, and DMARC records. Ensure optimal
              email deliverability with proper DNS authentication configuration.
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
                    Domain to validate
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
                      onKeyDown={(e) => e.key === 'Enter' && domain && validateDNS()}
                    />
                  </div>
                </div>

                <button
                  onClick={validateDNS}
                  disabled={!domain || loading}
                  className="w-full px-8 py-4 bg-[#1240cc] text-white font-semibold rounded-full hover:bg-[#0b34b4] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Validating DNS records...
                    </span>
                  ) : (
                    'Validate DNS Records'
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
                      VALIDATION RESULTS
                    </p>
                    <h2 className="text-3xl font-bold text-black">
                      {results.domain}
                    </h2>
                  </div>
                  <button
                    onClick={reset}
                    className="px-5 py-2.5 text-sm font-medium text-black border border-gray-300 rounded-full hover:border-[#1240cc] hover:text-[#1240cc] transition-all"
                  >
                    New Validation
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
                <>
                  {/* Quick Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="p-4 border border-gray-200 rounded-xl text-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${results.records.spf.found && results.records.spf.valid ? 'bg-green-50' : 'bg-red-50'
                        }`}>
                        <Server className={`w-5 h-5 ${results.records.spf.found && results.records.spf.valid ? 'text-green-600' : 'text-red-600'
                          }`} />
                      </div>
                      <p className="text-sm font-medium text-black">SPF</p>
                      <p className="text-xs text-gray-500">
                        {getStatusText(results.records.spf)}
                      </p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-xl text-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${results.records.dkim.found && results.records.dkim.valid ? 'bg-green-50' : 'bg-red-50'
                        }`}>
                        <Key className={`w-5 h-5 ${results.records.dkim.found && results.records.dkim.valid ? 'text-green-600' : 'text-red-600'
                          }`} />
                      </div>
                      <p className="text-sm font-medium text-black">DKIM</p>
                      <p className="text-xs text-gray-500">
                        {getStatusText(results.records.dkim)}
                      </p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-xl text-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${results.records.dmarc.found && results.records.dmarc.valid ? 'bg-green-50' : 'bg-red-50'
                        }`}>
                        <FileCheck className={`w-5 h-5 ${results.records.dmarc.found && results.records.dmarc.valid ? 'text-green-600' : 'text-red-600'
                          }`} />
                      </div>
                      <p className="text-sm font-medium text-black">DMARC</p>
                      <p className="text-xs text-gray-500">
                        {getStatusText(results.records.dmarc)}
                      </p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-xl text-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${results.records.mx.found && results.records.mx.valid ? 'bg-green-50' : 'bg-red-50'
                        }`}>
                        <Mail className={`w-5 h-5 ${results.records.mx.found && results.records.mx.valid ? 'text-green-600' : 'text-red-600'
                          }`} />
                      </div>
                      <p className="text-sm font-medium text-black">MX</p>
                      <p className="text-xs text-gray-500">
                        {getStatusText(results.records.mx)}
                      </p>
                    </div>
                  </div>

                  {/* SPF Record */}
                  <div className="p-6 bg-white border border-gray-200 rounded-xl hover:border-[#1240cc] transition-colors mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-semibold text-black flex items-center gap-2">
                        <Server className="w-5 h-5 text-blue-600" />
                        SPF Record
                      </h3>
                      {getStatusIcon(results.records.spf)}
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                      Specifies which mail servers are authorized to send email for your domain
                    </p>

                    {results.records.spf.found ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-white border border-gray-200 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-500 mb-2">Current Record:</p>
                              <code className="text-xs text-black/80 font-mono break-all">{results.records.spf.value}</code>
                            </div>
                            <button
                              onClick={() => copyToClipboard(results.records.spf.value, 'spf')}
                              className="ml-4 p-2 text-gray-400 hover:text-[#1240cc] transition-colors"
                            >
                              {copiedRecord === 'spf' ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {results.records.spf.issues.length > 0 && (
                          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="font-medium text-yellow-800 mb-2">Issues Found:</p>
                            <ul className="space-y-1">
                              {results.records.spf.issues.map((issue, index) => (
                                <li key={index} className="text-sm text-yellow-700">• {issue}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-700">No SPF record found for this domain.</p>
                        </div>
                        {results.records.spf.recommendation && (
                          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="font-medium text-blue-800 mb-2">Recommended Record:</p>
                            <div className="flex items-start justify-between">
                              <code className="text-xs text-blue-700 font-mono break-all flex-1">{results.records.spf.recommendation}</code>
                              <button
                                onClick={() => copyToClipboard(results.records.spf.recommendation, 'spf-rec')}
                                className="ml-4 p-2 text-blue-500 hover:text-blue-700 transition-colors"
                              >
                                {copiedRecord === 'spf-rec' ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* DKIM Record */}
                  <div className="p-6 bg-white border border-gray-200 rounded-xl hover:border-[#1240cc] transition-colors mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-semibold text-black flex items-center gap-2">
                        <Key className="w-5 h-5 text-green-600" />
                        DKIM Record
                      </h3>
                      {getStatusIcon(results.records.dkim)}
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                      Digital signature that verifies email authenticity
                    </p>

                    {results.records.dkim.found ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-white border border-gray-200 rounded-lg">
                          <p className="text-sm font-medium text-gray-500 mb-2">Selector: {results.records.dkim.selector}</p>
                          <div className="flex items-start justify-between">
                            <code className="text-xs text-black/80 font-mono break-all flex-1">{results.records.dkim.value.substring(0, 50)}...</code>
                            <button
                              onClick={() => copyToClipboard(results.records.dkim.value, 'dkim')}
                              className="ml-4 p-2 text-gray-400 hover:text-[#1240cc] transition-colors"
                            >
                              {copiedRecord === 'dkim' ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {results.records.dkim.issues.length > 0 && (
                          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="font-medium text-yellow-800 mb-2">Issues Found:</p>
                            <ul className="space-y-1">
                              {results.records.dkim.issues.map((issue, index) => (
                                <li key={index} className="text-sm text-yellow-700">• {issue}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-700">No DKIM record found.</p>
                        </div>
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-700">
                            DKIM records are specific to your email service provider. Contact your provider to get the correct DKIM configuration.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* DMARC Record */}
                  <div className="p-6 bg-white border border-gray-200 rounded-xl hover:border-[#1240cc] transition-colors mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-semibold text-black flex items-center gap-2">
                        <FileCheck className="w-5 h-5 text-purple-600" />
                        DMARC Policy
                      </h3>
                      {getStatusIcon(results.records.dmarc)}
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                      Tells receivers what to do with emails that fail authentication
                    </p>

                    {results.records.dmarc.found ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-white border border-gray-200 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-500 mb-2">Current Policy:</p>
                              <code className="text-xs text-black/80 font-mono break-all">{results.records.dmarc.value}</code>
                              <p className="text-sm text-gray-500 mt-3">
                                Policy Action: <span className="font-medium text-black">{results.records.dmarc.policy}</span>
                              </p>
                            </div>
                            <button
                              onClick={() => copyToClipboard(results.records.dmarc.value, 'dmarc')}
                              className="ml-4 p-2 text-gray-400 hover:text-[#1240cc] transition-colors"
                            >
                              {copiedRecord === 'dmarc' ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {results.records.dmarc.issues.length > 0 && (
                          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="font-medium text-yellow-800 mb-2">Issues Found:</p>
                            <ul className="space-y-1">
                              {results.records.dmarc.issues.map((issue, index) => (
                                <li key={index} className="text-sm text-yellow-700">• {issue}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-700">No DMARC policy found for this domain.</p>
                        </div>
                        {results.records.dmarc.recommendation && (
                          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="font-medium text-blue-800 mb-2">Recommended Record:</p>
                            <div className="flex items-start justify-between">
                              <code className="text-xs text-blue-700 font-mono break-all flex-1">{results.records.dmarc.recommendation}</code>
                              <button
                                onClick={() => copyToClipboard(results.records.dmarc.recommendation, 'dmarc-rec')}
                                className="ml-4 p-2 text-blue-500 hover:text-blue-700 transition-colors"
                              >
                                {copiedRecord === 'dmarc-rec' ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* MX Records */}
                  <div className="p-6 bg-white border border-gray-200 rounded-xl hover:border-[#1240cc] transition-colors mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-semibold text-black flex items-center gap-2">
                        <Mail className="w-5 h-5 text-orange-600" />
                        MX Records
                      </h3>
                      {getStatusIcon(results.records.mx)}
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                      Mail exchange servers that handle email for your domain
                    </p>

                    {results.records.mx.found && results.records.mx.records.length > 0 ? (
                      <div className="p-4 bg-white border border-gray-200 rounded-lg">
                        <p className="text-sm font-medium text-gray-500 mb-3">Mail Servers:</p>
                        <div className="space-y-3">
                          {results.records.mx.records.map((mx, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <code className="text-sm text-black/80 font-mono">{mx.server}</code>
                              <span className="text-xs font-medium text-gray-500">Priority: {mx.priority}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700">No MX records found. Email cannot be delivered to this domain.</p>
                      </div>
                    )}
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
                href="/resources/tools/spf-checker"
                onClick={() => trackClick('tool_navigation', { from: 'dns-validator', to: 'spf-checker' })}
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
                onClick={() => trackClick('tool_navigation', { from: 'dns-validator', to: 'dkim-checker' })}
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
                href="/resources/tools/dns-checker"
                onClick={() => trackClick('tool_navigation', { from: 'dns-validator', to: 'dns-checker' })}
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                  DNS Record Checker
                </h3>
                <p className="text-sm text-gray-500">
                  Comprehensive DNS record lookup and analysis for any domain.
                </p>
              </Link>

              <Link
                href="/resources/tools/deliverability-score"
                onClick={() => trackClick('tool_navigation', { from: 'dns-validator', to: 'deliverability-score' })}
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
                onClick={() => trackClick('tool_navigation', { from: 'dns-validator', to: 'dmarc-checker' })}
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
                onClick={() => trackClick('tool_navigation', { from: 'dns-validator', to: 'spam-checker' })}
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
          <div className="py-16 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold tracking-tight text-black mb-6">
              Understanding DNS validation
            </h2>

            <p className="text-base text-gray-500 leading-relaxed mb-8">
              DNS validation ensures your email authentication records are properly configured.
              Correct SPF, DKIM, and DMARC setup is essential for email deliverability and domain security.
            </p>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-lg font-semibold text-black mb-4">
                  Why validation matters
                </h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Email deliverability
                    </p>
                    <p className="text-sm text-gray-500">
                      Properly configured records ensure your emails reach the inbox.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Domain security
                    </p>
                    <p className="text-sm text-gray-500">
                      Prevent unauthorized use of your domain for email spoofing.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Compliance requirements
                    </p>
                    <p className="text-sm text-gray-500">
                      Meet industry standards for email authentication.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-black mb-4">
                  Validation process
                </h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Record existence
                    </p>
                    <p className="text-sm text-gray-500">
                      Check if SPF, DKIM, and DMARC records are present.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Syntax validation
                    </p>
                    <p className="text-sm text-gray-500">
                      Verify records follow proper format and syntax rules.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Configuration analysis
                    </p>
                    <p className="text-sm text-gray-500">
                      Identify potential issues and optimization opportunities.
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
      <section className="bg-gray-50 border-t border-gray-200">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="py-20 text-center max-w-xl mx-auto">
            <p className="font-mono text-xs uppercase tracking-widest text-[#1240cc] mb-5">Get started</p>
            <h2 className="text-3xl font-bold tracking-tight text-black mb-4">Need help configuring DNS records?</h2>
            <p className="text-base text-gray-500 mb-8">Infrabox automatically configures all DNS records for maximum deliverability.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="https://app.infrabox.software/signup" onClick={() => trackClick('tool_cta', { tool: 'dns-validator', action: 'signup' })} className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1240cc] text-white text-sm font-semibold rounded-full hover:bg-[#0b34b4] transition-colors">
                Get Started
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}