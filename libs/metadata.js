export function generatePageMetadata({
  title,
  description,
  keywords,
  path = '/',
  ogImage = 'https://www.infrabox.software/og-default.png'
}) {
  const baseUrl = 'https://www.infrabox.software';
  const fullUrl = `${baseUrl}${path}`;
  
  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: 'Infrabox',
      images: [
        {
          url: ogImage,
          width: 1920,
          height: 1080,
          alt: 'Infrabox - Email Infrastructure Platform',
        }
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: fullUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}