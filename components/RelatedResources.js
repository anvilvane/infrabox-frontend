import Link from 'next/link';
import { ArrowRight, Mail, Shield, TrendingUp, Users } from 'lucide-react';

export default function RelatedResources({ currentPage }) {
  const resources = [
    {
      title: 'Email Warmup Integration',
      description: 'Build sender reputation with our 14-day warmup process',
      href: '/email-warmup',
      icon: TrendingUp,
      keywords: ['warmup', 'sender reputation', 'gradual sending']
    },
    {
      title: 'Email Deliverability Solutions',
      description: 'Achieve 95% inbox placement with enterprise infrastructure',
      href: '/email-deliverability',
      icon: Mail,
      keywords: ['deliverability', 'inbox placement', 'spam prevention']
    },
    {
      title: 'Agency Email Solution',
      description: 'Manage hundreds of client accounts from one dashboard',
      href: '/agency-email-solution',
      icon: Users,
      keywords: ['agency', 'multi-client', 'bulk management']
    },
    {
      title: 'Google Workspace Accounts',
      description: 'US IP addresses at just $2.50 per mailbox',
      href: '/google-workspace-accounts',
      icon: Shield,
      keywords: ['Google Workspace', 'US IP', 'email accounts']
    }
  ];

  // Filter out current page and select 3 related resources
  const relatedResources = resources
    .filter(resource => resource.href !== currentPage)
    .slice(0, 3);

  if (relatedResources.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedResources.map((resource) => {
            const Icon = resource.icon;
            return (
              <Link
                key={resource.href}
                href={resource.href}
                className="group bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#1240cc]/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#1240cc]/20 transition-colors">
                    <Icon className="w-6 h-6 text-[#1240cc]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#1240cc] transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {resource.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-[#1240cc] group-hover:gap-2 transition-all">
                      Learn about {resource.title}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        
        {/* Additional Links Section */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
          <div className="flex flex-wrap gap-4">
            <Link href="/resources/tools" className="text-[#1240cc] hover:underline">
              Tools
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/resources/guides" className="text-[#1240cc] hover:underline">
              Setup Guides
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/affiliates" className="text-[#1240cc] hover:underline">
              Affiliate Program
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/partners" className="text-[#1240cc] hover:underline">
              Integration Partners
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/#book-call" className="text-[#1240cc] hover:underline">
              Book a Demo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}