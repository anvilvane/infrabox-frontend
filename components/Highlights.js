import React from 'react';
import { 
  Server,
  BarChart3,
  Shield,
  Zap,
  Users,
  Flame,
  Puzzle,
  Headphones,
  Settings
} from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: Server,
      title: "95% Inbox Rate",
      description: "Official Google, Microsoft & Azure accounts",
      points: ["Official Google accounts", "Domain authentication", "Reputation monitoring", "Automated warming"]
    },
     {
      icon: Settings,
      title: "Full API Access",
      description: "Build custom workflows with webhooks",
      points: ["REST APIs", "Webhooks", "Real-time events", "Full documentation"]
    },
     {
      icon: Puzzle,
      title: "24+ Integrations",
      description: "Works with every email tool",
      points: ["One-click setup", "Bulk sync", "Real-time updates", "Custom connectors"]
    },
     {
      icon: Zap,
      title: "Setup in 20 Minutes",
      description: "Get started in no time",
      points: ["Quick onboarding", "Ready to send", "No technical setup", "Instant activation"]
    },
    {
      icon: BarChart3,
      title: "Email Insights",
      description: "Track reply, bounce rate instantly",
      points: ["Inbox placement", "Bounce analysis", "Reputation monitoring", "Custom reports"]
    },
    {
      icon: Shield,
      title: "Full Admin Control",
      description: "Your domain, your rules",
      points: ["Full admin access", "2FA authentication", "App password setup", "Domain isolation"]
    },
   
    {
      icon: Users,
      title: "Unlimited Team",
      description: "Add as many users as you need",
      points: ["Unlimited users", "Role permissions", "Activity logs", "Workspace isolation"]
    },
    {
      icon: Flame,
      title: "Built-in Warmup",
      description: "Warm up every mailbox automatically",
      points: ["Smart volume ramping", "Inbox rate tracking", "Multi-platform support", "Per-mailbox config"]
    },
   
   
  ];

  return (
    <section id="features">
      <div className="mx-auto 2xl:max-w-6xl 2xl:px-12 w-full max-w-6xl border-x border-gray-200 border-dashed px-4 pb-12 ">
        <div className="text-balance mb-8">
          <h2 className="text-lg sm:text-xl md:text-4xl font-medium py-8 tracking-tight text-black">
           Email Infrastructure That Actually Delivers
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors">
                <IconComponent className="size-5 text-[#1240cc] mb-3" />
                <p className="text-sm font-medium text-black mb-1">{feature.title}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}