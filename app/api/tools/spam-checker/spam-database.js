// Comprehensive spam word database with categories and scoring
const spamWordDatabase = {
  // Financial Scams - Highest risk
  financial_scam: {
    words: [
      "nigerian prince", "wire transfer", "bank account details",
      "million dollars", "inheritance", "lottery winner",
      "tax refund", "irs", "audit", "seized funds",
      "frozen account", "verify account", "suspended account",
      "paypal", "western union", "money order", "cashier check",
      "bitcoin", "cryptocurrency", "crypto wallet", "urgent transfer",
      "beneficiary", "deceased relative", "unclaimed funds",
      "bank mandate", "swift code", "routing number"
    ],
    score: 10,
    category: "Financial Scam",
    severity: "critical"
  },
  
  // Aggressive Sales
  aggressive_sales: {
    words: [
      "buy now", "limited time", "act now", "don't delay",
      "while supplies last", "one time offer", "expires today",
      "final notice", "last chance", "urgent", "immediate action",
      "deadline", "hurry", "instant", "now only", "today only",
      "ends midnight", "flash sale", "clearance", "closing down",
      "everything must go", "time sensitive", "act fast",
      "don't miss out", "exclusive deal", "special promotion"
    ],
    score: 5,
    category: "Aggressive Marketing",
    severity: "medium"
  },
  
  // Free Offers
  free_offers: {
    words: [
      "100% free", "absolutely free", "no cost", "no fee",
      "free access", "free consultation", "free download",
      "free trial", "free membership", "free quote",
      "free sample", "free preview", "complimentary", "gratis",
      "zero cost", "no charge", "free gift", "free bonus",
      "free shipping", "free delivery", "free installation",
      "free assessment", "free evaluation", "free report"
    ],
    score: 4,
    category: "Free Offers",
    severity: "low"
  },
  
  // Money Related
  money: {
    words: [
      "make money", "earn money", "extra income", "cash bonus",
      "double your income", "financial freedom", "get rich",
      "millionaire", "six figures", "passive income",
      "work from home", "be your own boss", "quit your job",
      "easy money", "fast cash", "quick money", "guaranteed income",
      "unlimited earnings", "make $", "earn $", "save money",
      "discount", "cheap", "affordable", "lowest price",
      "best price", "compare prices", "price match"
    ],
    score: 6,
    category: "Money Making",
    severity: "medium"
  },
  
  // Health & Pharma
  health_pharma: {
    words: [
      "viagra", "cialis", "pharmacy", "prescription",
      "weight loss", "lose weight", "diet pills", "miracle cure",
      "anti-aging", "human growth hormone", "testosterone",
      "medical breakthrough", "doctors hate", "one weird trick",
      "supplements", "herbal", "natural remedy", "alternative medicine",
      "fda approved", "clinical trials", "proven results",
      "side effects", "treatment", "diagnosis", "symptoms",
      "cure", "healing", "wellness", "detox", "cleanse"
    ],
    score: 8,
    category: "Health/Pharma",
    severity: "high"
  },
  
  // Suspicious Phrases
  suspicious: {
    words: [
      "congratulations", "you've been selected", "winner",
      "claim your prize", "you've won", "guaranteed",
      "no strings attached", "no obligation", "risk free",
      "100% guaranteed", "satisfaction guaranteed",
      "we hate spam", "this is not spam", "not junk",
      "please read", "important information", "urgent message",
      "dear customer", "valued customer", "dear friend",
      "verify your email", "confirm your account",
      "update your information", "action required"
    ],
    score: 7,
    category: "Suspicious Claims",
    severity: "high"
  },
  
  // Adult Content
  adult: {
    words: [
      "xxx", "adult", "18+", "singles", "dating",
      "meet singles", "hot singles", "lonely wives",
      "adult content", "explicit", "mature content",
      "hookup", "casual encounters", "escort"
    ],
    score: 9,
    category: "Adult Content",
    severity: "high"
  },
  
  // Technical Tricks
  technical: {
    words: [
      "click here", "click below", "click now",
      "unsubscribe", "remove", "opt out",
      "update your information", "verify your account",
      "confirm your email", "validate your account",
      "click to download", "download now", "install now",
      "update now", "upgrade now", "activate now",
      "view online", "web version", "browser version"
    ],
    score: 3,
    category: "Technical",
    severity: "low"
  },
  
  // Urgency
  urgency: {
    words: [
      "urgent", "important", "alert", "warning",
      "account alert", "security alert", "action required",
      "response required", "immediate", "asap",
      "time sensitive", "expires soon", "ending soon",
      "about to expire", "expiring", "last reminder",
      "final reminder", "final warning", "suspended",
      "terminated", "cancelled", "deactivated"
    ],
    score: 5,
    category: "False Urgency",
    severity: "medium"
  },
  
  // Exaggerated Claims
  exaggerated: {
    words: [
      "amazing", "incredible", "unbelievable", "shocking",
      "revolutionary", "breakthrough", "miracle", "magic",
      "secret", "hidden", "exclusive", "limited",
      "best ever", "number one", "#1", "top rated",
      "award winning", "certified", "approved", "endorsed",
      "recommended by", "as seen on", "featured in"
    ],
    score: 4,
    category: "Exaggerated Claims",
    severity: "low"
  },
  
  // Call to Action
  cta: {
    words: [
      "call now", "order now", "sign up now", "register now",
      "subscribe now", "join now", "start now", "apply now",
      "get started", "learn more", "find out more", "discover",
      "see more", "view more", "read more", "continue reading",
      "get instant access", "instant download", "get it now"
    ],
    score: 2,
    category: "Call to Action",
    severity: "minimal"
  },
  
  // Privacy/Legal
  privacy_legal: {
    words: [
      "privacy policy", "terms and conditions", "disclaimer",
      "legal notice", "copyright", "all rights reserved",
      "confidential", "privileged", "proprietary",
      "authorized recipient", "intended recipient",
      "if you received this in error", "please delete"
    ],
    score: 1,
    category: "Privacy/Legal",
    severity: "minimal"
  },
  
  // Coaching/Consulting Pitch
  coaching_pitch: {
    words: [
      "high-performer", "high performer", "high-performance coach",
      "strategy call", "strategy session", "discovery call",
      "book a call", "schedule a call", "free call",
      "30-minute call", "15-minute call", "quick call",
      "private community", "growth community", "exclusive community",
      "waitlist", "wait list", "join the waitlist",
      "coaching program", "mentorship", "mastermind",
      "transform your life", "level up", "unlock your potential",
      "scale your business", "10x your", "double your",
      "breakthrough session", "clarity call", "no sales pitch",
      "no obligation call", "free consultation", "free strategy",
      "hop on a call", "jump on a call", "book a time"
    ],
    score: 7,
    category: "Coaching/Sales Pitch",
    severity: "high"
  },
  
  // Fake Personalization & Outreach
  fake_personalization: {
    words: [
      "came across my radar", "caught my attention", "noticed you",
      "saw your profile", "came across your", "stumbled upon",
      "can't help but reach out", "had to reach out", "compelled to reach out",
      "resonated with me", "speaks to me", "reminds me of",
      "i see you", "i notice you", "i've been following",
      "been watching", "been observing", "impressed by",
      "you're exactly", "you seem like", "you appear to be",
      "people like you", "someone like you", "professionals like you",
      "leaders like you", "entrepreneurs like you"
    ],
    score: 6,
    category: "Fake Personalization",
    severity: "medium"
  },
  
  // Emotional Manipulation
  emotional_manipulation: {
    words: [
      "felt that tug", "drop the mask", "feels aligned",
      "living a version", "not truly yours", "authentic self",
      "deep down", "gut feeling", "inner voice",
      "missing out", "left behind", "falling behind",
      "everyone else is", "successful people", "top performers",
      "regret not", "wish you had", "look back and",
      "life-changing", "game-changer", "breakthrough",
      "stuck in", "trapped in", "settling for",
      "deserve better", "meant for more", "bigger things",
      "comfort zone", "playing small", "holding back",
      "wake up call", "reality check", "hard truth"
    ],
    score: 5,
    category: "Emotional Manipulation",
    severity: "medium"
  },
  
  // LinkedIn/Social Outreach
  social_outreach: {
    words: [
      "follow me on linkedin", "connect on linkedin", "linkedin profile",
      "follow along", "check out my", "see my posts",
      "content i share", "insights i share", "tips i share",
      "grew my following", "10k followers", "viral post",
      "thought leader", "industry expert", "recognized expert",
      "featured in", "as seen in", "quoted in",
      "podcast guest", "speaking engagements", "ted talk"
    ],
    score: 4,
    category: "Social Media Pitch",
    severity: "medium"
  },
  
  // Business Opportunity
  business_opportunity: {
    words: [
      "business opportunity", "partnership opportunity", "collaboration",
      "mutual benefit", "win-win", "synergy",
      "roi", "return on investment", "revenue increase",
      "profit margin", "bottom line", "top line",
      "case study", "success story", "client results",
      "testimonial", "social proof", "proven system",
      "framework", "blueprint", "roadmap",
      "scale up", "scale your", "grow your",
      "passive income", "recurring revenue", "side hustle"
    ],
    score: 6,
    category: "Business Opportunity",
    severity: "high"
  },
  
  // B2B Cold Outreach
  b2b_cold_outreach: {
    words: [
      "i hope this email finds you well", "hope this email finds you",
      "are you looking for", "are you interested in",
      "we offer comprehensive", "we provide comprehensive",
      "we would be delighted", "we would love to",
      "expand your global presence", "expand your reach",
      "expand your business", "grow your business",
      "meet your business needs", "meet your requirements",
      "trusted partner", "reliable partner", "preferred partner",
      "industry leader", "market leader", "leading provider",
      "one-stop solution", "complete solution", "end-to-end solution",
      "discuss how we can", "explore how we can",
      "schedule a quick call", "arrange a brief call",
      "reaching out to you", "contacting you regarding",
      "came across your company", "found your company"
    ],
    score: 5,
    category: "B2B Cold Outreach",
    severity: "medium"
  },
  
  // Service Listing Spam
  service_listing: {
    words: [
      "full range of services", "wide range of services",
      "comprehensive services", "extensive services",
      "our services include", "services we offer",
      "we specialize in", "our expertise includes",
      "one-stop shop", "single source", "turnkey solution",
      "end-to-end services", "complete suite", "full spectrum",
      "integrated services", "holistic approach",
      "customized solutions", "tailored solutions",
      "flexible packages", "scalable solutions",
      "cost-effective solutions", "affordable pricing",
      "competitive rates", "best prices", "unbeatable prices"
    ],
    score: 4,
    category: "Service Listing",
    severity: "medium"
  },
  
  // Corporate Sales Language
  corporate_sales: {
    words: [
      "unmatched quality", "unmatched accuracy", "unparalleled service",
      "exceptional quality", "superior quality", "premium quality",
      "proven track record", "established reputation", "years of experience",
      "industry expertise", "domain expertise", "technical expertise",
      "fortune 500", "global clients", "international clients",
      "award-winning", "certified professionals", "qualified team",
      "iso certified", "industry certified", "accredited",
      "world-class", "best-in-class", "state-of-the-art",
      "cutting-edge", "innovative solutions", "advanced technology",
      "client satisfaction", "customer success", "client testimonials",
      "trusted by", "preferred by", "chosen by",
      "leading companies", "top companies", "major brands"
    ],
    score: 3,
    category: "Corporate Sales Language",
    severity: "low"
  },
  
  // Generic Business Communication
  generic_business: {
    words: [
      "dear sir/madam", "dear sir or madam", "to whom it may concern",
      "dear valued customer", "dear valued client", "dear business owner",
      "dear decision maker", "dear procurement team", "dear hiring manager",
      "kind regards", "warm regards", "best regards",
      "looking forward to hearing from you", "awaiting your response",
      "please feel free to", "do not hesitate to", "should you have any",
      "at your earliest convenience", "at your convenience",
      "thank you for your time", "appreciate your time",
      "opportunity to work with", "opportunity to serve",
      "mutually beneficial", "long-term relationship",
      "business relationship", "strategic partnership"
    ],
    score: 2,
    category: "Generic Business",
    severity: "low"
  },
  
  // Offshore Services
  offshore_services: {
    words: [
      "offshore development", "outsourcing services", "dedicated team",
      "remote developers", "virtual assistants", "managed services",
      "24/7 support", "round-the-clock service", "global delivery",
      "cost savings", "reduce costs", "save up to",
      "bangalore", "hyderabad", "manila", "kiev", "minsk",
      "timezone coverage", "follow-the-sun", "nearshore",
      "staff augmentation", "team extension", "resource augmentation",
      "hire developers", "hire designers", "hire experts",
      "hourly rates", "monthly retainer", "flexible engagement"
    ],
    score: 5,
    category: "Offshore Services",
    severity: "medium"
  }
};

// Export functions to work with the database
function getSpamWords() {
  return spamWordDatabase;
}

function getCategories() {
  return Object.keys(spamWordDatabase);
}

function getCategoryWords(category) {
  return spamWordDatabase[category] || null;
}

function getAllWords() {
  const allWords = [];
  Object.values(spamWordDatabase).forEach(category => {
    allWords.push(...category.words);
  });
  return allWords;
}

function getTotalWordCount() {
  return getAllWords().length;
}

module.exports = {
  spamWordDatabase,
  getSpamWords,
  getCategories,
  getCategoryWords,
  getAllWords,
  getTotalWordCount
};