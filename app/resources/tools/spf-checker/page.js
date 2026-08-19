'use client'

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import {
  Check,
  X,
  ArrowRight,
  Copy,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  Minus
} from "lucide-react";
import { trackClick } from '@/lib/datafast';
import Link from "next/link";

export default function SPFCheckerPage() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [openItems, setOpenItems] = useState(new Set([0]));

  const checkSPF = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/tools/spf-checker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain }),
      });

      if (!response.ok) {
        throw new Error('Failed to check SPF record');
      }

      const data = await response.json();
      setResults(data);
      trackClick('tool_use', { tool: 'SPF Checker' });
    } catch (error) {
      console.error('Error checking SPF:', error);
      setResults({
        error: true,
        message: 'Unable to check SPF record. Please verify the domain and try again.'
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
    trackClick('copy_result', { tool: 'SPF Checker' });
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
      question: "What is an SPF record?",
      answer: "An SPF (Sender Policy Framework) record is a DNS TXT record published at your domain's root that lists all the IP addresses and mail servers authorized to send email on behalf of your domain. When a receiving server gets an email claiming to be from your domain, it checks this record to verify the sender is legitimate. SPF helps prevent email spoofing and improves deliverability."
    },
    {
      question: "How do I check my SPF record?",
      answer: "Simply enter your domain name (e.g., company.com) into the Infrabox SPF Checker tool above and click 'Check SPF Record'. We will query your DNS, retrieve the SPF TXT record, parse all mechanisms and modifiers, count DNS lookups, and report on your configuration's validity with actionable recommendations."
    },
    {
      question: "What does an SPF soft fail (~all) mean?",
      answer: "A soft fail (~all) tells receiving servers to accept emails from unauthorized IPs but mark them as suspicious or potential spam. This is the recommended setting for most domains during initial rollout, as it prevents legitimate emails from being rejected outright while still providing protection against spoofing. Once you have verified all legitimate senders, you can move to a hard fail (-all)."
    },
    {
      question: "Why is my SPF record invalid?",
      answer: "Common reasons for invalid SPF records include: exceeding the 10 DNS lookup limit (include, a, mx, redirect each count as one lookup), syntax errors in the record, having multiple SPF records (you can only have one per domain), missing the 'v=spf1' version prefix, or referencing non-existent include domains. Our tool provides detailed error messages to help you fix these issues."
    },
    {
      question: "What is the 10 DNS lookup limit in SPF?",
      answer: "The SPF specification (RFC 7208) limits the number of DNS-querying mechanisms to 10 per SPF evaluation. Mechanisms that trigger lookups include: 'include', 'a', 'mx', 'redirect', and 'exists'. IP-based mechanisms like 'ip4' and 'ip6' do not count. Exceeding this limit causes a 'permerror' result, effectively breaking your SPF. Use our checker to count your current lookups."
    },
    {
      question: "Can I have multiple SPF records?",
      answer: "No, you can only have one SPF TXT record per domain. Having multiple SPF records will cause a 'permerror' and your SPF will fail validation entirely. If you need to authorize multiple senders, combine them into a single record using 'include' mechanisms. For example: v=spf1 include:_spf.google.com include:sendgrid.net ~all"
    },
    {
      question: "What is the difference between -all, ~all, and ?all?",
      answer: "These are SPF qualifiers that define the policy for emails from unauthorized senders. '-all' (hard fail) instructs receivers to reject unauthorized emails outright. '~all' (soft fail) marks them as suspicious but still delivers them, often to spam. '?all' (neutral) takes no stance. '+all' (pass all) allows any sender -- this is dangerous and should never be used. Most organizations should use ~all during testing and -all in production."
    },
    {
      question: "How does SPF work with DMARC?",
      answer: "DMARC uses SPF as one of its two authentication mechanisms (the other being DKIM). For DMARC to pass via SPF, two things must be true: the SPF check itself must pass (the sending IP is authorized), and the SPF domain must align with the From header domain. Alignment can be relaxed (subdomain match allowed) or strict (exact match required). Even if SPF fails, DMARC can still pass if DKIM succeeds."
    },
    {
      question: "How do I add third-party senders to my SPF record?",
      answer: "To authorize a third-party sender (like SendGrid, Mailchimp, or HubSpot), add their SPF include mechanism to your existing record. For example, to add SendGrid: v=spf1 include:_spf.google.com include:sendgrid.net ~all. Each provider publishes their own SPF include domain -- check their documentation. Be mindful of the 10 DNS lookup limit when adding multiple includes."
    },
    {
      question: "What happens when SPF authentication fails?",
      answer: "When SPF fails, the result depends on your SPF policy qualifier. With '-all', the email may be rejected entirely. With '~all', it is typically delivered to spam. The SPF result is also fed into DMARC evaluation -- if both SPF and DKIM fail with DMARC alignment, the DMARC policy (none/quarantine/reject) determines the final outcome. Failed SPF can also negatively impact your domain's sending reputation over time."
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
            <span className="text-gray-600">SPF Checker</span>
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
              SPF record checker
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
              Validate your SPF records and email authentication configuration.
              Ensure authorized servers can send emails on your domain's behalf.
            </p>
          </div>
        </div>
      </section>

      {/* Main Tool Section */}
      <section className="bg-white min-h-[600px]">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto pb-16">
            {!results ? (
              // Input Form
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
                        onKeyDown={(e) => e.key === 'Enter' && domain && checkSPF()}
                      />
                    </div>
                  </div>

                  <button
                    onClick={checkSPF}
                    disabled={!domain || loading}
                    className="w-full px-8 py-4 bg-[#1240cc] text-white font-semibold rounded-full hover:bg-[#0b34b4] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Checking SPF record...
                      </span>
                    ) : (
                      'Check SPF Record'
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
                    {/* SPF Status Card */}
                    <div className="p-6 bg-white border border-gray-200 mb-8">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <h3 className="text-base font-semibold text-black">
                            SPF Record
                          </h3>
                          <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 ${results.exists ? (results.valid ? 'text-green-700 bg-green-50 border border-green-200' : 'text-red-700 bg-red-50 border border-red-200')
                            : 'text-gray-700 bg-gray-50 border border-gray-200'
                            }`}>
                            {results.exists ? (results.valid ? 'Valid' : 'Invalid') : 'Not Found'}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mb-4">
                        DNS TXT record that specifies authorized mail servers
                      </p>

                      {results.record && (
                        <div className="p-4 bg-gray-50 border border-gray-200">
                          <div className="flex items-start justify-between gap-3">
                            <pre className="text-xs text-gray-700 font-mono overflow-x-auto flex-1">
                              {results.record}
                            </pre>
                            <button
                              onClick={() => copyToClipboard(results.record)}
                              className="flex-shrink-0 p-2 text-gray-400 hover:text-[#1240cc] transition-colors"
                              title="Copy to clipboard"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Analysis Details */}
                    {results.analysis && (
                      <div className="space-y-8">
                        <h3 className="text-xl font-bold text-black">
                          Analysis Details
                        </h3>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="p-6 bg-white border border-gray-200">
                            <h4 className="font-semibold text-black mb-3">DNS Lookups</h4>
                            <div className="flex items-center gap-3 mb-3">
                              <span className={`text-3xl font-bold ${results.analysis.lookupCount > 10 ? 'text-red-600' : 'text-green-600'
                                }`}>
                                {results.analysis.lookupCount || 0}
                              </span>
                              <div>
                                <p className="text-sm text-gray-500">out of 10 max</p>
                                {results.analysis.lookupCount > 10 && (
                                  <p className="text-xs text-red-600">
                                    Exceeds limit
                                  </p>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-gray-500">
                              SPF records are limited to 10 DNS lookups to prevent infinite loops
                            </p>
                          </div>

                          <div className="p-6 bg-white border border-gray-200">
                            <h4 className="font-semibold text-black mb-3">Policy Mode</h4>
                            <div className="mb-3">
                              <code className="text-lg font-semibold text-[#1240cc] bg-gray-50 px-2 py-1 rounded">
                                {results.analysis.policy || '~all'}
                              </code>
                            </div>
                            <p className="text-sm text-gray-500">
                              {results.analysis.policy === '-all' ? 'Hard fail - Reject unauthorized emails' :
                                results.analysis.policy === '~all' ? 'Soft fail - Mark as suspicious (recommended)' :
                                  results.analysis.policy === '?all' ? 'Neutral - No policy specified' : 'Pass all - Accept any sender'}
                            </p>
                          </div>
                        </div>

                        {/* Mechanisms */}
                        {results.analysis.mechanisms && results.analysis.mechanisms.length > 0 && (
                          <div className="p-6 bg-white border border-gray-200">
                            <h4 className="font-semibold text-black mb-4">Authorized Mechanisms</h4>
                            <div className="grid gap-3">
                              {results.analysis.mechanisms.map((mechanism, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200">
                                  <div className="w-6 h-6 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Check className="w-4 h-4 text-green-600" />
                                  </div>
                                  <code className="text-sm font-mono text-black bg-white px-2 py-1 rounded border flex-1">
                                    {mechanism}
                                  </code>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Warnings */}
                        {results.analysis.warnings && results.analysis.warnings.length > 0 && (
                          <div className="p-6 bg-white border border-yellow-200">
                            <h4 className="font-semibold text-black mb-4 flex items-center gap-2">
                              <AlertTriangle className="w-5 h-5 text-yellow-600" />
                              Warnings
                            </h4>
                            <ul className="space-y-3">
                              {results.analysis.warnings.map((warning, index) => (
                                <li key={index} className="text-sm text-gray-500 flex gap-2">
                                  <span className="text-yellow-600 mt-0.5">•</span>
                                  <span>{warning}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
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
                  Infrabox automatically configures SPF, DKIM, DMARC, and BIMI for all your domains.
                </p>
              </div>
              <a
                href="https://app.infrabox.software/signup"
                onClick={() => trackClick('tool_cta_banner', { tool: 'spf-checker' })}
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

            {/* What is SPF */}
            <div className="mb-16">
              <p className="font-mono text-xs uppercase tracking-widest text-[#1240cc] mb-3">
                Overview
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-black mb-4">
                What is SPF?
              </h2>
              <p className="text-base text-gray-500 leading-relaxed mb-4">
                Sender Policy Framework (SPF) is an email authentication protocol that allows domain owners to specify which
                mail servers are authorized to send email on behalf of their domain. It works by publishing a DNS TXT record
                that lists approved sending sources -- IP addresses, mail servers, and third-party services.
              </p>
              <p className="text-base text-gray-500 leading-relaxed">
                When a receiving mail server gets an email, it checks the SPF record of the sender's domain to verify the
                sending server is authorized. If the server's IP is not listed, the email may be flagged as spam or rejected
                depending on the SPF policy. SPF is one of the three core email authentication protocols alongside DKIM and DMARC.
              </p>
            </div>

            {/* SPF Record Structure */}
            <div className="mb-16">
              <p className="font-mono text-xs uppercase tracking-widest text-[#1240cc] mb-3">
                Record format
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-black mb-4">
                What is an SPF record?
              </h2>
              <p className="text-base text-gray-500 leading-relaxed mb-6">
                An SPF record is a DNS TXT record that defines authorized senders using mechanisms and qualifiers.
                Here are the key components:
              </p>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="p-5 border border-gray-200 bg-white">
                  <p className="font-mono text-xs uppercase tracking-wider text-gray-400 mb-2">Version</p>
                  <code className="text-sm bg-gray-50 px-2 py-1 font-mono text-gray-700 border border-gray-200">v=spf1</code>
                  <p className="text-xs text-gray-500 mt-3">Required prefix identifying the record as SPF</p>
                </div>
                <div className="p-5 border border-gray-200 bg-white">
                  <p className="font-mono text-xs uppercase tracking-wider text-gray-400 mb-2">Mechanisms</p>
                  <code className="text-sm bg-gray-50 px-2 py-1 font-mono text-gray-700 border border-gray-200">include: ip4:</code>
                  <p className="text-xs text-gray-500 mt-3">Define authorized senders (IPs, includes, mx, a)</p>
                </div>
                <div className="p-5 border border-gray-200 bg-white">
                  <p className="font-mono text-xs uppercase tracking-wider text-gray-400 mb-2">Qualifier</p>
                  <code className="text-sm bg-gray-50 px-2 py-1 font-mono text-gray-700 border border-gray-200">~all / -all</code>
                  <p className="text-xs text-gray-500 mt-3">Policy for unauthorized senders (soft/hard fail)</p>
                </div>
              </div>
              <div className="p-5 bg-gray-50 border border-gray-200">
                <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-2">Example SPF Record</p>
                <code className="text-sm text-gray-700 font-mono break-all">
                  v=spf1 include:_spf.google.com include:sendgrid.net ip4:203.0.113.0/24 ~all
                </code>
              </div>
            </div>

            {/* What we validate */}
            <div className="mb-16">
              <p className="font-mono text-xs uppercase tracking-widest text-[#1240cc] mb-3">
                Validation
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-black mb-4">
                What our SPF checker validates
              </h2>
              <p className="text-base text-gray-500 leading-relaxed mb-6">
                Our free SPF checker performs a comprehensive analysis of your domain's SPF configuration:
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { title: "DNS Record Presence", desc: "Verifies that an SPF TXT record exists for your domain" },
                  { title: "Record Syntax", desc: "Validates the SPF record format including version tag and mechanisms" },
                  { title: "DNS Lookup Count", desc: "Counts total DNS lookups and warns if exceeding the 10 lookup limit" },
                  { title: "Policy Analysis", desc: "Evaluates your all-mechanism qualifier (~all, -all, ?all)" },
                  { title: "Mechanism Parsing", desc: "Lists all authorized include, ip4, ip6, mx, and a mechanisms" },
                  { title: "Common Warnings", desc: "Detects multiple SPF records, deprecated ptr mechanism, and more" },
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

            {/* How SPF works + Benefits -- 2-column grid */}
            <div className="mb-16">
              <p className="font-mono text-xs uppercase tracking-widest text-[#1240cc] mb-3">
                Implementation
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-black mb-6">
                How SPF works & why it matters
              </h2>
              <div className="grid md:grid-cols-2 gap-px bg-gray-200 border border-gray-200">
                <div className="bg-white p-6">
                  <p className="font-mono text-xs uppercase tracking-wider text-gray-400 mb-4">
                    How SPF Works
                  </p>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-black">1. DNS publication</p>
                      <p className="text-xs text-gray-500 mt-0.5">You publish a TXT record listing all authorized sending sources.</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">2. Email received</p>
                      <p className="text-xs text-gray-500 mt-0.5">Receiving server extracts the envelope sender domain from the email.</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">3. SPF lookup</p>
                      <p className="text-xs text-gray-500 mt-0.5">Server queries DNS for the SPF record and checks if the sender IP is authorized.</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">4. Policy enforcement</p>
                      <p className="text-xs text-gray-500 mt-0.5">Unauthorized emails are handled per your policy (~all, -all, etc).</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6">
                  <p className="font-mono text-xs uppercase tracking-wider text-gray-400 mb-4">
                    Benefits of SPF
                  </p>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-black">Prevents spoofing</p>
                      <p className="text-xs text-gray-500 mt-0.5">Makes it significantly harder for attackers to forge emails from your domain.</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">Improves deliverability</p>
                      <p className="text-xs text-gray-500 mt-0.5">Legitimate emails are more likely to reach the inbox instead of spam.</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">Domain protection</p>
                      <p className="text-xs text-gray-500 mt-0.5">Protects your domain reputation from abuse by spammers and phishers.</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">DMARC foundation</p>
                      <p className="text-xs text-gray-500 mt-0.5">SPF is required for DMARC alignment, enabling full authentication coverage.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mb-16">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-6 border border-gray-200 bg-white text-center">
                  <p className="text-3xl font-bold text-[#1240cc] mb-1">10</p>
                  <p className="font-mono text-xs uppercase tracking-wider text-gray-400">Max DNS lookups</p>
                </div>
                <div className="p-6 border border-gray-200 bg-white text-center">
                  <p className="text-3xl font-bold text-[#1240cc] mb-1">94%</p>
                  <p className="font-mono text-xs uppercase tracking-wider text-gray-400">Top domains use SPF</p>
                </div>
                <div className="p-6 border border-gray-200 bg-white text-center">
                  <p className="text-3xl font-bold text-[#1240cc] mb-1">1</p>
                  <p className="font-mono text-xs uppercase tracking-wider text-gray-400">Record per domain</p>
                </div>
              </div>
            </div>

            {/* Common Issues */}
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-[#1240cc] mb-3">
                Troubleshooting
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-black mb-6">
                Common SPF configuration issues
              </h2>
              <div className="border border-gray-200 divide-y divide-gray-200">
                {[
                  { issue: "Too many DNS lookups", detail: "Exceeding the 10 lookup limit causes permerror -- flatten includes or use ip4/ip6" },
                  { issue: "Multiple SPF records", detail: "Only one SPF record per domain is allowed; merge them into a single record" },
                  { issue: "Missing v=spf1 prefix", detail: "Every SPF record must begin with v=spf1 to be recognized" },
                  { issue: "Using deprecated ptr mechanism", detail: "The ptr mechanism is slow and unreliable; replace with ip4 or include" },
                  { issue: "Overly permissive +all", detail: "Using +all allows any server to send as your domain -- never use this" },
                  { issue: "Missing third-party includes", detail: "Forgetting to add services like SendGrid or Mailchimp causes their emails to fail SPF" },
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
                { href: "/resources/tools/spf-generator", title: "SPF Record Generator", desc: "Create properly formatted SPF records for your domain." },
                { href: "/resources/tools/dkim-checker", title: "DKIM Record Checker", desc: "Verify DKIM signatures and public key configuration." },
                { href: "/resources/tools/dmarc-checker", title: "DMARC Policy Checker", desc: "Check DMARC policy configuration and alignment settings." },
                { href: "/resources/tools/deliverability-score", title: "Deliverability Score", desc: "Get a complete email deliverability assessment." },
                { href: "/resources/tools/spam-checker", title: "Spam Checker", desc: "Test email content for potential spam triggers." },
                { href: "/resources/tools/domain-scanner", title: "Domain Scanner", desc: "Comprehensive scan of all email authentication records." },
              ].map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  onClick={() => trackClick('tool_navigation', { from: 'spf-checker', to: tool.href.split('/').pop() })}
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
                  Configure SPF, DKIM, and DMARC records correctly for authentication.
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
              Perfect your email authentication
            </h2>
            <p className="text-base text-gray-500 mb-8">
              Infrabox provides complete email infrastructure with automated SPF, DKIM,
              and DMARC setup across all your sending domains.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://app.infrabox.software/signup"
                onClick={() => trackClick('tool_cta', { tool: 'spf-checker', action: 'signup' })}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1240cc] text-white text-sm font-semibold rounded-full hover:bg-[#0b34b4] transition-colors"
              >
                Get Started
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <Link
                href="/learn/email-deliverability-guide"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-black text-sm font-semibold rounded-full hover:border-gray-400 transition-colors"
              >
                Read SPF guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
