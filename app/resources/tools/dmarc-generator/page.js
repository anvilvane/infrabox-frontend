'use client'

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Copy,
  RefreshCw,
  HelpCircle,
  Mail,
  Settings,
  TrendingUp,
} from "lucide-react";
import { trackClick } from '@/lib/datafast';

export default function DMARCGeneratorPage() {
  const [config, setConfig] = useState({
    policy: 'none',
    subdomainPolicy: 'inherit',
    percentage: '100',
    aggregateEmail: '',
    forensicEmail: '',
    spfAlignment: 'relaxed',
    dkimAlignment: 'relaxed',
    failureOptions: [],
    reportFormat: 'afrf',
    reportInterval: '86400'
  });

  const [generatedRecord, setGeneratedRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copiedRecord, setCopiedRecord] = useState(false);
  const [copiedHost, setCopiedHost] = useState(false);
  const [openItems, setOpenItems] = useState(new Set([0]));

  const generateDMARC = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/tools/dmarc-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error('Failed to generate DMARC record');
      }

      const data = await response.json();
      setGeneratedRecord(data);
    } catch (error) {
      console.error('Error generating DMARC:', error);
      setGeneratedRecord({
        error: true,
        message: 'Failed to generate DMARC record'
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'record') {
      setCopiedRecord(true);
      setTimeout(() => setCopiedRecord(false), 2000);
    } else {
      setCopiedHost(true);
      setTimeout(() => setCopiedHost(false), 2000);
    }
  };

  const handleFailureOptionToggle = (option) => {
    setConfig(prev => ({
      ...prev,
      failureOptions: prev.failureOptions.includes(option)
        ? prev.failureOptions.filter(o => o !== option)
        : [...prev.failureOptions, option]
    }));
  };

  const getPolicyRecommendation = (policy) => {
    switch (policy) {
      case 'none':
        return 'Best for initial setup - Monitor without affecting delivery';
      case 'quarantine':
        return 'Intermediate protection - Suspicious emails go to spam';
      case 'reject':
        return 'Maximum protection - Block unauthorized emails completely';
      default:
        return '';
    }
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
      question: "What is a DMARC record?",
      answer: "A DMARC record is a DNS TXT record that tells email receivers what to do if an email fails SPF or DKIM authentication. It also specifies where to send reports about authentication results."
    },
    {
      question: "Which policy should I choose?",
      answer: "Start with 'p=none' (monitoring mode) to collect data without affecting email delivery. Once you've verified your legitimate email sources, move to 'p=quarantine' (send failures to spam), and finally 'p=reject' (block failures) for maximum security."
    },
    {
      question: "What are RUA and RUF reports?",
      answer: "RUA (Aggregate) reports provide a daily summary of email traffic and authentication results. RUF (Forensic) reports provide detailed information about individual authentication failures. We recommend always setting up RUA reports."
    },
    {
      question: "How do I publish the generated record?",
      answer: "Copy the generated TXT record and add it to your domain's DNS settings. The host/name should be '_dmarc' (or '_dmarc.yourdomain.com' depending on your provider) and the value is the record starting with 'v=DMARC1'."
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
            <span className="text-gray-600">DMARC Generator</span>
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
              DMARC record generator
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
              Generate DMARC policies and DNS records for email authentication.
              Create comprehensive protection with step-by-step configuration.
            </p>
          </div>
        </div>
      </section>

      {/* Main Tool Section */}
      <section className="bg-white min-h-[600px]">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8 pb-16">
          {!generatedRecord ? (
            // Input Form - Modern Clean Design
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-black mb-8 text-center">
                Configure Your DMARC Policy
              </h2>

              <div className="space-y-6">
                {/* Policy Selection */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    DMARC Policy <span className="text-red-500">*</span>
                  </label>
                  <div className="grid md:grid-cols-3 gap-3">
                    {['none', 'quarantine', 'reject'].map((policy) => (
                      <button
                        key={policy}
                        onClick={() => setConfig(prev => ({ ...prev, policy }))}
                        className={`p-4 rounded-xl border-2 transition-all ${config.policy === policy
                            ? 'border-[#1240cc] bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                          }`}
                      >
                        <div className="font-medium capitalize mb-1">{policy}</div>
                        <div className="text-xs text-gray-500">
                          {getPolicyRecommendation(policy)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subdomain Policy */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Subdomain Policy
                  </label>
                  <Select value={config.subdomainPolicy} onValueChange={(value) => setConfig(prev => ({ ...prev, subdomainPolicy: value }))}>
                    <SelectTrigger className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1240cc] focus:border-transparent transition-all">
                      <SelectValue placeholder="Select subdomain policy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inherit">Inherit from main domain</SelectItem>
                      <SelectItem value="none">None (monitoring only)</SelectItem>
                      <SelectItem value="quarantine">Quarantine</SelectItem>
                      <SelectItem value="reject">Reject</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Percentage */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Policy Percentage
                    <span className="ml-1 text-gray-500 text-xs">(% of emails to apply policy)</span>
                  </label>
                  <Select value={config.percentage} onValueChange={(value) => setConfig(prev => ({ ...prev, percentage: value }))}>
                    <SelectTrigger className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1240cc] focus:border-transparent transition-all">
                      <SelectValue placeholder="Select percentage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10%</SelectItem>
                      <SelectItem value="25">25%</SelectItem>
                      <SelectItem value="50">50%</SelectItem>
                      <SelectItem value="75">75%</SelectItem>
                      <SelectItem value="100">100%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Aggregate Reports Email */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Aggregate Reports Email (RUA)
                    <span className="ml-1 text-gray-500 text-xs">Recommended</span>
                  </label>
                  <Input
                    type="email"
                    value={config.aggregateEmail}
                    onChange={(e) => setConfig(prev => ({ ...prev, aggregateEmail: e.target.value }))}
                    placeholder="dmarc-reports@yourdomain.com"
                    className="w-full px-4 h-[52px] py-0 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1240cc] focus:border-transparent transition-all placeholder:text-gray-400"
                    onKeyDown={(e) => e.key === 'Enter' && generateDMARC()}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Receive daily DMARC aggregate reports. Separate multiple emails with commas.
                  </p>
                </div>

                {/* Forensic Reports Email */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Forensic Reports Email (RUF)
                    <span className="ml-1 text-gray-500 text-xs">Optional</span>
                  </label>
                  <Input
                    type="email"
                    value={config.forensicEmail}
                    onChange={(e) => setConfig(prev => ({ ...prev, forensicEmail: e.target.value }))}
                    placeholder="dmarc-forensic@yourdomain.com"
                    className="w-full px-4 h-[52px] py-0 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1240cc] focus:border-transparent transition-all placeholder:text-gray-400"
                    onKeyDown={(e) => e.key === 'Enter' && generateDMARC()}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Receive detailed reports for failed emails. Note: Not all providers send forensic reports.
                  </p>
                </div>

                {/* Generate Button */}
                <button
                  onClick={generateDMARC}
                  disabled={loading}
                  className="w-full px-8 py-4 bg-[#1240cc] text-white font-semibold rounded-full hover:bg-[#0b34b4] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating DMARC...
                    </span>
                  ) : (
                    <>
                      Generate DMARC Record
                      <ArrowRight className="w-5 h-5" />
                    </>
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
                      DMARC GENERATION COMPLETE
                    </p>
                    <h2 className="text-3xl font-bold text-black">
                      Your DMARC Record
                    </h2>
                  </div>
                  <button
                    onClick={() => setGeneratedRecord(null)}
                    className="px-5 py-2.5 text-sm font-medium text-black border border-gray-300 rounded-full hover:border-[#1240cc] hover:text-[#1240cc] transition-all"
                  >
                    Generate New
                  </button>
                </div>
              </div>

              {generatedRecord.error ? (
                <div className="p-6 bg-white border border-red-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-red-900 mb-2">Generation Failed</h3>
                      <p className="text-red-700">{generatedRecord.message}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Generated Record */}
                  <div className="mb-8 p-6 bg-white border border-green-200 rounded-xl">
                    <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      DMARC TXT Record
                    </h3>
                    <div className="p-4 bg-white border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <code className="text-sm text-black/80 font-mono break-all flex-1 whitespace-pre-wrap">
                          {generatedRecord.record}
                        </code>
                        <button
                          onClick={() => copyToClipboard(generatedRecord.record, 'record')}
                          className="ml-3 p-2 text-black/40 hover:text-gray-500 transition-colors flex-shrink-0"
                          title="Copy record"
                        >
                          {copiedRecord ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <Copy className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* DNS Instructions */}
                  <div className="mb-8 p-6 bg-white border border-blue-200 rounded-xl">
                    <h3 className="text-lg font-semibold text-black mb-4">
                      DNS Configuration Instructions
                    </h3>
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">Record Type:</p>
                          <p className="font-semibold text-black">TXT</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">TTL:</p>
                          <p className="font-semibold text-black">3600 (1 hour)</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-2">Host/Name:</p>
                        <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                          <code className="font-mono text-sm text-black flex-1">
                            _dmarc
                          </code>
                          <button
                            onClick={() => copyToClipboard('_dmarc', 'host')}
                            className="p-1.5 text-black/40 hover:text-gray-500 transition-colors"
                            title="Copy host"
                          >
                            {copiedHost ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="p-6 bg-white border border-gray-200 rounded-xl hover:border-[#1240cc] transition-colors">
                    <h3 className="text-lg font-semibold text-black mb-3">
                      Need Help with DMARC Implementation?
                    </h3>
                    <p className="text-gray-500 mb-4 leading-relaxed">
                      Infrabox automates DMARC deployment with monitoring, reporting, and expert guidance.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        href="https://app.infrabox.software/signup"
                        onClick={() => trackClick('tool_cta', { tool: 'dmarc-generator', action: 'signup' })}
                        className="px-6 py-3 bg-[#1240cc] text-white text-sm font-semibold rounded-full hover:bg-[#0b34b4] transition-all text-center shadow-lg hover:shadow-xl"
                      >
                        Get Expert DMARC Setup
                      </Link>
                      <Link
                        href="/resources/tools/dmarc-checker"
                        onClick={() => trackClick('tool_navigation', { from: 'dmarc-generator', to: 'dmarc-checker' })}
                        className="px-6 py-3 border border-gray-300 text-black text-sm font-semibold rounded-full hover:border-[#1240cc] hover:text-[#1240cc] transition-all text-center"
                      >
                        Check Existing DMARC
                      </Link>
                    </div>
                  </div>
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
                  Infrabox provides automated DMARC deployment with monitoring and expert support.
                </p>
              </div>
              <a
                href="https://app.infrabox.software/signup"
                onClick={() => trackClick('tool_cta_banner', { tool: 'dmarc-generator' })}
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
                href="/resources/tools/dmarc-checker"
                onClick={() => trackClick('tool_navigation', { from: 'dmarc-generator', to: 'dmarc-checker' })}
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                  DMARC Checker
                </h3>
                <p className="text-sm text-gray-500">
                  Validate existing DMARC policies and email authentication.
                </p>
              </Link>

              <Link
                href="/resources/tools/spf-generator"
                onClick={() => trackClick('tool_navigation', { from: 'dmarc-generator', to: 'spf-generator' })}
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                  SPF Record Generator
                </h3>
                <p className="text-sm text-gray-500">
                  Create SPF records for email server authorization.
                </p>
              </Link>

              <Link
                href="/resources/tools/dkim-generator"
                onClick={() => trackClick('tool_navigation', { from: 'dmarc-generator', to: 'dkim-generator' })}
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                  DKIM Generator
                </h3>
                <p className="text-sm text-gray-500">
                  Generate DKIM keys and DNS records for email signing.
                </p>
              </Link>

              <Link
                href="/resources/tools/deliverability-score"
                onClick={() => trackClick('tool_navigation', { from: 'dmarc-generator', to: 'deliverability-score' })}
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                  Deliverability Score
                </h3>
                <p className="text-sm text-gray-500">
                  Complete domain authentication and deliverability analysis.
                </p>
              </Link>

              <Link
                href="/resources/tools/spam-checker"
                onClick={() => trackClick('tool_navigation', { from: 'dmarc-generator', to: 'spam-checker' })}
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                  Spam Checker
                </h3>
                <p className="text-sm text-gray-500">
                  Test email content for potential spam triggers.
                </p>
              </Link>

              <Link
                href="/resources/tools/mailbox-calculator"
                onClick={() => trackClick('tool_navigation', { from: 'dmarc-generator', to: 'mailbox-calculator' })}
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                  Mailbox Calculator
                </h3>
                <p className="text-sm text-gray-500">
                  Calculate optimal mailbox setup for email campaigns.
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
              Understanding DMARC generation
            </h2>

            <p className="text-base text-gray-500 leading-relaxed mb-8">
              DMARC record generation requires careful consideration of your email ecosystem.
              Start with monitoring policies and gradually increase enforcement as you gain
              visibility into your legitimate email sources.
            </p>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-lg font-semibold text-black mb-4">
                  DMARC policy progression
                </h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      1. Start with p=none
                    </p>
                    <p className="text-sm text-gray-500">
                      Monitor email authentication without affecting delivery.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      2. Analyze reports
                    </p>
                    <p className="text-sm text-gray-500">
                      Review aggregate reports to identify legitimate senders.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      3. Move to quarantine
                    </p>
                    <p className="text-sm text-gray-500">
                      Send failing emails to spam folder for review.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      4. Enforce with reject
                    </p>
                    <p className="text-sm text-gray-500">
                      Block unauthorized emails completely for maximum protection.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-black mb-4">
                  Essential DMARC components
                </h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Policy (p=)
                    </p>
                    <p className="text-sm text-gray-500">
                      Defines action for emails failing authentication checks.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Aggregate reports (rua=)
                    </p>
                    <p className="text-sm text-gray-500">
                      Daily XML reports showing authentication statistics.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Percentage (pct=)
                    </p>
                    <p className="text-sm text-gray-500">
                      Controls rollout speed for policy enforcement.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Alignment modes
                    </p>
                    <p className="text-sm text-gray-500">
                      Determines strictness of SPF and DKIM domain matching.
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
              Ready to implement DMARC?
            </h2>
            <p className="text-base text-gray-500 mb-8">
              Infrabox provides automated DMARC deployment with monitoring and expert support.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://app.infrabox.software/signup"
                onClick={() => trackClick('tool_cta', { tool: 'dmarc-generator', action: 'signup' })}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1240cc] text-white text-sm font-semibold rounded-full hover:bg-[#0b34b4] transition-colors"
              >
                Get Started
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </a>
              <Link
                href="/learn/email-deliverability-guide"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-black text-sm font-semibold rounded-full hover:border-gray-400 transition-colors"
              >
                Read DMARC Guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}