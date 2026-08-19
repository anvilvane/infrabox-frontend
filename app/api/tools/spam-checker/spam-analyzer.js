const { spamWordDatabase, getSpamWords } = require('./spam-database');
const { checkPatterns, getPatternStats } = require('./spam-patterns');

class SpamAnalyzer {
  constructor() {
    this.spamWords = getSpamWords();
  }
  
  // Complete analysis of email content
  analyzeComplete(content) {
    const results = {
      spamScore: 0,
      riskLevel: "MINIMAL",
      detectedIssues: [],
      categoryScores: {},
      recommendations: [],
      detailedAnalysis: {},
      statistics: {},
      summary: {
        totalIssues: 0,
        criticalIssues: 0,
        highIssues: 0,
        mediumIssues: 0,
        lowIssues: 0
      }
    };
    
    // Analyze subject line
    if (content.subject) {
      const subjectAnalysis = this.analyzeSubject(content.subject);
      results.detailedAnalysis.subject = subjectAnalysis;
      results.spamScore += subjectAnalysis.score;
      results.detectedIssues.push(...subjectAnalysis.issues);
    }
    
    // Analyze body text
    if (content.body) {
      const bodyAnalysis = this.analyzeBody(content.body);
      results.detailedAnalysis.body = bodyAnalysis;
      results.spamScore += bodyAnalysis.score;
      results.detectedIssues.push(...bodyAnalysis.issues);
    }
    
    // Analyze HTML if present
    if (content.html) {
      const htmlAnalysis = this.analyzeHtml(content.html);
      results.detailedAnalysis.html = htmlAnalysis;
      results.spamScore += htmlAnalysis.score;
      results.detectedIssues.push(...htmlAnalysis.issues);
    }
    
    // Calculate category scores
    results.categoryScores = this.calculateCategoryScores(results.detectedIssues);
    
    // Calculate risk level
    results.riskLevel = this.calculateRiskLevel(results.spamScore);
    
    // Generate recommendations
    results.recommendations = this.generateRecommendations(results);
    
    // Add statistics
    results.statistics = this.calculateStatistics(content);
    
    // Update summary
    results.summary = this.calculateSummary(results.detectedIssues);
    
    return results;
  }
  
  // Analyze subject line
  analyzeSubject(subject) {
    const analysis = {
      score: 0,
      issues: [],
      warnings: []
    };
    
    if (!subject) return analysis;
    
    // Check length
    if (subject.length < 10) {
      analysis.warnings.push({
        type: "short_subject",
        message: "Subject line is too short (< 10 characters)",
        severity: "low",
        score: 2
      });
      analysis.score += 2;
    } else if (subject.length > 100) {
      analysis.warnings.push({
        type: "long_subject",
        message: "Subject line is too long (> 100 characters)",
        severity: "low",
        score: 1
      });
      analysis.score += 1;
    }
    
    // Check if subject is all caps
    if (subject === subject.toUpperCase() && subject.match(/[A-Z]/)) {
      analysis.issues.push({
        type: "all_caps_subject",
        message: "Subject line is in ALL CAPS",
        severity: "high",
        category: "formatting",
        score: 5
      });
      analysis.score += 5;
    }
    
    // Check for spam words in subject
    const subjectLower = subject.toLowerCase();
    for (const [category, data] of Object.entries(this.spamWords)) {
      if (!data || !data.words) continue;
      for (const word of data.words) {
        if (!word) continue;
        const wordLower = String(word).toLowerCase();
        if (subjectLower.includes(wordLower)) {
          analysis.issues.push({
            type: "spam_word",
            category: data.category,
            word: word,
            message: `Spam trigger word '${word}' found in subject`,
            severity: data.severity,
            score: data.score
          });
          analysis.score += data.score;
        }
      }
    }
    
    // Check patterns in subject
    const patternResults = checkPatterns(subject, false);
    if (patternResults.patterns.length > 0) {
      patternResults.patterns.forEach(pattern => {
        analysis.issues.push({
          type: "pattern_violation",
          pattern: pattern.type,
          message: pattern.description,
          severity: pattern.severity,
          occurrences: pattern.occurrences,
          score: pattern.score
        });
      });
      analysis.score += patternResults.totalScore;
    }
    
    return analysis;
  }
  
  // Analyze email body
  analyzeBody(body) {
    const analysis = {
      score: 0,
      issues: [],
      wordFrequency: {},
      spamWordDensity: 0,
      warnings: []
    };
    
    if (!body) return analysis;
    
    // Tokenize and analyze
    const words = body.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const uniqueWords = new Set(words);
    
    // Word frequency analysis
    const wordFreq = {};
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });
    
    // Get top 10 most frequent words
    analysis.wordFrequency = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .reduce((obj, [word, count]) => {
        obj[word] = count;
        return obj;
      }, {});
    
    // Check for spam words
    let spamWordCount = 0;
    const bodyLower = body.toLowerCase();
    const detectedSpamWords = new Map();
    
    for (const [category, data] of Object.entries(this.spamWords)) {
      if (!data || !data.words) continue;
      let categoryCount = 0;
      
      for (const word of data.words) {
        if (!word) continue;
        const wordStr = String(word);
        const regex = new RegExp(`\\b${wordStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
        const matches = bodyLower.match(regex);
        
        if (matches && matches.length > 0) {
          const count = matches.length;
          spamWordCount += count;
          categoryCount += count;
          
          // Track spam word for deduplication
          if (!detectedSpamWords.has(word)) {
            detectedSpamWords.set(word, {
              category: data.category,
              severity: data.severity,
              score: data.score,
              count: count
            });
          }
        }
      }
      
      if (categoryCount > 0) {
        analysis[`${category}_count`] = categoryCount;
      }
    }
    
    // Add spam word issues
    detectedSpamWords.forEach((data, word) => {
      const scoreMultiplier = Math.min(data.count, 3); // Cap at 3 occurrences
      analysis.issues.push({
        type: "spam_word",
        category: data.category,
        word: word,
        count: data.count,
        message: `Spam word '${word}' found ${data.count} time(s)`,
        severity: data.severity,
        score: data.score * scoreMultiplier
      });
      analysis.score += data.score * scoreMultiplier;
    });
    
    // Calculate spam word density
    if (words.length > 0) {
      analysis.spamWordDensity = (spamWordCount / words.length) * 100;
      
      if (analysis.spamWordDensity > 10) {
        analysis.issues.push({
          type: "high_spam_density",
          message: `High spam word density: ${analysis.spamWordDensity.toFixed(1)}%`,
          severity: "high",
          score: 5
        });
        analysis.score += 5;
      }
    }
    
    // Check patterns
    const patternResults = checkPatterns(body, false);
    if (patternResults.patterns.length > 0) {
      patternResults.patterns.forEach(pattern => {
        analysis.issues.push({
          type: "pattern_violation",
          pattern: pattern.type,
          message: pattern.description,
          severity: pattern.severity,
          occurrences: pattern.occurrences,
          examples: pattern.examples,
          score: pattern.score
        });
      });
      analysis.score += patternResults.totalScore;
    }
    
    // Check text statistics
    const stats = getPatternStats(body);
    
    if (stats.capitalLettersRatio > 30) {
      analysis.issues.push({
        type: "excessive_caps",
        message: `Excessive capital letters: ${stats.capitalLettersRatio.toFixed(1)}%`,
        severity: "medium",
        score: 3
      });
      analysis.score += 3;
    }
    
    if (stats.specialCharDensity > 10) {
      analysis.issues.push({
        type: "excessive_special_chars",
        message: `High special character density: ${stats.specialCharDensity.toFixed(1)}%`,
        severity: "medium",
        score: 2
      });
      analysis.score += 2;
    }
    
    // Add statistics to analysis
    analysis.statistics = stats;
    
    return analysis;
  }
  
  // Analyze HTML content
  analyzeHtml(html) {
    const analysis = {
      score: 0,
      issues: [],
      structureAnalysis: {}
    };
    
    if (!html) return analysis;
    
    // Check for hidden elements
    const hiddenElements = html.match(/display:\s*none|visibility:\s*hidden/gi) || [];
    if (hiddenElements.length > 0) {
      analysis.issues.push({
        type: "hidden_elements",
        message: `Found ${hiddenElements.length} hidden element(s)`,
        severity: "high",
        score: 5
      });
      analysis.score += 5;
    }
    
    // Check for tiny fonts
    const tinyFonts = html.match(/font-size:\s*[0-8]px/gi) || [];
    if (tinyFonts.length > 0) {
      analysis.issues.push({
        type: "tiny_fonts",
        message: `Found ${tinyFonts.length} element(s) with tiny fonts`,
        severity: "medium",
        score: 3
      });
      analysis.score += 3;
    }
    
    // Check for white text
    const whiteText = html.match(/color:\s*(?:#fff|#ffffff|white)/gi) || [];
    if (whiteText.length > 0) {
      analysis.issues.push({
        type: "white_text",
        message: `Found ${whiteText.length} element(s) with white text`,
        severity: "high",
        score: 4
      });
      analysis.score += 4;
    }
    
    // Check for forms
    const forms = html.match(/<form/gi) || [];
    if (forms.length > 0) {
      analysis.issues.push({
        type: "embedded_form",
        message: `Found ${forms.length} embedded form(s)`,
        severity: "medium",
        score: 3
      });
      analysis.score += 3;
    }
    
    // Check for JavaScript
    const scripts = html.match(/<script|javascript:/gi) || [];
    if (scripts.length > 0) {
      analysis.issues.push({
        type: "javascript_detected",
        message: "JavaScript code detected in HTML",
        severity: "high",
        score: 8
      });
      analysis.score += 8;
    }
    
    // Check patterns in HTML
    const patternResults = checkPatterns(html, true);
    if (patternResults.patterns.length > 0) {
      patternResults.patterns.forEach(pattern => {
        analysis.issues.push({
          type: "pattern_violation",
          pattern: pattern.type,
          message: pattern.description,
          severity: pattern.severity,
          occurrences: pattern.occurrences,
          score: pattern.score
        });
      });
      analysis.score += patternResults.totalScore;
    }
    
    // Structure analysis
    analysis.structureAnalysis = {
      hasHiddenElements: hiddenElements.length > 0,
      hasTinyFonts: tinyFonts.length > 0,
      hasWhiteText: whiteText.length > 0,
      hasForms: forms.length > 0,
      hasJavaScript: scripts.length > 0,
      totalLinks: (html.match(/<a\s/gi) || []).length,
      totalImages: (html.match(/<img\s/gi) || []).length
    };
    
    return analysis;
  }
  
  // Calculate risk level based on spam score
  calculateRiskLevel(score) {
    if (score >= 50) return "CRITICAL";
    if (score >= 30) return "HIGH";
    if (score >= 15) return "MEDIUM";
    if (score >= 5) return "LOW";
    return "MINIMAL";
  }
  
  // Calculate category scores
  calculateCategoryScores(issues) {
    const categoryScores = {};
    
    issues.forEach(issue => {
      if (issue.category) {
        if (!categoryScores[issue.category]) {
          categoryScores[issue.category] = {
            count: 0,
            score: 0,
            issues: []
          };
        }
        categoryScores[issue.category].count++;
        categoryScores[issue.category].score += issue.score || 0;
        categoryScores[issue.category].issues.push(issue);
      }
    });
    
    return categoryScores;
  }
  
  // Generate recommendations
  generateRecommendations(results) {
    const recommendations = [];
    
    // Critical score recommendations
    if (results.spamScore >= 50) {
      recommendations.push({
        priority: "critical",
        message: "⚠️ CRITICAL: Complete rewrite recommended - too many spam indicators",
        action: "Consider starting fresh with a more professional tone"
      });
    }
    
    // Check specific issues and generate targeted recommendations
    const issueTypes = new Set();
    results.detectedIssues.forEach(issue => {
      issueTypes.add(issue.type);
      
      // Specific recommendations based on issue type
      if (issue.type === "spam_word" && !recommendations.find(r => r.type === "spam_word")) {
        recommendations.push({
          priority: "high",
          type: "spam_word",
          message: `Remove or replace spam trigger words`,
          action: `Found ${issue.count || 1} instance(s) of '${issue.word}'`,
          suggestion: "Use more professional language"
        });
      }
      
      if (issue.type === "all_caps_subject" && !recommendations.find(r => r.type === "all_caps_subject")) {
        recommendations.push({
          priority: "high",
          type: "all_caps_subject",
          message: "Avoid using ALL CAPS in subject line",
          action: "Use proper capitalization for better deliverability"
        });
      }
      
      if (issue.type === "excessive_caps" && !recommendations.find(r => r.type === "excessive_caps")) {
        recommendations.push({
          priority: "medium",
          type: "excessive_caps",
          message: "Reduce the use of capital letters",
          action: "Use normal capitalization throughout your content"
        });
      }
      
      if (issue.type === "hidden_elements" && !recommendations.find(r => r.type === "hidden_elements")) {
        recommendations.push({
          priority: "high",
          type: "hidden_elements",
          message: "Remove hidden elements from HTML",
          action: "Hidden content is a major spam indicator"
        });
      }
      
      if (issue.type === "high_spam_density" && !recommendations.find(r => r.type === "high_spam_density")) {
        recommendations.push({
          priority: "high",
          type: "high_spam_density",
          message: "Reduce spam word density",
          action: "Too many promotional words - add more valuable content"
        });
      }
    });
    
    // General recommendations based on score ranges
    if (results.spamScore >= 15 && results.spamScore < 30) {
      recommendations.push({
        priority: "medium",
        message: "Consider rephrasing promotional language",
        action: "Replace aggressive sales terms with softer alternatives"
      });
      
      recommendations.push({
        priority: "medium",
        message: "Add more valuable content",
        action: "Balance promotional content with useful information"
      });
    }
    
    if (results.spamScore >= 5 && results.spamScore < 15) {
      recommendations.push({
        priority: "low",
        message: "Minor improvements recommended",
        action: "Review flagged words and consider alternatives"
      });
    }
    
    if (results.spamScore < 5) {
      recommendations.push({
        priority: "info",
        message: "✅ Your content looks good!",
        action: "Low spam risk - ready to send"
      });
    }
    
    // Sort by priority
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
    recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    
    return recommendations.slice(0, 10); // Return top 10 recommendations
  }
  
  // Calculate content statistics
  calculateStatistics(content) {
    const stats = {
      subjectLength: 0,
      subjectWordCount: 0,
      bodyLength: 0,
      wordCount: 0,
      sentenceCount: 0,
      linkCount: 0,
      avgWordLength: 0,
      uniqueWords: 0,
      readabilityScore: 0
    };
    
    if (content.subject) {
      stats.subjectLength = content.subject.length;
      stats.subjectWordCount = content.subject.split(/\s+/).filter(w => w.length > 0).length;
    }
    
    if (content.body) {
      const body = content.body;
      stats.bodyLength = body.length;
      
      // Word count
      const words = body.split(/\s+/).filter(w => w.length > 0);
      stats.wordCount = words.length;
      
      // Unique words
      stats.uniqueWords = new Set(words.map(w => w.toLowerCase())).size;
      
      // Sentence count
      const sentences = body.split(/[.!?]+/).filter(s => s.trim().length > 0);
      stats.sentenceCount = sentences.length;
      
      // Link count
      stats.linkCount = (body.match(/https?:\/\/[^\s]+/gi) || []).length;
      
      // Average word length
      if (words.length > 0) {
        const totalLength = words.reduce((sum, word) => sum + word.length, 0);
        stats.avgWordLength = Math.round((totalLength / words.length) * 10) / 10;
      }
      
      // Simple readability score (Flesch Reading Ease approximation)
      if (stats.sentenceCount > 0 && stats.wordCount > 0) {
        const avgSentenceLength = stats.wordCount / stats.sentenceCount;
        const avgSyllablesPerWord = stats.avgWordLength / 3; // Rough approximation
        stats.readabilityScore = Math.round(206.835 - 1.015 * avgSentenceLength - 84.6 * avgSyllablesPerWord);
        stats.readabilityScore = Math.max(0, Math.min(100, stats.readabilityScore));
      }
    }
    
    return stats;
  }
  
  // Calculate issue summary
  calculateSummary(issues) {
    const summary = {
      totalIssues: issues.length,
      criticalIssues: 0,
      highIssues: 0,
      mediumIssues: 0,
      lowIssues: 0,
      minimalIssues: 0
    };
    
    issues.forEach(issue => {
      switch (issue.severity) {
        case 'critical':
          summary.criticalIssues++;
          break;
        case 'high':
          summary.highIssues++;
          break;
        case 'medium':
          summary.mediumIssues++;
          break;
        case 'low':
          summary.lowIssues++;
          break;
        default:
          summary.minimalIssues++;
      }
    });
    
    return summary;
  }
  
  // Quick analysis (lighter version)
  analyzeQuick(content) {
    const results = {
      spamScore: 0,
      riskLevel: "MINIMAL",
      mainIssues: [],
      quickRecommendation: ""
    };
    
    const combinedText = `${content.subject || ''} ${content.body || ''}`.toLowerCase();
    
    // Quick check for major spam words only
    const majorCategories = ['financial_scam', 'health_pharma', 'suspicious', 'adult'];
    
    for (const category of majorCategories) {
      const data = this.spamWords[category];
      if (data && data.words) {
        for (const word of data.words) {
          if (word && combinedText.includes(String(word).toLowerCase())) {
            results.mainIssues.push({
              word: word,
              category: data.category,
              score: data.score
            });
            results.spamScore += data.score;
          }
        }
      }
    }
    
    // Quick pattern check
    if (combinedText === combinedText.toUpperCase() && combinedText.match(/[A-Z]/)) {
      results.spamScore += 10;
      results.mainIssues.push({
        type: "all_caps",
        message: "Content is in ALL CAPS",
        score: 10
      });
    }
    
    results.riskLevel = this.calculateRiskLevel(results.spamScore);
    
    // Quick recommendation
    if (results.spamScore >= 30) {
      results.quickRecommendation = "High spam risk - major rewrite recommended";
    } else if (results.spamScore >= 15) {
      results.quickRecommendation = "Medium spam risk - review and revise content";
    } else if (results.spamScore >= 5) {
      results.quickRecommendation = "Low spam risk - minor adjustments may help";
    } else {
      results.quickRecommendation = "Minimal spam risk - content looks good";
    }
    
    return results;
  }
}

module.exports = SpamAnalyzer;