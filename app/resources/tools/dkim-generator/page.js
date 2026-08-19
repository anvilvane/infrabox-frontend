'use client'

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { trackClick } from "@/lib/datafast";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Key,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Copy,
  RefreshCw,
  Download,
  Eye,
  EyeOff,
  XCircle,
} from "lucide-react";

export default function DKIMGeneratorPage() {
  const [config, setConfig] = useState({
    selector: 'default',
    keySize: '2048',
    keyType: 'rsa',
    hashAlgorithms: ['sha256'],
    serviceTypes: ['email'],
    flags: [],
    notes: '',
    provider: 'generic',
    generateKeys: true,
    publicKey: ''
  });

  const [generatedRecord, setGeneratedRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copiedRecord, setCopiedRecord] = useState(false);
  const [copiedHost, setCopiedHost] = useState(false);
  const [copiedPrivateKey, setCopiedPrivateKey] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [openItems, setOpenItems] = useState(new Set([0]));

  const generateDKIM = async () => {
    trackClick('dkim-generator-generate', { config });
    setLoading(true);

    try {
      const response = await fetch('/api/tools/dkim-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error('Failed to generate DKIM record');
      }

      const data = await response.json();
      setGeneratedRecord(data);
    } catch (error) {
      console.error('Error generating DKIM:', error);
      setGeneratedRecord({
        error: true,
        message: 'Failed to generate DKIM record'
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    trackClick(`dkim-generator-copy-${type}`);
    if (type === 'record') {
      setCopiedRecord(true);
      setTimeout(() => setCopiedRecord(false), 2000);
    } else if (type === 'host') {
      setCopiedHost(true);
      setTimeout(() => setCopiedHost(false), 2000);
    } else if (type === 'privateKey') {
      setCopiedPrivateKey(true);
      setTimeout(() => setCopiedPrivateKey(false), 2000);
    }
  };

  const downloadPrivateKey = () => {
    if (!generatedRecord?.privateKey) return;
    trackClick('dkim-generator-download-key');

    const blob = new Blob([generatedRecord.privateKey], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dkim-private-key-${config.selector}.pem`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFlagToggle = (flag) => {
    setConfig(prev => ({
      ...prev,
      flags: prev.flags.includes(flag)
        ? prev.flags.filter(f => f !== flag)
        : [...prev.flags, flag]
    }));
  };

  const handleHashToggle = (hash) => {
    setConfig(prev => ({
      ...prev,
      hashAlgorithms: prev.hashAlgorithms.includes(hash)
        ? prev.hashAlgorithms.filter(h => h !== hash)
        : [...prev.hashAlgorithms, hash]
    }));
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
    { value: 'google', label: 'Google Workspace' },
    { value: 'microsoft', label: 'Microsoft 365' },
    { value: 'sendgrid', label: 'SendGrid' },
    { value: 'mailchimp', label: 'Mailchimp' },
    { value: 'generic', label: 'Other / Custom' }
  ];

  const faqs = [
    {
      question: "What is a DKIM generator?",
      answer: "A DKIM generator is a tool that creates the public and private key pairs needed for DomainKeys Identified Mail (DKIM) authentication. It also generates the corresponding DNS TXT record that you need to publish."
    },
    {
      question: "What key size should I use?",
      answer: "We recommend using 2048-bit keys for a good balance of security and compatibility. 1024-bit keys are considered weak and should be avoided if possible. 4096-bit keys offer higher security but may not be supported by all DNS providers due to record length limits."
    },
    {
      question: "How do I use the generated keys?",
      answer: "The private key must be configured on your mail server or email service provider (keep it secret!). The public key (TXT record) must be added to your domain's DNS settings so receiving servers can verify your emails."
    },
    {
      question: "What is a DKIM selector?",
      answer: "A selector is a unique identifier that allows you to have multiple DKIM keys for the same domain (e.g., for different departments or services). Common selectors include 'default', 'google', or 'mail'."
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
            <span className="text-gray-600">DKIM Generator</span>
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
              DKIM record generator
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
              Generate DKIM keys and DNS records for email authentication.
              Create cryptographic signatures to secure your email delivery.
            </p>
          </div>
        </div>
      </section>

      {/* Main Tool Section */}
      <section className="bg-white min-h-[600px]">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8 pb-16">
          {!generatedRecord ? (
            // Input Form - Modern Clean Design
            <div className="max-w-5xl mx-auto">
              <div className="space-y-6">
                {/* Provider Selection */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Email Service Provider
                  </label>
                  <Select value={config.provider} onValueChange={(value) => setConfig(prev => ({ ...prev, provider: value }))}>
                    <SelectTrigger className="w-full px-4 py-3 text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1240cc] focus:border-transparent transition-all">
                      <SelectValue placeholder="Select email provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {providers.map(provider => (
                        <SelectItem key={provider.value} value={provider.value}>
                          {provider.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 mt-2">
                    Select your email provider for specific instructions
                  </p>
                </div>

                {/* Selector */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    DKIM Selector <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={config.selector}
                    onChange={(e) => setConfig(prev => ({ ...prev, selector: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                    placeholder="default"
                    className="w-full px-4 h-[52px] py-0 text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1240cc] focus:border-transparent transition-all placeholder:text-gray-400"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (config.selector && (config.generateKeys || config.publicKey)) generateDKIM();
                      }
                    }}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Unique identifier for this DKIM key (letters, numbers, hyphens only)
                  </p>
                </div>

                {/* Key Size */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Key Size
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['1024', '2048', '4096'].map((size) => (
                      <button
                        key={size}
                        onClick={() => setConfig(prev => ({ ...prev, keySize: size }))}
                        className={`p-4 rounded-xl border-2 transition-all ${config.keySize === size
                          ? 'border-[#1240cc] bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                          }`}
                      >
                        <div className="font-semibold text-black">{size} bits</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {size === '1024' && 'Not recommended'}
                          {size === '2048' && 'Recommended'}
                          {size === '4096' && 'Maximum security'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Key Generation Options */}
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="generateKeys"
                    checked={config.generateKeys}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, generateKeys: checked }))}
                    className="mt-1 w-4 h-4 text-[#1240cc] rounded focus:ring-[#1240cc]"
                  />
                  <label htmlFor="generateKeys" className="flex-1 cursor-pointer">
                    <span className="font-medium text-black">Generate New Key Pair</span>
                    <p className="text-gray-500 text-sm">
                      Automatically generate public and private keys for maximum security
                    </p>
                  </label>
                </div>

                {/* Manual Public Key Input */}
                {!config.generateKeys && (
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Public Key <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={config.publicKey}
                      onChange={(e) => setConfig(prev => ({ ...prev, publicKey: e.target.value }))}
                      placeholder="Paste your public key here (without headers)"
                      className="w-full px-4 h-[52px] py-0 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1240cc] focus:border-transparent transition-all font-mono text-sm placeholder:text-gray-400"
                      rows={4}
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Enter the public key without BEGIN/END headers
                    </p>
                  </div>
                )}

                {/* Advanced Settings */}
                <details className="border border-gray-200 rounded-xl">
                  <summary className="px-4 py-3 cursor-pointer hover:bg-gray-50 font-medium text-black rounded-xl">
                    Advanced Settings
                  </summary>
                  <div className="p-4 space-y-4 border-t border-gray-200">
                    {/* Hash Algorithms */}
                    <div>
                      <label className="block text-sm font-medium text-black mb-3">
                        Hash Algorithms
                      </label>
                      <div className="space-y-3">
                        {['sha256', 'sha1'].map(hash => (
                          <label key={hash} className="flex items-center gap-3">
                            <Checkbox
                              checked={config.hashAlgorithms.includes(hash)}
                              onCheckedChange={() => handleHashToggle(hash)}
                              className="w-4 h-4 text-[#1240cc] rounded focus:ring-[#1240cc]"
                            />
                            <span className="text-sm text-black">
                              {hash.toUpperCase()} {hash === 'sha256' && '(Recommended)'}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Flags */}
                    <div>
                      <label className="block text-sm font-medium text-black mb-3">
                        Configuration Flags
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-start gap-3">
                          <Checkbox
                            checked={config.flags.includes('y')}
                            onCheckedChange={() => handleFlagToggle('y')}
                            className="mt-0.5 w-4 h-4 text-[#1240cc] rounded focus:ring-[#1240cc]"
                          />
                          <div>
                            <span className="text-sm font-medium text-black">
                              Testing mode (t=y)
                            </span>
                            <p className="text-xs text-gray-500">
                              Domain is testing DKIM - failures won't affect delivery
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Notes (Optional)
                      </label>
                      <Input
                        type="text"
                        value={config.notes}
                        onChange={(e) => setConfig(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Administrative notes"
                        className="w-full px-4 h-[52px] py-0 text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1240cc] focus:border-transparent transition-all placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                </details>

                <button
                  onClick={generateDKIM}
                  disabled={loading || (!config.generateKeys && !config.publicKey)}
                  className="w-full px-8 py-4 bg-[#1240cc] text-white font-semibold rounded-full hover:bg-[#0b34b4] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating DKIM keys...
                    </span>
                  ) : (
                    'Generate DKIM Record'
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
                      DKIM GENERATION COMPLETE
                    </p>
                    <h2 className="text-3xl font-bold text-black">
                      Your DKIM Record
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
                      <XCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-red-900 mb-2">Generation Failed</h3>
                      <p className="text-red-700">{generatedRecord.message}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Generated Record */}
                  <div className="p-6 bg-white border border-green-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-black">
                          DKIM TXT Record
                        </h3>
                        <p className="text-sm text-gray-500">
                          Add this record to your DNS zone
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 p-4 bg-white border border-gray-200 rounded-lg">
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
                      {generatedRecord.recordLength > 255 && (
                        <p className="text-sm text-yellow-700 mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          Note: This record is {generatedRecord.recordLength} characters. Your DNS provider may require splitting it into multiple strings.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* DNS Instructions */}
                  <div className="p-6 bg-white border border-blue-200 rounded-xl">
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
                            {generatedRecord.dnsInstructions?.host || `${config.selector}._domainkey`}
                          </code>
                          <button
                            onClick={() => copyToClipboard(generatedRecord.dnsInstructions?.host || `${config.selector}._domainkey`, 'host')}
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

                  {/* Private Key (if generated) */}
                  {generatedRecord.privateKey && (
                    <div className="p-6 bg-white border border-yellow-200 rounded-xl">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-yellow-50 rounded-full flex items-center justify-center">
                          <Key className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-black">
                            Private Key (Keep Secret!)
                          </h3>
                          <p className="text-sm text-gray-500">
                            Configure this on your mail server
                          </p>
                        </div>
                      </div>
                      <div className="p-4 bg-white border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm text-gray-500">
                            Save this private key securely. You'll need it to configure your mail server.
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setShowPrivateKey(!showPrivateKey)}
                              className="p-2 text-black/40 hover:text-gray-500 transition-colors"
                              title={showPrivateKey ? "Hide" : "Show"}
                            >
                              {showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => copyToClipboard(generatedRecord.privateKey, 'privateKey')}
                              className="p-2 text-black/40 hover:text-gray-500 transition-colors"
                              title="Copy private key"
                            >
                              {copiedPrivateKey ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={downloadPrivateKey}
                              className="p-2 text-black/40 hover:text-gray-500 transition-colors"
                              title="Download private key"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        {showPrivateKey && (
                          <pre className="text-xs text-black/80 overflow-x-auto font-mono bg-gray-50 p-3 rounded border">
                            {generatedRecord.privateKey}
                          </pre>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Provider Instructions */}
                  {generatedRecord.providerInstructions && (
                    <div className="p-6 bg-white border border-gray-200 rounded-xl">
                      <h3 className="text-lg font-semibold text-black mb-4">
                        {generatedRecord.providerInstructions.name} Setup Instructions
                      </h3>
                      <ol className="space-y-3">
                        {generatedRecord.providerInstructions.steps.map((step, index) => (
                          <li key={index} className="flex gap-4">
                            <span className="flex-shrink-0 w-7 h-7 bg-[#1240cc] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                              {index + 1}
                            </span>
                            <span className="text-black/80 leading-relaxed pt-1">{step}</span>
                          </li>
                        ))}
                      </ol>
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-black">Typical Selector:</span>
                            <span className="text-gray-500 ml-2">{generatedRecord.providerInstructions.selector}</span>
                          </div>
                          <div>
                            <span className="font-medium text-black">Recommended Key Size:</span>
                            <span className="text-gray-500 ml-2">{generatedRecord.providerInstructions.keySize} bits</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Warnings */}
                  {generatedRecord.warnings && generatedRecord.warnings.length > 0 && (
                    <div className="p-6 bg-white border border-yellow-200 rounded-xl">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-yellow-50 rounded-full flex items-center justify-center">
                          <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-black">
                          Important Notes
                        </h3>
                      </div>
                      <ul className="space-y-2">
                        {generatedRecord.warnings.map((warning, index) => (
                          <li key={index} className="flex items-start gap-2 text-black/80">
                            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span>{warning}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="p-6 bg-white border border-gray-200 rounded-xl hover:border-[#1240cc] transition-colors">
                    <h3 className="text-lg font-semibold text-black mb-3">
                      Need Help with DKIM Setup?
                    </h3>
                    <p className="text-gray-500 mb-4 leading-relaxed">
                      Infrabox automatically configures DKIM for all major email providers with ongoing key rotation.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        href="https://app.infrabox.software/signup"
                        className="px-6 py-3 bg-[#1240cc] text-white text-sm font-semibold rounded-full hover:bg-[#0b34b4] transition-all text-center shadow-lg hover:shadow-xl"
                      >
                        Automate DKIM Setup
                      </Link>
                      <Link
                        href="/resources/tools/dkim-checker"
                        className="px-6 py-3 border border-gray-300 text-black text-sm font-semibold rounded-full hover:border-[#1240cc] hover:text-[#1240cc] transition-all text-center"
                      >
                        Verify DKIM Record
                      </Link>
                    </div>
                  </div>
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
                  Infrabox automatically generates and manages DKIM keys with ongoing rotation.
                </p>
              </div>
              <a
                href="https://app.infrabox.software/signup"
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
                href="/resources/tools/dkim-checker"
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                  DKIM Checker
                </h3>
                <p className="text-sm text-gray-500">
                  Validate existing DKIM records and signatures.
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
                  Create SPF records for email sender authorization.
                </p>
              </Link>

              <Link
                href="/resources/tools/deliverability-score"
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                  Deliverability Score
                </h3>
                <p className="text-sm text-gray-500">
                  Complete domain authentication analysis.
                </p>
              </Link>

              <Link
                href="/resources/tools/spf-checker"
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                  SPF Checker
                </h3>
                <p className="text-sm text-gray-500">
                  Validate SPF records and sender policies.
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
                  Test email content for spam triggers.
                </p>
              </Link>

              <Link
                href="/resources/tools/mailbox-calculator"
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                  Mailbox Calculator
                </h3>
                <p className="text-sm text-gray-500">
                  Calculate optimal mailbox setup for campaigns.
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
              Understanding DKIM generation
            </h2>

            <p className="text-base text-gray-500 leading-relaxed mb-8">
              DKIM key generation creates the cryptographic foundation for email authentication.
              Proper key management and DNS configuration are essential for email security.
            </p>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-lg font-semibold text-black mb-4">
                  Key generation best practices
                </h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Use 2048-bit keys minimum
                    </p>
                    <p className="text-sm text-gray-500">
                      1024-bit keys are deprecated and no longer secure.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Rotate keys regularly
                    </p>
                    <p className="text-sm text-gray-500">
                      Replace keys every 6-12 months for optimal security.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Test before deployment
                    </p>
                    <p className="text-sm text-gray-500">
                      Use testing mode to validate configuration first.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-black mb-4">
                  DNS record management
                </h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Use descriptive selectors
                    </p>
                    <p className="text-sm text-gray-500">
                      Choose selectors that identify the service or purpose.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Monitor DNS propagation
                    </p>
                    <p className="text-sm text-gray-500">
                      Allow time for DNS changes to propagate globally.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Handle long records properly
                    </p>
                    <p className="text-sm text-gray-500">
                      Split 2048+ bit keys if your DNS provider requires it.
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
              Automate your DKIM setup
            </h2>
            <p className="text-base text-gray-500 mb-8">
              Infrabox automatically generates and manages DKIM keys for maximum email security.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://app.infrabox.software/signup"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1240cc] text-white text-sm font-semibold rounded-full hover:bg-[#0b34b4] transition-colors"
              >
                Get Started
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
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