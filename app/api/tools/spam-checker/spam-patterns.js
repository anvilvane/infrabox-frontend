// Regex patterns for spam detection
const spamPatterns = {
  // Text manipulation patterns
  excessive_caps: {
    pattern: /[A-Z]{10,}/g,
    description: "Excessive capital letters detected",
    score: 3,
    severity: "medium"
  },
  
  all_caps_subject: {
    pattern: /^[A-Z\s!?.]+$/,
    description: "Subject line is entirely in capital letters",
    score: 5,
    severity: "high"
  },
  
  multiple_exclamation: {
    pattern: /!{3,}/g,
    description: "Multiple exclamation marks detected",
    score: 2,
    severity: "low"
  },
  
  multiple_question: {
    pattern: /\?{3,}/g,
    description: "Multiple question marks detected",
    score: 2,
    severity: "low"
  },
  
  multiple_dollar: {
    pattern: /\${2,}/g,
    description: "Multiple dollar signs detected",
    score: 4,
    severity: "medium"
  },
  
  // Hidden content patterns
  hidden_text: {
    pattern: /style\s*=\s*["']?\s*(?:display\s*:\s*none|visibility\s*:\s*hidden)[^"']*/gi,
    description: "Hidden text detected in HTML",
    score: 10,
    severity: "critical"
  },
  
  white_text: {
    pattern: /color\s*:\s*(?:#?(?:fff(?:fff)?|white))[^;]*/gi,
    description: "White text that might be hidden",
    score: 8,
    severity: "high"
  },
  
  tiny_font: {
    pattern: /font-size\s*:\s*[0-8]px/gi,
    description: "Tiny font size detected",
    score: 6,
    severity: "high"
  },
  
  // Spacing manipulation
  excessive_spacing: {
    pattern: /[ ]{5,}/g,
    description: "Excessive spaces detected (text manipulation)",
    score: 3,
    severity: "medium"
  },
  
  letter_spacing: {
    pattern: /\b(\w)\s+(\w)\s+(\w)\s+(\w)/g,
    description: "Letter spacing manipulation detected",
    score: 4,
    severity: "medium"
  },
  
  // URL patterns
  ip_address: {
    pattern: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
    description: "IP address detected in content",
    score: 5,
    severity: "high"
  },
  
  url_shortener: {
    pattern: /(?:bit\.ly|tinyurl\.com|goo\.gl|ow\.ly|short\.link|t\.co|tiny\.cc|is\.gd|buff\.ly|rebrand\.ly|trib\.al|shorturl\.at)/gi,
    description: "URL shortener detected (often used to hide destination)",
    score: 7,
    severity: "high"
  },
  
  suspicious_tld: {
    pattern: /\.(tk|ml|ga|cf|click|download|review|top|loan|work|date|men|trade|bid|webcam|science|party)\b/gi,
    description: "Suspicious top-level domain detected",
    score: 6,
    severity: "high"
  },
  
  // Fake personalization
  fake_personalisation: {
    pattern: /Dear\s+(?:Customer|Friend|User|Member|Valued Customer|Sir\/Madam|Subscriber|Account Holder)/gi,
    description: "Generic greeting (fake personalization)",
    score: 3,
    severity: "medium"
  },
  
  // Encoded content
  encoded_text: {
    pattern: /(?:%[0-9a-fA-F]{2}){5,}/g,
    description: "Excessive URL encoding detected",
    score: 5,
    severity: "high"
  },
  
  hex_encoding: {
    pattern: /&#x[0-9a-fA-F]{2,4};{5,}/g,
    description: "Excessive hex encoding detected",
    score: 5,
    severity: "high"
  },
  
  // Money patterns
  large_money: {
    pattern: /\$[\d,]+(?:\.\d{2})?(?:\s*(?:million|billion|thousand|USD|dollars?))/gi,
    description: "Large money amount mentioned",
    score: 4,
    severity: "medium"
  },
  
  percentage_off: {
    pattern: /\d{2,3}%\s*(?:off|discount|savings?)/gi,
    description: "Percentage discount mentioned",
    score: 2,
    severity: "low"
  },
  
  // Phone patterns
  premium_rate: {
    pattern: /\b(?:1-)?900-\d{3}-\d{4}\b/g,
    description: "Premium rate phone number detected",
    score: 7,
    severity: "high"
  },
  
  international_dial: {
    pattern: /\+(?:234|91|86|27|62|92|880|84|63|20)\s*\d+/g,
    description: "International phone number from high-risk country",
    score: 5,
    severity: "medium"
  },
  
  // Email patterns
  multiple_recipients: {
    pattern: /(?:undisclosed[- ]recipients?|bulk[- ]mail|mass[- ]mail)/gi,
    description: "Bulk mail indicators detected",
    score: 4,
    severity: "medium"
  },
  
  suspicious_sender: {
    pattern: /(?:no-?reply|do-?not-?reply|mailer-daemon|postmaster|automated|system)@/gi,
    description: "Automated sender address pattern",
    score: 2,
    severity: "low"
  },
  
  // Special characters abuse
  special_chars: {
    pattern: /[★☆✓✔✗✘♥♦♣♠€£¥§©®™]{3,}/g,
    description: "Excessive special characters detected",
    score: 3,
    severity: "medium"
  },
  
  // Repeated punctuation
  repeated_punctuation: {
    pattern: /([!?.])\1{2,}/g,
    description: "Repeated punctuation detected",
    score: 2,
    severity: "low"
  },
  
  // Suspicious HTML
  javascript_in_html: {
    pattern: /<script[^>]*>|javascript:|on\w+\s*=/gi,
    description: "JavaScript code detected in content",
    score: 8,
    severity: "high"
  },
  
  form_in_email: {
    pattern: /<form[^>]*>|<input[^>]*>|<button[^>]*>/gi,
    description: "Form elements detected in email",
    score: 6,
    severity: "high"
  },
  
  // Obfuscation attempts
  zero_width_chars: {
    pattern: /\u200B|\u200C|\u200D|\uFEFF/g,
    description: "Zero-width characters detected (obfuscation attempt)",
    score: 7,
    severity: "high"
  },
  
  unicode_obfuscation: {
    pattern: /[\u0430\u043E\u0441\u0435\u0440]/g, // Cyrillic chars that look like Latin
    description: "Unicode character obfuscation detected",
    score: 6,
    severity: "high"
  },
  
  // Modern sales tactics patterns
  numbered_ctas: {
    pattern: /[1-9]️⃣|①|②|③|④|⑤|\d\)\s*(hop|book|schedule|join|reply|click|download|visit)/gi,
    description: "Multiple numbered calls-to-action detected",
    score: 5,
    severity: "medium"
  },
  
  ps_section: {
    pattern: /\bP\.?S\.?[\s:]/gi,
    description: "P.S. section detected (common in sales emails)",
    score: 3,
    severity: "low"
  },
  
  reply_bait: {
    pattern: /reply\s+with\s+["'].*["']|just\s+reply|hit\s+reply|respond\s+with/gi,
    description: "Reply bait tactic detected",
    score: 4,
    severity: "medium"
  },
  
  scarcity_pattern: {
    pattern: /only\s+\d+\s+(spots?|seats?|slots?|spaces?)\s+(left|remaining|available)|limited\s+(spots?|seats?|availability)/gi,
    description: "Artificial scarcity tactic detected",
    score: 5,
    severity: "medium"
  },
  
  testimonial_pattern: {
    pattern: /[""].*made\s+\$?\d+k.*[""]|[""].*changed\s+my\s+life.*[""]|[""].*best\s+decision.*[""]|client\s+results?|success\s+stor(y|ies)/gi,
    description: "Testimonial/success story pattern detected",
    score: 3,
    severity: "low"
  },
  
  authority_pattern: {
    pattern: /\b(featured\s+(in|on)|as\s+seen\s+(in|on)|appeared\s+on|guest\s+on|interviewed\s+by|recognized\s+by|endorsed\s+by)\b/gi,
    description: "Authority/credibility claim detected",
    score: 4,
    severity: "medium"
  },
  
  fake_casual: {
    pattern: /\b(hey\s+there|what's\s+up|quick\s+question|real\s+quick|super\s+quick|random\s+but|weird\s+question|crazy\s+idea)\b/gi,
    description: "Fake casual tone detected",
    score: 3,
    severity: "low"
  },
  
  calendar_link: {
    pattern: /calendly|cal\.com|hubspot.*meetings|acuityscheduling|schedule\.once|book\.time/gi,
    description: "Calendar booking link detected",
    score: 5,
    severity: "medium"
  },
  
  // B2B patterns
  service_list_pattern: {
    pattern: /(?:^|\n)\s*[-•·✓✔▪▫◦‣⁃]\s+.+(?:\n\s*[-•·✓✔▪▫◦‣⁃]\s+.+){4,}/gm,
    description: "Long service list detected (5+ items)",
    score: 4,
    severity: "medium"
  },
  
  company_credentials: {
    pattern: /\b(established\s+in\s+\d{4}|since\s+\d{4}|\d+\+?\s+years?\s+(of\s+)?experience|founded\s+in\s+\d{4}|over\s+\d+\s+years?)\b/gi,
    description: "Company credentials/experience claims",
    score: 3,
    severity: "low"
  },
  
  client_boasting: {
    pattern: /\b(trusted\s+by|clients?\s+include|worked?\s+with|partnered?\s+with|serving|delivered?\s+to)\s+(\d+\+?|hundreds?|thousands?|numerous|multiple|several|many)\s+(clients?|companies|organizations?|brands?)/gi,
    description: "Client boasting pattern detected",
    score: 3,
    severity: "low"
  },
  
  generic_greeting: {
    pattern: /^(dear|hi|hello)\s+[A-Z][a-z]+,?\s*\n+.*(hope\s+this\s+(email|message)\s+finds\s+you|trust\s+this\s+(email|message)|hope\s+you('re|are)\s+doing)/gmi,
    description: "Generic personalized greeting",
    score: 4,
    severity: "medium"
  },
  
  location_signature: {
    pattern: /\n.*\n.*\n.*(bangalore|mumbai|delhi|hyderabad|chennai|pune|kolkata|manila|kiev|minsk|dhaka|karachi|lahore|vietnam|poland|ukraine|belarus|philippines|pakistan|bangladesh)\s*$/gi,
    description: "Offshore location in signature",
    score: 3,
    severity: "low"
  },
  
  percentage_claims: {
    pattern: /\b\d{2,3}%\s*(increase|improvement|growth|reduction|savings?|cheaper|faster|better|more\s+efficient)/gi,
    description: "Percentage improvement claims",
    score: 3,
    severity: "low"
  },
  
  languages_mention: {
    pattern: /\b\d{2,3}\+?\s*(languages?|countries|regions|markets|locations)\b/gi,
    description: "Multiple languages/countries claim",
    score: 2,
    severity: "low"
  },
  
  team_size_boasting: {
    pattern: /\b(team\s+of\s+)?\d{2,}\+?\s+(professionals?|experts?|developers?|engineers?|designers?|consultants?|specialists?|employees?|staff|members?)\b/gi,
    description: "Team size boasting",
    score: 2,
    severity: "low"
  }
};

// Function to check text against all patterns
function checkPatterns(text, isHtml = false) {
  const detectedPatterns = [];
  let totalScore = 0;
  
  for (const [patternName, patternData] of Object.entries(spamPatterns)) {
    // Skip HTML-specific patterns if not HTML
    if (!isHtml && ['hidden_text', 'white_text', 'tiny_font', 'javascript_in_html', 'form_in_email'].includes(patternName)) {
      continue;
    }
    
    const matches = text.match(patternData.pattern);
    if (matches && matches.length > 0) {
      const occurrences = matches.length;
      const score = patternData.score * Math.min(occurrences, 3); // Cap multiplier at 3
      
      detectedPatterns.push({
        type: patternName,
        description: patternData.description,
        severity: patternData.severity,
        occurrences: occurrences,
        examples: matches.slice(0, 3), // Show first 3 examples
        score: score
      });
      
      totalScore += score;
    }
  }
  
  return {
    patterns: detectedPatterns,
    totalScore: totalScore,
    patternCount: detectedPatterns.length
  };
}

// Check for specific pattern
function checkPattern(text, patternName) {
  const pattern = spamPatterns[patternName];
  if (!pattern) return null;
  
  const matches = text.match(pattern.pattern);
  if (!matches) return null;
  
  return {
    type: patternName,
    description: pattern.description,
    severity: pattern.severity,
    occurrences: matches.length,
    examples: matches.slice(0, 3),
    score: pattern.score * Math.min(matches.length, 3)
  };
}

// Get pattern statistics
function getPatternStats(text) {
  const stats = {
    capitalLettersRatio: 0,
    punctuationDensity: 0,
    numberDensity: 0,
    specialCharDensity: 0,
    averageWordLength: 0,
    linkCount: 0
  };
  
  if (!text || text.length === 0) return stats;
  
  // Capital letters ratio
  const capitals = (text.match(/[A-Z]/g) || []).length;
  const letters = (text.match(/[a-zA-Z]/g) || []).length;
  stats.capitalLettersRatio = letters > 0 ? (capitals / letters) * 100 : 0;
  
  // Punctuation density
  const punctuation = (text.match(/[!?.,;:]/g) || []).length;
  stats.punctuationDensity = (punctuation / text.length) * 100;
  
  // Number density
  const numbers = (text.match(/\d/g) || []).length;
  stats.numberDensity = (numbers / text.length) * 100;
  
  // Special character density
  const specialChars = (text.match(/[^a-zA-Z0-9\s.,!?;:]/g) || []).length;
  stats.specialCharDensity = (specialChars / text.length) * 100;
  
  // Average word length
  const words = text.match(/\b\w+\b/g) || [];
  if (words.length > 0) {
    const totalLength = words.reduce((sum, word) => sum + word.length, 0);
    stats.averageWordLength = totalLength / words.length;
  }
  
  // Link count
  stats.linkCount = (text.match(/https?:\/\/[^\s]+/gi) || []).length;
  
  return stats;
}

module.exports = {
  spamPatterns,
  checkPatterns,
  checkPattern,
  getPatternStats
};