export function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const orgRef = {
  "@type": "Organization",
  "@id": "https://www.infrabox.software/#organization",
};

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.infrabox.software/#organization",
  name: "Infrabox",
  alternateName: ["infrabox.software", "Infrabox Email Infrastructure"],
  url: "https://www.infrabox.software",
  logo: {
    "@type": "ImageObject",
    url: "https://www.infrabox.software/logo.png",
    width: 512,
    height: 512,
  },
  description:
    "Enterprise email infrastructure platform. US-IP Google Workspace and Microsoft 365 accounts with 95% inbox delivery, automated DNS, email warmup, and 24+ sequencer integrations.",
  foundingDate: "2023",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    availableLanguage: "English",
    url: "https://www.infrabox.software",
  },
  sameAs: [
    "https://www.linkedin.com/company/infrabox",
    "https://www.youtube.com/@Infrabox",
    "https://twitter.com/infrabox",
    "https://www.crunchbase.com/organization/infrabox",
    "https://www.g2.com/products/infrabox",
    "https://docs.infrabox.software",
  ],
  knowsAbout: [
    "Email Infrastructure",
    "Email Deliverability",
    "Google Workspace Accounts",
    "Microsoft 365 Accounts",
    "Email Warmup",
    "DNS Management",
    "SPF DKIM DMARC",
    "Inbox Placement",
    "Sender Reputation",
    "Email Authentication",
    "Outbound Sales Infrastructure",
  ],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.infrabox.software/#website",
  name: "Infrabox",
  alternateName: "infrabox.software",
  url: "https://www.infrabox.software",
  description:
    "Enterprise email infrastructure with US-IP Google Workspace and Microsoft 365 accounts. 95% inbox delivery rate with automated setup in under 10 minutes.",
  publisher: orgRef,
  // No SearchAction/sitelinks searchbox: there is no on-site search endpoint that
  // consumes ?q=, and an invalid potentialAction suppresses the feature. Re-add a
  // SearchAction here only once a real search page exists.
  inLanguage: "en-US",
};

export const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": "https://www.infrabox.software/#software",
  name: "Infrabox",
  description:
    "Email infrastructure platform providing US-IP Google Workspace and Microsoft 365 accounts with automated DNS setup, email warmup integration, InfraGuard domain monitoring, and 24+ sequencer integrations. 95% inbox delivery rate with setup in under 10 minutes.",
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "Email Infrastructure",
  operatingSystem: "Web",
  url: "https://www.infrabox.software",
  featureList: [
    "US-IP Google Workspace Accounts - Official accounts with premium US IP addresses",
    "Microsoft 365 & Azure Mailboxes - Enterprise Microsoft accounts with full admin control",
    "Automated DNS Setup - SPF, DKIM, DMARC configured automatically in seconds",
    "Isolated Email Warmup - Built-in warmup that builds sender reputation independently per mailbox",
    "InfraGuard Domain Protection - Blacklist monitoring, DNS watching, bounce tracking every 6 hours",
    "24+ Sequencer Integrations - SmartLead, Instantly, Apollo, Reply, Lemlist, and more",
    "Inbox Placement Testing - Real-time deliverability monitoring across providers",
    "Email Analytics Dashboard - Bounce monitoring, engagement tracking, and deliverability scores",
    "Bulk Mailbox Management - Create and manage 500+ accounts from one dashboard",
    "REST API Access - Full API for programmatic mailbox and domain management",
  ],
  offers: [
    {
      "@type": "Offer",
      name: "Google Workspace Accounts",
      price: "2.5",
      priceCurrency: "USD",
      description:
        "US-IP Google Workspace accounts from $2.50/mailbox/month on annual Enterprise plan. Plans start at $39/mo with 10 mailboxes included.",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "2.5",
        priceCurrency: "USD",
        unitText: "per mailbox per month (annual billing)",
        referenceQuantity: {
          "@type": "QuantitativeValue",
          value: 1,
          unitCode: "MON",
        },
      },
      availability: "https://schema.org/InStock",
      priceValidUntil: "2026-12-31",
      url: "https://www.infrabox.software/pricing",
    },
    {
      "@type": "Offer",
      name: "Microsoft 365 Accounts",
      price: "2.5",
      priceCurrency: "USD",
      description:
        "Microsoft 365 mailboxes from $2.50/mailbox/month on Enterprise annual billing, same tier pricing as Google Workspace. Full admin control included.",
      availability: "https://schema.org/InStock",
      priceValidUntil: "2026-12-31",
      url: "https://www.infrabox.software/pricing",
    },
  ],
  author: orgRef,
  datePublished: "2023-01-01",
  screenshot:
    "https://www.infrabox.software/og-default.png",
};


export const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://www.infrabox.software/#service",
  serviceType: "Email Infrastructure Service",
  name: "Infrabox Email Infrastructure",
  description:
    "Complete email infrastructure setup with US-IP Google Workspace and Microsoft 365 accounts, automated DNS management, email warmup, domain monitoring, and deliverability optimization.",
  provider: orgRef,
  areaServed: "Worldwide",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Email Infrastructure Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Google Workspace Accounts",
          description:
            "US-IP Google Workspace accounts with automated setup, 2FA, and app passwords",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Microsoft 365 & Azure Mailboxes",
          description:
            "Enterprise Microsoft 365 and Azure mailboxes with full admin control",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "DNS Management",
          description:
            "Automated SPF, DKIM, DMARC configuration and monitoring",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Email Warmup",
          description:
            "Isolated warmup system building sender reputation per mailbox",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "InfraGuard Domain Protection",
          description:
            "Blacklist monitoring, DNS watching, bounce tracking, and inbox placement testing",
        },
      },
    ],
  },
};

export function createBreadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function createWebPageSchema({ name, description, url, dateModified }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url,
    dateModified: dateModified || new Date().toISOString().split("T")[0],
    isPartOf: {
      "@id": "https://www.infrabox.software/#website",
    },
    about: orgRef,
    publisher: orgRef,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".tool-description", ".features", "[data-speakable]"],
    },
    mainContentOfPage: {
      "@type": "WebPageElement",
      cssSelector: "main",
    },
  };
}

export function createToolFaqSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function createHowToSchema({
  name,
  description,
  steps,
  totalTime,
  tool,
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    ...(totalTime && { totalTime }),
    ...(tool && {
      tool: {
        "@type": "HowToTool",
        name: tool,
      },
    }),
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

export function createWebApplicationSchema({ name, url, featureList }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    applicationCategory: "BusinessApplication",
    name,
    url,
    operatingSystem: "Web",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList,
    isPartOf: {
      "@id": "https://www.infrabox.software/#website",
    },
  };
}

export function createItemListSchema({ name, description, url, items }) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    description,
    url,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: item.position || index + 1,
      name: item.name,
      description: item.description,
      ...(item.url && { url: item.url }),
    })),
  };
}

export function createReviewSchema({ name, description, url, author, datePublished, dateModified, ratingValue, bestRating, itemReviewed }) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    name,
    description,
    url,
    datePublished,
    dateModified: dateModified || datePublished,
    author: author ? { "@type": "Person", name: author } : { "@type": "Organization", "@id": "https://www.infrabox.software/#organization" },
    publisher: { "@type": "Organization", "@id": "https://www.infrabox.software/#organization" },
    itemReviewed: {
      "@type": "SoftwareApplication",
      name: itemReviewed || name.replace(/ Review.*/, ''),
      applicationCategory: "BusinessApplication",
    },
    ...(ratingValue && {
      reviewRating: {
        "@type": "Rating",
        ratingValue,
        bestRating: bestRating || "10",
      },
    }),
  };
}

export function createArticleSchema({
  headline,
  description,
  url,
  datePublished,
  dateModified,
  author,
  authorUrl,
  image,
  keywords,
}) {
  const authorObj = author
    ? {
        "@type": "Person",
        name: author,
        ...(authorUrl && { url: authorUrl, sameAs: [authorUrl] }),
      }
    : orgRef;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url,
    datePublished,
    dateModified: dateModified || datePublished,
    author: authorObj,
    publisher: orgRef,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    inLanguage: "en-US",
    isAccessibleForFree: true,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2", "[data-speakable]"],
    },
    ...(keywords && keywords.length > 0 && { keywords: keywords.join(", ") }),
    ...(image && {
      image: {
        "@type": "ImageObject",
        url: image,
        width: 1200,
        height: 630,
      },
    }),
  };
}

export function createProductComparisonSchema({
  product1Name,
  product1Url,
  product1Price,
  product1Rating,
  product2Name,
  product2Url,
  product2Price,
  product2Rating,
  comparisonUrl,
  lastReviewed,
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": comparisonUrl,
    name: `${product1Name} vs ${product2Name} Comparison`,
    url: comparisonUrl,
    dateModified: lastReviewed,
    lastReviewed: lastReviewed,
    mainEntity: [
      {
        "@type": "SoftwareApplication",
        name: product1Name,
        url: product1Url,
        applicationCategory: "BusinessApplication",
        offers: {
          "@type": "Offer",
          price: product1Price,
          priceCurrency: "USD",
        },
        ...(product1Rating && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product1Rating.score,
            reviewCount: product1Rating.reviewCount,
            bestRating: "5",
          },
        }),
      },
      {
        "@type": "SoftwareApplication",
        name: product2Name,
        url: product2Url,
        applicationCategory: "BusinessApplication",
        offers: {
          "@type": "Offer",
          price: product2Price,
          priceCurrency: "USD",
        },
        ...(product2Rating && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product2Rating.score,
            reviewCount: product2Rating.reviewCount,
            bestRating: "5",
          },
        }),
      },
    ],
    publisher: {
      "@type": "Organization",
      "@id": "https://www.infrabox.software/#organization",
    },
  };
}
