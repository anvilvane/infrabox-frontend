import React from 'react';
import { Building2, Users, TrendingUp, Zap, Target, Scale } from 'lucide-react';

export default function AgencySection() {
  return (
    <section className="border-gray-200 border-dashed bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto 2xl:max-w-6xl 2xl:px-12 w-full max-w-5xl border-x border-gray-200 border-dashed px-4 py-16">
        
        {/* Header with Badge */}
        <div className="text-center text-balance mb-12">
          <div className="inline-flex items-center gap-2 bg-[#1240cc] text-white px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Scale className="w-4 h-4" />
            Made for Scale
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-black mb-4">
            Built for SaaS Platforms & Outbound Agencies
          </h2>
          <p className="text-lg max-w-3xl mx-auto text-gray-600">
            Enterprise infrastructure for managing thousands of mailboxes at scale.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* SaaS Platforms */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#1240cc] rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-black">For SaaS Platforms</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Scale your outbound with infrastructure built for volume.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-medium text-black mb-1">Unlimited Scale</h4>
                  <p className="text-sm text-gray-600">Add 100+ mailboxes in minutes</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-medium text-black mb-1">API-First Approach</h4>
                  <p className="text-sm text-gray-600">Direct product integration via APIs</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-medium text-black mb-1">95% Deliverability</h4>
                  <p className="text-sm text-gray-600">Consistent inbox delivery at scale</p>
                </div>
              </div>
            </div>
          </div>

          {/* Outbound Agencies */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#1240cc] rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-black">For Outbound Agencies</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Multi-client management with isolated workspaces.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-medium text-black mb-1">Multi-Client Management</h4>
                  <p className="text-sm text-gray-600">Isolated workspaces per client</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-medium text-black mb-1">Bulk Domain Management</h4>
                  <p className="text-sm text-gray-600">100+ domains per client. 1 admin panel per domain</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-medium text-black mb-1">Bulk Everything</h4>
                  <p className="text-sm text-gray-600">All operations in bulk</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-gray-100 rounded-2xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-[#1240cc] mb-2">200+</div>
              <div className="text-sm text-gray-600">Agencies Using Infrabox</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#1240cc] mb-2">2M+</div>
              <div className="text-sm text-gray-600">Emails Sent Monthly</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#1240cc] mb-2">50K+</div>
              <div className="text-sm text-gray-600">Active Mailboxes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#1240cc] mb-2">95%</div>
              <div className="text-sm text-gray-600">Inbox Delivery Rate</div>
            </div>
          </div>
        </div>

        {/* Key Benefits Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-[#1240cc]" />
            </div>
            <h4 className="font-semibold text-black mb-2">Enterprise Infrastructure</h4>
            <p className="text-sm text-gray-600">
              99.9% uptime SLA
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-[#1240cc]" />
            </div>
            <h4 className="font-semibold text-black mb-2">10-Minute Setup</h4>
            <p className="text-sm text-gray-600">
              Live in under 10 minutes
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-[#1240cc]" />
            </div>
            <h4 className="font-semibold text-black mb-2">Scale Without Limits</h4>
            <p className="text-sm text-gray-600">
              Unlimited growth potential
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}