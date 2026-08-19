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
    Mail,
    Shield,
    Server,
    User,
    Plus,
    Minus,
    Search
} from "lucide-react";
import ScoreCircle from "@/components/ScoreCircle";

export default function EmailVerifierPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [openItems, setOpenItems] = useState(new Set([0]));

    const verifyEmail = async () => {
        if (!email) return;

        setLoading(true);
        setResults(null);

        try {
            const response = await fetch('/api/tools/email-verifier', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to verify email');
            }

            setResults(data);
            trackClick('tool_use', { tool: 'email-verifier', status: data.status });
        } catch (error) {
            console.error('Error verifying email:', error);
            setResults({
                error: true,
                message: error.message || 'Unable to verify email. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setEmail("");
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
            question: "How accurate is this email verifier?",
            answer: "Our verifier performs multiple checks including syntax validation, domain existence, MX record lookup, and disposable email detection. It provides a high level of accuracy (95%+) without sending an actual email to the recipient."
        },
        {
            question: "What is a disposable email address?",
            answer: "Disposable email addresses (also known as burner emails) are temporary accounts used to avoid spam. They are often valid for only a short time (e.g., 10 minutes). We detect and flag these as 'Risky' because they hold no long-term value for your list."
        },
        {
            question: "What are role-based emails?",
            answer: "Role-based emails (like admin@, support@, sales@) are associated with a function or department rather than a specific person. They are often managed by multiple people and may have stricter spam filters."
        },
        {
            question: "Does this tool check if the email actually exists?",
            answer: "We verify that the domain exists and has valid mail servers (MX records) capable of receiving email. We do not perform a full SMTP handshake (sending a test packet) to avoid being blocked by mail servers, but our multi-step validation is highly reliable."
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
                        <span className="text-gray-600">Email Verifier</span>
                    </div>
                </div>
            </section>

            {/* Hero Section */}
            <section className="bg-white">
                <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
                    <div className="text-center pt-12 pb-16 max-w-3xl mx-auto">
                        <p className="font-mono text-xs uppercase tracking-widest text-[#1240cc] mb-5">Free tool</p>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-black mb-5">Free email verifier</h1>
                        <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
                            Verify email addresses instantly. Check for validity, disposable domains,
                            and mail server configuration to clean your email list.
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
                                    <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                                        Email address to verify
                                    </label>
                                    <div className="relative">
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="name@company.com"
                                            className="w-full px-4 h-[52px] py-0 text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1240cc] focus:border-transparent transition-all placeholder:text-gray-400"
                                            disabled={loading}
                                            onKeyDown={(e) => e.key === 'Enter' && email && verifyEmail()}
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={verifyEmail}
                                    disabled={!email || loading}
                                    className="w-full px-8 py-4 bg-[#1240cc] text-white font-semibold rounded-full hover:bg-[#0b34b4] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Verifying email...
                                        </span>
                                    ) : (
                                        'Verify Email'
                                    )}
                                </button>
                            </div>
                        </div>
                    ) : (
                        // Results Display
                        <div className="max-w-3xl mx-auto">
                            {/* Results Header */}
                            <div className="border-b border-gray-200 pb-6 mb-8">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-[#1240cc] mb-2">
                                            VERIFICATION RESULTS
                                        </p>
                                        <h2 className="text-3xl font-bold text-black break-all">
                                            {results.email || email}
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
                                    <div className={`p-8 rounded-2xl border ${results.status === 'valid' ? 'bg-green-50 border-green-200' :
                                            results.status === 'risky' ? 'bg-yellow-50 border-yellow-200' :
                                                'bg-red-50 border-red-200'
                                        }`}>
                                        <div className="flex flex-col md:flex-row items-center gap-8">
                                            <div className="flex-shrink-0">
                                                <ScoreCircle score={results.score} size={120} strokeWidth={8} />
                                            </div>
                                            <div className="flex-1 text-center md:text-left">
                                                <h3 className={`text-2xl font-bold mb-2 ${results.status === 'valid' ? 'text-green-800' :
                                                        results.status === 'risky' ? 'text-yellow-800' :
                                                            'text-red-800'
                                                    }`}>
                                                    {results.status === 'valid' ? 'Valid Email Address' :
                                                        results.status === 'risky' ? 'Risky Email Address' :
                                                            'Invalid Email Address'}
                                                </h3>
                                                <p className={`text-lg ${results.status === 'valid' ? 'text-green-700' :
                                                        results.status === 'risky' ? 'text-yellow-700' :
                                                            'text-red-700'
                                                    }`}>
                                                    {results.status === 'valid' ? 'This email address appears to be valid and safe to send to.' :
                                                        results.status === 'risky' ? 'This email has some risk factors (e.g., disposable or role-based).' :
                                                            'This email address is invalid or does not exist.'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Details Grid */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {/* Syntax */}
                                        <div className="p-6 bg-white border border-gray-200 rounded-xl">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className={`p-2 rounded-full ${results.checks.syntax.valid ? 'bg-green-100' : 'bg-red-100'}`}>
                                                    {results.checks.syntax.valid ? (
                                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                                    ) : (
                                                        <XCircle className="w-5 h-5 text-red-600" />
                                                    )}
                                                </div>
                                                <h4 className="font-semibold text-black">Syntax Check</h4>
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                {results.checks.syntax.message}
                                            </p>
                                        </div>

                                        {/* MX Record */}
                                        <div className="p-6 bg-white border border-gray-200 rounded-xl">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className={`p-2 rounded-full ${results.checks.mx.valid ? 'bg-green-100' : 'bg-red-100'}`}>
                                                    {results.checks.mx.valid ? (
                                                        <Server className="w-5 h-5 text-green-600" />
                                                    ) : (
                                                        <XCircle className="w-5 h-5 text-red-600" />
                                                    )}
                                                </div>
                                                <h4 className="font-semibold text-black">Mail Server (MX)</h4>
                                            </div>
                                            <p className="text-sm text-gray-500 mb-2">
                                                {results.checks.mx.message}
                                            </p>
                                            {results.checks.mx.records && results.checks.mx.records.length > 0 && (
                                                <div className="text-xs bg-gray-50 p-2 rounded border border-gray-100 font-mono text-gray-500 truncate">
                                                    {results.checks.mx.records[0].exchange}
                                                </div>
                                            )}
                                        </div>

                                        {/* Disposable */}
                                        <div className="p-6 bg-white border border-gray-200 rounded-xl">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className={`p-2 rounded-full ${!results.checks.disposable.isDisposable ? 'bg-green-100' : 'bg-yellow-100'}`}>
                                                    {!results.checks.disposable.isDisposable ? (
                                                        <Shield className="w-5 h-5 text-green-600" />
                                                    ) : (
                                                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                                                    )}
                                                </div>
                                                <h4 className="font-semibold text-black">Disposable Check</h4>
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                {results.checks.disposable.message}
                                            </p>
                                        </div>

                                        {/* Role Based */}
                                        <div className="p-6 bg-white border border-gray-200 rounded-xl">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className={`p-2 rounded-full ${!results.checks.role.isRole ? 'bg-green-100' : 'bg-blue-100'}`}>
                                                    {!results.checks.role.isRole ? (
                                                        <User className="w-5 h-5 text-green-600" />
                                                    ) : (
                                                        <User className="w-5 h-5 text-blue-600" />
                                                    )}
                                                </div>
                                                <h4 className="font-semibold text-black">Account Type</h4>
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                {results.checks.role.message}
                                            </p>
                                        </div>
                                    </div>
                                </div>
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
                                href="/resources/tools/email-permutator"
                                onClick={() => trackClick('tool_navigation', { from: 'email-verifier', to: 'email-permutator' })}
                                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
                            >
                                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                                    Email Permutator
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Generate potential email addresses for prospects.
                                </p>
                            </Link>

                            <Link
                                href="/resources/tools/spam-checker"
                                onClick={() => trackClick('tool_navigation', { from: 'email-verifier', to: 'spam-checker' })}
                                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
                            >
                                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                                    Spam Words Checker
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Check your email content for spam trigger words.
                                </p>
                            </Link>

                            <Link
                                href="/resources/tools/deliverability-score"
                                onClick={() => trackClick('tool_navigation', { from: 'email-verifier', to: 'deliverability-score' })}
                                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
                            >
                                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                                    Deliverability Score
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Analyze your domain's email deliverability health.
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
            <section className="bg-white">
                <div className="mx-auto max-w-6xl pb-4 w-full border-x border-gray-200 border-dashed px-4">
                    <div className="py-20 text-center max-w-xl mx-auto">
                        <h2 className="text-3xl font-bold tracking-tight text-black mb-4">
                            Clean your email list automatically
                        </h2>
                        <p className="text-base text-gray-500 mb-8 max-w-xl mx-auto">
                            Infrabox provides real-time email verification API to prevent fake signups
                            and keep your list healthy.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="https://app.infrabox.software/signup"
                                onClick={() => trackClick('tool_cta', { tool: 'email-verifier', action: 'signup' })}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 text-[#1240cc] rounded-full transition-all text-sm font-semibold"
                            >
                                Get API Key
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
