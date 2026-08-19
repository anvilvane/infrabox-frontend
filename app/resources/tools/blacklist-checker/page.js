'use client'

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { trackClick } from '@/lib/datafast';
import { Input } from "@/components/ui/input";
import {
    CheckCircle,
    XCircle,
    AlertTriangle,
    ArrowRight,
    Shield,
    Server,
    Globe,
    Search,
    ExternalLink
} from "lucide-react";
import ScoreCircle from "@/components/ScoreCircle";

export default function BlacklistCheckerPage() {
    const [domain, setDomain] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [openItems, setOpenItems] = useState(new Set([0]));

    const checkBlacklist = async () => {
        if (!domain) return;

        setLoading(true);
        setResults(null);

        try {
            const response = await fetch('/api/tools/blacklist-check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ domain }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to check blacklists');
            }

            setResults(data);
            trackClick('tool_use', { tool: 'blacklist-checker', status: data.isClean ? 'clean' : 'listed' });
        } catch (error) {
            console.error('Error checking blacklists:', error);
            setResults({
                error: true,
                message: error.message || 'Unable to check blacklists. Please try again.'
            });
        } finally {
            setLoading(false);
        }
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

    const faqs = [
        {
            question: "What is an email blacklist?",
            answer: "An email blacklist (or DNSBL) is a real-time database that identifies IP addresses or domains known for sending spam. Email service providers check these lists to decide whether to accept your emails or send them to the spam folder."
        },
        {
            question: "How do I get off a blacklist?",
            answer: "Each blacklist has its own removal process. Generally, you need to: 1) Identify the cause (spam complaints, malware, etc.), 2) Fix the issue, and 3) Request removal (delisting) via the blacklist's website. Our tool provides links to delisting pages where available."
        },
        {
            question: "Does being blacklisted affect my email delivery?",
            answer: "Yes, significantly. If your IP or domain is on a major blacklist like Spamhaus or SpamCop, your emails will likely be blocked or sent to spam by major providers like Gmail, Outlook, and Yahoo."
        },
        {
            question: "How often should I check my blacklist status?",
            answer: "We recommend checking weekly, or immediately if you notice a drop in open rates. Regular monitoring helps you catch issues early before they damage your sender reputation permanently."
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
                        <span className="text-gray-600">Blacklist Checker</span>
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
                            Email blacklist checker
                        </h1>
                        <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
                            Check if your domain or IP is listed on 50+ major email blacklists.
                            Identify delivery issues and protect your sender reputation.
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
                                        Domain or IP address
                                    </label>
                                    <div className="relative">
                                        <Input
                                            id="domain"
                                            type="text"
                                            value={domain}
                                            onChange={(e) => setDomain(e.target.value)}
                                            placeholder="example.com or 1.2.3.4"
                                            className="w-full px-4 h-[52px] py-0 text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1240cc] focus:border-transparent transition-all placeholder:text-gray-400"
                                            disabled={loading}
                                            onKeyDown={(e) => e.key === 'Enter' && domain && checkBlacklist()}
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={checkBlacklist}
                                    disabled={!domain || loading}
                                    className="w-full px-8 py-4 bg-[#1240cc] text-white font-semibold rounded-full hover:bg-[#0b34b4] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Checking blacklists...
                                        </span>
                                    ) : (
                                        'Check Blacklists'
                                    )}
                                </button>
                            </div>
                        </div>
                    ) : (
                        // Results Display
                        <div className="max-w-4xl mx-auto">
                            {/* Results Header */}
                            <div className="border-b border-gray-200 pb-6 mb-8">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-mono text-xs uppercase tracking-widest text-[#1240cc] mb-2">
                                            Check results
                                        </p>
                                        <h2 className="text-3xl font-bold text-black break-all">
                                            {results.target || domain}
                                        </h2>
                                    </div>
                                    <button
                                        onClick={reset}
                                        className="px-5 py-2.5 text-sm font-medium text-black border border-gray-300 rounded-full hover:border-[#1240cc] hover:text-[#1240cc] transition-all flex-shrink-0 ml-4"
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
                                <div className="space-y-8">
                                    {/* Status Card */}
                                    <div className={`p-8 rounded-2xl border ${results.isClean ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                        <div className="flex flex-col md:flex-row items-center gap-8">
                                            <div className="flex-shrink-0">
                                                <ScoreCircle score={results.reputationScore} size={120} strokeWidth={8} />
                                            </div>
                                            <div className="flex-1 text-center md:text-left">
                                                <h3 className={`text-2xl font-bold mb-2 ${results.isClean ? 'text-green-800' : 'text-red-800'}`}>
                                                    {results.isClean ? 'Clean on all checked blacklists' : `Listed on ${results.listedCount} blacklists`}
                                                </h3>
                                                <p className={`text-lg ${results.isClean ? 'text-green-700' : 'text-red-700'}`}>
                                                    {results.isClean
                                                        ? 'Great job! Your domain/IP is not listed on any of the major blacklists we checked.'
                                                        : 'Action required. Your domain/IP is listed on one or more blacklists, which may impact your email deliverability.'}
                                                </p>
                                                <div className="mt-4 text-sm opacity-80">
                                                    Checked {results.totalChecked} blacklists in {Math.round(results.processingTimeMs / 1000)}s
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Blacklist Grid */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {results.results.map((result, index) => (
                                            <div
                                                key={index}
                                                className={`p-4 rounded-xl border ${result.listed ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-3">
                                                        {result.listed ? (
                                                            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                                        ) : (
                                                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                                        )}
                                                        <div>
                                                            <h4 className={`font-semibold ${result.listed ? 'text-red-900' : 'text-black'}`}>
                                                                {result.blacklist}
                                                            </h4>
                                                            <p className="text-xs text-gray-500">{result.domain}</p>
                                                        </div>
                                                    </div>
                                                    {result.listed && (
                                                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                                                            Listed
                                                        </span>
                                                    )}
                                                </div>
                                                {result.listed && result.reason && (
                                                    <div className="mt-3 pt-3 border-t border-red-100 text-sm text-red-800">
                                                        <p className="font-medium">Reason:</p>
                                                        <p>{result.reason}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
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
                                    Automate monitoring
                                </p>
                                <p className="text-sm text-gray-500">
                                    Infrabox monitors your domains 24/7 and alerts you instantly if you get blacklisted.
                                </p>
                            </div>
                            <a
                                href="https://app.infrabox.software/signup"
                                onClick={() => trackClick('tool_cta_banner', { tool: 'blacklist-checker' })}
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
                                href="/resources/tools/email-verifier"
                                onClick={() => trackClick('tool_navigation', { from: 'blacklist-checker', to: 'email-verifier' })}
                                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
                            >
                                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                                    Email Verifier
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Verify email addresses instantly.
                                </p>
                            </Link>

                            <Link
                                href="/resources/tools/spam-checker"
                                onClick={() => trackClick('tool_navigation', { from: 'blacklist-checker', to: 'spam-checker' })}
                                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
                            >
                                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                                    Spam Words Checker
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Check your content for spam triggers.
                                </p>
                            </Link>

                            <Link
                                href="/resources/tools/deliverability-score"
                                onClick={() => trackClick('tool_navigation', { from: 'blacklist-checker', to: 'deliverability-score' })}
                                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
                            >
                                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                                    Deliverability Score
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Analyze your domain's health.
                                </p>
                            </Link>
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
                            Monitor your blacklist status automatically
                        </h2>
                        <p className="text-base text-gray-500 mb-8">
                            Infrabox monitors your domains 24/7 and alerts you instantly if you get blacklisted.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <a
                                href="https://app.infrabox.software/signup"
                                onClick={() => trackClick('tool_cta', { tool: 'blacklist-checker', action: 'signup' })}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1240cc] text-white text-sm font-semibold rounded-full hover:bg-[#0b34b4] transition-colors"
                            >
                                Start monitoring
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
