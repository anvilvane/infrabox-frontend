'use client'

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Shield,
  Check,
  AlertTriangle,
  X,
  ArrowRight,
  Mail,
  AlertOctagon,
  TrendingUp,
  Info,
  ChevronDown,
  ChevronUp,
  FileText,
  Code,
  Zap,
  Search,
  Filter,
  XCircle,
  CheckCircle,
  Plus,
  Minus
} from "lucide-react";
import { trackClick } from '@/lib/datafast';
import ScoreCircle from "@/components/ScoreCircle";
import Link from "next/link";

export default function SpamCheckerPage() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [html, setHtml] = useState("");
  const [checkType, setCheckType] = useState("comprehensive");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState("input");
  const [expandedCategories, setExpandedCategories] = useState({});
  const [showHtmlInput, setShowHtmlInput] = useState(false);
  const [openItems, setOpenItems] = useState(new Set([0]));

  const checkSpam = async () => {
    if (!subject && !body && !html) {
      alert("Please enter at least a subject or body content to analyze");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/tools/spam-checker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          body,
          html,
          checkType
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze content');
      }

      const data = await response.json();
      setResults(data);
      setActiveTab("results");
    } catch (error) {
      console.error('Error checking spam:', error);
      setResults({
        error: true,
        message: 'Unable to analyze content. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSubject("");
    setBody("");
    setHtml("");
    setResults(null);
    setActiveTab("input");
    setExpandedCategories({});
  };

  const loadSampleSpam = () => {
    setSubject("🎉 CONGRATULATIONS! You've WON $1,000,000!!!");
    setBody(`Dear Valued Customer,

URGENT: You've been selected as our LUCKY WINNER!

Click here NOW to claim your FREE prize of ONE MILLION DOLLARS! This is a LIMITED TIME offer that expires TODAY!

Act now or lose this once-in-a-lifetime opportunity! NO OBLIGATION! 100% GUARANTEED! Risk-free!

Our Nigerian prince partner has personally selected YOU from millions of users. All you need to do is:
1. Click the link below
2. Enter your bank details
3. Pay a small processing fee
4. Receive your millions!

BONUS: Order in the next 10 minutes and receive FREE viagra and weight loss pills!

Visit: http://192.168.1.1/totally-not-a-scam
Call: 1-900-SCAM-NOW

This is NOT spam! We hate spam too!

Best regards,
Prince Ahmed
CEO of Free Money International`);
  };

  const loadSampleClean = () => {
    setSubject("Team Meeting Tomorrow at 2 PM");
    setBody(`Hi everyone,

Just a reminder that we have our weekly team meeting scheduled for tomorrow at 2 PM in the main conference room.

We'll be discussing:
- Project updates
- Q3 goals review
- Upcoming deadlines
- Team feedback

Please come prepared with your status updates. Let me know if you have any questions.

Thanks,
Sarah
Project Manager`);
  };

  const getRiskIcon = (level) => {
    const icons = {
      'MINIMAL': <CheckCircle className="w-5 h-5 text-green-600" />,
      'LOW': <AlertTriangle className="w-5 h-5 text-lime-600" />,
      'MEDIUM': <AlertTriangle className="w-5 h-5 text-amber-600" />,
      'HIGH': <AlertOctagon className="w-5 h-5 text-red-600" />,
      'CRITICAL': <XCircle className="w-5 h-5 text-red-800" />
    };
    return icons[level] || <Info className="w-5 h-5 text-gray-600" />;
  };

  const getRiskColor = (level) => {
    const colors = {
      'MINIMAL': 'text-green-600 bg-green-50',
      'LOW': 'text-lime-600 bg-lime-50',
      'MEDIUM': 'text-amber-600 bg-amber-50',
      'HIGH': 'text-red-600 bg-red-50',
      'CRITICAL': 'text-red-800 bg-red-100'
    };
    return colors[level] || 'text-gray-600 bg-gray-50';
  };

  const getSeverityBadge = (severity) => {
    const colors = {
      'critical': 'bg-red-100 text-red-800',
      'high': 'bg-orange-100 text-orange-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'low': 'bg-blue-100 text-blue-800',
      'minimal': 'bg-gray-100 text-gray-800'
    };
    return colors[severity] || 'bg-gray-100 text-gray-800';
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
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

  const faqs = [
    {
      question: "How does the spam checker work?",
      answer: "Our spam checker analyzes your email subject line and body content against known spam triggers, keyword lists, and formatting rules used by major email providers to identify spam."
    },
    {
      question: "What is a good spam score?",
      answer: "A lower spam score is better. Ideally, you want a score of 0. Scores below 2.5 are generally considered safe, while scores above 5.0 are likely to be marked as spam."
    },
    {
      question: "Can I check HTML emails?",
      answer: "Yes, you can paste your HTML code into the tool to analyze both the content and the HTML structure for potential issues."
    },
    {
      question: "Is this tool free to use?",
      answer: "Yes, this spam checker is completely free to use for analyzing your email content."
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
            <span className="text-gray-600">Spam Checker</span>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="text-center pt-12 pb-16 max-w-3xl mx-auto">
            <p className="font-mono text-xs uppercase tracking-widest text-[#1240cc] mb-5">Free tool</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-black mb-5">Email spam checker</h1>
            <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
              Analyze email content for spam triggers and improve deliverability.
              Get actionable recommendations to avoid spam filters and reach the inbox.
            </p>
          </div>
        </div>
      </section>

      {/* Main Tool Section */}
      <section className="bg-white min-h-[600px]">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8 pb-16">
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-8 max-w-5xl mx-auto">
            <button
              onClick={() => setActiveTab("input")}
              className={`px-6 py-3 rounded-full font-medium transition ${activeTab === "input"
                  ? "bg-[#1240cc] text-white"
                  : "bg-white text-black border border-gray-300 hover:border-[#1240cc] hover:text-[#1240cc]"
                }`}
            >
              <Mail className="w-4 h-4 inline mr-2" />
              Input
            </button>
            {results && (
              <button
                onClick={() => setActiveTab("results")}
                className={`px-6 py-3 rounded-full font-medium transition ${activeTab === "results"
                    ? "bg-[#1240cc] text-white"
                    : "bg-white text-black border border-gray-300 hover:border-[#1240cc] hover:text-[#1240cc]"
                  }`}
              >
                <TrendingUp className="w-4 h-4 inline mr-2" />
                Results
              </button>
            )}
          </div>

          {/* Input Tab */}
          {activeTab === "input" && (
            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                {/* Quick Load Buttons */}
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={loadSampleSpam}
                    className="px-4 py-2 bg-red-50 text-red-700 rounded-full hover:bg-red-100 transition text-sm border border-red-200"
                  >
                    Load Spam Sample
                  </button>
                  <button
                    onClick={loadSampleClean}
                    className="px-4 py-2 bg-green-50 text-green-700 rounded-full hover:bg-green-100 transition text-sm border border-green-200"
                  >
                    Load Clean Sample
                  </button>
                </div>

                {/* Subject Line */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Email Subject Line
                  </label>
                  <Input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter your email subject..."
                    className="w-full px-4 h-[52px] py-0 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1240cc] focus:border-transparent transition-all placeholder:text-gray-400"
                    disabled={loading}
                  />
                </div>

                {/* Body Content */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Email Body Content
                  </label>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Paste your email content here..."
                    rows="10"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1240cc] focus:border-transparent transition-all placeholder:text-gray-400"
                    disabled={loading}
                  />
                </div>

                {/* HTML Content (Optional) */}
                <div>
                  <button
                    onClick={() => setShowHtmlInput(!showHtmlInput)}
                    className="flex items-center gap-2 text-sm font-medium text-black mb-2"
                  >
                    <Code className="w-4 h-4" />
                    HTML Content (Optional)
                    {showHtmlInput ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {showHtmlInput && (
                    <textarea
                      value={html}
                      onChange={(e) => setHtml(e.target.value)}
                      placeholder="Paste HTML version if available..."
                      rows="6"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1240cc] focus:border-transparent transition-all font-mono text-sm placeholder:text-gray-400"
                      disabled={loading}
                    />
                  )}
                </div>

                {/* Analysis Type */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Analysis Type
                  </label>
                  <Select value={checkType} onValueChange={setCheckType} disabled={loading}>
                    <SelectTrigger className="w-full px-4 py-3 h-[52px] border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1240cc] focus:border-transparent transition-all">
                      <SelectValue placeholder="Select analysis type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comprehensive">Comprehensive Analysis</SelectItem>
                      <SelectItem value="quick">Quick Check</SelectItem>
                      <SelectItem value="subject_only">Subject Line Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <button
                    onClick={checkSpam}
                    disabled={loading || (!subject && !body && !html)}
                    className="w-full px-8 py-4 bg-[#1240cc] text-white font-semibold rounded-full hover:bg-[#0b34b4] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing content...
                      </span>
                    ) : (
                      'Analyze Content'
                    )}
                  </button>
                  <button
                    onClick={reset}
                    disabled={loading}
                    className="w-full px-6 py-3 border border-gray-300 text-black font-medium rounded-full hover:border-[#1240cc] hover:text-[#1240cc] transition-all disabled:opacity-50"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Results Tab */}
          {activeTab === "results" && results && !results.error && (
            <div className="max-w-5xl mx-auto space-y-8">
              {/* Results Header */}
              <div className="border-b border-gray-200 pb-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#1240cc] mb-2">
                      ANALYSIS RESULTS
                    </p>
                    <h2 className="text-3xl font-bold text-black">
                      Spam Analysis
                    </h2>
                  </div>
                  <button
                    onClick={reset}
                    className="px-5 py-2.5 text-sm font-medium text-black border border-gray-300 rounded-full hover:border-[#1240cc] hover:text-[#1240cc] transition-all"
                  >
                    New Analysis
                  </button>
                </div>
              </div>

              {/* Score Card */}
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                  <div className="text-center">
                    <ScoreCircle score={Math.max(0, 100 - (results.spamScore || 0))} />
                    <p className="mt-4 text-sm font-medium text-black">
                      Deliverability Score
                    </p>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm font-medium text-gray-500">Risk Level:</span>
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${results.riskLevel === 'MINIMAL' ? 'bg-green-50 text-green-700 border border-green-200' :
                          results.riskLevel === 'LOW' ? 'bg-green-50 text-green-700 border border-green-200' :
                            results.riskLevel === 'MEDIUM' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                              'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                        {results.riskLevel}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {results.riskLevel === 'MINIMAL' ? 'Excellent content with minimal risk of triggering spam filters.' :
                        results.riskLevel === 'LOW' ? 'Good content with low risk of delivery issues.' :
                          results.riskLevel === 'MEDIUM' ? 'Some spam triggers detected that should be addressed.' :
                            'High risk content that will likely be filtered as spam.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Summary Stats */}
              {results.summary && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 border border-gray-200 rounded-xl text-center">
                    <div className="text-2xl font-bold text-black">{results.summary.totalIssues}</div>
                    <div className="text-xs text-gray-500">Total Issues</div>
                  </div>
                  {results.summary.criticalIssues > 0 && (
                    <div className="p-4 border border-red-200 rounded-xl text-center">
                      <div className="text-2xl font-bold text-red-600">{results.summary.criticalIssues}</div>
                      <div className="text-xs text-gray-500">Critical</div>
                    </div>
                  )}
                  {results.summary.highIssues > 0 && (
                    <div className="p-4 border border-orange-200 rounded-xl text-center">
                      <div className="text-2xl font-bold text-orange-600">{results.summary.highIssues}</div>
                      <div className="text-xs text-gray-500">High</div>
                    </div>
                  )}
                  {results.summary.mediumIssues > 0 && (
                    <div className="p-4 border border-yellow-200 rounded-xl text-center">
                      <div className="text-2xl font-bold text-yellow-600">{results.summary.mediumIssues}</div>
                      <div className="text-xs text-gray-500">Medium</div>
                    </div>
                  )}
                </div>
              )}

              {/* Recommendations */}
              {results.recommendations && results.recommendations.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-black mb-6">
                    Recommendations
                  </h3>
                  <div className="space-y-4">
                    {results.recommendations.map((rec, index) => (
                      <div key={index} className="p-6 bg-white border border-gray-200 rounded-xl hover:border-[#1240cc] transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-base font-semibold text-black">
                            {rec.message}
                          </h4>
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${rec.priority === 'critical' ? 'bg-red-50 text-red-700 border border-red-200' :
                              rec.priority === 'high' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                                rec.priority === 'medium' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                                  rec.priority === 'low' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                    'bg-green-50 text-green-700 border border-green-200'
                            }`}>
                            {rec.priority?.charAt(0).toUpperCase() + rec.priority?.slice(1) || 'Info'}
                          </span>
                        </div>
                        {rec.action && (
                          <p className="text-sm text-gray-500 leading-relaxed mb-2">
                            {rec.action}
                          </p>
                        )}
                        {rec.suggestion && (
                          <p className="text-sm text-gray-500 italic">
                            {rec.suggestion}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Detailed Issues by Category */}
              {results.categoryScores && Object.keys(results.categoryScores).length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-black mb-6">Issues by Category</h3>
                  <div className="space-y-3">
                    {Object.entries(results.categoryScores).map(([category, data]) => (
                      <div key={category} className="bg-white border border-gray-200 rounded-xl">
                        <button
                          onClick={() => toggleCategory(category)}
                          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-xl"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-black">{category}</span>
                            <span className="text-sm text-gray-500">
                              {data.count} issue{data.count !== 1 ? 's' : ''}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-red-600 px-2 py-1 bg-red-50 rounded-full">-{data.score}</span>
                            {expandedCategories[category] ?
                              <ChevronUp className="w-4 h-4 text-black/40" /> :
                              <ChevronDown className="w-4 h-4 text-black/40" />
                            }
                          </div>
                        </button>
                        {expandedCategories[category] && (
                          <div className="border-t border-gray-200 p-6">
                            <div className="space-y-4">
                              {data.issues.map((issue, idx) => (
                                <div key={idx} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getSeverityBadge(issue.severity)}`}>
                                        {issue.severity}
                                      </span>
                                      <span className="text-xs font-bold text-red-600">-{issue.score}</span>
                                    </div>
                                    <p className="text-sm text-gray-500">{issue.message}</p>
                                    {issue.word && (
                                      <code className="text-xs bg-white px-2 py-1 rounded mt-2 inline-block border">
                                        {issue.word}
                                      </code>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Statistics */}
              {results.statistics && (
                <div>
                  <h3 className="text-xl font-bold text-black mb-6">Content Statistics</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {Object.entries(results.statistics).map(([key, value]) => (
                      <div key={key} className="p-4 bg-white border border-gray-200 rounded-xl">
                        <div className="text-center">
                          <div className="text-xl font-bold text-black">
                            {typeof value === 'number' ?
                              (Number.isInteger(value) ? value : value.toFixed(1)) :
                              value
                            }
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error Display */}
          {results && results.error && (
            <div className="max-w-5xl mx-auto">
              <div className="p-6 bg-white border border-red-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-black">Error</h3>
                    <p className="text-gray-500 mt-1">{results.message}</p>
                  </div>
                </div>
              </div>
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
                href="/resources/tools/email-header-analyzer"
                onClick={() => trackClick('tool_navigation', { from: 'spam-checker', to: 'email-header-analyzer' })}
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                  Header Analyzer
                </h3>
                <p className="text-sm text-gray-500">
                  Analyze email headers for authentication issues.
                </p>
              </Link>

              <Link
                href="/resources/tools/deliverability-score"
                onClick={() => trackClick('tool_navigation', { from: 'spam-checker', to: 'deliverability-score' })}
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                  Deliverability Score
                </h3>
                <p className="text-sm text-gray-500">
                  Complete domain deliverability analysis.
                </p>
              </Link>

              <Link
                href="/resources/tools/reputation-check"
                onClick={() => trackClick('tool_navigation', { from: 'spam-checker', to: 'reputation-check' })}
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                  Reputation Check
                </h3>
                <p className="text-sm text-gray-500">
                  Monitor IP and domain reputation status.
                </p>
              </Link>

              <Link
                href="/resources/tools/mailbox-calculator"
                onClick={() => trackClick('tool_navigation', { from: 'spam-checker', to: 'mailbox-calculator' })}
                className="group block p-5 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <h3 className="text-base font-semibold text-black mb-2 group-hover:text-[#1240cc] transition-colors">
                  Mailbox Calculator
                </h3>
                <p className="text-sm text-gray-500">
                  Calculate optimal mailbox requirements.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Educational Content */}
      <section className="bg-white border-t border-gray-200">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="py-16 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold tracking-tight text-black mb-6">
              Understanding spam detection
            </h2>

            <p className="text-base text-gray-500 leading-relaxed mb-8">
              Spam filters use complex algorithms to analyze email content, sender reputation,
              and user behavior. Understanding these systems helps you create content that
              reaches the inbox consistently.
            </p>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-lg font-semibold text-black mb-4">
                  Common triggers
                </h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Excessive capitalization
                    </p>
                    <p className="text-sm text-gray-500">
                      Using ALL CAPS or too many exclamation marks looks unprofessional.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Spam keywords
                    </p>
                    <p className="text-sm text-gray-500">
                      Terms like "free", "guarantee", "winner" trigger filters.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Poor formatting
                    </p>
                    <p className="text-sm text-gray-500">
                      Excessive punctuation, colors, or hidden text raises red flags.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Suspicious links
                    </p>
                    <p className="text-sm text-gray-500">
                      URL shorteners and IP addresses instead of domains.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-black mb-4">
                  Best practices
                </h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Write naturally
                    </p>
                    <p className="text-sm text-gray-500">
                      Use proper grammar, spelling, and conversational tone.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Provide value
                    </p>
                    <p className="text-sm text-gray-500">
                      Focus on helpful content rather than pure sales messaging.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Test regularly
                    </p>
                    <p className="text-sm text-gray-500">
                      Check content before sending to large lists or campaigns.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black mb-1">
                      Build reputation
                    </p>
                    <p className="text-sm text-gray-500">
                      Consistent sending patterns and engagement improve deliverability.
                    </p>
                  </div>
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

      {/* CTA Section */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl pb-4 w-full border-x border-gray-200 border-dashed px-4">
          <div className="py-20 text-center max-w-xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-black mb-4">
              Improve your email content
            </h2>
            <p className="text-base text-gray-500 mb-8 max-w-xl mx-auto">
              Infrabox helps you avoid spam filters and reach the inbox consistently
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="https://app.infrabox.software/signup"
                onClick={() => trackClick('tool_cta', { tool: 'spam-checker', action: 'signup' })}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 text-[#1240cc] rounded-full transition-all text-sm font-semibold"
              >
                Get Started
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