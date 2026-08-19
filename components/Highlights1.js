import React from 'react';
import { Clock, Globe, Shield, Mail, Zap, FileUp, Check, Flame, BarChart3, Cloud, Settings, ShieldCheck, Search, TrendingDown, Inbox, Activity, Heart, TrendingUp, AlertTriangle, Bell, TestTube } from 'lucide-react';

export default function QuickStartSection() {
  return (
    <>
      {/* Quick Setup Section */}
      <section>
        <div className="mx-auto 2xl:max-w-6xl 2xl:px-12 w-full max-w-6xl border-x border-gray-200 border-dashed px-4 pt-12 pb-4">
         <div className="text-balance">
  <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium tracking-tight text-black">
    Ready in 10 Minutes
  </h2>
  <p className="text-base max-w-xl mt-4 text-gray-600">
    Whether you’re setting up 10 mailboxes or 1,000, getting started is quick. Connect your domain with one click and start sending in minutes.
  </p>
</div>

          
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div aria-hidden="true" className="p-8 pb-0 overflow-hidden bg-gray-100 lg:col-span-2 lg:p-20 lg:pb-0 rounded-xl">
              <div className="h-2 mx-8 bg-white border border-b-0 rounded-t-xl border-gray-300"></div>
              <div className="h-3 mx-4 bg-white border border-b-0 rounded-t-xl border-gray-300"></div>
              <div className="bg-white outline outline-gray-200 rounded-xl shadow-sm divide-y divide-gray-200 -mb-[12%] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 text-xs bg-gray-50 text-gray-600">
                  <span>Domain Setup</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">just now</span>
                    <div className="px-3 py-1 text-xs border rounded-full border-gray-300 text-gray-700 hover:bg-gray-100">
                      Check DNS
                    </div>
                    <div className="px-3 py-1 text-xs text-white rounded-full bg-[#1240cc] hover:bg-[#0b34b4]">
                      Connect
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 text-xs space-y-4 text-gray-700">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-500">Domain</span>
                    <span className="text-black">infrabox.software</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-500">Status</span>
                    <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
                      Connected
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-500">Time</span>
                    <span className="text-black">2 minutes</span>
                  </div>
                </div>
                <div className="px-6 py-4 bg-white">
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#1240cc] rounded-full"></div>
                      <span>DNS records configured</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#1240cc] rounded-full"></div>
                      <span>SSL certificate active</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span>Email routing setup...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative h-full overflow-hidden rounded-xl group min-h-[300px] bg-gradient-to-br from-[#1240cc] to-[#0b34b4]">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="relative z-20 flex flex-col justify-between h-full p-6">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-white">Domain Health Check</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                        <span className="text-sm text-white">Blacklist status verified</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                        <span className="text-sm text-white">No past abuse detected</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                        <span className="text-sm text-white">100% fresh domains</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm sm:text-base text-white font-medium">
                    All domains pre-screened for blacklists and past abuse. Only healthy, reputation-clean domains delivered.
                  </p>
                  <p className="text-xs mt-2 text-green-300">
                    Verified before purchase
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workspace & Security Features */}
      <section>
        <div className="mx-auto 2xl:max-w-6xl 2xl:px-12 w-full max-w-6xl border-x border-gray-200 border-dashed px-4 flex flex-col py-12 border-t gap-24">
          
          {/* Workspace Management */}
          <div className="items-start grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex flex-col justify-center h-full text-balance gap-4">
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl  font-medium tracking-tight text-black">
                  Dedicated Panel for Each Domain
                </h2>
                <p className="text-base max-w-xl mt-4 text-gray-600">
                  Every domain gets its own isolated panel. If one domain's reputation gets damaged, others remain unaffected. Complete isolation means maximum protection and zero cross-contamination.
                </p>
                <div className="flex mt-4">
                  <a href="https://app.infrabox.software/signup" className="flex transition text-center rounded-full items-center duration-300 justify-center focus:ring-2 focus:outline-none focus:ring-offset-2 text-white bg-[#1240cc] hover:bg-[#0b34b4] focus:ring-[#1240cc] h-9 px-4 py-2 text-sm">
                    Get started
                  </a>
                </div>
              </div>
            </div>
            
            <div aria-hidden="true" className="p-8 pb-0 pr-0 overflow-hidden bg-gray-100 rounded-xl group">
              <div className="max-w-md p-4 mx-auto -mb-1 -mr-1 bg-white rounded-tl-xl shadow-sm outline outline-gray-300">
                <div className="flex items-center gap-4">
                  <div className="inline-flex p-4 rounded-lg bg-gray-100">
                    <Shield className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Domain Panels</p>
                    <p className="text-base font-medium text-black">
                      3 Isolated
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 mt-4 border-t space-y-4 border-gray-100">
                  {[
                    { name: "northpeak.io", status: "Healthy", reputation: "95%", isolation: "Protected", color: "bg-green-500" },
                    { name: "infrabox.software", status: "Healthy", reputation: "93%", isolation: "Protected", color: "bg-green-500" },
                    { name: "brightlane.co", status: "Isolated", reputation: "72%", isolation: "Quarantined", color: "bg-yellow-500" }
                  ].map((domain, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 ${domain.color} rounded-full`}></div>
                        <div>
                          <div className="text-sm font-medium text-black">{domain.name}</div>
                          <div className="text-xs text-gray-500">Rep: {domain.reputation} • {domain.isolation}</div>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        domain.status === 'Isolated' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {domain.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Security Setup */}
          <div className="items-center grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex flex-col justify-between h-full text-balance gap-4 lg:order-last">
              <div className="inline-flex p-4 rounded-lg bg-gray-100 w-fit">
                <Shield className="size-5 text-[#1240cc]" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl  font-medium tracking-tight text-black">
                  DNS Configuration DFY
                </h2>
                <p className="text-base max-w-xl mt-4 text-gray-600">
                  We configure DKIM, DMARC, and SPF records automatically. Your emails land in inboxes, not spam folders. Maximum deliverability without the technical headaches.
                </p>
                <div className="flex mt-4">
                  <a href="https://app.infrabox.software/signup" className="flex transition text-center rounded-full items-center duration-300 justify-center focus:ring-2 focus:outline-none focus:ring-offset-2 text-white bg-[#1240cc] hover:bg-[#0b34b4] focus:ring-[#1240cc] h-9 px-4 py-2 text-sm">
                    Get started
                  </a>
                </div>
              </div>
            </div>
            
            <div aria-hidden="true" className="p-8 pb-0 pl-0 overflow-hidden bg-gray-100 rounded-xl group">
              <div className="max-w-md p-4 mx-auto -mb-1 -ml-1 bg-white rounded-tr-xl shadow-sm outline outline-gray-300">
                <div className="flex items-center gap-4">
                  <div className="inline-flex p-4 rounded-lg bg-gray-100">
                    <Shield className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Security</p>
                    <p className="text-base font-medium text-black">
                      Auto Configuration
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 mt-4 border-t grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 border-gray-100 gap-y-8">
                  <div>
                    <p className="text-sm text-gray-500">DKIM</p>
                    <p className="text-base font-medium text-black">Active</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">DMARC</p>
                    <p className="text-base font-medium text-black">Enabled</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">SPF</p>
                    <p className="text-base font-medium text-black">Protected</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Reputation</p>
                    <p className="text-base font-medium text-black">Excellent</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Deliverability</p>
                    <p className="text-base font-medium text-black">95%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="text-base font-medium text-black">Ready</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bulk Operations */}
          <div className="items-start grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex flex-col justify-between h-full text-balance gap-4">
              <div className="inline-flex p-4 rounded-lg bg-gray-100 w-fit">
                <Mail className="size-5 text-[#1240cc]" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl  font-medium tracking-tight text-black">
                  Scale with Bulk Operations
                </h2>
                <p className="text-base max-w-xl mt-4 text-gray-600">
                  Buy multiple mailboxes at once and let AI fill in the details. Go from 1 to 100 mailboxes without the manual work. Perfect for agencies and growing teams.
                </p>
                <div className="flex mt-4">
                  <a href="https://app.infrabox.software/signup" className="flex transition text-center rounded-full items-center duration-300 justify-center focus:ring-2 focus:outline-none focus:ring-offset-2 text-white bg-[#1240cc] hover:bg-[#0b34b4] focus:ring-[#1240cc] h-9 px-4 py-2 text-sm">
                    Get started
                  </a>
                </div>
              </div>
            </div>
            
            <div aria-hidden="true" className="p-8 pb-0 overflow-hidden bg-gray-100 rounded-xl group">
              <div className="p-4 mx-auto -mb-1 bg-white rounded-t-xl shadow-sm outline outline-gray-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="inline-flex p-4 rounded-lg bg-gray-100">
                      <Mail className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Bulk Setup</p>
                      <p className="text-base font-medium text-black">
                        50 Mailboxes
                      </p>
                    </div>
                  </div>
                  <button tabIndex={-1} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                    <FileUp className="size-3" />
                    Import CSV
                  </button>
                </div>
                
                <div className="pt-4 mt-4 border-t grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 border-gray-100 gap-y-8">
                  <div>
                    <p className="text-sm text-gray-500">Purchased</p>
                    <p className="text-base font-medium text-black">50</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">AI Generated</p>
                    <p className="text-base font-medium text-black">50</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Configured</p>
                    <p className="text-base font-medium text-black">47</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Remaining</p>
                    <p className="text-base font-medium text-black">3</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Progress</p>
                    <p className="text-base font-medium text-black">94%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time Left</p>
                    <p className="text-base font-medium text-black">2 min</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Isolated Warmup */}
          <div className="items-center grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex flex-col justify-between h-full text-balance gap-4 lg:order-last">
              <div className="inline-flex p-4 rounded-lg bg-gray-100 w-fit">
                <Flame className="size-5 text-[#1240cc]" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium tracking-tight text-black">
                  Isolated Email Warmup
                </h2>
                <p className="text-base max-w-xl mt-4 text-gray-600">
                  Build sender reputation automatically across Google, Microsoft & Azure. Smart volume ramping from 2 to 40 emails/day with real-time inbox and spam rate tracking.
                </p>
                <div className="flex mt-4">
                  <a href="/email-warmup" className="flex transition text-center rounded-full items-center duration-300 justify-center focus:ring-2 focus:outline-none focus:ring-offset-2 text-white bg-[#1240cc] hover:bg-[#0b34b4] focus:ring-[#1240cc] h-9 px-4 py-2 text-sm">
                    Learn more about email warmup
                  </a>
                </div>
              </div>
            </div>

            <div aria-hidden="true" className="p-8 pb-0 pl-0 overflow-hidden bg-gray-100 rounded-xl group">
              <div className="max-w-md p-4 mx-auto -mb-1 -ml-1 bg-white rounded-tr-xl shadow-sm outline outline-gray-300">
                <div className="flex items-center gap-4">
                  <div className="inline-flex p-4 rounded-lg bg-gray-100">
                    <Flame className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email Warmup</p>
                    <p className="text-base font-medium text-black">Sender Reputation</p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t grid grid-cols-3 border-gray-100 gap-y-8">
                  <div>
                    <p className="text-sm text-gray-500">Active</p>
                    <p className="text-base font-medium text-black">847</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Health Score</p>
                    <p className="text-base font-medium text-green-700">92%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Inbox Rate</p>
                    <p className="text-base font-medium text-black">96.1%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Daily Volume</p>
                    <p className="text-base font-medium text-black">2 → 40</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Spam Rate</p>
                    <p className="text-base font-medium text-black">1.8%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Platforms</p>
                    <p className="text-base font-medium text-black">3</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* InfraGuard */}
          <div className="items-start grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex flex-col justify-between h-full text-balance gap-4">
              <div className="inline-flex p-4 rounded-lg bg-gray-100 w-fit">
                <Shield className="size-5 text-[#1240cc]" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium tracking-tight text-black">
                  InfraGuard Domain Protection
                </h2>
                <p className="text-base max-w-xl mt-4 text-gray-600">
                  24/7 blacklist monitoring, DNS watchdog, bounce tracking & inbox placement tests. Get alerted before problems affect your deliverability.
                </p>
                <div className="flex mt-4">
                  <a href="https://app.infrabox.software/signup" className="flex transition text-center rounded-full items-center duration-300 justify-center focus:ring-2 focus:outline-none focus:ring-offset-2 text-white bg-[#1240cc] hover:bg-[#0b34b4] focus:ring-[#1240cc] h-9 px-4 py-2 text-sm">
                    Get started
                  </a>
                </div>
              </div>
            </div>

            <div aria-hidden="true" className="p-8 pb-0 pr-0 overflow-hidden bg-gray-100 rounded-xl group">
              <div className="max-w-md p-4 mx-auto -mb-1 -mr-1 bg-white rounded-tl-xl shadow-sm outline outline-gray-300">
                <div className="flex items-center gap-4">
                  <div className="inline-flex p-4 rounded-lg bg-gray-100">
                    <Shield className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">InfraGuard</p>
                    <p className="text-base font-medium text-black">Domain Protection</p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t space-y-4 border-gray-100">
                  {[
                    { label: "Blacklist", status: "Clean", color: "bg-green-500" },
                    { label: "DNS Records", status: "Healthy", color: "bg-green-500" },
                    { label: "Bounce Rate", status: "1.2%", color: "bg-green-500" },
                    { label: "SPF / DKIM / DMARC", status: "Configured", color: "bg-green-500" },
                  ].map((check, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 ${check.color} rounded-full`}></div>
                        <span className="text-sm text-gray-700">{check.label}</span>
                      </div>
                      <span className="text-sm font-medium text-green-700">{check.status}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 mt-4 border-t grid grid-cols-3 border-gray-100 gap-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Protected</p>
                    <p className="text-base font-medium text-black">24</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">IPT Tests</p>
                    <p className="text-base font-medium text-black">156</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Health</p>
                    <p className="text-base font-medium text-green-700">98/100</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}