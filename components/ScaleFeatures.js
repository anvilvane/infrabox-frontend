import React from 'react';
import { Filter, Download, Upload, Clock, ShoppingCart, Zap, ArrowRight, Globe } from 'lucide-react';

export default function ScaleFeatures() {
  const features = [
    {
      icon: Globe,
      title: "Bulk Domain Operations",
      description: "Connect 100+ domains in under 1 minute",
      highlight: "CSV upload, bulk paste, API integration",
      visual: (
        <div className="bg-white rounded-lg shadow-sm outline outline-gray-300 p-3 h-[250px] flex items-center justify-center">
          <div className="text-xs space-y-2 w-full">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="font-medium">Bulk Connect Domains</span>
              <span className="text-[10px] text-green-600">100+ domains</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-[10px] flex-1">sales1.com, sales2.com, sales3.com...</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <Upload className="w-3 h-3 text-gray-500" />
                <span className="text-[10px] text-gray-600">domains.csv (142 domains)</span>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-600">Processing...</span>
                <span className="text-[10px] font-medium text-green-600">142/142</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                <div className="bg-green-500 h-1.5 rounded-full" style={{width: '100%'}}></div>
              </div>
              <div className="text-center mt-2">
                <span className="text-[10px] text-gray-600">⏱️ 48 seconds</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: Filter,
      title: "Extensive Filtration",
      description: "Manage thousands of mailboxes with advanced filters",
      highlight: "Platform, status, domain, admin, tags, dates",
      visual: (
        <div className="bg-white rounded-lg shadow-sm outline outline-gray-300 p-3 h-[250px] flex items-center justify-center">
          <div className="text-xs space-y-2 w-full">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="font-medium">Active Filters (5)</span>
            </div>
            <div className="flex flex-wrap gap-1">
              <span className="bg-[#1240cc] text-white px-2 py-0.5 rounded-full text-[10px]">Platform: Google</span>
              <span className="bg-[#1240cc] text-white px-2 py-0.5 rounded-full text-[10px]">Status: Active</span>
              <span className="bg-[#1240cc] text-white px-2 py-0.5 rounded-full text-[10px]">Domain: sales.com</span>
              <span className="bg-[#1240cc] text-white px-2 py-0.5 rounded-full text-[10px]">Admin: Yes</span>
              <span className="bg-[#1240cc] text-white px-2 py-0.5 rounded-full text-[10px]">Tag: Priority</span>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-100">
              <span className="text-gray-600 text-[10px]">Showing 847 of 2,341 mailboxes</span>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: Download,
      title: "One-Click Export",
      description: "Export all mailbox data instantly",
      highlight: "CSV, JSON, Excel formats",
      visual: (
        <div className="bg-white rounded-lg shadow-sm outline outline-gray-300 p-3 h-[250px] flex items-center justify-center">
          <div className="text-xs space-y-2 w-full">
            <div className="font-medium text-gray-600 mb-2">Export Options</div>
            <div className="space-y-1">
              <button className="w-full flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                <span className="text-[11px]">All Mailboxes (2,341)</span>
                <span className="text-[10px] text-green-600 font-medium">CSV</span>
              </button>
              <button className="w-full flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                <span className="text-[11px]">Filtered Results (847)</span>
                <span className="text-[10px] text-blue-600 font-medium">Excel</span>
              </button>
              <div className="flex items-center justify-center pt-1">
                <Download className="w-3 h-3 text-[#1240cc] animate-bounce" />
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: Upload,
      title: "Bulk Import to Sequencers",
      description: "One-click sync with 24+ email platforms",
      highlight: "Instantly, Smartlead, Apollo, and more",
      visual: (
        <div className="bg-white rounded-lg shadow-sm outline outline-gray-300 p-3 h-[250px] flex items-center justify-center">
          <div className="text-xs space-y-2 w-full">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-600">Select Platform</span>
              <span className="text-[10px] text-green-600">15+ supported</span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <div className="p-2 bg-gray-50 rounded text-center hover:bg-[#1240cc] hover:text-white transition-colors cursor-pointer">
                <span className="text-[10px] font-medium">Instantly</span>
              </div>
              <div className="p-2 bg-gray-50 rounded text-center hover:bg-[#1240cc] hover:text-white transition-colors cursor-pointer">
                <span className="text-[10px] font-medium">Smartlead</span>
              </div>
              <div className="p-2 bg-gray-50 rounded text-center hover:bg-[#1240cc] hover:text-white transition-colors cursor-pointer">
                <span className="text-[10px] font-medium">Apollo</span>
              </div>
              <div className="p-2 bg-gray-50 rounded text-center hover:bg-[#1240cc] hover:text-white transition-colors cursor-pointer">
                <span className="text-[10px] font-medium">Lemlist</span>
              </div>
            </div>
            <div className="text-center pt-1">
              <span className="text-[10px] text-gray-500">Click to import 500+ mailboxes</span>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: Clock,
      title: "Smart Scheduling",
      description: "Automated workflows on your schedule",
      highlight: "Scheduled imports, exports, updates",
      visual: (
        <div className="bg-white rounded-lg shadow-sm outline outline-gray-300 p-3 h-[250px] flex items-center justify-center">
          <div className="text-xs space-y-2 w-full">
            <div className="font-medium text-gray-600 mb-2">Scheduled Tasks</div>
            <div className="space-y-1">
              <div className="flex items-center justify-between p-1.5 bg-gray-50 rounded">
                <span className="text-[10px]">Daily Export</span>
                <span className="text-[10px] text-gray-500">9:00 AM</span>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-gray-50 rounded">
                <span className="text-[10px]">Weekly Sync</span>
                <span className="text-[10px] text-gray-500">Mon 2:00 PM</span>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-green-50 rounded border border-green-200">
                <span className="text-[10px] text-green-700">Running Now</span>
                <Clock className="w-3 h-3 text-green-600 animate-spin" />
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: ShoppingCart,
      title: "Rapid Bulk Ordering",
      description: "Order 100+ mailboxes in under 5 minutes",
      highlight: "AI-powered profile generation",
      visual: (
        <div className="bg-white rounded-lg shadow-sm outline outline-gray-300 p-3 h-[250px] flex items-center justify-center">
          <div className="text-xs space-y-2 w-full">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#1240cc] mb-1">100+</div>
              <div className="text-[10px] text-gray-600">mailboxes</div>
            </div>
            <div className="flex items-center justify-center gap-1 py-2">
              <div className="w-8 h-0.5 bg-green-500"></div>
              <Zap className="w-4 h-4 text-yellow-500" />
              <div className="w-8 h-0.5 bg-green-500"></div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-[#1240cc]">&lt; 5 min</div>
              <div className="text-[10px] text-gray-600">setup time</div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <section className="border-gray-200 border-dashed">
      <div className="mx-auto 2xl:max-w-6xl 2xl:px-12 w-full max-w-5xl border-x border-gray-200 border-dashed px-4 py-12 border-t">
        
        {/* Section Header */}
        <div className="text-center text-balance mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-black">
            Built for Scale, Designed for Speed
          </h2>
          <p className="text-base max-w-2xl mx-auto mt-4 text-gray-600">
            Powerful bulk operations and automation for scale
          </p>
        </div>

        {/* Features Grid - All 6 features in a single grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            
            return (
              <div key={index} className="group">
                <div className="h-full p-6 bg-gray-100 rounded-xl hover:shadow-md transition-all">
                  {/* Icon */}
                  <div className="inline-flex p-3 bg-white rounded-lg mb-4">
                    <Icon className="w-5 h-5 text-[#1240cc]" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-medium text-black mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {feature.description}
                  </p>
                  <p className="text-xs text-[#1240cc] font-medium mb-4">
                    {feature.highlight}
                  </p>
                  
                  {/* Visual */}
                  <div className="mt-4">
                    {feature.visual}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Start scaling your email operations today
          </p>
          <a 
            href="https://app.infrabox.software/signup"
            className="inline-flex transition text-center rounded-full items-center duration-300 justify-center focus:ring-2 focus:outline-none focus:ring-offset-2 text-white bg-[#1240cc] hover:bg-[#0b34b4] focus:ring-[#1240cc] h-11 px-8 py-3 text-base shadow-lg shadow-[#1240cc]/25 gap-2"
          >
            Start Scaling Today
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}