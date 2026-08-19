import React from 'react';
import {
  Bot,
  TrendingUp,
  Settings,
  Target,
  Users,
  DollarSign,
  Cloud,
  Send
} from 'lucide-react';

export default function ICPSection() {
  const icps = [
    {
      icon: Bot,
      title: "AI SDRs",
      description: "Full API access for seamless automation. Plug into your AI agents instantly."
    },
    {
      icon: TrendingUp,
      title: "Revenue Platforms",
      description: "95% inbox rates with InfraGuard protection. Scale without deliverability drops."
    },
    {
      icon: Settings,
      title: "RevOps Teams",
      description: "Automated DNS setup, auto-reconnect with 24+ sequencers. Zero manual work."
    },
    {
      icon: Target,
      title: "Lead Gen Agencies",
      description: "Fully automated infrastructure with dedicated reports. Scale to thousands of mailboxes."
    },
    {
      icon: Users,
      title: "Hiring Companies",
      description: "Inbox placement tests ensure your outreach lands. Reach candidates, not spam folders."
    },
    {
      icon: DollarSign,
      title: "Funding Companies",
      description: "Email insights and deliverability monitoring. Know exactly when investors engage."
    },
    {
      icon: Cloud,
      title: "SaaS Companies",
      description: "REST API and webhooks for custom integrations. Build email into your product."
    },
    {
      icon: Send,
      title: "B2B Outreach",
      description: "Unlimited workspaces, domain rotation, and 24/7 support. Outreach at any scale."
    }
  ];

  return (
    <section className="border-gray-200 border-dashed">
      <div className="mx-auto 2xl:max-w-6xl 2xl:px-12 w-full max-w-6xl border-x border-gray-200 border-dashed px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight text-black">
            Built for B2B outreach teams
          </h2>
          <p className="mt-2 text-sm text-gray-600 max-w-2xl mx-auto">
            From AI-powered sales tools to enterprise teams, Infrabox powers the email infrastructure behind modern outreach.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {icps.map((icp, index) => {
            const Icon = icp.icon;
            return (
              <div
                key={index}
                className="group p-5 rounded-xl bg-gray-50 hover:bg-white hover:shadow-md transition-all duration-300 border border-transparent hover:border-gray-200"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#1240cc]/10 rounded-lg group-hover:bg-[#1240cc] transition-colors duration-300">
                    <Icon className="w-5 h-5 text-[#1240cc] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-black mb-1">
                      {icp.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {icp.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
