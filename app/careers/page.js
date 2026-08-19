'use client'

import React, { useState, useRef } from 'react';
import { ArrowRight, ChevronDown, Rocket, Globe, TrendingUp, Users, Building2, MapPin, Clock, Mail, ExternalLink } from 'lucide-react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trackClick } from '@/lib/datafast';
import { careersData, departments } from '@/data/careers';

export default function Careers() {
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [expandedPositions, setExpandedPositions] = useState(new Set());
  const positionsRef = useRef(null);

  const filteredPositions = selectedDepartment === 'All'
    ? careersData
    : careersData.filter(p => p.department === selectedDepartment);

  const togglePosition = (id) => {
    setExpandedPositions(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const cultureCards = [
    {
      icon: Rocket,
      title: 'Real Impact',
      description: 'Your work directly moves the needle on a high-growth business. No side projects, no busywork.',
    },
    {
      icon: Globe,
      title: 'Gurgaon In-Office',
      description: 'Based out of our Gurgaon office. Work directly with the team, in-person collaboration, global client exposure.',
    },
    {
      icon: TrendingUp,
      title: 'Learn by Doing',
      description: "Work directly with the founding team. Mentorship isn't scheduled, it's built into the work.",
    },
    {
      icon: Users,
      title: 'Growth Path',
      description: 'Every internship has a clear 3–6 month path to a full-time role. We promote from within.',
    },
  ];

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed px-4 sm:px-6 lg:px-8">
          <div className="text-center pt-24 pb-16 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-black leading-[0.95] mb-4">
              Build the Infrastructure Behind{' '}
              <span className="text-[#1240cc]">Millions of Emails</span>
            </h1>
            <p className="text-base text-black/70 leading-relaxed max-w-xl mx-auto mb-6">
              We're lean, fast, and scaling. If you're aspirational, looking for high growth, and want to be part of one of the best AI accelerators and a widespread SaaS studio across the world, join us.
            </p>
            <button
              onClick={() => {
                positionsRef.current?.scrollIntoView({ behavior: 'smooth' });
                trackClick('careers_hero_cta', { action: 'view_positions' });
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1240cc] hover:bg-[#0b34b4] text-white rounded-full transition-all text-sm font-medium"
            >
              View Open Positions
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Why Infrabox */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl w-full border-x border-t border-gray-200 border-dashed px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-black text-center mb-10 tracking-tight">Why Infrabox?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cultureCards.map((card) => {
              const IconComp = card.icon;
              return (
                <div key={card.title} className="bg-gray-50 rounded-xl p-6">
                  <div className="w-10 h-10 bg-[#1240cc]/10 rounded-lg flex items-center justify-center mb-4">
                    <IconComp className="w-5 h-5 text-[#1240cc]" />
                  </div>
                  <h3 className="text-base font-semibold text-black mb-2">{card.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{card.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="bg-white" ref={positionsRef} id="positions">
        <div className="mx-auto max-w-6xl w-full border-x border-t border-gray-200 border-dashed px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-black text-center mb-8 tracking-tight">Open Positions</h2>

          {/* Department Filter */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-gray-100 rounded-lg p-1 flex-wrap gap-1">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => {
                    setSelectedDepartment(dept);
                    trackClick('careers_filter', { department: dept });
                  }}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    selectedDepartment === dept
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  type="button"
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Position Cards */}
          <div className="space-y-3">
            {filteredPositions.map((position) => {
              const isExpanded = expandedPositions.has(position.id);
              return (
                <div key={position.id} className="bg-gray-50 rounded-xl overflow-hidden">
                  {/* Collapsed Header */}
                  <button
                    onClick={() => togglePosition(position.id)}
                    className="w-full text-left p-6 flex items-start justify-between gap-4"
                    type="button"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-black mb-2">{position.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-white px-2.5 py-1 rounded-full">
                          <Building2 className="w-3 h-3" />
                          {position.department}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-white px-2.5 py-1 rounded-full">
                          <MapPin className="w-3 h-3" />
                          {position.location}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-white px-2.5 py-1 rounded-full">
                          <Clock className="w-3 h-3" />
                          {position.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{position.description}</p>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 flex-shrink-0 mt-1 transition-transform duration-300 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Expanded Content */}
                  <div
                    style={{
                      maxHeight: isExpanded ? '2000px' : '0px',
                      opacity: isExpanded ? 1 : 0,
                      transition: 'max-height 0.4s ease, opacity 0.3s ease',
                    }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 border-t border-gray-200 pt-4 space-y-6">
                      {/* Meta info */}
                      {(position.shift || position.stipend || position.reportsTo) && (
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                          {position.shift && <span><span className="font-medium text-black">Shift:</span> {position.shift}</span>}
                          {position.stipend && <span><span className="font-medium text-black">Stipend:</span> {position.stipend}</span>}
                          {position.reportsTo && <span><span className="font-medium text-black">Reports to:</span> {position.reportsTo}</span>}
                        </div>
                      )}

                      {/* Responsibility Tracks (Founders Office) */}
                      {position.responsibilityTracks && (
                        <div>
                          <h4 className="text-sm font-semibold text-black mb-3">Responsibilities</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(position.responsibilityTracks).map(([trackName, items]) => (
                              <div key={trackName} className="bg-white rounded-lg p-4">
                                <h5 className="text-sm font-medium text-[#1240cc] mb-2">{trackName}</h5>
                                <ul className="space-y-1.5">
                                  {items.map((item, i) => (
                                    <li key={i} className="text-sm text-gray-600 flex gap-2">
                                      <span className="text-[#1240cc] mt-1 flex-shrink-0">•</span>
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Regular Responsibilities */}
                      {position.responsibilities && position.responsibilities.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-black mb-3">Responsibilities</h4>
                          <ul className="space-y-1.5">
                            {position.responsibilities.map((item, i) => (
                              <li key={i} className="text-sm text-gray-600 flex gap-2">
                                <span className="text-[#1240cc] mt-0.5 flex-shrink-0">•</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Requirements */}
                      {position.requirements && position.requirements.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-black mb-3">Requirements</h4>
                          <ul className="space-y-1.5">
                            {position.requirements.map((item, i) => (
                              <li key={i} className="text-sm text-gray-600 flex gap-2">
                                <span className="text-[#1240cc] mt-0.5 flex-shrink-0">•</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Nice to Have */}
                      {position.niceToHave && position.niceToHave.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-black mb-3">Nice to Have</h4>
                          <ul className="space-y-1.5">
                            {position.niceToHave.map((item, i) => (
                              <li key={i} className="text-sm text-gray-600 flex gap-2">
                                <span className="text-[#1240cc] mt-0.5 flex-shrink-0">•</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Perks */}
                      {position.perks && position.perks.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-black mb-3">What You Get</h4>
                          <div className="flex flex-wrap gap-2">
                            {position.perks.map((perk, i) => (
                              <span key={i} className="text-xs bg-[#1240cc]/5 text-[#1240cc] px-3 py-1.5 rounded-full">
                                {perk}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Selection Process */}
                      {position.selectionProcess && position.selectionProcess.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-black mb-3">Selection Process</h4>
                          <ol className="space-y-1.5">
                            {position.selectionProcess.map((step, i) => (
                              <li key={i} className="text-sm text-gray-600 flex gap-2">
                                <span className="text-[#1240cc] font-medium flex-shrink-0">{i + 1}.</span>
                                {step}
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}

                      {/* Apply Button */}
                      <div className="pt-2">
                        <a
                          href={position.applyMethod === 'email' ? position.applyLink : position.applyLink}
                          target={position.applyMethod === 'form' && position.applyLink !== '#' ? '_blank' : undefined}
                          rel={position.applyMethod === 'form' && position.applyLink !== '#' ? 'noopener noreferrer' : undefined}
                          onClick={() => trackClick('careers_apply', { position: position.id, method: position.applyMethod })}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1240cc] hover:bg-[#0b34b4] text-white rounded-full transition-all text-sm font-medium"
                        >
                          {position.applyMethod === 'email' ? (
                            <>
                              <Mail className="w-4 h-4" />
                              Apply via Email
                            </>
                          ) : (
                            <>
                              <ExternalLink className="w-4 h-4" />
                              Apply Now
                            </>
                          )}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredPositions.length === 0 && (
              <div className="text-center py-12 text-gray-500 text-sm">
                No open positions in this department right now.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl w-full border-x border-t border-gray-200 border-dashed px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-[#1240cc] rounded-xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
              Don't see your role?
            </h2>
            <p className="text-white/70 text-sm md:text-base mb-6 max-w-lg mx-auto">
              We're always looking for exceptional people. Send us your resume and tell us how you'd contribute.
            </p>
            <a
              href="mailto:hr@infrabox.software"
              onClick={() => trackClick('careers_general_apply', { action: 'mailto' })}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#1240cc] rounded-full transition-all text-sm font-medium hover:bg-gray-100"
            >
              <Mail className="w-4 h-4" />
              hr@infrabox.software
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
