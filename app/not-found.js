'use client'
import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

export default function Minimal404() {

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        {/* Main 404 */}
        <div className="mb-8">
          <span className="text-8xl font-light text-gray-200 select-none">4</span>
          <span className="text-8xl font-light text-[#1240cc] mx-2">0</span>
          <span className="text-8xl font-light text-gray-200 select-none">4</span>
        </div>
        
        {/* Sarcastic Message */}
        <div className="mb-12 space-y-3">
          <h1 className="text-2xl font-light text-black">
            Page not found
          </h1>
          
        </div>
        
        {/* Simple Action */}
        <a href="/">
        <button className="inline-flex items-center gap-2 px-8 py-3 bg-[#1240cc] text-white rounded-full hover:bg-[#0b34b4] transition-colors duration-300 group">
          <span>Take me back</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
        </a>
        
       
      </div>
    </div>
  );
}