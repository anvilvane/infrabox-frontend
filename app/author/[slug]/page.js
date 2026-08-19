import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getAuthor,
  getAuthorByName,
  getAllAuthorSlugs,
} from "@/lib/authors";
import { getAllLearnArticles } from "@/app/learn/[slug]/learn-data";
import {
  JsonLd,
  createBreadcrumbSchema,
} from "@/components/seo/json-ld";

const CATEGORY_COLORS = {
  Comparisons: "text-amber-600",
  Reviews: "text-violet-600",
  Alternatives: "text-emerald-600",
  Pricing: "text-orange-600",
  Educational: "text-sky-600",
  Solutions: "text-rose-600",
  Guides: "text-blue-600",
};

export function generateStaticParams() {
  return getAllAuthorSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) return {};

  return {
    title: `${author.name} - ${author.role} at Infrabox`,
    description: author.bio,
    openGraph: {
      title: `${author.name} - ${author.role} at Infrabox`,
      description: author.bio,
      url: `https://www.infrabox.software/author/${author.slug}`,
      type: "profile",
      images: [
        {
          url: `https://www.infrabox.software${author.avatar}`,
          alt: author.name,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: `${author.name} - ${author.role} at Infrabox`,
      description: author.bio,
    },
    alternates: {
      canonical: `https://www.infrabox.software/author/${author.slug}`,
    },
  };
}

export default async function AuthorPage({ params }) {
  const { slug } = await params;
  const author = getAuthor(slug);

  if (!author) {
    notFound();
  }

  const allArticles = getAllLearnArticles();
  const authorArticles = allArticles.filter(
    (article) => article.author === author.name
  );

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    jobTitle: author.role,
    description: author.bio,
    url: `https://www.infrabox.software/author/${author.slug}`,
    image: `https://www.infrabox.software${author.avatar}`,
    ...(author.linkedin ? { sameAs: [author.linkedin] } : {}),
    worksFor: {
      "@type": "Organization",
      name: "Infrabox",
      url: "https://www.infrabox.software",
    },
  };

  return (
    <>
      <JsonLd
        data={createBreadcrumbSchema([
          { name: "Home", url: "https://www.infrabox.software" },
          { name: "Our Team", url: "https://www.infrabox.software/authors" },
          {
            name: author.name,
            url: `https://www.infrabox.software/author/${author.slug}`,
          },
        ])}
      />
      <JsonLd data={personSchema} />

      <main className="bg-gray-50 min-h-screen">
        {/* Author Header */}
        <section className="bg-white border-b border-gray-200">
          <div className="px-6 py-16 sm:py-20 max-w-3xl mx-auto">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-xs text-gray-400 mb-10">
              <Link
                href="/"
                className="hover:text-gray-900 transition-colors"
              >
                Home
              </Link>
              <span>/</span>
              <Link
                href="/authors"
                className="hover:text-gray-900 transition-colors"
              >
                Our Team
              </Link>
              <span>/</span>
              <span className="text-gray-600">{author.name}</span>
            </nav>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar */}
              <Image
                src={author.avatar}
                alt={author.name}
                width={120}
                height={120}
                priority
                sizes="112px"
                className="w-28 h-28 rounded-full object-cover border-2 border-gray-200 shrink-0"
              />

              {/* Info */}
              <div className="text-center sm:text-left">
                <h1 className="text-[28px] sm:text-[36px] font-semibold text-gray-900 leading-[1.2] mb-1">
                  {author.name}
                </h1>
                <p className="text-[#1240cc] font-medium text-lg mb-4">
                  {author.role} at Infrabox
                </p>
                <p className="text-gray-600 text-[15px] leading-relaxed mb-5 max-w-xl">
                  {author.bio}
                </p>
                {author.linkedin && (
                <a
                  href={author.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#1240cc] hover:underline"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Articles */}
        <section className="bg-gray-50 border-b border-gray-200">
          <div className="px-6 py-12 lg:py-16 max-w-5xl mx-auto">
            <h2 className="text-[20px] sm:text-[24px] font-semibold text-gray-900 leading-[1.2] mb-8">
              Articles by {author.name}{" "}
              <span className="text-gray-400 font-normal text-base">
                ({authorArticles.length})
              </span>
            </h2>

            {authorArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {authorArticles.map((article) => {
                  const categoryColor =
                    CATEGORY_COLORS[article.category] ||
                    CATEGORY_COLORS.Guides;
                  return (
                    <Link
                      key={article.slug}
                      href={`/learn/${article.slug}`}
                      className="group flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                    >
                      {/* Pastel green mesh thumbnail */}
                      <div className="relative h-[150px] overflow-hidden">
                        <div className="absolute inset-0 bg-[#e8f0fe]">
                          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                              <filter id={`m-${article.slug}`} x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur in="SourceGraphic" stdDeviation="50" />
                              </filter>
                            </defs>
                            <ellipse cx="340" cy="30" rx="150" ry="100" fill="#bcd4fb" opacity="0.9" filter={`url(#m-${article.slug})`} />
                            <ellipse cx="60" cy="170" rx="130" ry="90" fill="#d5e4fd" opacity="0.8" filter={`url(#m-${article.slug})`} />
                            <ellipse cx="200" cy="90" rx="100" ry="80" fill="#a9c6fa" opacity="0.6" filter={`url(#m-${article.slug})`} />
                          </svg>
                        </div>
                        <div className="relative z-10 h-full p-4 flex flex-col justify-between">
                          <div className="flex items-center justify-between">
                            <img src="/logo.png" alt="Infrabox" className="h-5 w-auto opacity-30" />
                            <span className={`inline-flex px-2 py-0.5 rounded-md text-[9px] font-semibold uppercase tracking-wider ${categoryColor} bg-white/60`}>
                              {article.category}
                            </span>
                          </div>
                          <h3 className="text-[#1240cc] font-semibold text-[14px] leading-snug line-clamp-3">
                            {article.headline}
                          </h3>
                        </div>
                      </div>

                      {/* Content below */}
                      <div className="px-4 pt-3 pb-4 flex-1 flex flex-col">
                        <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2 flex-1">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center gap-2.5 pt-3 border-t border-gray-100">
                          <Image
                            src={author.avatar}
                            alt={author.name}
                            width={24}
                            height={24}
                            className="w-6 h-6 rounded-full object-cover border border-gray-200"
                          />
                          <span className="text-xs text-gray-500">{author.name}</span>
                          <span className="text-xs text-gray-400">{article.readingTime}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                No articles published yet.
              </p>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white border-t border-gray-200">
          <div className="px-6 py-14 lg:py-20 max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Ready to build your infrastructure?
            </h2>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Plans from $39/mo with 10 mailboxes included. Setup in under 10 minutes.
            </p>
            <a
              href="https://app.infrabox.software/signup"
              className="inline-flex items-center gap-2 px-7 py-3 bg-[#1240cc] text-white font-semibold rounded-full hover:bg-[#0b34b4] transition-colors text-sm shadow-lg shadow-[#1240cc]/20"
            >
              Get Started
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
