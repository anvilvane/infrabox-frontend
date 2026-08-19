'use client'

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Check,
  X,
  AlertTriangle,
  Shield,
  Image,
  Award,
  Copy,
  ExternalLink,
  Plus,
  Minus,
  CheckCircle,
} from "lucide-react";
import { trackClick } from '@/lib/datafast';

export default function BIMICheckerPage() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [openItems, setOpenItems] = useState(new Set([0]));

  const checkBIMI = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/tools/bimi-checker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain }),
      });

      if (!response.ok) {
        throw new Error('Failed to check BIMI record');
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error checking BIMI:', error);
      setResults({
        error: true,
        message: 'Unable to check BIMI record. Please verify the domain and try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setDomain("");
    setResults(null);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
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
      question: "What is BIMI?",
      answer: "Brand Indicators for Message Identification (BIMI) is an email specification that allows organizations to display their official brand logo next to authenticated messages in supporting email clients like Gmail, Yahoo Mail, and Apple Mail. It works by publishing a DNS TXT record that points to your logo file and optional VMC certificate."
    },
    {
      question: "Does BIMI require DMARC?",
      answer: "Yes, BIMI requires your domain to have a DMARC policy of either 'quarantine' or 'reject' (p=quarantine or p=reject). A DMARC policy of 'none' is not sufficient. This requirement ensures that only properly authenticated emails display your brand logo, preventing impersonation."
    },
    {
      question: "What is a VMC and do I need one?",
      answer: "A Verified Mark Certificate (VMC) is a digital certificate issued by a Certificate Authority (like DigiCert or Entrust) that validates your legal right to use your trademarked logo. Gmail and Apple Mail require a VMC to display your BIMI logo. Yahoo Mail does not require a VMC, making it a good place to start testing your BIMI implementation."
    },
    {
      question: "Which email clients support BIMI?",
      answer: "As of 2024, Gmail (requires VMC), Yahoo Mail (no VMC required), Apple Mail on iOS 24+ and macOS Ventura+ (requires VMC), and Fastmail all support BIMI. Microsoft Outlook is currently piloting BIMI support. Support continues to expand across the email ecosystem."
    },
    {
      question: "What format does my BIMI logo need to be?",
      answer: "Your BIMI logo must be in SVG Tiny Portable/Secure (SVG Tiny P/S) format. It must be a square image, no larger than 32KB, hosted on an HTTPS URL. The SVG must not contain any external references, scripts, or animations. Most design tools can export to standard SVG, but you may need a specialized converter for SVG Tiny P/S compliance."
    },
    {
      question: "How long does it take for BIMI to appear?",
      answer: "After properly configuring your BIMI DNS record, it can take 24-72 hours for DNS propagation. Email providers may then take additional time (sometimes weeks) to cache and display your logo. Gmail in particular may take longer as it verifies your VMC and builds trust with your sending domain."
    },
    {
      question: "How much does a VMC cost?",
      answer: "VMC certificates typically cost between $1,000 and $1,500 per year, issued by authorized Certificate Authorities like DigiCert and Entrust. You need a registered trademark with an intellectual property office (like the USPTO) to qualify. Some organizations start with Yahoo Mail (no VMC needed) before investing in a VMC for Gmail display."
    },
    {
      question: "Can I use BIMI without a trademarked logo?",
      answer: "For email providers that require a VMC (like Gmail and Apple Mail), you need a registered trademark. However, Yahoo Mail and Fastmail support BIMI without a VMC, so you can display your logo there without trademark registration. This is a great way to start benefiting from BIMI while working toward full VMC certification."
    },
    {
      question: "What is the BIMI DNS record format?",
      answer: "A BIMI record is a DNS TXT record published at default._bimi.yourdomain.com with the format: v=BIMI1; l=https://example.com/logo.svg; a=https://example.com/cert.pem. The 'l=' tag points to your SVG logo URL and the 'a=' tag (optional) points to your VMC certificate file."
    },
    {
      question: "Why isn't my BIMI logo showing in Gmail?",
      answer: "Common reasons include: missing or invalid VMC certificate (Gmail requires VMC), DMARC policy set to 'none' instead of 'quarantine' or 'reject', SVG logo not in the required Tiny P/S format, logo file exceeding 32KB, DNS propagation delays, or insufficient sending reputation. Use this checker to diagnose specific issues."
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
            <span className="text-gray-600">BIMI Checker</span>
          </div>
        </div>
      </section>

      {/* Hero */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="text-center pt-12 pb-16 max-w-3xl mx-auto">
            <p className="font-mono text-xs uppercase tracking-widest text-[#1240cc] mb-5">
              Free tool
            </p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-black mb-5">
              BIMI record checker
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
              Validate Brand Indicators for Message Identification. Display your brand logo
              next to authenticated emails in Gmail, Yahoo, and Apple Mail.
            </p>
          </div>
        </div>
      </section>

      {/* Main Tool Section -- functional code preserved */}
      <section className="bg-white min-h-[600px]">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8 pb-16">
          {!results ? (
            <div className="max-w-xl mx-auto">
              <div className="space-y-6">
                <div>
                  <label htmlFor="domain" className="block text-sm font-medium text-black mb-2">
                    Domain to check
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
                      onKeyDown={(e) => e.key === 'Enter' && domain && checkBIMI()}
                    />
                  </div>
                </div>

                <button
                  onClick={checkBIMI}
                  disabled={!domain || loading}
                  className="w-full px-8 py-4 bg-[#1240cc] text-white font-semibold rounded-full hover:bg-[#0b34b4] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Checking BIMI...
                    </span>
                  ) : (
                    'Check BIMI Record'
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto">
              {/* Results Header */}
              <div className="border-b border-gray-200 pb-6 mb-8">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-[#1240cc] mb-2">
                      Analysis results
                    </p>
                    <h2 className="text-3xl font-bold text-black">
                      {results.domain || domain}
                    </h2>
                  </div>
                  <button
                    onClick={reset}
                    className="px-5 py-2.5 text-sm font-medium text-black border border-gray-200 rounded-full hover:border-gray-300 transition-colors"
                  >
                    New Check
                  </button>
                </div>
              </div>

              {results.error ? (
                <div className="p-6 bg-white border border-red-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <X className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-black mb-1">Analysis Failed</h3>
                      <p className="text-sm text-gray-500">{results.message}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* BIMI Status Card */}
                  <div className="grid md:grid-cols-3 gap-8 mb-12">
                    <div className="md:col-span-1">
                      <div className="text-center">
                        <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center ${results.exists && results.valid
                            ? 'bg-green-50 border-4 border-green-200'
                            : results.exists
                              ? 'bg-yellow-50 border-4 border-yellow-200'
                              : 'bg-gray-50 border-4 border-gray-200'
                          }`}>
                          {results.exists && results.valid ? (
                            <Check className="w-16 h-16 text-green-600" />
                          ) : results.exists ? (
                            <AlertTriangle className="w-16 h-16 text-yellow-600" />
                          ) : (
                            <X className="w-16 h-16 text-gray-400" />
                          )}
                        </div>
                        <p className="mt-4 text-sm font-medium text-black">
                          BIMI Status
                        </p>
                        <p className="text-2xl font-bold text-black mt-1">
                          {results.exists ? (results.valid ? 'Valid' : 'Issues Found') : 'Not Found'}
                        </p>
                      </div>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 border border-gray-200">
                          <div className="flex items-center gap-2">
                            {results.parsed?.logoUrl ? (
                              <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                                <Check className="w-5 h-5 text-green-600" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center">
                                <X className="w-5 h-5 text-red-600" />
                              </div>
                            )}
                            <div>
                              <p className="text-base font-semibold text-black">Logo</p>
                              <p className="text-xs text-gray-500">
                                {results.parsed?.logoUrl ? 'Configured' : 'Missing'}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 border border-gray-200">
                          <div className="flex items-center gap-2">
                            {results.parsed?.certificateUrl ? (
                              <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                                <Check className="w-5 h-5 text-green-600" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 bg-yellow-50 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                              </div>
                            )}
                            <div>
                              <p className="text-base font-semibold text-black">VMC</p>
                              <p className="text-xs text-gray-500">
                                {results.parsed?.certificateUrl ? 'Configured' : 'Optional'}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 border border-gray-200">
                          <div className="flex items-center gap-2">
                            {results.dmarcStatus?.sufficient ? (
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
                                {results.dmarcStatus?.policy || 'Not checked'}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 border border-gray-200">
                          <div className="flex items-center gap-2">
                            {results.validation?.requirements?.hasValidLogo ? (
                              <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                                <Check className="w-5 h-5 text-green-600" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center">
                                <X className="w-5 h-5 text-red-600" />
                              </div>
                            )}
                            <div>
                              <p className="text-base font-semibold text-black">HTTPS</p>
                              <p className="text-xs text-gray-500">
                                {results.validation?.requirements?.hasValidLogo ? 'Valid' : 'Invalid'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* BIMI Record Display */}
                      {results.record && (
                        <div className="p-6 bg-white border border-gray-200">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-base font-semibold text-black">BIMI Record</h4>
                            <button
                              onClick={() => copyToClipboard(results.record)}
                              className="p-2 text-gray-400 hover:text-[#1240cc] transition-colors"
                              title="Copy to clipboard"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="p-4 bg-gray-50 border border-gray-200">
                            <code className="text-xs text-gray-700 font-mono break-all">
                              {results.record}
                            </code>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Detailed Configuration */}
                  {results.parsed && (
                    <div className="mb-12">
                      <h3 className="text-xl font-bold text-black mb-6">
                        Configuration Details
                      </h3>
                      <div className="divide-y divide-gray-200 border border-gray-200">
                        {/* Logo URL */}
                        <div className="p-5">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <h4 className="text-base font-semibold text-black">
                                  Logo URL
                                </h4>
                                <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 ${
                                  results.parsed.logoUrl
                                    ? 'text-green-700 bg-green-50 border border-green-200'
                                    : 'text-red-700 bg-red-50 border border-red-200'
                                }`}>
                                  {results.parsed.logoUrl ? 'Configured' : 'Missing'}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                SVG logo file hosted on HTTPS
                              </p>
                              {results.parsed.logoUrl && (
                                <div className="mt-3 p-3 bg-gray-50 border border-gray-200">
                                  <code className="text-xs text-gray-700 font-mono break-all">
                                    {results.parsed.logoUrl}
                                  </code>
                                  <a
                                    href={results.parsed.logoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 mt-2 font-mono text-xs uppercase tracking-wider text-[#1240cc] hover:text-[#0b34b4]"
                                  >
                                    View Logo <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* VMC Certificate */}
                        <div className="p-5">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <h4 className="text-base font-semibold text-black">
                                  VMC Certificate
                                </h4>
                                <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 ${
                                  results.parsed.certificateUrl
                                    ? 'text-green-700 bg-green-50 border border-green-200'
                                    : 'text-yellow-700 bg-yellow-50 border border-yellow-200'
                                }`}>
                                  {results.parsed.certificateUrl ? 'Configured' : 'Optional'}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                Verified Mark Certificate for Gmail support
                              </p>
                              {results.parsed.certificateUrl && (
                                <div className="mt-3 p-3 bg-gray-50 border border-gray-200">
                                  <code className="text-xs text-gray-700 font-mono break-all">
                                    {results.parsed.certificateUrl}
                                  </code>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* DMARC Status */}
                        {results.dmarcStatus && (
                          <div className="p-5">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3">
                                  <h4 className="text-base font-semibold text-black">
                                    DMARC Policy
                                  </h4>
                                  <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 ${
                                    results.dmarcStatus.sufficient
                                      ? 'text-green-700 bg-green-50 border border-green-200'
                                      : 'text-red-700 bg-red-50 border border-red-200'
                                  }`}>
                                    {results.dmarcStatus.sufficient ? 'Sufficient' : 'Insufficient'}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                  {results.dmarcStatus.message}
                                </p>
                                {results.dmarcStatus.policy && (
                                  <div className="mt-3 p-3 bg-gray-50 border border-gray-200">
                                    <code className="text-xs text-gray-700 font-mono">
                                      Policy: {results.dmarcStatus.policy}
                                    </code>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Warnings */}
                  {results.warnings && results.warnings.length > 0 && (
                    <div className="mb-12">
                      <h3 className="text-xl font-bold text-black mb-6">
                        Issues & Recommendations
                      </h3>
                      <div className="space-y-3">
                        {results.warnings.map((warning, index) => (
                          <div key={index} className="p-5 bg-white border border-gray-200 hover:border-gray-300 transition-colors">
                            <div className="flex items-start gap-3">
                              <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-gray-600 leading-relaxed">
                                {warning}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sample BIMI Record */}
                  {!results.exists && (
                    <div className="mb-12">
                      <h3 className="text-xl font-bold text-black mb-6">
                        Sample BIMI Record
                      </h3>
                      <div className="p-6 bg-white border border-gray-200">
                        <p className="text-sm text-gray-500 mb-4">
                          Add this TXT record to your DNS at default._bimi.yourdomain.com:
                        </p>
                        <div className="p-4 bg-gray-50 border border-gray-200">
                          <code className="text-xs text-gray-700 font-mono break-all">
                            v=BIMI1; l=https://yourdomain.com/logo.svg; a=https://yourdomain.com/vmc.pem
                          </code>
                        </div>
                      </div>
                    </div>
                  )}
                </>
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
                  Infrabox automatically configures BIMI, DMARC, SPF, and DKIM for all your domains.
                </p>
              </div>
              <a
                href="https://app.infrabox.software/signup"
                onClick={() => trackClick('tool_cta_banner', { tool: 'bimi-checker' })}
                className="flex-shrink-0 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[#1240cc] hover:text-[#0b34b4] transition-colors"
              >
                Get Started
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Educational Content */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="py-16 max-w-4xl mx-auto">

            {/* What is BIMI */}
            <div className="mb-16">
              <p className="font-mono text-xs uppercase tracking-widest text-[#1240cc] mb-3">
                Overview
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-black mb-4">
                What is BIMI?
              </h2>
              <p className="text-base text-gray-500 leading-relaxed mb-4">
                Brand Indicators for Message Identification (BIMI) is an email specification that enables organizations to display
                their official brand logo next to authenticated messages in supporting email clients. Unlike other email authentication
                protocols that work behind the scenes, BIMI provides a visible indicator to recipients that
                the email is from a verified sender.
              </p>
              <p className="text-base text-gray-500 leading-relaxed">
                BIMI works by publishing a special DNS TXT record at <code className="text-sm bg-gray-100 px-1.5 py-0.5 font-mono text-gray-700">default._bimi.yourdomain.com</code> that
                points to your brand's SVG logo file and an optional Verified Mark Certificate (VMC). When a receiving mail server
                processes an authenticated email from your domain, it looks up this record and displays your logo to the recipient.
              </p>
            </div>

            {/* BIMI Record Structure */}
            <div className="mb-16">
              <p className="font-mono text-xs uppercase tracking-widest text-[#1240cc] mb-3">
                Record format
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-black mb-4">
                What is a BIMI Record?
              </h2>
              <p className="text-base text-gray-500 leading-relaxed mb-6">
                A BIMI record is a DNS TXT record that tells email providers where to find your brand logo and certificate.
                It consists of three key components:
              </p>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="p-5 border border-gray-200 bg-white">
                  <p className="font-mono text-xs uppercase tracking-wider text-gray-400 mb-2">Version Tag</p>
                  <code className="text-sm bg-gray-50 px-2 py-1 font-mono text-gray-700 border border-gray-200">v=BIMI1</code>
                  <p className="text-xs text-gray-500 mt-3">Identifies the record as BIMI version 1</p>
                </div>
                <div className="p-5 border border-gray-200 bg-white">
                  <p className="font-mono text-xs uppercase tracking-wider text-gray-400 mb-2">Logo URL</p>
                  <code className="text-sm bg-gray-50 px-2 py-1 font-mono text-gray-700 border border-gray-200">l=https://...</code>
                  <p className="text-xs text-gray-500 mt-3">HTTPS URL pointing to your SVG Tiny P/S logo</p>
                </div>
                <div className="p-5 border border-gray-200 bg-white">
                  <p className="font-mono text-xs uppercase tracking-wider text-gray-400 mb-2">Authority</p>
                  <code className="text-sm bg-gray-50 px-2 py-1 font-mono text-gray-700 border border-gray-200">a=https://...</code>
                  <p className="text-xs text-gray-500 mt-3">URL to your Verified Mark Certificate (VMC)</p>
                </div>
              </div>
              <div className="p-5 bg-gray-50 border border-gray-200">
                <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-2">Example BIMI Record</p>
                <code className="text-sm text-gray-700 font-mono break-all">
                  v=BIMI1; l=https://example.com/brand/logo.svg; a=https://example.com/brand/certificate.pem
                </code>
              </div>
            </div>

            {/* What we validate */}
            <div className="mb-16">
              <p className="font-mono text-xs uppercase tracking-widest text-[#1240cc] mb-3">
                Validation
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-black mb-4">
                What our BIMI checker validates
              </h2>
              <p className="text-base text-gray-500 leading-relaxed mb-6">
                Our free BIMI checker performs a comprehensive analysis of your domain's BIMI configuration:
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { title: "DNS Record Presence", desc: "Verifies that a BIMI TXT record exists at default._bimi.yourdomain.com" },
                  { title: "Record Syntax", desc: "Validates the BIMI record format including version tag and proper syntax" },
                  { title: "Logo URL Accessibility", desc: "Checks that the SVG logo URL is reachable over HTTPS" },
                  { title: "DMARC Compliance", desc: "Confirms your DMARC policy is set to quarantine or reject as required" },
                  { title: "VMC Certificate", desc: "Detects and validates the Verified Mark Certificate if present" },
                  { title: "Logo Format", desc: "Checks the logo meets SVG Tiny P/S requirements for email clients" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 border border-gray-200 bg-white">
                    <CheckCircle className="w-4 h-4 text-[#1240cc] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-black">{item.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements + Client Support -- 2-column grid */}
            <div className="mb-16">
              <p className="font-mono text-xs uppercase tracking-widest text-[#1240cc] mb-3">
                Implementation
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-black mb-6">
                Requirements & email client support
              </h2>
              <div className="grid md:grid-cols-2 gap-px bg-gray-200 border border-gray-200">
                <div className="bg-white p-6">
                  <p className="font-mono text-xs uppercase tracking-wider text-gray-400 mb-4">
                    BIMI Requirements
                  </p>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-black">DMARC policy (quarantine/reject)</p>
                      <p className="text-xs text-gray-500 mt-0.5">Ensures only authenticated emails display your logo.</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">SVG Tiny P/S logo format</p>
                      <p className="text-xs text-gray-500 mt-0.5">Square logo, max 32KB, no scripts or external references.</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">HTTPS logo hosting</p>
                      <p className="text-xs text-gray-500 mt-0.5">Logo must be served over a secure HTTPS connection.</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">VMC certificate (for Gmail)</p>
                      <p className="text-xs text-gray-500 mt-0.5">Required for Gmail and Apple Mail; optional for Yahoo.</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6">
                  <p className="font-mono text-xs uppercase tracking-wider text-gray-400 mb-4">
                    Email Client Support
                  </p>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-black">Gmail</p>
                      <p className="text-xs text-gray-500 mt-0.5">Requires VMC. 90%+ inbox coverage on web and mobile.</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">Yahoo Mail</p>
                      <p className="text-xs text-gray-500 mt-0.5">No VMC required. Supported since 2020, great for testing.</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">Apple Mail</p>
                      <p className="text-xs text-gray-500 mt-0.5">iOS 24+ and macOS Ventura+. Requires VMC certificate.</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">Outlook</p>
                      <p className="text-xs text-gray-500 mt-0.5">Currently in pilot phase with limited availability.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mb-16">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-6 border border-gray-200 bg-white text-center">
                  <p className="text-3xl font-bold text-[#1240cc] mb-1">10%+</p>
                  <p className="font-mono text-xs uppercase tracking-wider text-gray-400">Open rate increase</p>
                </div>
                <div className="p-6 border border-gray-200 bg-white text-center">
                  <p className="text-3xl font-bold text-[#1240cc] mb-1">90%</p>
                  <p className="font-mono text-xs uppercase tracking-wider text-gray-400">Brand recognition</p>
                </div>
                <div className="p-6 border border-gray-200 bg-white text-center">
                  <p className="text-3xl font-bold text-[#1240cc] mb-1">3B+</p>
                  <p className="font-mono text-xs uppercase tracking-wider text-gray-400">Inboxes supported</p>
                </div>
              </div>
            </div>

            {/* Common Issues */}
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-[#1240cc] mb-3">
                Troubleshooting
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-black mb-6">
                Common BIMI implementation issues
              </h2>
              <div className="border border-gray-200 divide-y divide-gray-200">
                {[
                  { issue: "Incorrect SVG format", detail: "Must use SVG Tiny Portable/Secure profile, not standard SVG" },
                  { issue: "DMARC policy too permissive", detail: "Needs p=quarantine or p=reject (p=none is insufficient)" },
                  { issue: "DNS propagation delays", detail: "Allow 24-72 hours for changes to take effect globally" },
                  { issue: "Logo file too large", detail: "Exceeds 32KB limit or contains external references/scripts" },
                  { issue: "Missing VMC for Gmail", detail: "VMC certificate is required for logo display in Gmail and Apple Mail" },
                  { issue: "Non-square logo", detail: "BIMI requires a perfectly square (1:1 aspect ratio) logo image" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4">
                    <X className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-sm font-medium text-black">{item.issue}</span>
                      <span className="text-sm text-gray-500"> -- {item.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Tools + Guides */}
      <section className="bg-gray-50 border-t border-gray-200">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="py-16 max-w-4xl mx-auto">
            <p className="font-mono text-xs uppercase tracking-widest text-[#1240cc] mb-3">
              Related
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-black mb-8">
              Related tools & guides
            </h2>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {[
                { href: "/resources/tools/bimi-generator", title: "BIMI Record Generator", desc: "Create properly formatted BIMI records for your domain." },
                { href: "/resources/tools/dmarc-checker", title: "DMARC Policy Checker", desc: "Verify your DMARC policy meets BIMI requirements." },
                { href: "/resources/tools/deliverability-score", title: "Deliverability Score", desc: "Get a complete email deliverability assessment." },
                { href: "/resources/tools/spf-checker", title: "SPF Checker", desc: "Validate SPF records and sender policies." },
                { href: "/resources/tools/dkim-checker", title: "DKIM Checker", desc: "Verify DKIM signatures and public key configuration." },
                { href: "/resources/tools/domain-scanner", title: "Domain Scanner", desc: "Comprehensive scan of all email authentication records." },
              ].map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  onClick={() => trackClick('tool_navigation', { from: 'bimi-checker', to: tool.href.split('/').pop() })}
                  className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
                >
                  <h3 className="text-sm font-semibold text-black mb-1.5 group-hover:text-[#1240cc] transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3">
                    {tool.desc}
                  </p>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#1240cc]">
                    Try it &rarr;
                  </span>
                </Link>
              ))}
            </div>

            {/* Guide links */}
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                href="/learn/email-deliverability-guide"
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <p className="font-mono text-[10px] uppercase tracking-wider text-gray-400 mb-2">Guide</p>
                <h3 className="text-sm font-semibold text-black group-hover:text-[#1240cc] transition-colors mb-1">
                  Complete Email Deliverability Guide
                </h3>
                <p className="text-xs text-gray-500">
                  Master authentication, reputation management, and inbox placement.
                </p>
              </Link>
              <Link
                href="/learn/dns-setup-guide"
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <p className="font-mono text-[10px] uppercase tracking-wider text-gray-400 mb-2">Guide</p>
                <h3 className="text-sm font-semibold text-black group-hover:text-[#1240cc] transition-colors mb-1">
                  DNS Records Setup Tutorial
                </h3>
                <p className="text-xs text-gray-500">
                  Configure DKIM, DMARC, and SPF records correctly for authentication.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
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
                        <Minus className="w-4 h-4 text-[#1240cc]" />
                      ) : (
                        <Plus className="w-4 h-4 text-gray-400" />
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

      {/* Bottom CTA */}
      <section className="bg-gray-50 border-t border-gray-200">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="py-20 text-center max-w-xl mx-auto">
            <p className="font-mono text-xs uppercase tracking-widest text-[#1240cc] mb-5">
              Get started
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-black mb-4">
              Get your logo in every inbox
            </h2>
            <p className="text-base text-gray-500 mb-8">
              Infrabox helps you implement BIMI correctly with logo optimization,
              VMC guidance, and automated DNS configuration.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://app.infrabox.software/signup"
                onClick={() => trackClick('tool_cta', { tool: 'bimi-checker', action: 'signup' })}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1240cc] text-white text-sm font-semibold rounded-full hover:bg-[#0b34b4] transition-colors"
              >
                Get Started
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <Link
                href="/learn/email-deliverability-guide"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-black text-sm font-semibold rounded-full hover:border-gray-400 transition-colors"
              >
                Read BIMI guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
