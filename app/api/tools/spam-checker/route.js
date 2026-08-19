import { NextResponse } from 'next/server';

const SpamAnalyzer = require('./spam-analyzer');
const { getSpamWords, getCategories, getCategoryWords } = require('./spam-database');

// Simple in-memory cache for spam results
class SpamCache {
  constructor() {
    this.cache = new Map();
    this.ttl = 5 * 60 * 1000; // 5 minutes TTL
    this.maxSize = 100;
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  set(key, data) {
    // Clean up if cache is too large
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, {
      data: data,
      expiry: Date.now() + this.ttl
    });
  }
}

// Initialize cache and spam analyzer
const spamCache = new SpamCache();
const spamAnalyzer = new SpamAnalyzer();

// Main spam checking endpoint
export async function POST(request) {
  try {
    const body = await request.json();
    const { subject, body: emailBody, html, checkType = 'comprehensive' } = body;
    
    // Validate input
    if (!subject && !emailBody && !html) {
      return NextResponse.json(
        { 
          error: true, 
          message: 'Please provide at least a subject, body, or HTML content to analyze' 
        },
        { status: 400 }
      );
    }
    
    // Generate cache key
    const cacheKey = `spam:${JSON.stringify({ subject, body: emailBody?.substring(0, 100), checkType })}`;
    
    // Check cache
    const cached = spamCache.get(cacheKey);
    if (cached) {
      return NextResponse.json({
        ...cached,
        cached: true
      });
    }
    
    // Prepare content object
    const content = {
      subject: subject || '',
      body: emailBody || '',
      html: html || ''
    };
    
    let result;
    
    // Perform analysis based on check type
    switch (checkType) {
      case 'quick':
        // Quick check - only major spam indicators
        result = spamAnalyzer.analyzeQuick(content);
        break;
        
      case 'subject_only':
        // Subject line only analysis
        result = spamAnalyzer.analyzeSubject(content.subject);
        result = {
          spamScore: result.score,
          riskLevel: spamAnalyzer.calculateRiskLevel(result.score),
          detectedIssues: result.issues,
          warnings: result.warnings,
          recommendations: spamAnalyzer.generateRecommendations({
            spamScore: result.score,
            detectedIssues: result.issues
          })
        };
        break;
        
      case 'comprehensive':
      default:
        // Full comprehensive analysis
        result = spamAnalyzer.analyzeComplete(content);
        break;
    }
    
    // Add timestamp
    result.timestamp = new Date().toISOString();
    result.checkType = checkType;
    
    // Add risk level color coding
    result.riskColor = getRiskColor(result.riskLevel);
    
    // Cache the result
    spamCache.set(cacheKey, result);
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Spam checker error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { 
        error: true, 
        message: 'Failed to analyze content',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// Get spam word database endpoint
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const action = searchParams.get('action');
    
    // Return specific category words
    if (category) {
      const categoryData = getCategoryWords(category);
      if (!categoryData) {
        return NextResponse.json(
          { error: true, message: 'Category not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        category: category,
        data: categoryData,
        wordCount: categoryData.words.length
      });
    }
    
    // Return category list
    if (action === 'categories') {
      const categories = getCategories();
      const categoryDetails = categories.map(cat => {
        const data = getCategoryWords(cat);
        return {
          id: cat,
          name: data.category,
          severity: data.severity,
          score: data.score,
          wordCount: data.words.length
        };
      });
      
      return NextResponse.json({
        categories: categoryDetails,
        totalCategories: categories.length
      });
    }
    
    // Return summary
    const allWords = getSpamWords();
    const summary = {
      totalCategories: Object.keys(allWords).length,
      totalWords: Object.values(allWords).reduce((sum, cat) => sum + cat.words.length, 0),
      categories: Object.keys(allWords).map(key => ({
        id: key,
        name: allWords[key].category,
        wordCount: allWords[key].words.length,
        severity: allWords[key].severity,
        score: allWords[key].score
      }))
    };
    
    return NextResponse.json(summary);
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: true, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to get risk level color
function getRiskColor(riskLevel) {
  const colors = {
    'MINIMAL': '#10b981',  // green-500
    'LOW': '#84cc16',      // lime-500
    'MEDIUM': '#f59e0b',   // amber-500
    'HIGH': '#ef4444',     // red-500
    'CRITICAL': '#991b1b'  // red-800
  };
  return colors[riskLevel] || '#6b7280'; // gray-500 as fallback
}