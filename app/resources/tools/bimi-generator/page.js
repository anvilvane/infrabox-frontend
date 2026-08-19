'use client'

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
} from "lucide-react";
import { trackClick } from '@/lib/datafast';

export default function BIMIGeneratorPage() {
  const [config, setConfig] = useState({
    logoUrl: '',
    certificateUrl: '',
    selector: 'default',
    emailProvider: 'generic',
    dmarcPolicy: '',
    logoValidated: false,
    trademarkVerified: false
  });

  const [generatedRecord, setGeneratedRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copiedRecord, setCopiedRecord] = useState(false);
  const [copiedHost, setCopiedHost] = useState(false);
  const [openItems, setOpenItems] = useState(new Set([0]));

  const generateBIMI = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/tools/bimi-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate BIMI record');
      }

      const data = await response.json();
      setGeneratedRecord(data);
    } catch (error) {
      console.error('Error generating BIMI:', error);
      setGeneratedRecord({
        error: true,
        message: error.message || 'Failed to generate BIMI record'
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

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const providers = [
    { value: 'gmail', label: 'Gmail', requiresVMC: true },
    { value: 'yahoo', label: 'Yahoo Mail', requiresVMC: false },
    { value: 'apple', label: 'Apple Mail', requiresVMC: false },
    { value: 'outlook', label: 'Outlook (Beta)', requiresVMC: false },
    { value: 'generic', label: 'Other / All', requiresVMC: false }
  ];

  const faqs = [
    {
      question: "What is a BIMI record?",
      answer: "A BIMI record is a DNS TXT record that points to your logo file and optional VMC certificate, allowing email clients to display your brand logo next to authenticated messages."
    },
    {
      question: "Do I need a VMC?",
      answer: "A Verified Mark Certificate (VMC) is required for Gmail and Apple Mail to display your logo. Other providers like Yahoo Mail may display BIMI logos without a VMC, but having one ensures the broadest support."
    },
    {
      question: "What are the logo requirements?",
      answer: "Your logo must be in SVG Tiny Portable/Secure (P/S) format, square aspect ratio (1:1), have a solid background, and be hosted on HTTPS. The file size should not exceed 32KB."
    },
    {
      question: "How do I publish the generated record?",
      answer: "Copy the generated TXT record and add it to your domain's DNS settings. The host/name should be 'default._bimi' (or 'selector._bimi' if you chose a custom selector) and the value is the generated record string."
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
            <span className="text-gray-600">BIMI Generator</span>
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
              BIMI record generator
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
              Create BIMI records to display your brand logo in email clients.
              Build trust with visual brand indicators next to authenticated emails.
            </p>
          </div>
        </div>
      </section>

      {/* Main Tool Section */}
      <section className="bg-white min-h-[600px]">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-6xl mx-auto">
            {!generatedRecord ? (
              // Configuration Form
              <div className="space-y-6 max-w-4xl mx-auto">
                {/* Email Provider Selection */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Target email provider
                  </label>
                  <Select value={config.emailProvider} onValueChange={(value) => setConfig(prev => ({ ...prev, emailProvider: value }))}>
                    <SelectTrigger className="w-full px-4 py-3 text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1240cc] focus:border-transparent transition-all">
                      <SelectValue placeholder="Select email provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {providers.map(provider => (
                        <SelectItem key={provider.value} value={provider.value}>
                          {provider.label} {provider.requiresVMC && '(VMC Required)'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">
                    Different providers have different requirements
                  </p>
                </div>

                {/* Logo URL */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Logo URL <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="url"
                    value={config.logoUrl}
                    onChange={(e) => setConfig(prev => ({ ...prev, logoUrl: e.target.value }))}
                    placeholder="https://yourdomain.com/logo.svg"
                    className="w-full px-4 h-[52px] py-0 text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1240cc] focus:border-transparent transition-all placeholder:text-gray-400"
                    onKeyDown={(e) => e.key === 'Enter' && config.logoUrl && generateBIMI()}
                  />
                  <div className="mt-3 p-4 bg-white border border-gray-200 rounded-xl">
                    <h4 className="text-xs font-medium text-black mb-2">Logo requirements:</h4>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>• SVG Tiny P/S format (no external refs, scripts, or animations)</li>
                      <li>• Square aspect ratio (1:1)</li>
                      <li>• Centered logo on solid background</li>
                      <li>• Maximum 32KB file size</li>
                      <li>• Hosted on HTTPS with proper CORS headers</li>
                    </ul>
                  </div>
                </div>

                {/* VMC Certificate URL */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    VMC certificate URL {config.emailProvider === 'gmail' && <span className="text-red-500">*</span>}
                    <span className="ml-1 text-gray-500 text-xs">
                      {config.emailProvider === 'gmail' ? '(Required for Gmail)' : '(Optional)'}
                    </span>
                  </label>
                  <Input
                    type="url"
                    value={config.certificateUrl}
                    onChange={(e) => setConfig(prev => ({ ...prev, certificateUrl: e.target.value }))}
                    placeholder="https://yourdomain.com/vmc-certificate.pem"
                    className="w-full px-4 h-[52px] py-0 text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1240cc] focus:border-transparent transition-all placeholder:text-gray-400"
                    onKeyDown={(e) => e.key === 'Enter' && config.logoUrl && generateBIMI()}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Verified Mark Certificate from DigiCert or Entrust (requires trademark)
                  </p>
                </div>

                {/* Selector */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    BIMI selector
                  </label>
                  <Input
                    type="text"
                    value={config.selector}
                    onChange={(e) => setConfig(prev => ({ ...prev, selector: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                    placeholder="default"
                    className="w-full px-4 h-[52px] py-0 text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1240cc] focus:border-transparent transition-all placeholder:text-gray-400"
                    onKeyDown={(e) => e.key === 'Enter' && config.logoUrl && generateBIMI()}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Usually "default" - allows multiple BIMI records if needed
                  </p>
                </div>

                {/* DMARC Policy Status */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Current DMARC policy
                  </label>
                  <Select value={config.dmarcPolicy} onValueChange={(value) => setConfig(prev => ({ ...prev, dmarcPolicy: value }))}>
                    <SelectTrigger className="w-full px-4 py-3 text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1240cc] focus:border-transparent transition-all">
                      <SelectValue placeholder="Select your DMARC policy" />
                    </SelectTrigger>
                    <SelectContent>

                      <SelectItem value="none">p=none (Monitor only)</SelectItem>
                      <SelectItem value="quarantine">p=quarantine</SelectItem>
                      <SelectItem value="reject">p=reject</SelectItem>
                    </SelectContent>
                  </Select>
                  {config.dmarcPolicy === 'none' && (
                    <p className="text-xs text-red-600 mt-1">
                      ⚠️ BIMI requires DMARC policy of quarantine or reject
                    </p>
                  )}
                </div>

                {/* Generate Button */}
                <button
                  onClick={generateBIMI}
                  disabled={loading || !config.logoUrl}
                  className="w-full px-8 py-4 bg-[#1240cc] text-white font-semibold rounded-full hover:bg-[#0b34b4] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </span>
                  ) : (
                    'Generate BIMI Record'
                  )}
                </button>
              </div>
            ) : (
              // Generated Record Display
              <div className="max-w-5xl mx-auto">
                {/* Results Header */}
                <div className="border-b border-gray-200 pb-6 mb-8">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-widest text-[#1240cc] mb-2">
                        Generated record
                      </p>
                      <h2 className="text-3xl font-bold text-black">
                        BIMI Configuration
                      </h2>
                    </div>
                    <button
                      onClick={() => {
                        setGeneratedRecord(null);
                        setConfig({
                          logoUrl: '',
                          certificateUrl: '',
                          selector: 'default',
                          emailProvider: 'generic',
                          dmarcPolicy: '',
                          logoValidated: false,
                          trademarkVerified: false
                        });
                      }}
                      className="px-5 py-2.5 text-sm font-medium text-black border border-gray-300 rounded-full hover:border-[#1240cc] hover:text-[#1240cc] transition-all"
                    >
                      Generate New
                    </button>
                  </div>
                </div>

                {generatedRecord.error ? (
                  // Error State
                  <div className="p-6 bg-white border border-red-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0">
                        <X className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-black mb-1">Generation Failed</h3>
                        <p className="text-sm text-gray-500">{generatedRecord.message}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Generated Record */}
                    <div className="mb-8">
                      <div className="p-6 bg-white border border-green-200 rounded-xl">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-base font-semibold text-black flex items-center gap-2">
                            <Check className="w-5 h-5 text-green-600" />
                            Your BIMI Record
                          </h3>
                          <button
                            onClick={() => copyToClipboard(generatedRecord.record, 'record')}
                            className="p-2 text-gray-500 hover:text-[#1240cc] transition-colors"
                            title="Copy record"
                          >
                            {copiedRecord ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        <div className="p-4 bg-white border border-gray-200 rounded-lg">
                          <code className="text-xs text-black/80 font-mono break-all">
                            {generatedRecord.record}
                          </code>
                        </div>
                      </div>
                    </div>

                    {/* DNS Instructions */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-black mb-6">
                        DNS Configuration
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-4 border border-gray-200 rounded-xl">
                          <p className="text-sm font-medium text-black mb-1">Record Type</p>
                          <p className="text-base text-gray-500">TXT</p>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-xl">
                          <p className="text-sm font-medium text-black mb-1">TTL</p>
                          <p className="text-base text-gray-500">3600 (1 hour)</p>
                        </div>
                        <div className="md:col-span-2 p-4 border border-gray-200 rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-black">Host/Name</p>
                            <button
                              onClick={() => copyToClipboard(generatedRecord.dnsInstructions?.host || `${config.selector}._bimi`, 'host')}
                              className="p-1 text-gray-500 hover:text-[#1240cc] transition-colors"
                              title="Copy host"
                            >
                              {copiedHost ? (
                                <Check className="w-3 h-3 text-green-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                          <code className="text-sm text-black/80 font-mono">
                            {generatedRecord.dnsInstructions?.host || `${config.selector}._bimi`}
                          </code>
                        </div>
                      </div>
                    </div>

                    {/* Requirements Check */}
                    {generatedRecord.requirements && (
                      <div className="mb-8">
                        <h3 className="text-xl font-bold text-black mb-6">
                          Requirements Checklist
                        </h3>

                        <div className="grid md:grid-cols-3 gap-6">
                          {/* Logo Requirements */}
                          <div className="p-4 border border-gray-200 rounded-xl">
                            <h4 className="text-base font-semibold text-black mb-3 flex items-center gap-2">
                              <Image className="w-4 h-4" />
                              Logo
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                {generatedRecord.requirements.logo?.isHttps ? (
                                  <Check className="w-4 h-4 text-green-600" />
                                ) : (
                                  <X className="w-4 h-4 text-red-600" />
                                )}
                                <span className="text-gray-500">HTTPS hosting</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {generatedRecord.requirements.logo?.isSvg ? (
                                  <Check className="w-4 h-4 text-green-600" />
                                ) : (
                                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                                )}
                                <span className="text-gray-500">SVG format</span>
                              </div>
                            </div>
                          </div>

                          {/* VMC Requirements */}
                          <div className="p-4 border border-gray-200 rounded-xl">
                            <h4 className="text-base font-semibold text-black mb-3 flex items-center gap-2">
                              <Award className="w-4 h-4" />
                              VMC
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                {generatedRecord.requirements.vmc?.hasUrl || config.emailProvider !== 'gmail' ? (
                                  config.emailProvider === 'gmail' && !generatedRecord.requirements.vmc?.hasUrl ? (
                                    <X className="w-4 h-4 text-red-600" />
                                  ) : (
                                    <Check className="w-4 h-4 text-green-600" />
                                  )
                                ) : (
                                  <X className="w-4 h-4 text-red-600" />
                                )}
                                <span className="text-gray-500">
                                  {config.emailProvider === 'gmail' ? 'Required' : 'Optional'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* DMARC Requirements */}
                          <div className="p-4 border border-gray-200 rounded-xl">
                            <h4 className="text-base font-semibold text-black mb-3 flex items-center gap-2">
                              <Shield className="w-4 h-4" />
                              DMARC
                            </h4>
                            <p className="text-sm text-gray-500">
                              {generatedRecord.requirements.dmarc?.description || 'Policy required'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Implementation Steps */}
                    {generatedRecord.implementationSteps && (
                      <div className="mb-8">
                        <h3 className="text-xl font-bold text-black mb-6">
                          Implementation Steps
                        </h3>
                        <div className="space-y-4">
                          {generatedRecord.implementationSteps.map((step, index) => (
                            <div key={index} className="flex gap-4">
                              <span className="flex-shrink-0 w-8 h-8 bg-[#1240cc] text-white rounded-full flex items-center justify-center text-sm font-bold">
                                {index + 1}
                              </span>
                              <p className="text-sm text-gray-500 pt-1">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Warnings */}
                    {generatedRecord.warnings && generatedRecord.warnings.length > 0 && (
                      <div className="mb-8">
                        <div className="p-6 bg-white border border-yellow-200 rounded-xl">
                          <h3 className="text-base font-semibold text-black mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-yellow-600" />
                            Important Notes
                          </h3>
                          <ul className="space-y-2">
                            {generatedRecord.warnings.map((warning, index) => (
                              <li key={index} className="text-sm text-gray-500">
                                • {warning}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
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
                onClick={() => trackClick('tool_cta_banner', { tool: 'bimi-generator' })}
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
                href="/resources/tools/bimi-checker"
                onClick={() => trackClick('tool_navigation', { from: 'bimi-generator', to: 'bimi-checker' })}
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                  BIMI Record Checker
                </h3>
                <p className="text-sm text-gray-500">
                  Validate existing BIMI records and logo configuration.
                </p>
              </Link>

              <Link
                href="/resources/tools/dmarc-generator"
                onClick={() => trackClick('tool_navigation', { from: 'bimi-generator', to: 'dmarc-generator' })}
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                  DMARC Record Generator
                </h3>
                <p className="text-sm text-gray-500">
                  Create DMARC policy required for BIMI.
                </p>
              </Link>

              <Link
                href="/resources/tools/deliverability-score"
                onClick={() => trackClick('tool_navigation', { from: 'bimi-generator', to: 'deliverability-score' })}
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                  Deliverability Score
                </h3>
                <p className="text-sm text-gray-500">
                  Get a complete email deliverability assessment.
                </p>
              </Link>

              <Link
                href="/resources/tools/spf-generator"
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                  SPF Generator
                </h3>
                <p className="text-sm text-gray-500">
                  Create SPF records for email authorization.
                </p>
              </Link>

              <Link
                href="/resources/tools/dkim-generator"
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                  DKIM Generator
                </h3>
                <p className="text-sm text-gray-500">
                  Generate DKIM keys for email signing.
                </p>
              </Link>

              <Link
                href="/resources/tools/spam-checker"
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                  Spam Checker
                </h3>
                <p className="text-sm text-gray-500">
                  Check email content for spam triggers.
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
              Implementation
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-black mb-4">
              BIMI implementation guide
            </h2>

            <p className="text-base text-gray-500 leading-relaxed mb-8">
              BIMI (Brand Indicators for Message Identification) displays your logo next to authenticated
              emails. Success requires proper logo formatting, strong DMARC policy, and optional VMC for Gmail.
            </p>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-lg font-semibold text-black mb-4">
                  Logo preparation
                </h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      SVG Tiny P/S format
                    </p>
                    <p className="text-sm text-gray-500">
                      Strict format with no scripts, animations, or external refs.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Square aspect ratio
                    </p>
                    <p className="text-sm text-gray-500">
                      1:1 ratio with centered logo on solid background.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Size limits
                    </p>
                    <p className="text-sm text-gray-500">
                      Maximum 32KB file size for optimal performance.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-black mb-4">
                  VMC process
                </h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Trademark required
                    </p>
                    <p className="text-sm text-gray-500">
                      Registered trademark in eligible jurisdiction.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Certificate cost
                    </p>
                    <p className="text-sm text-gray-500">
                      $1,000-$1,500 annually from DigiCert or Entrust.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Processing time
                    </p>
                    <p className="text-sm text-gray-500">
                      2-4 weeks for verification and issuance.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-white border border-gray-200 rounded-xl">
              <h3 className="text-lg font-semibold text-black mb-4">
                Deployment timeline
              </h3>
              <div className="space-y-3 text-sm text-gray-500">
                <div className="flex items-start gap-3">
                  <span className="font-semibold text-black">Week 1:</span>
                  <span>Prepare logo in SVG Tiny format, validate specifications</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-semibold text-black">Week 2:</span>
                  <span>Ensure DMARC at quarantine/reject with good alignment</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-semibold text-black">Week 3-5:</span>
                  <span>Apply for and receive VMC if targeting Gmail</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-semibold text-black">Week 6:</span>
                  <span>Deploy BIMI record, monitor logo display</span>
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
              Professional BIMI implementation
            </h2>
            <p className="text-base text-gray-500 mb-8">
              Let Infrabox handle your complete BIMI setup, from logo optimization to VMC procurement.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://app.infrabox.software/signup"
                onClick={() => trackClick('tool_cta', { tool: 'bimi-generator', action: 'signup' })}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1240cc] text-white text-sm font-semibold rounded-full hover:bg-[#0b34b4] transition-colors"
              >
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