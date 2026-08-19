'use client'

import { useEffect, useState } from 'react';
import { trackTool, trackClick, initializePageTracking } from '@/lib/datafast';

/**
 * ToolTracker Component
 * Wraps tool pages to track usage and engagement
 */
export default function ToolTracker({ 
  toolName, 
  children, 
  onFormSubmit,
  onResultGenerated,
  onError 
}) {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [formStartTime, setFormStartTime] = useState(null);

  useEffect(() => {
    // Track tool page visit
    initializePageTracking(`tool_${toolName}`);
    trackTool(toolName, 'page_visited', {
      tool_name: toolName,
      timestamp: new Date().toISOString()
    });
  }, [toolName]);

  // Track form start
  const handleFormStart = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      setFormStartTime(Date.now());
      trackTool(toolName, 'form_started', {
        tool_name: toolName
      });
    }
  };

  // Track form submission
  const handleFormSubmit = (formData = {}) => {
    const timeToSubmit = formStartTime ? Math.round((Date.now() - formStartTime) / 1000) : null;
    
    trackTool(toolName, 'submitted', {
      tool_name: toolName,
      time_to_submit: timeToSubmit,
      ...formData
    });

    if (onFormSubmit) {
      onFormSubmit(formData);
    }
  };

  // Track result generation
  const handleResultGenerated = (resultData = {}) => {
    trackTool(toolName, 'result_generated', {
      tool_name: toolName,
      success: true,
      ...resultData
    });

    if (onResultGenerated) {
      onResultGenerated(resultData);
    }
  };

  // Track errors
  const handleError = (errorData = {}) => {
    trackTool(toolName, 'error', {
      tool_name: toolName,
      error_type: errorData.type || 'unknown',
      error_message: errorData.message || 'Unknown error',
      ...errorData
    });

    if (onError) {
      onError(errorData);
    }
  };

  // Track result copy
  const handleResultCopy = (copyData = {}) => {
    trackTool(toolName, 'result_copied', {
      tool_name: toolName,
      ...copyData
    });
  };

  // Track related tool click
  const handleRelatedToolClick = (relatedToolName) => {
    trackClick('related_tool', {
      from_tool: toolName,
      to_tool: relatedToolName,
      location: 'tool_page'
    });
  };

  // Provide tracking methods to children
  const trackingProps = {
    onFormStart: handleFormStart,
    onFormSubmit: handleFormSubmit,
    onResultGenerated: handleResultGenerated,
    onError: handleError,
    onResultCopy: handleResultCopy,
    onRelatedToolClick: handleRelatedToolClick
  };

  // Clone children and pass tracking props
  if (typeof children === 'function') {
    return children(trackingProps);
  }

  return <>{children}</>;
}

/**
 * Hook for tool tracking
 */
export function useToolTracking(toolName) {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [formStartTime, setFormStartTime] = useState(null);

  useEffect(() => {
    trackTool(toolName, 'page_visited', {
      tool_name: toolName
    });
  }, [toolName]);

  const trackFormStart = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      setFormStartTime(Date.now());
      trackTool(toolName, 'form_started', {
        tool_name: toolName
      });
    }
  };

  const trackFormSubmit = (formData = {}) => {
    const timeToSubmit = formStartTime ? Math.round((Date.now() - formStartTime) / 1000) : null;
    
    trackTool(toolName, 'submitted', {
      tool_name: toolName,
      time_to_submit: timeToSubmit,
      ...formData
    });
  };

  const trackResult = (success, resultData = {}) => {
    trackTool(toolName, success ? 'result_generated' : 'validation_failed', {
      tool_name: toolName,
      success,
      ...resultData
    });
  };

  const trackCopy = (contentType) => {
    trackTool(toolName, 'result_copied', {
      tool_name: toolName,
      content_type: contentType
    });
  };

  const trackError = (errorType, errorMessage) => {
    trackTool(toolName, 'error', {
      tool_name: toolName,
      error_type: errorType,
      error_message: errorMessage
    });
  };

  return {
    trackFormStart,
    trackFormSubmit,
    trackResult,
    trackCopy,
    trackError
  };
}