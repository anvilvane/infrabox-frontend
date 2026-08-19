'use client'

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  CheckCircle,
  XCircle,
  Plus,
  Minus,
  X,
  ArrowRight,
  Copy
} from "lucide-react";
import { trackClick } from '@/lib/datafast';

export default function SPFGeneratorPage() {
  const [ipAddresses, setIpAddresses] = useState(['']);
  const [includeDomains, setIncludeDomains] = useState(['']);
  const [mechanisms, setMechanisms] = useState({
    a: false,
    mx: false,
  });
  const [policy, setPolicy] = useState('~all');
  const [generatedRecord, setGeneratedRecord] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [openItems, setOpenItems] = useState(new Set([0]));

  const addIpAddress = () => {
    setIpAddresses([...ipAddresses, '']);
  };

  const removeIpAddress = (index) => {
    setIpAddresses(ipAddresses.filter((_, i) => i !== index));
  };

  const updateIpAddress = (index, value) => {
    const updated = [...ipAddresses];
    updated[index] = value;
    setIpAddresses(updated);
  };

  const addIncludeDomain = () => {
    setIncludeDomains([...includeDomains, '']);
  };

  const removeIncludeDomain = (index) => {
    setIncludeDomains(includeDomains.filter((_, i) => i !== index));
  };

  const updateIncludeDomain = (index, value) => {
    const updated = [...includeDomains];
    updated[index] = value;
    setIncludeDomains(updated);
  };

  const generateSPF = () => {
    let record = 'v=spf1';

    // Add mechanisms
    if (mechanisms.a) record += ' a';
    if (mechanisms.mx) record += ' mx';

    // Add IP addresses
    ipAddresses.forEach(ip => {
      if (ip.trim()) {
        if (ip.includes(':')) {
          record += ` ip6:${ip.trim()}`;
        } else {
          record += ` ip4:${ip.trim()}`;
        }
      }
    });

    // Add include domains
    includeDomains.forEach(domain => {
      if (domain.trim()) {
        record += ` include:${domain.trim()}`;
      }
    });

    // Add policy
    record += ` ${policy}`;

    setGeneratedRecord(record);
    setShowResult(true);
    trackClick('tool_use', { tool: 'SPF Generator' });
  };


  const reset = () => {
    setIpAddresses(['']);
    setIncludeDomains(['']);
    setMechanisms({ a: false, mx: false });
    setPolicy('~all');
    setGeneratedRecord('');
    setShowResult(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    trackClick('copy_result', { tool: 'SPF Generator' });
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
      question: "How do I create an SPF record?",
      answer: "Use our free SPF Generator tool. Simply list your authorized IP addresses, include any third-party email services (like Google or Outlook), and choose your policy. The tool will automatically generate the correct TXT record for you."
    },
    {
      question: "What should I include in my SPF record?",
      answer: "You should include all IP addresses and mail servers that send email on behalf of your domain. This includes your own web servers, office IP addresses, and any third-party services like marketing platforms (Mailchimp, HubSpot) or helpdesk software."
    },
    {
      question: "Can I have multiple SPF records?",
      answer: "No, a domain must have only one SPF record. If you have multiple sources, you must combine them into a single TXT record. Our generator helps you do this correctly."
    },
    {
      question: "What is the difference between ~all and -all?",
      answer: " ~all (Soft Fail) tells receivers to accept unauthorized emails but mark them as suspicious. -all (Hard Fail) tells receivers to reject unauthorized emails completely. We recommend starting with ~all to avoid delivery issues."
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
            <span className="text-gray-600">SPF Generator</span>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="text-center pt-12 pb-16 max-w-3xl mx-auto">
            <p className="font-mono text-xs uppercase tracking-widest text-[#1240cc] mb-5">Free tool</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-black mb-5">SPF record generator</h1>
            <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
              Create valid SPF records for your domain to protect against email spoofing
              and improve deliverability with our automated generator.
            </p>
          </div>
        </div>
      </section>

      {/* Main Tool Section */}
      <section className="bg-white min-h-[600px]">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto pb-16">
            {!showResult ? (
              // Generator Form - Modern Clean Design
              <div className="max-w-3xl mx-auto">
                <div className="mb-8 text-center">
                  <p className="text-xs uppercase tracking-wider text-[#1240cc] mb-2">
                    CONFIGURE RECORD
                  </p>
                  <h2 className="text-2xl font-bold text-black">
                    SPF record settings
                  </h2>
                </div>

                <div className="space-y-8">
                  {/* IP Addresses */}
                  <div className="p-6 bg-white border border-gray-200 rounded-xl">
                    <label className="block text-sm font-medium text-black mb-4">
                      Authorized IP Addresses
                    </label>
                    <p className="text-xs text-gray-500 mb-4">
                      Add IPv4 or IPv6 addresses that are authorized to send email from your domain
                    </p>
                    <div className="space-y-3">
                      {ipAddresses.map((ip, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            type="text"
                            value={ip}
                            onChange={(e) => updateIpAddress(index, e.target.value)}
                            placeholder="192.168.1.1 or 2001:db8::1"
                            className="flex-1 px-4 h-[52px] py-0 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1240cc] focus:border-transparent transition-all placeholder:text-gray-400"
                          />
                          {ipAddresses.length > 1 && (
                            <button
                              onClick={() => removeIpAddress(index)}
                              className="p-3 text-red-600 hover:bg-red-50 rounded-full transition"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={addIpAddress}
                        className="flex items-center gap-2 text-[#1240cc] hover:text-[#0b34b4] font-medium text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Add IP Address
                      </button>
                    </div>
                  </div>

                  {/* Include Domains */}
                  <div className="p-6 bg-white border border-gray-200 rounded-xl">
                    <label className="block text-sm font-medium text-black mb-4">
                      Third-party Email Services
                    </label>
                    <p className="text-xs text-gray-500 mb-4">
                      Include SPF records from email services like Google Workspace, Mailchimp, etc.
                    </p>
                    <div className="space-y-3">
                      {includeDomains.map((domain, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            type="text"
                            value={domain}
                            onChange={(e) => updateIncludeDomain(index, e.target.value)}
                            placeholder="_spf.google.com"
                            className="flex-1 px-4 h-[52px] py-0 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1240cc] focus:border-transparent transition-all placeholder:text-gray-400"
                          />
                          {includeDomains.length > 1 && (
                            <button
                              onClick={() => removeIncludeDomain(index)}
                              className="p-3 text-red-600 hover:bg-red-50 rounded-full transition"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={addIncludeDomain}
                        className="flex items-center gap-2 text-[#1240cc] hover:text-[#0b34b4] font-medium text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Add Include Domain
                      </button>
                    </div>
                  </div>

                  {/* Additional Mechanisms */}
                  <div className="p-6 bg-white border border-gray-200 rounded-xl">
                    <label className="block text-sm font-medium text-black mb-4">
                      Additional Mechanisms
                    </label>
                    <p className="text-xs text-gray-500 mb-4">
                      Include your domain's A or MX records as authorized senders
                    </p>
                    <div className="space-y-4">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <Checkbox
                          checked={mechanisms.a}
                          onCheckedChange={(checked) => setMechanisms({ ...mechanisms, a: checked })}
                          className="w-4 h-4 text-[#1240cc] rounded focus:ring-[#1240cc] mt-0.5"
                        />
                        <div>
                          <span className="text-black font-medium">
                            A record mechanism
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            Authorize servers listed in your domain's A record
                          </p>
                        </div>
                      </label>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <Checkbox
                          checked={mechanisms.mx}
                          onCheckedChange={(checked) => setMechanisms({ ...mechanisms, mx: checked })}
                          className="w-4 h-4 text-[#1240cc] rounded focus:ring-[#1240cc] mt-0.5"
                        />
                        <div>
                          <span className="text-black font-medium">
                            MX record mechanism
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            Authorize servers listed in your domain's MX records
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Policy */}
                  <div className="p-6 bg-white border border-gray-200 rounded-xl">
                    <label className="block text-sm font-medium text-black mb-4">
                      SPF Policy Mode
                    </label>
                    <p className="text-xs text-gray-500 mb-4">
                      Define how to handle emails from unauthorized servers
                    </p>
                    <Select value={policy} onValueChange={setPolicy}>
                      <SelectTrigger className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1240cc] focus:border-transparent transition-all">
                        <SelectValue placeholder="Select policy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="~all">~all (Soft Fail - Recommended)</SelectItem>
                        <SelectItem value="-all">-all (Hard Fail - Strict)</SelectItem>
                        <SelectItem value="?all">?all (Neutral)</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">
                        {policy === '~all' && 'Messages from unauthorized servers will be marked as suspicious but not rejected'}
                        {policy === '-all' && 'Messages from unauthorized servers will be rejected completely'}
                        {policy === '?all' && 'No specific policy applied to unauthorized servers'}
                      </p>
                    </div>
                  </div>

                  {/* Generate Button */}
                  <div className="text-center">
                    <button
                      onClick={generateSPF}
                      className="w-full px-8 py-4 bg-[#1240cc] text-white font-semibold rounded-full hover:bg-[#0b34b4] transition-all shadow-lg hover:shadow-xl"
                    >
                      Generate SPF Record
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Results Display - Modern Clean Layout
              <div className="max-w-4xl mx-auto">
                {/* Results Header */}
                <div className="border-b border-gray-200 pb-6 mb-8">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[#1240cc] mb-2">
                        GENERATED RECORD
                      </p>
                      <h2 className="text-3xl font-bold text-black">
                        Your SPF record
                      </h2>
                      <p className="text-gray-500 mt-2">
                        Add this TXT record to your domain's DNS settings
                      </p>
                    </div>
                    <button
                      onClick={reset}
                      className="px-5 py-2.5 text-sm font-medium text-black border border-gray-300 rounded-full hover:border-[#1240cc] hover:text-[#1240cc] transition-all"
                    >
                      Generate Another
                    </button>
                  </div>
                </div>

                {/* Generated Record */}
                <div className="p-6 bg-white border border-gray-200 rounded-xl mb-8">
                  <h3 className="text-base font-semibold text-black mb-4">
                    SPF Record
                  </h3>
                  <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between gap-3">
                      <pre className="text-xs text-black/80 font-mono overflow-x-auto flex-1">
                        {generatedRecord}
                      </pre>
                      <button
                        onClick={() => copyToClipboard(generatedRecord)}
                        className="flex-shrink-0 p-2 text-black/40 hover:text-black transition-colors"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* DNS Instructions */}
                <div className="p-6 bg-white border border-gray-200 rounded-xl">
                  <h3 className="font-semibold text-black mb-4">DNS Setup Instructions</h3>
                  <div className="space-y-3">
                    {[
                      'Log in to your domain DNS management panel (GoDaddy, Cloudflare, etc.)',
                      'Create a new TXT record',
                      'Leave the name/host field empty or enter @ for root domain',
                      'Paste the generated SPF record in the value field',
                      'Save the record and wait for DNS propagation (usually 15 minutes to 48 hours)'
                    ].map((step, index) => (
                      <div key={index} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-[#1240cc] text-white rounded-full flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </span>
                        <p className="text-sm text-gray-500">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Educational Content */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="py-12 max-w-5xl mx-auto border-t border-gray-200 border-dashed pt-16">
            <div className="max-w-4xl mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-black mb-4">
                How to create SPF records
              </h2>
              <p className="text-base text-gray-500 leading-relaxed">
                Learn about SPF record components, best practices, and why automated generation helps prevent common configuration errors.
              </p>
            </div>

            <div className="space-y-12">
              <div>
                <h3 className="text-xl font-semibold text-black mb-6">
                  SPF record components
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <span className="text-[#1240cc] mt-1">·</span>
                    <div>
                      <p className="text-sm font-medium text-black mb-1">IP addresses (ip4: and ip6:)</p>
                      <p className="text-sm text-gray-500">Authorize specific IPv4 or IPv6 addresses to send email from your domain.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-[#1240cc] mt-1">·</span>
                    <div>
                      <p className="text-sm font-medium text-black mb-1">Include mechanisms (include:)</p>
                      <p className="text-sm text-gray-500">Reference other domains' SPF records, useful for third-party email services.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-[#1240cc] mt-1">·</span>
                    <div>
                      <p className="text-sm font-medium text-black mb-1">A and MX mechanisms</p>
                      <p className="text-sm text-gray-500">Authorize servers listed in your domain's A or MX DNS records.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-[#1240cc] mt-1">·</span>
                    <div>
                      <p className="text-sm font-medium text-black mb-1">Policy qualifier (all mechanism)</p>
                      <p className="text-sm text-gray-500">Defines how to handle emails from unauthorized sources: ~all (soft fail), -all (hard fail), or ?all (neutral).</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-black mb-6">
                  Why use an SPF generator
                </h3>
                <div className="space-y-4 text-sm text-gray-500 leading-relaxed">
                  <p>
                    Creating SPF records manually is error-prone and complex. Common mistakes include exceeding the 10 DNS lookup limit,
                    using deprecated mechanisms, or incorrect syntax that breaks email authentication entirely.
                  </p>
                  <p>
                    Our generator automatically validates your configuration, ensures proper formatting, and follows SPF best practices.
                    This prevents deliverability issues and protects your domain from spoofing attacks while maintaining compliance with email authentication standards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section (Accordion) */}
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

      {/* Related Tools */}
      <section className="bg-white border-gray-200">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="py-12 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold tracking-tight text-black mb-8">
              Related tools
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <Link
                href="/resources/tools/spf-checker"
                onClick={() => trackClick('tool_navigation', { from: 'spf-generator', to: 'spf-checker' })}
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                  SPF Checker
                </h3>
                <p className="text-sm text-gray-500">
                  Validate and analyze existing SPF records.
                </p>
              </Link>

              <Link
                href="/resources/tools/dkim-generator"
                onClick={() => trackClick('tool_navigation', { from: 'spf-generator', to: 'dkim-generator' })}
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                  DKIM Generator
                </h3>
                <p className="text-sm text-gray-500">
                  Generate DKIM keys and DNS records.
                </p>
              </Link>

              <Link
                href="/resources/tools/dmarc-generator"
                onClick={() => trackClick('tool_navigation', { from: 'spf-generator', to: 'dmarc-generator' })}
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                  DMARC Generator
                </h3>
                <p className="text-sm text-gray-500">
                  Build comprehensive DMARC policies.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl pb-4 w-full border-x border-gray-200 border-dashed px-4">
          <div className="py-20 text-center max-w-xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-black mb-4">
              Automate your SPF management
            </h2>
            <p className="text-base text-gray-500 mb-8 max-w-xl mx-auto">
              Infrabox automatically generates and manages SPF records for all your domains
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="https://app.infrabox.software/signup"
                onClick={() => trackClick('tool_cta', { tool: 'spf-generator', action: 'signup' })}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 text-[#1240cc] rounded-full transition-all text-sm font-semibold"
              >
                Get Automatic Setup
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/resources/tools/spf-checker"
                className="inline-flex items-center justify-center px-6 py-3 border border-white text-white hover:bg-white/10 rounded-full transition-all text-sm font-semibold"
              >
                Validate SPF Record
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}