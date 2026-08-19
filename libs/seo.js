import config from "@/config";

export const getSEOTags = ({
  title,
  description,
  keywords,
  openGraph,
  canonicalUrlRelative,
  extraTags,
} = {}) => {
  // Default share image so every getSEOTags page emits og:image / twitter:image.
  // Next.js does NOT deep-merge openGraph, so a page declaring its own openGraph
  // without images would otherwise drop the root layout's default image.
  const ogImages = openGraph?.images || [
    {
      url: `https://www.${config.domainName}/opengraph-image.png`,
      width: 1920,
      height: 1080,
      alt: config.appName,
    },
  ];

  return {
    // up to 50 characters (what does your app do for the user?) > your main should be here
    title: title || config.appName,
    // up to 160 characters (how does your app help the user?)
    description: description || config.appDescription,
    // some keywords separated by commas. by default it will be your app name
    keywords: keywords || [config.appName],
    applicationName: config.appName,
    // set a base URL prefix for other fields that require a fully qualified URL (.e.g og:image: og:image: 'https://yourdomain.com/share.png' => '/share.png')
    metadataBase: new URL(
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/"
        : `https://www.${config.domainName}/`
    ),

    openGraph: {
      title: openGraph?.title || config.appName,
      description: openGraph?.description || config.appDescription,
      url: openGraph?.url || `https://www.${config.domainName}/`,
      siteName: openGraph?.title || config.appName,
      images: ogImages,
      locale: "en_US",
      type: "website",
    },

    twitter: {
      title: openGraph?.title || config.appName,
      description: openGraph?.description || config.appDescription,
      images: ogImages.map((img) => (typeof img === "string" ? img : img.url)),
      card: "summary_large_image",
    },

    // If a canonical URL is given, we add it. The metadataBase will turn the relative URL into a fully qualified URL
    ...(canonicalUrlRelative && {
      alternates: { canonical: canonicalUrlRelative },
    }),

    // If you want to add extra tags, you can pass them here
    ...extraTags,
  };
};