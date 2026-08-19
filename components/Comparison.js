import React, { useState } from 'react';
import { Check, X, Minus } from 'lucide-react';

export default function ComparisonTable() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Features' },
    { id: 'infrastructure', name: 'Infrastructure' },
    { id: 'deliverability', name: 'Deliverability' },
    { id: 'management', name: 'Management' },
  ];

  const features = [
    {
      category: 'infrastructure',
      name: 'Google Cloud Partner',
      description: 'Official partnership with enhanced infrastructure',
      infrabox: true,
      zapmail: false,
      hypertide: false,
      highlight: true
    },
    {
      category: 'management',
      name: 'API Access',
      description: 'Full API with webhooks',
      infrabox: true,
      zapmail: false,
      hypertide: false
    },
    {
      category: 'management',
      name: 'Platform Integrations',
      description: 'Number of email platform imports supported',
      infrabox: '17',
      zapmail: '5',
      hypertide: '3'
    },
    {
      category: 'management',
      name: 'Add-on Mailbox',
      description: 'Cost per additional mailbox',
      infrabox: '$2.50',
      zapmail: '$3.00-$3.50',
      hypertide: '-'
    },
    {
      category: 'deliverability',
      name: 'Deliverability Rate',
      description: 'Average inbox placement rate',
      infrabox: '95%',
      zapmail: 'No Guarantee',
      hypertide: 'No Guarantee'
    },
    {
      category: 'infrastructure',
      name: 'Auto DNS Configuration',
      description: 'DKIM, DMARC, SPF setup without technical knowledge',
      infrabox: true,
      zapmail: true,
      hypertide: true,
    },
    {
      category: 'infrastructure',
      name: 'Bulk Mailbox Setup',
      description: 'AI-powered bulk mailbox creation and configuration',
      infrabox: true,
      zapmail: true,
      hypertide: true,
    },
    {
      category: 'infrastructure',
      name: 'Setup Time',
      description: 'Time from signup to sending first email',
      infrabox: '10 minutes',
      zapmail: '10 minutes',
      hypertide: '4-6 hours'
    },
    {
      category: 'deliverability',
      name: 'Built-in Email Warmup',
      description: 'Automated sender reputation building',
      infrabox: true,
      zapmail: false,
      hypertide: false,
    },
    {
      category: 'deliverability',
      name: 'Domain Monitoring (InfraGuard)',
      description: 'Blacklist, DNS & bounce monitoring',
      infrabox: true,
      zapmail: false,
      hypertide: false,
    },
    {
      category: 'infrastructure',
      name: 'Azure Mailboxes',
      description: 'Microsoft Azure email infrastructure',
      infrabox: true,
      zapmail: false,
      hypertide: true,
    },
  ];

  const filteredFeatures = selectedCategory === 'all'
    ? features
    : features.filter(feature => feature.category === selectedCategory);

  const handleCategoryKeyDown = (e) => {
    const ids = categories.map(c => c.id);
    const idx = ids.indexOf(selectedCategory);
    let newIdx;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      newIdx = (idx + 1) % ids.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      newIdx = (idx - 1 + ids.length) % ids.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      newIdx = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      newIdx = ids.length - 1;
    } else {
      return;
    }
    setSelectedCategory(ids[newIdx]);
    document.getElementById(`category-tab-${ids[newIdx]}`)?.focus();
  };

  const getIcon = (value, isInfrabox = false) => {
    if (value === true) {
      return <Check className={`w-4 h-4 ${isInfrabox ? 'text-[#1240cc]' : 'text-green-600'}`} aria-hidden="true" />;
    }
    if (value === false) {
      return <X className="w-4 h-4 text-red-500" aria-hidden="true" />;
    }
    if (value === 'limited' || value === 'basic' || value === 'manual') {
      return <Minus className="w-4 h-4 text-amber-500" aria-hidden="true" />;
    }
    return null;
  };

  const getDisplayValue = (value, isInfrabox = false) => {
    if (typeof value === 'boolean') {
      return (
        <>
          {getIcon(value, isInfrabox)}
          <span className="sr-only">{value ? 'Yes' : 'No'}</span>
        </>
      );
    }
    if (value === 'limited') {
      return <span className="text-xs text-amber-600 font-medium">Limited</span>;
    }
    if (value === 'basic') {
      return <span className="text-xs text-amber-600 font-medium">Basic</span>;
    }
    if (value === 'manual') {
      return <span className="text-xs text-amber-600 font-medium">Manual</span>;
    }
    if (value === 'unlimited') {
      return <span className="text-xs text-[#1240cc] font-medium">Unlimited</span>;
    }
    return <span className={`text-xs font-medium ${isInfrabox ? 'text-[#1240cc]' : 'text-gray-700'}`}>{value}</span>;
  };

  return (
    <section className="border-gray-200 border-dashed">
      <div className="mx-auto 2xl:max-w-6xl 2xl:px-12 w-full max-w-6xl border-x border-gray-200 border-dashed px-4 pt-12 pb-12">
        
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight text-black">
            How Infrabox Compares
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            See why leading agencies choose Infrabox for their email infrastructure.
            <br className="hidden sm:block" />
            We&apos;re the only official Google Cloud partner in this space.
          </p>
        </div>

        {/* Category Filter */}
        <div className="hidden md:flex flex-wrap justify-center gap-2 mb-6" role="tablist" aria-label="Feature categories">
          {categories.map((category) => (
            <button
              key={category.id}
              id={`category-tab-${category.id}`}
              onClick={() => setSelectedCategory(category.id)}
              onKeyDown={handleCategoryKeyDown}
              tabIndex={selectedCategory === category.id ? 0 : -1}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                selectedCategory === category.id
                  ? 'bg-[#1240cc] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              role="tab"
              aria-selected={selectedCategory === category.id}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Mobile Cards */}
        <div className="block lg:hidden space-y-4">
          {filteredFeatures.filter(feature => feature.name !== 'Setup Time').map((feature, index) => (
            <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="mb-3">
                <p className="font-medium text-gray-900 text-sm">{feature.name}</p>
                <p className="text-xs text-gray-500 mt-1">{feature.description}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-[#DAFCD5]/30 rounded-md p-3 text-center">
                  <div className="text-xs font-medium text-[#1240cc] mb-2">Infrabox</div>
                  <div className="flex justify-center">
                    {getDisplayValue(feature.infrabox, true)}
                  </div>
                </div>

                <div className="rounded-md p-3 text-center">
                  <div className="text-xs font-medium text-gray-700 mb-2">ZapMail</div>
                  <div className="flex justify-center">
                    {getDisplayValue(feature.zapmail)}
                  </div>
                </div>

                <div className="rounded-md p-3 text-center">
                  <div className="text-xs font-medium text-gray-700 mb-2">HyperTide</div>
                  <div className="flex justify-center">
                    {getDisplayValue(feature.hypertide)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table — semantic <table> for AI/SERP extraction */}
        <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full border-collapse" aria-label="Infrabox vs ZapMail vs HyperTide comparison">
            <caption className="sr-only">
              Feature-by-feature comparison of Infrabox, ZapMail, and HyperTide email infrastructure platforms.
            </caption>
            <thead>
              <tr className="border-b border-gray-200">
                <th scope="col" className="px-6 py-4 text-left w-1/4">
                  <span className="text-sm font-medium text-gray-900">Features</span>
                </th>
                <th scope="col" className="px-6 py-4 text-center bg-[#DAFCD5]/30 w-1/4">
                  <span className="text-sm font-medium text-[#1240cc]">Infrabox</span>
                  <span className="flex items-center justify-center gap-1 mt-1">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span className="text-xs text-[#1240cc]/70">Official Google Partner</span>
                  </span>
                </th>
                <th scope="col" className="px-6 py-4 text-center w-1/4">
                  <span className="text-sm font-medium text-gray-900">ZapMail</span>
                </th>
                <th scope="col" className="px-6 py-4 text-center w-1/4">
                  <span className="text-sm font-medium text-gray-900">HyperTide</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredFeatures.map((feature, index) => (
                <tr key={index} className="border-b border-gray-100 last:border-b-0">
                  <th scope="row" className="px-6 py-4 text-left font-normal">
                    <p className="text-sm font-medium text-gray-900">{feature.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{feature.description}</p>
                  </th>
                  <td className="px-6 py-4 text-center bg-[#DAFCD5]/30">
                    <span className="inline-flex justify-center items-center">{getDisplayValue(feature.infrabox, true)}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex justify-center items-center">{getDisplayValue(feature.zapmail)}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex justify-center items-center">{getDisplayValue(feature.hypertide)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}