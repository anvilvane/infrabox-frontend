import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllAuthors } from "@/lib/authors";
import {
  JsonLd,
  createBreadcrumbSchema,
  createWebPageSchema,
} from "@/components/seo/json-ld";

export const metadata = {
  title: "Infrabox Team: Email Infrastructure Experts",
  description:
    "Meet the people building Infrabox — the email infrastructure platform trusted by agencies and B2B sales teams across the US, EU, and APAC.",
  openGraph: {
    title: "Infrabox Team: Email Infrastructure Experts | Infrabox",
    description: "Meet the people building Infrabox — the email infrastructure platform trusted by agencies and B2B sales teams across the US, EU, and APAC.",
    url: "https://www.infrabox.software/authors",
    siteName: "Infrabox",
    type: "website",
    images: [
      {
        url: "https://www.infrabox.software/opengraph-image.png",
        width: 1920,
        height: 1080,
        alt: "The Infrabox Team",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Infrabox Team: Email Infrastructure Experts | Infrabox",
    description: "Meet the people building Infrabox — the email infrastructure platform trusted by agencies and B2B sales teams across the US, EU, and APAC.",
    images: ["https://www.infrabox.software/opengraph-image.png"],
  },
  alternates: {
    canonical: "https://www.infrabox.software/authors",
  },
};

export default function AuthorsPage() {
  const authors = getAllAuthors();

  return (
    <>
      <JsonLd
        data={createBreadcrumbSchema([
          { name: "Home", url: "https://www.infrabox.software" },
          { name: "Our Team", url: "https://www.infrabox.software/authors" },
        ])}
      />
      <JsonLd
        data={createWebPageSchema({
          name: "Our Team",
          description: "Meet the team behind Infrabox.",
          url: "https://www.infrabox.software/authors",
        })}
      />

      <Header />

      <main className="bg-gray-50 min-h-screen">
        {/* Hero */}
        <section className="bg-white border-b border-gray-200">
          <div className="px-6 py-16 sm:py-20 max-w-3xl mx-auto text-center">
            <nav className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-8">
              <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-gray-600">Our Team</span>
            </nav>

            <h1 className="text-[32px] sm:text-[40px] font-bold text-gray-900 leading-[1.15] mb-4">
              Meet the team behind Infrabox
            </h1>
            <p className="text-base text-gray-500 leading-relaxed max-w-xl mx-auto">
              We build the email infrastructure that powers agencies and
              sales teams worldwide. Here's who makes it happen.
            </p>
          </div>
        </section>

        {/* Authors Grid */}
        <section className="bg-gray-50">
          <div className="max-w-4xl mx-auto px-6 py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {authors.map((author) => {
                return (
                  <Link
                    key={author.slug}
                    href={`/author/${author.slug}`}
                    className="group bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                  >
                    <Image
                      src={author.avatar}
                      alt={author.name}
                      width={96}
                      height={96}
                      className="w-24 h-24 rounded-full object-cover border-2 border-gray-100 mx-auto mb-4"
                    />
                    <h2 className="text-lg font-bold text-gray-900 group-hover:text-[#1240cc] transition-colors mb-0.5">
                      {author.name}
                    </h2>
                    <p className="text-sm text-[#1240cc] font-medium mb-3">
                      {author.role}
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-3">
                      {author.bio}
                    </p>
                    <div className="flex items-center justify-center pt-3 border-t border-gray-100">
                      {author.linkedin && (
                      <a
                        href={author.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[#1240cc] transition-colors"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white border-t border-gray-200">
          <div className="max-w-3xl mx-auto px-6 py-14 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Want to join the team?
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              We're building the future of email infrastructure.
            </p>
            <a
              href="mailto:hey@infrabox.software"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1240cc] text-white font-semibold rounded-lg hover:bg-[#0b34b4] transition-colors text-sm"
            >
              Get in touch
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
