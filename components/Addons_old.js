import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, MailWarning, Inbox, Bot, Mail, BarChart3, ArrowRight } from 'lucide-react';

// Simplified Terminal Component for AgentKit
const MiniTerminal = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [displayText, setDisplayText] = useState("");
  
  const snippets = [
    {
      title: "List Inboxes",
      code: `GET /api/email/inbox/list
Authorization: Bearer your-api-key

Response: {
  "inboxes": [{
    "email": "sales@agentmail.to",
    "platform": "GOOGLE"
  }]
}`
    },
    {
      title: "Send Email",
      code: `POST /api/email/message/send
{
  "to": "client@company.com",
  "subject": "Re: Your inquiry",
  "body": "Thank you for reaching out..."
}

Response: { "status": "sent" }`
    },
    {
      title: "Process Messages",
      code: `GET /api/email/message/list
Labels: ["UNREAD", "INBOX"]

Response: {
  "messages": [{
    "from": "lead@example.com",
    "subject": "Interested in demo"
  }]
}`
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % snippets.length);
    }, 4000);
    
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setDisplayText(snippets[currentStep].code);
  }, [currentStep]);

  return (
    <div className="bg-black rounded-xl p-4 font-mono text-xs overflow-hidden h-full">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
        <span className="text-gray-400 text-[10px]">{snippets[currentStep].title}</span>
      </div>
      <pre className="text-green-400 whitespace-pre-wrap text-[11px] leading-relaxed">
        {displayText}
        <span className="animate-pulse">▊</span>
      </pre>
    </div>
  );
};

export default function AddonsSection() {
  const addons = [
    {
      icon: Mail,
      title: "Email Warmup Integration",
      description: "Connect with SmartLead, Instantly, Reply, Lemlist, Za-zu, Email Bison, SalesForge, WarmForge, Warmy, and more.",
      features: ["Multiple platform support", "Automated warmup", "Reputation monitoring"],
      available: true,
      comingSoon: null,
      visual: (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[180px] w-full flex flex-col items-center justify-center p-4">
          <div className="text-xs space-y-2 w-full max-w-[240px]">
            <div className="font-medium text-gray-600 mb-2 text-center">Warmup Progress</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-500 w-12">Week 1</span>
                <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-green-500 h-full rounded-full" style={{width: '100%'}}></div>
                </div>
                <span className="text-[10px] text-gray-600">50/day</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-500 w-12">Week 2</span>
                <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{width: '60%'}}></div>
                </div>
                <span className="text-[10px] text-gray-600">150/day</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-500 w-12">Week 3</span>
                <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gray-300 h-full rounded-full" style={{width: '0%'}}></div>
                </div>
                <span className="text-[10px] text-gray-600">300/day</span>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-center">
              <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-[10px] font-medium whitespace-nowrap">Coming Q2 2025</span>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: ShieldCheck,
      title: "Catch-all Email Validation",
      description: "Verify catch-all emails instantly to reduce bounce rates.",
      features: ["Real-time validation", "Bulk verification", "API access"],
      available: true,
      visual: (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[180px] w-full flex flex-col items-center justify-center p-4">
          <div className="space-y-2 text-xs w-full max-w-[240px]">
            <div className="font-medium text-gray-600 mb-2 text-center">Email Validation</div>
            <div className="flex items-center justify-between p-1.5 bg-gray-50 rounded text-[10px]">
              <span className="text-gray-600 truncate">john@company.com</span>
              <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Valid</span>
            </div>
            <div className="flex items-center justify-between p-1.5 bg-gray-50 rounded text-[10px]">
              <span className="text-gray-600 truncate">info@example.org</span>
              <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">Catch-all</span>
            </div>
            <div className="flex items-center justify-between p-1.5 bg-gray-50 rounded text-[10px]">
              <span className="text-gray-600 truncate">sales@business.net</span>
              <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Valid</span>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: Inbox,
      title: "Master Inbox",
      description: "Unified inbox to view, tag, group, and reply across all mailboxes.",
      features: ["View all mailboxes", "Tag & group emails", "Reply from any mailbox", "Bulk actions"],
      available: true,
      visual: (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[180px] w-full flex flex-col items-center justify-center p-4">
          <div className="text-xs space-y-1.5 w-full max-w-[240px]">
            <div className="flex items-center justify-between text-gray-600 mb-2">
              <span className="font-medium text-[11px]">All Inboxes (247)</span>
              <span className="text-[10px]">5 accounts</span>
            </div>
            {["New partnership opportunity", "Product demo request"].map((subject, i) => (
              <div key={i} className="flex items-center gap-2 p-1.5 bg-gray-50 rounded">
                <div className={`w-1.5 h-1.5 ${i === 0 ? 'bg-blue-500' : 'bg-gray-300'} rounded-full flex-shrink-0`}></div>
                <span className="text-[10px] text-gray-700 truncate flex-1">{subject}</span>
                <div className="flex gap-1 flex-shrink-0">
                  <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-[9px] font-medium">Lead</span>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-center pt-2 gap-3 text-[10px] text-gray-500">
              <span>✏️ Reply</span>
              <span>🏷️ Tag</span>
              <span>📁 Group</span>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: MailWarning,
      title: "Bounce Monitoring",
      description: "Track bounces automatically to protect sender reputation.",
      features: ["Automatic detection", "Bounce analytics", "Suppression lists"],
      available: false,
      comingSoon: "Q2 2025",
      visual: (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[180px] w-full flex flex-col items-center justify-center p-4">
          <div className="text-xs space-y-2 w-full max-w-[240px]">
            <div className="font-medium text-gray-600 text-center mb-3">Bounce Monitoring</div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[11px] text-gray-600">Bounce Rate</span>
                <span className="text-red-600 font-medium text-sm">2.3%</span>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-300 mb-1">📊</div>
                <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-[10px] font-medium whitespace-nowrap">Coming Q2 2025</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: BarChart3,
      title: "Deliverability Testing Suite",
      description: "Test deliverability with DNS checks, blacklist monitoring, and inbox placement.",
      features: ["DNS/Technical checks", "Blacklist monitoring", "Inbox placement tests", "SPF/DKIM/DMARC validation"],
      available: true,
      visual: (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[180px] w-full flex flex-col items-center justify-center p-4">
          <div className="text-xs space-y-1.5 w-full max-w-[240px]">
            <div className="font-medium text-gray-600 text-center mb-2">Deliverability Report</div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between p-1.5 bg-gray-50 rounded text-[10px]">
                <span className="text-gray-600">DNS Health</span>
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">✓ Passed</span>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-gray-50 rounded text-[10px]">
                <span className="text-gray-600">Blacklist Check</span>
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">✓ Clean</span>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-gray-50 rounded text-[10px]">
                <span className="text-gray-600">SPF/DKIM/DMARC</span>
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">✓ Valid</span>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-500">Inbox Rate</span>
                <span className="text-[11px] font-medium text-green-600">94.7%</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <>
      {/* Add-ons Section */}
      <section className="border-gray-200 border-dashed">
        <div className="mx-auto 2xl:max-w-6xl 2xl:px-12 w-full max-w-5xl border-x border-gray-200 border-dashed px-4 py-12">
          <div className="text-center text-balance mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-black">
              Powerful Add-ons to Supercharge Your Email Operations
            </h2>
            <p className="text-base max-w-2xl mx-auto mt-4 text-gray-600">
              Extend your email infrastructure with advanced features designed for scale and performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addons.map((addon, index) => {
              const Icon = addon.icon;
              
              return (
                <div key={index} className="flex flex-col lg:flex-row gap-6 p-6 bg-gray-100 rounded-xl">
                  {/* Feature Info */}
                  <div className="flex-1 space-y-4">
                    <div className="inline-flex p-3 bg-white rounded-lg">
                      <Icon className="w-5 h-5 text-[#1240cc]" />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-black mb-2">
                        {addon.title}
                        {addon.comingSoon && (
                          <span className="ml-2 text-[10px] bg-gray-800 text-white px-2 py-0.5 rounded-full font-normal">
                            Coming {addon.comingSoon}
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {addon.description}
                      </p>
                      
                      
                      <button 
                        className={`flex items-center gap-2 text-sm font-medium ${
                          addon.available 
                            ? 'text-[#1240cc] hover:gap-3' 
                            : 'text-gray-400 cursor-not-allowed'
                        } transition-all`}
                        disabled={!addon.available}
                      >
                        {addon.available ? 'Learn more' : 'Coming soon'}
                        {addon.available && <ArrowRight className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                  
                  {/* Visual Mockup */}
                  <div className="w-full lg:w-64 flex items-center justify-center">
                    {addon.visual}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AgentKit Section */}
      <section className="border-gray-200 border-dashed border-t">
        <div className="mx-auto 2xl:max-w-6xl 2xl:px-12 w-full max-w-5xl border-x border-gray-200 border-dashed px-4 py-12">
          <div className="text-center text-balance mb-8">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-[#1240cc]" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-black">
              AgentKit: Email APIs for AI Agents
            </h2>
            <p className="text-base max-w-2xl mx-auto mt-3 text-gray-600">
              REST APIs for AI agents to manage emails programmatically
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Terminal Demo */}
            <div className="h-[250px]">
              <MiniTerminal />
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 h-[250px]">
              <div className="bg-gradient-to-br from-[#1240cc] to-[#0b34b4] text-white rounded-xl p-4 flex flex-col justify-center items-center text-center">
                <div className="text-2xl font-bold mb-1">18</div>
                <div className="text-xs opacity-90">Total APIs</div>
              </div>
              <div className="bg-gray-100 rounded-xl p-4 flex flex-col justify-center items-center text-center">
                <div className="text-2xl font-bold text-[#1240cc] mb-1">6</div>
                <div className="text-xs text-gray-600">Entity Types</div>
              </div>
              <div className="bg-gray-100 rounded-xl p-4 flex flex-col justify-center items-center text-center">
                <div className="text-2xl font-bold text-[#1240cc] mb-1">2</div>
                <div className="text-xs text-gray-600">Platforms</div>
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-xl p-4 flex flex-col justify-center items-center text-center">
                <div className="text-2xl font-bold mb-1">∞</div>
                <div className="text-xs opacity-90">Possibilities</div>
              </div>
            </div>
          </div>

          {/* Capabilities Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { icon: "📥", title: "Inbox Management" },
              { icon: "💬", title: "Message Processing" },
              { icon: "🤖", title: "Automated Replies" },
              { icon: "🧵", title: "Thread Management" },
              { icon: "📎", title: "File Handling" },
              { icon: "🏷️", title: "Smart Organization" }
            ].map((item, i) => (
              <div key={i} className="p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors text-center">
                <div className="text-xl mb-1">{item.icon}</div>
                <h4 className="text-xs font-medium text-black">{item.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}