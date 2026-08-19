'use client'

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToolTracking } from "@/components/ToolTracker";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Key,
  Server,
  Lock,
  RefreshCw,
  Copy,
  Info,
  Search,
  Plus,
  Minus,
  ChevronRight,
  FileCheck,
  Zap,
  Mail,
  X,
  Check
} from "lucide-react";

export default function DKIMCheckerPage() {
  const [domain, setDomain] = useState("");
  const [selector, setSelector] = useState("");
  const [useAutoDetect, setUseAutoDetect] = useState(true);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [openItems, setOpenItems] = useState(new Set([0]));

  const { trackFormStart, trackFormSubmit, trackResult, trackCopy, trackError } = useToolTracking('dkim_checker');

  const commonSelectors = [
    'google', 'default', 'selector1', 'selector2',
    'mailgun', 'sendgrid', 'mandrill', 'postmark',
    'amazonses', 'mailchimp', 'zoho', 'microsoft'
  ];

  const checkDKIM = async () => {
    setLoading(true);
    trackFormSubmit({
      domain,
      selector: useAutoDetect ? 'auto_detect' : selector,
      use_auto_detect: useAutoDetect
    });

    try {
      const response = await fetch('/api/tools/dkim-checker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain,
          selector: useAutoDetect ? null : selector,
          autoDetect: useAutoDetect
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to check DKIM record');
      }

      const data = await response.json();
      setResults(data);
      trackResult(true, {
        domain,
        selector: data.selector || selector,
        valid: data.valid || false
      });
    } catch (error) {
      console.error('Error checking DKIM:', error);
      const errorMessage = 'Unable to check DKIM record. Please verify the domain and selector.';
      setResults({
        error: true,
        message: errorMessage
      });
      trackError('api_error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setDomain("");
    setSelector("");
    setUseAutoDetect(true);
    setResults(null);
  };

  const copyToClipboard = (text, contentType = 'result') => {
    navigator.clipboard.writeText(text);
    trackCopy(contentType);
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
      question: "What is a DKIM checker?",
      answer: "A DKIM checker is a tool that validates the DomainKeys Identified Mail (DKIM) record for a specific domain and selector. It queries DNS for the public key published at selector._domainkey.yourdomain.com, verifies the record syntax, and confirms the key can be used to authenticate email signatures."
    },
    {
      question: "How do I find my DKIM selector?",
      answer: "The DKIM selector is usually provided by your email service provider (e.g., 'google' for Google Workspace, 'selector1' for Microsoft 365). You can also find it in the email headers of a message sent from your domain -- look for the 's=' tag in the DKIM-Signature header. Our auto-detect feature scans the most common selectors automatically."
    },
    {
      question: "Why is DKIM important for email deliverability?",
      answer: "DKIM adds a cryptographic digital signature to your emails, allowing receiving servers to verify that the message genuinely came from your domain and was not altered in transit. This directly improves inbox placement rates, protects your brand reputation from spoofing, and is required for DMARC alignment -- a prerequisite for BIMI logo display."
    },
    {
      question: "What if my DKIM check fails?",
      answer: "If the check fails, common causes include: the DKIM record is missing from DNS, the selector is incorrect, the record has syntax errors, the key has been revoked, or DNS propagation hasn't completed yet. Double-check the selector with your email provider, verify the DNS record is published correctly, and allow 24-48 hours for propagation."
    },
    {
      question: "What key size should I use for DKIM?",
      answer: "A 2048-bit RSA key is the recommended minimum for DKIM. While 1024-bit keys still technically work, they are considered cryptographically weak and some providers may flag them. Many modern email services now default to 2048-bit keys. If your DNS provider has TXT record length limits, you can split the key across multiple strings within the same record."
    },
    {
      question: "Can I have multiple DKIM records for one domain?",
      answer: "Yes, you can have multiple DKIM records using different selectors. This is common when you use multiple email services (e.g., Google Workspace for business email and SendGrid for transactional mail). Each service gets its own unique selector, and all can coexist without conflict since each record lives at a different DNS hostname."
    },
    {
      question: "How does DKIM differ from SPF?",
      answer: "SPF verifies that an email was sent from an authorized IP address by checking the envelope sender, while DKIM verifies that the email content has not been tampered with using cryptographic signatures on the message headers and body. Both are complementary -- SPF authorizes the sending server, DKIM authenticates the message itself. Together they form the foundation for DMARC."
    },
    {
      question: "What happens if DKIM alignment fails with DMARC?",
      answer: "DKIM alignment in DMARC checks that the domain in the DKIM signature (d= tag) matches the From header domain. If alignment fails for both DKIM and SPF, DMARC will apply its configured policy (none, quarantine, or reject). Relaxed alignment allows subdomain matching (e.g., mail.example.com passes for example.com), while strict requires an exact domain match."
    },
    {
      question: "What is DKIM key rotation and why does it matter?",
      answer: "DKIM key rotation is the practice of periodically generating new DKIM key pairs and updating your DNS records. This limits the window of exposure if a private key is compromised. Best practice is to rotate keys every 6-12 months. During rotation, publish the new key with a new selector before removing the old one, ensuring uninterrupted email authentication."
    },
    {
      question: "How long does DKIM DNS propagation take?",
      answer: "After adding or updating a DKIM record in DNS, propagation typically takes 15 minutes to 48 hours depending on your DNS provider and the TTL (Time To Live) settings. During this window, some receiving servers may not yet see your new record. We recommend waiting at least 1 hour before testing, and up to 24 hours for full global propagation."
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
            <span className="text-gray-600">DKIM Checker</span>
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
              DKIM record checker
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
              Validate DKIM signatures and verify email authentication configuration.
              Check public key records, key sizes, and cryptographic signing setup.
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
                      onFocus={trackFormStart}
                      placeholder="yourdomain.com"
                      className="w-full px-4 h-[52px] py-0 text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1240cc] focus:border-transparent transition-all placeholder:text-gray-400"
                      disabled={loading}
                      onKeyDown={(e) => e.key === 'Enter' && domain && checkDKIM()}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox
                      checked={useAutoDetect}
                      onCheckedChange={setUseAutoDetect}
                      className="mt-1 w-4 h-4 text-[#1240cc] rounded focus:ring-[#1240cc]"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-black">Auto-detect DKIM selector</span>
                      <p className="text-black/60 text-sm">
                        Automatically scan common selectors like google, default, selector1
                      </p>
                    </div>
                  </label>

                  {!useAutoDetect && (
                    <div>
                      <label htmlFor="selector" className="block text-sm font-medium text-black mb-2">
                        DKIM Selector
                      </label>
                      <Input
                        id="selector"
                        type="text"
                        value={selector}
                        onChange={(e) => setSelector(e.target.value)}
                        placeholder="google, default, selector1"
                        className="w-full px-4 h-[52px] py-0 text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1240cc] focus:border-transparent transition-all placeholder:text-gray-400"
                        disabled={loading}
                        onKeyDown={(e) => e.key === 'Enter' && domain && checkDKIM()}
                      />
                      <p className="text-sm text-black/60 mt-2">
                        Common selectors: {commonSelectors.slice(0, 4).join(', ')}
                      </p>
                    </div>
                  )}
                </div>

                <button
                  onClick={checkDKIM}
                  disabled={!domain || loading}
                  className="w-full px-8 py-4 bg-[#1240cc] text-white font-semibold rounded-full hover:bg-[#0b34b4] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {useAutoDetect ? 'Scanning selectors...' : 'Checking DKIM...'}
                    </span>
                  ) : (
                    'Check DKIM Records'
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
                  {results.records && results.records.length > 0 ? (
                    <div className="space-y-6">
                      <div className="p-6 bg-white border border-green-200">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                            <Check className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-black">
                              {results.records.length} DKIM Record{results.records.length > 1 ? 's' : ''} Found
                            </h3>
                            <p className="text-sm text-gray-500">
                              DKIM authentication configured for this domain
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {results.records.map((record, index) => (
                            <div key={index} className="border border-gray-200 p-4 bg-white">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h4 className="font-semibold text-black">
                                    Selector: {record.selector}
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    {record.selector}._domainkey.{domain}
                                  </p>
                                </div>
                                <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 ${record.valid
                                  ? 'text-green-700 bg-green-50 border border-green-200'
                                  : 'text-red-700 bg-red-50 border border-red-200'
                                  }`}>
                                  {record.valid ? 'Valid' : 'Invalid'}
                                </span>
                              </div>

                              {record.record && (
                                <div className="mt-3 p-3 bg-gray-50 border border-gray-200">
                                  <div className="flex items-start justify-between">
                                    <code className="text-xs text-gray-700 font-mono break-all flex-1">
                                      {record.record}
                                    </code>
                                    <button
                                      onClick={() => copyToClipboard(record.record)}
                                      className="ml-3 p-1 text-gray-400 hover:text-[#1240cc] transition-colors"
                                      title="Copy to clipboard"
                                    >
                                      <Copy className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              )}

                              {record.analysis && (
                                <div className="mt-3 space-y-2">
                                  {record.analysis.keySize && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <span className="text-gray-500">Key Size:</span>
                                      <span className={`font-medium ${record.analysis.keySize >= 2048
                                        ? 'text-green-600'
                                        : 'text-yellow-600'
                                        }`}>
                                        {record.analysis.keySize} bits
                                      </span>
                                      {record.analysis.keySize < 2048 && (
                                        <span className="text-yellow-600 text-xs">
                                          (2048+ recommended)
                                        </span>
                                      )}
                                    </div>
                                  )}

                                  {record.analysis.algorithm && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <span className="text-gray-500">Algorithm:</span>
                                      <span className="font-medium text-black">{record.analysis.algorithm}</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 bg-white border border-yellow-200">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-yellow-50 rounded-full flex items-center justify-center">
                          <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-black mb-1">No DKIM Records Found</h3>
                          <p className="text-sm text-gray-500 mb-3">
                            No DKIM records were detected for this domain. DKIM signing may not be configured.
                          </p>
                          {results.selectorsChecked && (
                            <p className="text-xs text-gray-400">
                              Checked selectors: {results.selectorsChecked.join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CTA for missing or invalid DKIM */}
                  {(!results.records || results.records.length === 0 ||
                    results.records.some(r => !r.valid)) && (
                      <div className="p-6 mt-8 bg-white border border-gray-200 hover:border-gray-300 transition-colors">
                        <h3 className="text-lg font-semibold text-black mb-3">
                          Need Help Setting Up DKIM?
                        </h3>
                        <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                          Infrabox automatically generates 2048-bit DKIM keys and configures DNS records for maximum email security.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Link
                            href="https://app.infrabox.software/signup"
                            className="px-6 py-3 bg-[#1240cc] text-white text-sm font-semibold rounded-full hover:bg-[#0b34b4] transition-all text-center shadow-lg hover:shadow-xl"
                          >
                            Get DKIM Setup
                          </Link>
                          <Link
                            href="/resources/tools/dkim-generator"
                            className="px-6 py-3 border border-gray-300 text-black text-sm font-semibold rounded-full hover:border-[#1240cc] hover:text-[#1240cc] transition-all text-center"
                          >
                            Generate DKIM Keys
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
                  Infrabox automatically generates and manages DKIM keys, SPF, DMARC, and BIMI for all your domains.
                </p>
              </div>
              <a
                href="https://app.infrabox.software/signup"
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

            {/* What is DKIM */}
            <div className="mb-16">
              <p className="font-mono text-xs uppercase tracking-widest text-[#1240cc] mb-3">
                Overview
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-black mb-4">
                What is DKIM?
              </h2>
              <p className="text-base text-gray-500 leading-relaxed mb-4">
                DomainKeys Identified Mail (DKIM) is an email authentication protocol that uses cryptographic signatures
                to verify that an email message was sent by the domain it claims to be from and that the content has not
                been tampered with during transit. It is one of the three pillars of email authentication alongside SPF and DMARC.
              </p>
              <p className="text-base text-gray-500 leading-relaxed">
                DKIM works by adding a digital signature header to outgoing emails using a private key held by the sending server.
                The corresponding public key is published as a DNS TXT record at <code className="text-sm bg-gray-100 px-1.5 py-0.5 font-mono text-gray-700">selector._domainkey.yourdomain.com</code>.
                Receiving mail servers retrieve this public key and use it to verify the signature, confirming the email's authenticity and integrity.
              </p>
            </div>

            {/* DKIM Record Structure */}
            <div className="mb-16">
              <p className="font-mono text-xs uppercase tracking-widest text-[#1240cc] mb-3">
                Record format
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-black mb-4">
                What is a DKIM record?
              </h2>
              <p className="text-base text-gray-500 leading-relaxed mb-6">
                A DKIM record is a DNS TXT record that contains the public key used to verify email signatures.
                It consists of several key-value pairs that define the key type, algorithm, and the public key data:
              </p>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="p-5 border border-gray-200 bg-white">
                  <p className="font-mono text-xs uppercase tracking-wider text-gray-400 mb-2">Version</p>
                  <code className="text-sm bg-gray-50 px-2 py-1 font-mono text-gray-700 border border-gray-200">v=DKIM1</code>
                  <p className="text-xs text-gray-500 mt-3">Identifies the record as DKIM version 1</p>
                </div>
                <div className="p-5 border border-gray-200 bg-white">
                  <p className="font-mono text-xs uppercase tracking-wider text-gray-400 mb-2">Key Type</p>
                  <code className="text-sm bg-gray-50 px-2 py-1 font-mono text-gray-700 border border-gray-200">k=rsa</code>
                  <p className="text-xs text-gray-500 mt-3">RSA is the standard algorithm (Ed25519 emerging)</p>
                </div>
                <div className="p-5 border border-gray-200 bg-white">
                  <p className="font-mono text-xs uppercase tracking-wider text-gray-400 mb-2">Public Key</p>
                  <code className="text-sm bg-gray-50 px-2 py-1 font-mono text-gray-700 border border-gray-200">p=MIGf...</code>
                  <p className="text-xs text-gray-500 mt-3">Base64-encoded public key data (2048-bit recommended)</p>
                </div>
              </div>
              <div className="p-5 bg-gray-50 border border-gray-200">
                <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-2">Example DKIM Record</p>
                <code className="text-sm text-gray-700 font-mono break-all">
                  v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBg...
                </code>
              </div>
            </div>

            {/* What we validate */}
            <div className="mb-16">
              <p className="font-mono text-xs uppercase tracking-widest text-[#1240cc] mb-3">
                Validation
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-black mb-4">
                What our DKIM checker validates
              </h2>
              <p className="text-base text-gray-500 leading-relaxed mb-6">
                Our free DKIM checker performs a comprehensive analysis of your domain's DKIM configuration:
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { title: "DNS Record Presence", desc: "Verifies that a DKIM TXT record exists at selector._domainkey.yourdomain.com" },
                  { title: "Record Syntax", desc: "Validates the DKIM record format including version tag and key parameters" },
                  { title: "Public Key Validity", desc: "Confirms the public key is properly Base64-encoded and parseable" },
                  { title: "Key Size Analysis", desc: "Checks key length and flags 1024-bit keys as potentially weak" },
                  { title: "Algorithm Detection", desc: "Identifies the signing algorithm (RSA, Ed25519) in use" },
                  { title: "Selector Auto-Detection", desc: "Scans 12+ common selectors to find all active DKIM records" },
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

            {/* How DKIM works + Common selectors -- 2-column grid */}
            <div className="mb-16">
              <p className="font-mono text-xs uppercase tracking-widest text-[#1240cc] mb-3">
                Implementation
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-black mb-6">
                How DKIM works & common selectors
              </h2>
              <div className="grid md:grid-cols-2 gap-px bg-gray-200 border border-gray-200">
                <div className="bg-white p-6">
                  <p className="font-mono text-xs uppercase tracking-wider text-gray-400 mb-4">
                    How DKIM Works
                  </p>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-black">1. Email signing</p>
                      <p className="text-xs text-gray-500 mt-0.5">Sending mail server signs outgoing messages with a private cryptographic key.</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">2. DNS publication</p>
                      <p className="text-xs text-gray-500 mt-0.5">Public key is published as a TXT record at selector._domainkey.domain.com.</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">3. Signature verification</p>
                      <p className="text-xs text-gray-500 mt-0.5">Receiving servers retrieve the public key and verify the email signature.</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">4. Authentication result</p>
                      <p className="text-xs text-gray-500 mt-0.5">Result is recorded in the Authentication-Results header for DMARC evaluation.</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6">
                  <p className="font-mono text-xs uppercase tracking-wider text-gray-400 mb-4">
                    Common Selectors by Provider
                  </p>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-black">Google Workspace</p>
                      <p className="text-xs text-gray-500 mt-0.5">Uses &apos;google&apos; selector with 2048-bit RSA keys by default.</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">Microsoft 365</p>
                      <p className="text-xs text-gray-500 mt-0.5">Uses &apos;selector1&apos; and &apos;selector2&apos; with CNAME records.</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">SendGrid</p>
                      <p className="text-xs text-gray-500 mt-0.5">Uses &apos;s1&apos; and &apos;s2&apos; or &apos;sendgrid&apos; selectors.</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">Amazon SES</p>
                      <p className="text-xs text-gray-500 mt-0.5">Uses unique selectors with CNAME records pointing to AWS.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mb-16">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-6 border border-gray-200 bg-white text-center">
                  <p className="text-3xl font-bold text-[#1240cc] mb-1">2048</p>
                  <p className="font-mono text-xs uppercase tracking-wider text-gray-400">Min recommended bits</p>
                </div>
                <div className="p-6 border border-gray-200 bg-white text-center">
                  <p className="text-3xl font-bold text-[#1240cc] mb-1">99%</p>
                  <p className="font-mono text-xs uppercase tracking-wider text-gray-400">Provider support</p>
                </div>
                <div className="p-6 border border-gray-200 bg-white text-center">
                  <p className="text-3xl font-bold text-[#1240cc] mb-1">12+</p>
                  <p className="font-mono text-xs uppercase tracking-wider text-gray-400">Selectors scanned</p>
                </div>
              </div>
            </div>

            {/* Common Issues */}
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-[#1240cc] mb-3">
                Troubleshooting
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-black mb-6">
                Common DKIM configuration issues
              </h2>
              <div className="border border-gray-200 divide-y divide-gray-200">
                {[
                  { issue: "Missing DKIM record", detail: "No TXT record at selector._domainkey -- check selector name and DNS zone" },
                  { issue: "Wrong selector name", detail: "Selector does not match what your email provider configured" },
                  { issue: "Key size too small", detail: "1024-bit keys are deprecated; upgrade to 2048-bit for security" },
                  { issue: "Syntax errors in record", detail: "Missing semicolons, incorrect tags, or malformed Base64 key data" },
                  { issue: "DNS propagation delay", detail: "New or updated records can take 24-48 hours to propagate globally" },
                  { issue: "Key revocation (p= empty)", detail: "An empty p= tag means the key has been revoked and is no longer valid" },
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
                { href: "/resources/tools/dkim-generator", title: "DKIM Key Generator", desc: "Generate DKIM key pairs and DNS records for email signing." },
                { href: "/resources/tools/spf-checker", title: "SPF Record Checker", desc: "Validate SPF records and email sender authorization." },
                { href: "/resources/tools/dmarc-checker", title: "DMARC Policy Checker", desc: "Check DMARC policy configuration and alignment settings." },
                { href: "/resources/tools/deliverability-score", title: "Deliverability Score", desc: "Get a complete email deliverability assessment." },
                { href: "/resources/tools/spam-checker", title: "Spam Checker", desc: "Test email content for potential spam triggers." },
                { href: "/resources/tools/domain-scanner", title: "Domain Scanner", desc: "Comprehensive scan of all email authentication records." },
              ].map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
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
              Automate your DKIM setup
            </h2>
            <p className="text-base text-gray-500 mb-8">
              Infrabox automatically generates and manages 2048-bit DKIM keys,
              handles DNS configuration, and monitors signing health across all your domains.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://app.infrabox.software/signup"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1240cc] text-white text-sm font-semibold rounded-full hover:bg-[#0b34b4] transition-colors"
              >
                Get Started
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <Link
                href="/learn/email-deliverability-guide"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-black text-sm font-semibold rounded-full hover:border-gray-400 transition-colors"
              >
                Read DKIM guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
