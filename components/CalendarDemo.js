'use client';

import React, { useState, useEffect } from 'react';

const CalendarDemo = () => {
  const [currentStage, setCurrentStage] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [animatedEvents, setAnimatedEvents] = useState(new Set());

  // Calendar data for different stages
  const calendarStages = [
    {
      title: "Before Infrabox",
      description: "Struggling to book meetings",
      meetings: [
        { date: 15, type: "Infrabox Demo", color: "bg-emerald-100" }
      ]
    },
    {
      title: "Week 1 with Infrabox",
      description: "First meetings start coming in",
      meetings: [
        { date: 1, type: "Stripe CEO", color: "bg-purple-100" },
        { date: 2, type: "Notion/Followup", color: "bg-orange-100" },
        { date: 2, type: "Demo Call", color: "bg-emerald-100", secondary: true },
        { date: 5, type: "Intro/OpenAI", color: "bg-purple-100" },
        { date: 5, type: "Demo Call", color: "bg-orange-100", secondary: true },
        { date: 8, type: "Demo Call", color: "bg-teal-100" },
        { date: 15, type: "Infrabox Demo", color: "bg-emerald-200" }
      ]
    },
    {
      title: "Week 2-3 with Infrabox",
      description: "Calendar filling up consistently",
      meetings: [
        { date: 1, type: "Stripe CEO", color: "bg-purple-100" },
        { date: 1, type: "Discovery Call", color: "bg-orange-100", secondary: true },
        { date: 2, type: "Notion/Followup", color: "bg-orange-100" },
        { date: 2, type: "Demo Call", color: "bg-emerald-100", secondary: true },
        { date: 3, type: "Demo Call", color: "bg-purple-100" },
        { date: 4, type: "Airbnb/Followup", color: "bg-teal-100" },
        { date: 5, type: "Intro/OpenAI", color: "bg-purple-100" },
        { date: 5, type: "Demo Call", color: "bg-orange-100", secondary: true },
        { date: 6, type: "Uber/Followup", color: "bg-teal-100" },
        { date: 6, type: "Demo Call", color: "bg-emerald-100", secondary: true },
        { date: 8, type: "Demo Call", color: "bg-orange-100" },
        { date: 10, type: "Slack/Followup", color: "bg-purple-200" },
        { date: 11, type: "Discord/Followup", color: "bg-teal-100" },
        { date: 15, type: "Infrabox Demo", color: "bg-emerald-200" },
        { date: 17, type: "Close/Figma", color: "bg-green-200" },
        { date: 19, type: "Linear/Followup", color: "bg-orange-100" },
        { date: 20, type: "Vercel/Intro", color: "bg-purple-100" },
        { date: 25, type: "GitHub Demo", color: "bg-teal-100" }
      ]
    },
    {
      title: "Month 1+ with Infrabox",
      description: "Fully booked calendar",
      meetings: [
        { date: 29, type: "Netflix/Follow", color: "bg-purple-100" },
        { date: 30, type: "Demo Call", color: "bg-orange-100", secondary: true },
        { date: 1, type: "Stripe CEO", color: "bg-purple-100" },
        { date: 1, type: "Discovery Call", color: "bg-orange-100", secondary: true },
        { date: 2, type: "Notion/Followup", color: "bg-orange-100" },
        { date: 2, type: "Demo Call", color: "bg-emerald-100", secondary: true },
        { date: 3, type: "Demo Call", color: "bg-purple-100" },
        { date: 4, type: "Airbnb/Followup", color: "bg-teal-100" },
        { date: 4, type: "Demo Call", color: "bg-orange-100", secondary: true },
        { date: 5, type: "Intro/OpenAI", color: "bg-purple-100" },
        { date: 5, type: "Demo Call", color: "bg-emerald-100", secondary: true },
        { date: 6, type: "Uber/Followup", color: "bg-teal-100" },
        { date: 6, type: "Demo Call", color: "bg-orange-100", secondary: true },
        { date: 7, type: "Discovery Call", color: "bg-purple-100" },
        { date: 7, type: "Quick Demo", color: "bg-emerald-100", secondary: true },
        { date: 8, type: "Demo Call", color: "bg-orange-100" },
        { date: 10, type: "Slack/Followup", color: "bg-purple-200" },
        { date: 10, type: "Demo Call", color: "bg-emerald-100", secondary: true },
        { date: 11, type: "Discord/Followup", color: "bg-teal-100" },
        { date: 11, type: "Demo Call", color: "bg-orange-100", secondary: true },
        { date: 13, type: "Spotify/Follow", color: "bg-purple-200" },
        { date: 13, type: "Twilio/Intro", color: "bg-orange-100", secondary: true },
        { date: 14, type: "GitHub Demo", color: "bg-teal-100" },
        { date: 14, type: "Discovery Call", color: "bg-purple-100", secondary: true },
        { date: 15, type: "Infrabox Demo", color: "bg-emerald-200" },
        { date: 16, type: "Linear/Followup", color: "bg-orange-100" },
        { date: 16, type: "Demo Call", color: "bg-emerald-100", secondary: true },
        { date: 17, type: "Close/Figma", color: "bg-green-200" },
        { date: 17, type: "Demo Call", color: "bg-purple-100", secondary: true },
        { date: 18, type: "MongoDB Demo", color: "bg-orange-200" },
        { date: 19, type: "Linear/Followup", color: "bg-orange-100" },
        { date: 19, type: "Demo Call", color: "bg-emerald-100", secondary: true },
        { date: 20, type: "Vercel/Intro", color: "bg-purple-100" },
        { date: 22, type: "Demo Call", color: "bg-orange-100" },
        { date: 22, type: "Supabase Demo", color: "bg-emerald-100", secondary: true },
        { date: 23, type: "Shopify/Follow", color: "bg-teal-100" },
        { date: 23, type: "Demo Call", color: "bg-purple-100", secondary: true },
        { date: 24, type: "Coinbase/Follow", color: "bg-purple-200" },
        { date: 24, type: "Demo Call", color: "bg-orange-100", secondary: true },
        { date: 25, type: "GitHub Demo", color: "bg-teal-100" },
        { date: 26, type: "Zapier/Follow", color: "bg-orange-100" },
        { date: 26, type: "Demo Call", color: "bg-emerald-100", secondary: true },
        { date: 27, type: "Webflow/Follow", color: "bg-purple-200" },
        { date: 27, type: "Demo Call", color: "bg-orange-100", secondary: true },
        { date: 28, type: "Demo", color: "bg-emerald-100" },
        { date: 29, type: "Growth Team", color: "bg-teal-100" },
        { date: 29, type: "Retool/Demo", color: "bg-purple-100", secondary: true },
        { date: 30, type: "Airtable/Follow", color: "bg-orange-100" },
        { date: 30, type: "Demo Call", color: "bg-emerald-100", secondary: true },
        { date: 31, type: "Monthly Review", color: "bg-green-200" },
        { date: 1, type: "Dropbox/Follow", color: "bg-purple-100" },
        { date: 1, type: "Demo Call", color: "bg-orange-100", secondary: true }
      ]
    }
  ];

  // Track stage changes and identify new events to animate
  useEffect(() => {
    if (currentStage === 0) {
      setAnimatedEvents(new Set());
      return;
    }

    const currentMeetings = calendarStages[currentStage].meetings;
    const previousMeetings = calendarStages[currentStage - 1].meetings;

    const newEventKeys = new Set();
    currentMeetings.forEach((meeting, index) => {
      const eventKey = `${meeting.date}-${meeting.type}`;
      const existsInPrevious = previousMeetings.some(prev =>
        prev.date === meeting.date && prev.type === meeting.type
      );

      if (!existsInPrevious) {
        newEventKeys.add(eventKey);
      }
    });

    setAnimatedEvents(newEventKeys);

    // Clear animation flags after animation completes
    const timer = setTimeout(() => {
      setAnimatedEvents(new Set());
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentStage]);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentStage((prev) => (prev + 1) % 4);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Calendar grid component
  const Calendar = ({ meetings }) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    const currentMonth = now.toLocaleString('default', { month: 'long' });
    const currentYear = now.getFullYear();
    const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
    const startDay = 1; // July 1st starts on Tuesday (index 2)
    const emptyDays = Array.from({ length: startDay }, (_, i) => null);

    // Create a unique key for each meeting based on stage and content
    const getMeetingKey = (meeting, index, stage) => `${stage}-${meeting.date}-${meeting.type}-${index}`;

    // Check if a meeting should be animated
    const shouldAnimateMeeting = (meeting) => {
      const eventKey = `${meeting.date}-${meeting.type}`;
      return animatedEvents.has(eventKey);
    };

    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <p className="text-lg font-semibold text-gray-900">{currentMonth} {currentYear}</p>
          <div className="flex gap-1">
            <button className="p-1 hover:bg-gray-100 rounded" tabIndex={-1} aria-hidden="true">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="p-1 hover:bg-gray-100 rounded" tabIndex={-1} aria-hidden="true">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map(day => (
            <div key={day} className="p-2 text-center text-xs font-medium text-gray-500 border-b">
              {day}
            </div>
          ))}

          {/* Previous month days */}
          {emptyDays.map((_, i) => (
            <div key={`empty-${i}`} className="p-1 h-20 text-xs text-gray-500 border border-transparent">
              <div className="font-medium mb-1 text-center">{29 + i}</div>
            </div>
          ))}

          {/* Current month days */}
          {daysInMonth.map(day => {
            const dayMeetings = meetings.filter(meeting => meeting.date === day);

            return (
              <div key={day} className="p-1 h-20 text-xs border border-transparent relative">
                <div className="font-medium mb-1 text-center">{day}</div>
                <div className="space-y-0.5 overflow-hidden">
                  {dayMeetings.slice(0, 2).map((meeting, i) => {
                    const shouldAnimate = shouldAnimateMeeting(meeting);
                    return (
                      <div
                        key={getMeetingKey(meeting, i, currentStage)}
                        className={`${meeting.color} text-gray-800 px-1 py-0.5 rounded text-[9px] font-medium truncate leading-tight ${shouldAnimate ? 'opacity-0 translate-y-2 animate-slide-up' : 'opacity-100 translate-y-0'}`}
                        style={{
                          fontSize: '8px',
                          lineHeight: '10px',
                          ...(shouldAnimate && {
                            animationDelay: `${i * 100}ms`,
                            animationFillMode: 'forwards'
                          })
                        }}
                      >
                        {meeting.type}
                      </div>
                    );
                  })}
                  {dayMeetings.length > 2 && (
                    <div className="text-gray-500 text-[8px] font-medium">
                      +{dayMeetings.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <section className="py-16 bg-gray-50 relative">
      {/* Dashed border container */}
      <div className="absolute inset-0 mx-auto max-w-6xl w-full border-x border-gray-200 border-dashed pointer-events-none"></div>
      {/* Content container */}
      <div className="relative mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          {/* Left side - Content and slider */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-wider text-[#1240cc] mb-4">
                THE INFRABOX ADVANTAGE
              </p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-black mb-6">
                From empty calendars to fully booked in weeks
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Infrabox's 97% inbox delivery rate means your prospects actually see your messages – and respond with meeting requests.
              </p>
            </div>

            {/* Stage indicator */}
            <div className="mb-6">
              <span className="text-sm font-medium text-gray-700">
                {calendarStages[currentStage].title}
              </span>
            </div>

            {/* Timeline */}
            <div className="relative mb-8">
              {/* Timeline track */}
              <div className="relative h-2 rounded-full" style={{ backgroundColor: '#f4fef3' }}>
                {/* Progress track */}
                <div
                  className="absolute h-2 bg-emerald-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${((currentStage + 1) / 4) * 100}%` }}
                />

                {/* Infrabox icon moving along the timeline */}
                <div
                  className="absolute -top-2 w-6 h-6 bg-white rounded-full flex items-center justify-center transition-all duration-1000 ease-out transform -translate-x-1/2 border-2 border-emerald-500"
                  style={{ left: `${((currentStage + 1) / 4) * 100}%` }}
                >
                  {/* Infrabox icon */}
                  <img
                    src="/icon.png"
                    alt="Infrabox"
                    className="w-3 h-3 transition-transform duration-1000 ease-out"
                    style={{ transform: `rotate(${currentStage * 360}deg)` }}
                  />
                </div>
              </div>
            </div>

            {/* Compact Stats */}
            <div className="text-left mb-8">
              <div className="text-lg font-semibold text-gray-900 mb-1">
                {calendarStages[currentStage].meetings.length} meetings booked
              </div>
              <div className="text-sm text-gray-500 mb-6">
                {calendarStages[currentStage].description}
              </div>
            </div>

            {/* CTA Button */}
            <div>
              <a
                href="https://app.infrabox.software/signup?utm_source=calendar_demo_cta&utm_medium=button&utm_campaign=landing"
                className="relative inline-flex transition text-center rounded-full items-center duration-300 justify-center focus:ring-2 focus:outline-none focus:ring-offset-2 text-white bg-[#1240cc] hover:bg-[#0b34b4] focus:ring-[#1240cc] h-10 sm:h-11 px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base shadow-lg shadow-[#1240cc]/25 gap-2"
              >
                Get Started Now
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right side - Calendar */}
          <div className="lg:col-span-3 lg:pl-8">
            <Calendar meetings={calendarStages[currentStage].meetings} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalendarDemo;