'use client'

import React from 'react';
import { trackClick } from '@/lib/datafast';

/**
 * TrackedButton Component
 * A wrapper component that automatically tracks button clicks
 */
export default function TrackedButton({ 
  children, 
  trackingName,
  trackingData = {},
  onClick,
  href,
  className,
  ...props 
}) {
  const handleClick = (e) => {
    // Track the click
    if (trackingName) {
      trackClick(trackingName, {
        ...trackingData,
        href: href || null,
        timestamp: new Date().toISOString()
      });
    }

    // Call original onClick if provided
    if (onClick) {
      onClick(e);
    }
  };

  // If href is provided, render as a link
  if (href) {
    return (
      <a 
        href={href}
        onClick={handleClick}
        className={className}
        {...props}
      >
        {children}
      </a>
    );
  }

  // Otherwise render as a button
  return (
    <button
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * TrackedLink Component
 * A wrapper component specifically for tracked links
 */
export function TrackedLink({ 
  children, 
  trackingName,
  trackingData = {},
  href,
  className,
  onClick,
  ...props 
}) {
  const handleClick = (e) => {
    // Track the click
    if (trackingName) {
      trackClick(trackingName, {
        ...trackingData,
        href: href,
        link_text: typeof children === 'string' ? children : trackingData.link_text,
        timestamp: new Date().toISOString()
      });
    }

    // Call original onClick if provided
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <a 
      href={href}
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </a>
  );
}