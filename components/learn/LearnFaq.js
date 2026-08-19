'use client';

import { useState } from 'react';

function FaqItem({ question, answer, isOpen, onToggle }) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <span className="text-[16px] font-semibold text-gray-900 pr-4 group-hover:text-[#1240cc] transition-colors">
          {question}
        </span>
        {/* + icon that rotates 45deg to become x */}
        <span
          className={`flex-shrink-0 w-5 h-5 flex items-center justify-center transition-transform duration-300 ease-out ${
            isOpen ? 'rotate-45' : 'rotate-0'
          }`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="text-gray-400"
          >
            <path
              d="M8 3v10M3 8h10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </button>

      {/* grid-rows animation for smooth expand/collapse */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-sm text-stone-600 leading-relaxed pb-4">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LearnFaq({ items = [] }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="my-6 divide-y divide-gray-200 border-y border-gray-200">
      {items.map((item, i) => (
        <FaqItem
          key={i}
          question={item.question}
          answer={item.answer}
          isOpen={openIndex === i}
          onToggle={() => setOpenIndex(openIndex === i ? null : i)}
        />
      ))}
    </div>
  );
}
