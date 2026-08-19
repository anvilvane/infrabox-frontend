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
  Mail,
  Lock,
  Activity,
  RefreshCw,
  Copy,
  TrendingUp,
  BarChart3,
  Check,
  X,
  Plus,
  Minus
} from "lucide-react";
import { trackClick } from '@/lib/datafast';

export default function DMARCCheckerPage() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [openItems, setOpenItems] = useState(new Set([0]));

  const checkDMARC = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/tools/dmarc-checker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain }),
      });

      if (!response.ok) {
        throw new Error('Failed to check DMARC record');
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error checking DMARC:', error);
      setResults({
        error: true,
        message: 'Unable to check DMARC record. Please verify the domain and try again.'
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

  const getPolicyColor = (policy) => {
    switch (policy) {
      case 'reject': return 'text-green-600';
      case 'quarantine': return 'text-yellow-600';
      case 'none': return 'text-gray-600';
      default: return 'text-gray-500';
    }
  };

  const getPolicyDescription = (policy) => {
    switch (policy) {
      case 'reject': return 'Strict - Reject unauthorized emails';
      case 'quarantine': return 'Moderate - Send to spam/quarantine';
      case 'none': return 'Monitor only - No action taken';
      default: return 'No policy set';
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
      question: "What is a DMARC checker?",
      answer: "A DMARC checker is a tool that looks up the DMARC DNS TXT record at _dmarc.yourdomain.com, validates its syntax, and analyzes the policy configuration. It verifies that your domain has proper protection against email spoofing and helps identify misconfigurations that could affect email deliverability or security."
    },
    {
      question: "What do the DMARC policies mean?",
      answer: "DMARC has three main policies: 'p=none' (monitoring only -- emails are delivered normally but reports are generated), 'p=quarantine' (suspicious emails are sent to spam folder), and 'p=reject' (suspicious emails are blocked completely and never delivered). Most organizations start with p=none to monitor, then gradually move to quarantine and finally reject."
    },
    {
      question: "Why is DMARC important?",
      answer: "DMARC is crucial for email security because it allows domain owners to specify exactly how receivers should handle emails that fail SPF and DKIM authentication. Without DMARC, attackers can freely spoof your domain to send phishing emails. DMARC also enables aggregate reporting so you can see who is sending email as your domain, and it is required for BIMI logo display in Gmail and Apple Mail."
    },
    {
      question: "How do I fix a 'DMARC record not found' error?",
      answer: "To fix this, you need to create a DMARC TXT record and add it to your domain's DNS settings with the hostname '_dmarc'. A simple starting record is: v=DMARC1; p=none; rua=mailto:dmarc-reports@yourdomain.com. You can use our DMARC Generator tool to create a properly formatted record. Allow 24-48 hours for DNS propagation after adding it."
    },
    {
      question: "What is the difference between p= and sp= in DMARC?",
      answer: "The 'p=' tag sets the policy for your main domain (e.g., example.com), while 'sp=' sets a separate policy for subdomains (e.g., mail.example.com). If sp= is not specified, subdomains inherit the main domain policy. This allows you to enforce a strict policy on your main domain while being more lenient on subdomains, or vice versa."
    },
    {
      question: "What are DMARC aggregate reports (rua)?",
      answer: "Aggregate reports (rua) are XML reports sent by receiving mail servers that summarize DMARC authentication results for your domain. They include data on which IPs sent email as your domain, whether SPF/DKIM passed or failed, and the volume of messages. Configure them by adding rua=mailto:reports@yourdomain.com to your DMARC record. Use a DMARC report analyzer to parse these XML files."
    },
    {
      question: "What are DMARC forensic reports (ruf)?",
      answer: "Forensic reports (ruf) provide detailed information about individual email messages that failed DMARC authentication. Unlike aggregate reports which are summaries, forensic reports contain message headers or even full email content. They are useful for investigating specific authentication failures, but many providers do not send them due to privacy concerns."
    },
    {
      question: "What is DMARC alignment?",
      answer: "DMARC alignment verifies that the domain authenticated by SPF or DKIM matches the From header domain visible to the recipient. Relaxed alignment (the default) allows subdomain matching -- so mail.example.com passes for example.com. Strict alignment requires an exact domain match. Alignment is what makes DMARC more effective than SPF or DKIM alone."
    },
    {
      question: "How long should I stay on p=none before enforcing?",
      answer: "Most security experts recommend monitoring with p=none for 2-4 weeks minimum while reviewing aggregate reports. During this time, identify all legitimate email sources and ensure they pass SPF and DKIM with proper alignment. Once you are confident all legitimate senders are authenticated, move to p=quarantine with pct=25, gradually increasing to pct=100, then finally p=reject."
    },
    {
      question: "Can DMARC break my legitimate email delivery?",
      answer: "Yes, if implemented incorrectly. Moving to p=quarantine or p=reject before ensuring all legitimate senders pass authentication will cause those emails to go to spam or be rejected. This is why the gradual approach matters: start with p=none, use the pct= tag to apply the policy to only a percentage of messages, and use aggregate reports to verify before full enforcement."
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
            <span className="text-gray-600">DMARC Checker</span>
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
              DMARC policy checker
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
              Validate DMARC policies and analyze email authentication alignment.
              Check policy configuration, reporting setup, and get insights for improved security.
            </p>
          </div>
        </div>
      </section>

      {/* Main Tool Section */}
      <section className="bg-white min-h-[600px]">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8 pb-16">
          {!results ? (
            // Input Form
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
                      onKeyDown={(e) => e.key === 'Enter' && domain && checkDMARC()}
                    />
                  </div>
                </div>

                <button
                  onClick={checkDMARC}
                  disabled={!domain || loading}
                  className="w-full px-8 py-4 bg-[#1240cc] text-white font-semibold rounded-full hover:bg-[#0b34b4] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Checking DMARC...
                    </span>
                  ) : (
                    'Check DMARC Record'
                  )}
                </button>
              </div>
            </div>
          ) : (
            // Results Display
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
                  {/* DMARC Status */}
                  <div className="mb-8">
                    <div className="p-6 bg-white border border-gray-200 hover:border-gray-300 transition-colors">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${results.exists ? 'bg-green-50' : 'bg-red-50'
                          }`}>
                          {results.exists ? (
                            <Check className="w-5 h-5 text-green-600" />
                          ) : (
                            <X className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-black">
                            DMARC Record {results.exists ? 'Found' : 'Not Found'}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {results.exists ? 'DMARC policy is configured' : 'No DMARC policy detected'}
                          </p>
                        </div>
                      </div>

                      {results.record && (
                        <div className="mt-4 p-4 bg-gray-50 border border-gray-200">
                          <div className="flex items-start justify-between">
                            <code className="text-xs text-gray-700 font-mono break-all flex-1">
                              {results.record}
                            </code>
                            <button
                              onClick={() => copyToClipboard(results.record)}
                              className="ml-3 p-1 text-gray-400 hover:text-[#1240cc] transition-colors"
                              title="Copy to clipboard"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Policy Details */}
                  {results.parsed && (
                    <div className="mb-12">
                      <h3 className="text-xl font-bold text-black mb-6">
                        Policy Configuration
                      </h3>

                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="p-4 border border-gray-200">
                          <h4 className="text-base font-semibold text-black mb-2">Main Policy</h4>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-2xl font-bold ${getPolicyColor(results.parsed.policy)}`}>
                              {results.parsed.policy || 'none'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            {getPolicyDescription(results.parsed.policy)}
                          </p>
                        </div>

                        <div className="p-4 border border-gray-200">
                          <h4 className="text-base font-semibold text-black mb-2">Percentage</h4>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl font-bold text-black">
                              {results.parsed.percentage || '100'}%
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            Applied to this percentage of emails
                          </p>
                        </div>
                      </div>

                      {/* Additional Settings */}
                      <div className="grid md:grid-cols-2 gap-6">
                        {results.parsed.subdomain_policy && (
                          <div className="p-4 border border-gray-200">
                            <h4 className="text-base font-semibold text-black mb-2">Subdomain Policy</h4>
                            <p className="text-lg font-semibold text-black">
                              {results.parsed.subdomain_policy}
                            </p>
                          </div>
                        )}

                        {results.parsed.alignment && (
                          <div className="p-4 border border-gray-200">
                            <h4 className="text-base font-semibold text-black mb-2">Alignment Mode</h4>
                            <p className="text-sm text-gray-500">
                              SPF: {results.parsed.alignment.spf || 'relaxed'}<br />
                              DKIM: {results.parsed.alignment.dkim || 'relaxed'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Reporting */}
                  {(results.parsed?.rua || results.parsed?.ruf) && (
                    <div className="mb-12">
                      <h3 className="text-xl font-bold text-black mb-6">
                        Reporting Configuration
                      </h3>
                      <div className="p-6 bg-white border border-gray-200">
                        {results.parsed.rua && (
                          <p className="text-sm text-gray-500 mb-2">
                            <strong className="text-black">Aggregate Reports (RUA):</strong> {results.parsed.rua}
                          </p>
                        )}
                        {results.parsed.ruf && (
                          <p className="text-sm text-gray-500">
                            <strong className="text-black">Forensic Reports (RUF):</strong> {results.parsed.ruf}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Warnings */}
                  {results.warnings && results.warnings.length > 0 && (
                    <div className="mb-12">
                      <h3 className="text-xl font-bold text-black mb-6">
                        Recommendations
                      </h3>
                      <div className="space-y-3">
                        {results.warnings.map((warning, index) => (
                          <div key={index} className="p-5 bg-white border border-gray-200 hover:border-gray-300 transition-colors">
                            <div className="flex items-start gap-3">
                              <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-gray-500 leading-relaxed">
                                {warning}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTA for improvement */}
                  {(!results.exists || (results.parsed && results.parsed.policy === 'none')) && (
                    <div className="p-6 bg-white border border-gray-200 hover:border-gray-300 transition-colors">
                      <h3 className="text-lg font-semibold text-black mb-3">
                        Strengthen Your DMARC Protection
                      </h3>
                      <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                        {!results.exists
                          ? "Without DMARC, your domain is vulnerable to spoofing and phishing attacks. Infrabox provides automated DMARC setup with monitoring and reporting."
                          : "Your DMARC policy is set to monitoring only. Upgrade to quarantine or reject for full protection with expert guidance."
                        }
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                          href="https://app.infrabox.software/signup"
                          onClick={() => trackClick('tool_cta', { tool: 'dmarc-checker', action: 'signup' })}
                          className="px-6 py-3 bg-[#1240cc] text-white text-sm font-semibold rounded-full hover:bg-[#0b34b4] transition-all text-center shadow-lg hover:shadow-xl"
                        >
                          Get DMARC Setup
                        </Link>
                        <Link
                          href="/resources/tools/dmarc-generator"
                          onClick={() => trackClick('tool_navigation', { from: 'dmarc-checker', to: 'dmarc-generator' })}
                          className="px-6 py-3 border border-gray-300 text-black text-sm font-semibold rounded-full hover:border-[#1240cc] hover:text-[#1240cc] transition-all text-center"
                        >
                          Generate DMARC Record
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
                  Infrabox automatically configures DMARC, SPF, DKIM, and BIMI for all your domains.
                </p>
              </div>
              <a
                href="https://app.infrabox.software/signup"
                onClick={() => trackClick('tool_cta_banner', { tool: 'dmarc-checker' })}
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

            {/* What is DMARC */}
            <div className="mb-16">
              <p className="font-mono text-xs uppercase tracking-widest text-[#1240cc] mb-3">
                Overview
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-black mb-4">
                What is DMARC?
              </h2>
              <p className="text-base text-gray-500 leading-relaxed mb-4">
                Domain-based Message Authentication, Reporting & Conformance (DMARC) is an email authentication protocol
                that builds upon SPF and DKIM to give domain owners policy control over how receiving servers should handle
                emails that fail authentication checks. It is the most important email security protocol for preventing
                domain spoofing and phishing attacks.
              </p>
              <p className="text-base text-gray-500 leading-relaxed">
                DMARC works by publishing a DNS TXT record at <code className="text-sm bg-gray-100 px-1.5 py-0.5 font-mono text-gray-700">_dmarc.yourdomain.com</code> that
                specifies your authentication policy and reporting preferences. When a receiving server processes an email
                from your domain, it checks SPF and DKIM results, verifies alignment with the From header domain, and
                applies your DMARC policy if both authentication methods fail.
              </p>
            </div>

            {/* DMARC Record Structure */}
            <div className="mb-16">
              <p className="font-mono text-xs uppercase tracking-widest text-[#1240cc] mb-3">
                Record format
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-black mb-4">
                What is a DMARC record?
              </h2>
              <p className="text-base text-gray-500 leading-relaxed mb-6">
                A DMARC record is a DNS TXT record that defines your email authentication policy.
                It consists of several key tags:
              </p>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="p-5 border border-gray-200 bg-white">
                  <p className="font-mono text-xs uppercase tracking-wider text-gray-400 mb-2">Version</p>
                  <code className="text-sm bg-gray-50 px-2 py-1 font-mono text-gray-700 border border-gray-200">v=DMARC1</code>
                  <p className="text-xs text-gray-500 mt-3">Required version tag identifying the record as DMARC</p>
                </div>
                <div className="p-5 border border-gray-200 bg-white">
                  <p className="font-mono text-xs uppercase tracking-wider text-gray-400 mb-2">Policy</p>
                  <code className="text-sm bg-gray-50 px-2 py-1 font-mono text-gray-700 border border-gray-200">p=reject</code>
                  <p className="text-xs text-gray-500 mt-3">How to handle failures: none, quarantine, or reject</p>
                </div>
                <div className="p-5 border border-gray-200 bg-white">
                  <p className="font-mono text-xs uppercase tracking-wider text-gray-400 mb-2">Reporting</p>
                  <code className="text-sm bg-gray-50 px-2 py-1 font-mono text-gray-700 border border-gray-200">rua=mailto:</code>
                  <p className="text-xs text-gray-500 mt-3">Email address to receive aggregate authentication reports</p>
                </div>
              </div>
              <div className="p-5 bg-gray-50 border border-gray-200">
                <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-2">Example DMARC Record</p>
                <code className="text-sm text-gray-700 font-mono break-all">
                  v=DMARC1; p=reject; rua=mailto:dmarc@example.com; ruf=mailto:forensics@example.com; pct=100; adkim=r; aspf=r
                </code>
              </div>
            </div>

            {/* What we validate */}
            <div className="mb-16">
              <p className="font-mono text-xs uppercase tracking-widest text-[#1240cc] mb-3">
                Validation
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-black mb-4">
                What our DMARC checker validates
              </h2>
              <p className="text-base text-gray-500 leading-relaxed mb-6">
                Our free DMARC checker performs a comprehensive analysis of your domain's DMARC configuration:
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { title: "DNS Record Presence", desc: "Verifies that a DMARC TXT record exists at _dmarc.yourdomain.com" },
                  { title: "Record Syntax", desc: "Validates the DMARC record format including version and required tags" },
                  { title: "Policy Analysis", desc: "Evaluates your p= policy level (none, quarantine, reject)" },
                  { title: "Subdomain Policy", desc: "Checks sp= tag for subdomain-specific policy configuration" },
                  { title: "Alignment Settings", desc: "Reviews adkim= and aspf= alignment mode (relaxed vs strict)" },
                  { title: "Reporting Setup", desc: "Validates rua= and ruf= reporting email addresses" },
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

            {/* Implementation steps + Policy levels -- 2-column grid */}
            <div className="mb-16">
              <p className="font-mono text-xs uppercase tracking-widest text-[#1240cc] mb-3">
                Implementation
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-black mb-6">
                DMARC implementation & policy levels
              </h2>
              <div className="grid md:grid-cols-2 gap-px bg-gray-200 border border-gray-200">
                <div className="bg-white p-6">
                  <p className="font-mono text-xs uppercase tracking-wider text-gray-400 mb-4">
                    Implementation Steps
                  </p>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-black">1. Setup SPF and DKIM</p>
                      <p className="text-xs text-gray-500 mt-0.5">Ensure proper SPF and DKIM authentication before implementing DMARC.</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">2. Start with p=none</p>
                      <p className="text-xs text-gray-500 mt-0.5">Monitor email flows for 2-4 weeks to understand your ecosystem.</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">3. Analyze reports</p>
                      <p className="text-xs text-gray-500 mt-0.5">Review aggregate reports to identify legitimate vs. fraudulent sources.</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">4. Enforce gradually</p>
                      <p className="text-xs text-gray-500 mt-0.5">Move to quarantine, then reject using percentage controls (pct=).</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6">
                  <p className="font-mono text-xs uppercase tracking-wider text-gray-400 mb-4">
                    Policy Levels
                  </p>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-black">None (p=none)</p>
                      <p className="text-xs text-gray-500 mt-0.5">Monitor mode -- collect data without affecting email delivery.</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">Quarantine (p=quarantine)</p>
                      <p className="text-xs text-gray-500 mt-0.5">Failed emails sent to spam folder for recipient review.</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">Reject (p=reject)</p>
                      <p className="text-xs text-gray-500 mt-0.5">Maximum protection -- unauthorized emails are blocked completely.</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">Percentage (pct=)</p>
                      <p className="text-xs text-gray-500 mt-0.5">Apply policy to a portion of messages for safe, gradual rollout.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mb-16">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-6 border border-gray-200 bg-white text-center">
                  <p className="text-3xl font-bold text-[#1240cc] mb-1">80%</p>
                  <p className="font-mono text-xs uppercase tracking-wider text-gray-400">Phishing reduction</p>
                </div>
                <div className="p-6 border border-gray-200 bg-white text-center">
                  <p className="text-3xl font-bold text-[#1240cc] mb-1">5M+</p>
                  <p className="font-mono text-xs uppercase tracking-wider text-gray-400">Domains with DMARC</p>
                </div>
                <div className="p-6 border border-gray-200 bg-white text-center">
                  <p className="text-3xl font-bold text-[#1240cc] mb-1">3</p>
                  <p className="font-mono text-xs uppercase tracking-wider text-gray-400">Policy levels</p>
                </div>
              </div>
            </div>

            {/* Common Issues */}
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-[#1240cc] mb-3">
                Troubleshooting
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-black mb-6">
                Common DMARC configuration issues
              </h2>
              <div className="border border-gray-200 divide-y divide-gray-200">
                {[
                  { issue: "Missing DMARC record", detail: "No TXT record at _dmarc.yourdomain.com -- add one to enable protection" },
                  { issue: "Policy stuck on p=none", detail: "Monitoring only provides no protection; plan to move to quarantine/reject" },
                  { issue: "No reporting configured", detail: "Missing rua= tag means you cannot see who sends email as your domain" },
                  { issue: "SPF/DKIM not aligned", detail: "Authentication passes but domain alignment fails -- check From header matching" },
                  { issue: "Third-party sender failures", detail: "SaaS services sending as your domain may fail DMARC -- verify their SPF/DKIM setup" },
                  { issue: "Subdomain policy missing", detail: "Without sp= tag, subdomains inherit main policy which may not be appropriate" },
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
                { href: "/resources/tools/dmarc-generator", title: "DMARC Record Generator", desc: "Create properly formatted DMARC records for your domain." },
                { href: "/resources/tools/spf-checker", title: "SPF Record Checker", desc: "Validate SPF records and email sender authorization." },
                { href: "/resources/tools/dkim-checker", title: "DKIM Record Checker", desc: "Verify DKIM signatures and public key configuration." },
                { href: "/resources/tools/deliverability-score", title: "Deliverability Score", desc: "Get a complete email deliverability assessment." },
                { href: "/resources/tools/spam-checker", title: "Spam Checker", desc: "Test email content for potential spam triggers." },
                { href: "/resources/tools/bimi-checker", title: "BIMI Checker", desc: "Validate BIMI logo configuration (requires DMARC)." },
              ].map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  onClick={() => trackClick('tool_navigation', { from: 'dmarc-checker', to: tool.href.split('/').pop() })}
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
                  Configure DMARC, SPF, and DKIM records correctly for authentication.
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
              Complete DMARC protection
            </h2>
            <p className="text-base text-gray-500 mb-8">
              Infrabox provides automated DMARC setup with monitoring, aggregate report
              analysis, and expert guidance for safe policy enforcement.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://app.infrabox.software/signup"
                onClick={() => trackClick('tool_cta', { tool: 'dmarc-checker', action: 'signup' })}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1240cc] text-white text-sm font-semibold rounded-full hover:bg-[#0b34b4] transition-colors"
              >
                Get Started
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <Link
                href="/learn/email-deliverability-guide"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-black text-sm font-semibold rounded-full hover:border-gray-400 transition-colors"
              >
                Read DMARC guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
