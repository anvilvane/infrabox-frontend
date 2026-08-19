import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import LearnToc from "@/components/learn/LearnToc";
import { LearnFaq, LearnCodeBlock } from "@/components/learn";
import {
  JsonLd,
  createBreadcrumbSchema,
  createArticleSchema,
  createToolFaqSchema,
} from "@/components/seo/json-ld";
import {
  getCaseStudy,
  getAllCaseStudySlugs,
  getRelatedCaseStudies,
} from "./case-studies-data";
import { outboundRel } from "@/lib/outbound-links";

/** Convert inline markdown (bold, code, links, italic, strikethrough) to HTML */
function md(text) {
  return text
    .replace(/\[(.+?)\]\((.+?)\)/g, (_m, label, href) => {
      // Only Infrabox and case-study partner sites are dofollow.
      const rel = outboundRel(href);
      return `<a href="${href}" class="text-[#1240cc] hover:underline" target="_blank" rel="${rel}">${label}</a>`;
    })
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-gray-900">$1</strong>')
    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<em>$1</em>")
    .replace(/~~(.+?)~~/g, '<del class="text-gray-400">$1</del>')
    .replace(
      /`(.+?)`/g,
      '<code class="font-mono text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">$1</code>'
    );
}

/** Split content into blocks, keeping code fences (``` ... ```) as single blocks */
function splitContentBlocks(content) {
  const blocks = [];
  const parts = content.split("\n\n");
  let inCode = false;
  let codeBuffer = [];

  for (const part of parts) {
    if (!inCode && part.startsWith("```")) {
      inCode = true;
      codeBuffer = [part];
      const lines = part.split("\n");
      const closingIdx = lines.findIndex((l, i) => i > 0 && l.trim() === "```");
      if (closingIdx > 0) {
        inCode = false;
        blocks.push(codeBuffer.join("\n"));
        codeBuffer = [];
      }
    } else if (inCode) {
      codeBuffer.push(part);
      if (part.includes("```") && !part.startsWith("```")) {
        inCode = false;
        blocks.push(codeBuffer.join("\n"));
        codeBuffer = [];
      } else if (part.trim() === "```") {
        inCode = false;
        blocks.push(codeBuffer.join("\n"));
        codeBuffer = [];
      }
    } else {
      blocks.push(part);
    }
  }

  if (codeBuffer.length > 0) {
    blocks.push(codeBuffer.join("\n"));
  }

  return blocks;
}

export function generateStaticParams() {
  return getAllCaseStudySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getCaseStudy(slug);
  if (!post) return {};

  return {
    title: post.metaTitle ? { absolute: post.metaTitle } : post.title,
    description: post.metaDescription,
    keywords: post.tags,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription,
      url: `https://www.infrabox.software/case-studies/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author || "Infrabox"],
      tags: post.tags,
      section: post.category,
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle || post.title,
      description: post.metaDescription,
    },
    alternates: {
      canonical: `https://www.infrabox.software/case-studies/${post.slug}`,
    },
  };
}

export default async function CaseStudyPage({ params }) {
  const { slug } = await params;
  const post = getCaseStudy(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedCaseStudies(slug);

  const articleImage = `https://www.infrabox.software/case-studies/${post.slug}/opengraph-image`;

  // Case studies carry no personal byline; attribute the Article schema to the
  // publisher (Infrabox) unless the data explicitly sets an author.
  const schemaAuthor = post.author || "Infrabox";

  const articleSchema = createArticleSchema({
    headline: post.title,
    description: post.metaDescription,
    url: `https://www.infrabox.software/case-studies/${post.slug}`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: schemaAuthor,
    image: articleImage,
    keywords: post.tags,
  });

  // Build ToC items
  const tocItems = [];
  for (const s of post.sections) {
    tocItems.push({
      id: s.heading
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
      label: s.heading,
    });
  }
  if (post.faqs && post.faqs.length > 0) {
    tocItems.push({ id: "faq", label: "FAQ" });
  }
  if (post.sources && post.sources.length > 0) {
    tocItems.push({ id: "sources", label: "Sources" });
  }

  return (
    <>
      <JsonLd
        data={createBreadcrumbSchema([
          { name: "Home", url: "https://www.infrabox.software" },
          { name: "Customer Stories", url: "https://www.infrabox.software/customer-stories" },
          { name: "Case Studies", url: "https://www.infrabox.software/customer-stories/case-studies" },
          {
            name: post.headline,
            url: `https://www.infrabox.software/case-studies/${post.slug}`,
          },
        ])}
      />
      <JsonLd data={articleSchema} />
      {post.faqs && post.faqs.length > 0 && (
        <JsonLd
          data={createToolFaqSchema(
            post.faqs.map((faq) => ({
              question: faq.question,
              answer: faq.answer,
            }))
          )}
        />
      )}

      <main className="bg-gray-50 min-h-screen">
        {/* Two-column layout */}
        <div className="flex max-w-6xl mx-auto">
          {/* Sidebar - TOC */}
          <aside className="hidden lg:block w-[280px] shrink-0 border-r border-gray-200 bg-white relative">
            <div className="sticky top-0 h-screen overflow-y-auto cs-scrollbar">
              <div className="p-6">
                <LearnToc items={tocItems} />
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <article className="bg-white border-b border-gray-200">
              <div className="px-6 lg:px-12 py-10 lg:py-12 max-w-3xl">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
                  <Link
                    href="/customer-stories/case-studies"
                    className="hover:text-[#1240cc] transition-colors"
                  >
                    Case Studies
                  </Link>
                  <svg
                    className="w-3 h-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      d="M9 18l6-6-6-6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-gray-500">{post.category}</span>
                </div>

                {/* Client badge */}
                {post.client && (
                  <div className="inline-flex items-center gap-2.5 mb-5 px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50">
                    {post.client.logo && (
                      <Image
                        src={post.client.logo}
                        alt={post.client.name}
                        width={20}
                        height={20}
                        className="w-5 h-5 rounded object-contain"
                      />
                    )}
                    <span className="text-xs font-medium text-gray-700">
                      {post.client.name}
                    </span>
                    {post.client.industry && (
                      <>
                        <span className="text-gray-300">&middot;</span>
                        <span className="text-xs text-gray-400">
                          {post.client.industry}
                        </span>
                      </>
                    )}
                  </div>
                )}

                <h1 className="text-[28px] sm:text-[36px] md:text-[42px] font-semibold text-gray-900 leading-[1.2] mb-6">
                  {post.headline}
                </h1>

                {/* Meta row — case studies have no personal author byline;
                    attribution lives as an author note inside the content. */}
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>
                    Published on:{" "}
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  {post.updatedAt && post.updatedAt !== post.publishedAt && (
                    <span>
                      &middot; Updated:{" "}
                      {new Date(post.updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                  {post.readingTime && (
                    <span>&middot; {post.readingTime}</span>
                  )}
                </div>

                {/* Results strip */}
                {post.results && post.results.length > 0 && (
                  <div className="mt-8 grid grid-cols-3 gap-3">
                    {post.results.map((r, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-gray-200 bg-gray-50/60 px-4 py-4 text-center"
                      >
                        <div className="text-[22px] sm:text-[26px] font-bold text-[#1240cc] leading-none">
                          {r.metric}
                        </div>
                        <div className="mt-1.5 text-[11px] text-gray-500 leading-tight">
                          {r.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </article>

            {/* TL;DR */}
            <section
              className="bg-white border-b border-gray-200 scroll-mt-4"
              data-speakable="true"
            >
              <div className="px-6 lg:px-12 py-10 lg:py-12 max-w-3xl">
                <div className="bg-[#1240cc]/5 border border-[#1240cc]/10 rounded-lg p-5">
                  <p className="text-xs font-semibold text-[#1240cc] uppercase tracking-wider mb-2">
                    TL;DR
                  </p>
                  <p className="text-[15px] text-gray-700 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>
            </section>

            {/* Content sections */}
            {post.sections.map((section) => {
              const sectionId = section.heading
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");
              return (
                <section
                  key={section.heading}
                  id={sectionId}
                  className="bg-white border-b border-gray-200 scroll-mt-4"
                >
                  <div className="px-6 lg:px-12 py-10 lg:py-12 max-w-3xl">
                    <h2 className="text-[20px] sm:text-[24px] font-semibold text-gray-900 leading-[1.2] mb-6">
                      {section.heading}
                    </h2>
                    <div className="text-gray-600 text-base leading-relaxed space-y-4">
                      {splitContentBlocks(section.content).map((paragraph, j) => {
                        // Code blocks
                        if (paragraph.startsWith("```")) {
                          const lines = paragraph.split("\n");
                          const lang = lines[0].replace("```", "").trim();
                          const codeLines = lines.slice(1);
                          if (
                            codeLines.length > 0 &&
                            codeLines[codeLines.length - 1].trim() === "```"
                          ) {
                            codeLines.pop();
                          }
                          const cleaned = codeLines.reduce((acc, line) => {
                            if (
                              line.trim() === "" &&
                              acc.length > 0 &&
                              acc[acc.length - 1].trim() === ""
                            )
                              return acc;
                            acc.push(line);
                            return acc;
                          }, []);
                          return (
                            <LearnCodeBlock
                              key={j}
                              code={cleaned.join("\n")}
                              lang={lang}
                            />
                          );
                        }

                        // Numbered lists (1. 2. 3.)
                        if (/^\d+\.\s/.test(paragraph)) {
                          const items = paragraph.split(/\n(?=\d+\.\s)/);
                          return (
                            <ol key={j} className="list-none space-y-3">
                              {items.map((item, k) => {
                                const match = item.match(/^(\d+)\.\s([\s\S]*)/);
                                if (!match) return null;
                                return (
                                  <li key={k} className="flex gap-3">
                                    <span className="font-mono text-xs text-[#1240cc] font-semibold mt-0.5 shrink-0 w-5 h-5 bg-[#1240cc]/10 rounded flex items-center justify-center">
                                      {match[1]}
                                    </span>
                                    <span
                                      dangerouslySetInnerHTML={{
                                        __html: md(match[2]),
                                      }}
                                    />
                                  </li>
                                );
                              })}
                            </ol>
                          );
                        }

                        // Bullet lists
                        if (
                          paragraph.startsWith("- ") ||
                          paragraph.includes("\n- ")
                        ) {
                          const items = paragraph
                            .split("\n")
                            .filter((l) => l.startsWith("- "));
                          return (
                            <ul key={j} className="space-y-2">
                              {items.map((item, k) => (
                                <li
                                  key={k}
                                  className="flex items-start gap-2.5 text-gray-600"
                                >
                                  <span className="w-1.5 h-1.5 bg-[#1240cc] rounded-full mt-2 shrink-0" />
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: md(item.replace(/^- /, "")),
                                    }}
                                  />
                                </li>
                              ))}
                            </ul>
                          );
                        }

                        // Blockquotes (> text)
                        if (paragraph.startsWith("> ")) {
                          const quoteText = paragraph
                            .split("\n")
                            .map((l) => l.replace(/^>\s?/, ""))
                            .join("\n");
                          return (
                            <blockquote
                              key={j}
                              className="border-l-3 border-[#1240cc]/30 pl-4 py-1 text-gray-500 italic"
                              dangerouslySetInnerHTML={{
                                __html: md(quoteText),
                              }}
                            />
                          );
                        }

                        // Inline images ![alt](src)
                        if (/^!\[.*?\]\(.*?\)/.test(paragraph.trim())) {
                          const imgMatch = paragraph
                            .trim()
                            .match(/^!\[(.+?)\]\((.+?)\)(?:\s*\n(.+))?/);
                          if (imgMatch) {
                            return (
                              <figure key={j} className="my-2">
                                <div className="border border-gray-200 bg-white overflow-hidden rounded-lg shadow-sm">
                                  <Image
                                    src={imgMatch[2]}
                                    alt={imgMatch[1]}
                                    width={1200}
                                    height={675}
                                    className="w-full h-auto"
                                  />
                                </div>
                                {imgMatch[3] && (
                                  <figcaption className="mt-2 text-xs text-gray-500 leading-relaxed italic">
                                    {imgMatch[3]}
                                  </figcaption>
                                )}
                              </figure>
                            );
                          }
                        }

                        // Regular paragraph
                        return (
                          <p
                            key={j}
                            dangerouslySetInnerHTML={{
                              __html: md(paragraph).replace(/\n- /g, "<br/>- "),
                            }}
                          />
                        );
                      })}
                    </div>

                    {/* Section images */}
                    {section.images && section.images.length > 0 && (
                      <div className="mt-6 space-y-6">
                        {section.images.map((img, imgIdx) => (
                          <figure key={imgIdx}>
                            <div className="border border-gray-200 bg-white overflow-hidden rounded-lg shadow-sm">
                              <Image
                                src={img.src}
                                alt={img.alt}
                                width={1200}
                                height={675}
                                className="w-full h-auto"
                              />
                            </div>
                            {img.caption && (
                              <figcaption className="mt-2 text-xs text-gray-500 leading-relaxed italic">
                                {img.caption}
                              </figcaption>
                            )}
                          </figure>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              );
            })}

            {/* FAQs */}
            {post.faqs && post.faqs.length > 0 && (
              <section
                id="faq"
                data-speakable="true"
                className="bg-white border-b border-gray-200 scroll-mt-4"
              >
                <div className="px-6 lg:px-12 py-10 lg:py-12 max-w-3xl">
                  <h2 className="text-[20px] sm:text-[24px] font-semibold text-gray-900 leading-[1.2] mb-6">
                    Frequently Asked Questions
                  </h2>
                  <LearnFaq items={post.faqs} />
                </div>
              </section>
            )}

            {/* Sources & References */}
            {post.sources && post.sources.length > 0 && (
              <section
                id="sources"
                className="bg-white border-b border-gray-200 scroll-mt-4"
              >
                <div className="px-6 lg:px-12 py-10 lg:py-12 max-w-3xl">
                  <h2 className="text-[20px] sm:text-[24px] font-semibold text-gray-900 leading-[1.2] mb-6">
                    Sources & References
                  </h2>
                  <ol className="space-y-3">
                    {post.sources.map((source, i) => {
                      const domain = source.url
                        ? source.url.replace(/^https?:\/\//, "").split("/")[0]
                        : "";
                      const favicon = domain
                        ? `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
                        : null;
                      return (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-sm text-gray-600"
                        >
                          <span className="font-mono text-xs text-gray-400 mt-0.5 shrink-0 w-5 h-5 bg-gray-100 rounded flex items-center justify-center">
                            {i + 1}
                          </span>
                          {favicon && (
                            <img
                              src={favicon}
                              alt=""
                              className="h-4 w-4 mt-0.5 shrink-0 rounded-sm object-contain"
                            />
                          )}
                          <span>
                            {source.url ? (
                              <a
                                href={source.url}
                                className="text-gray-700 hover:text-[#1240cc] hover:underline font-medium"
                                target="_blank"
                                rel={outboundRel(source.url)}
                              >
                                {source.title}
                              </a>
                            ) : (
                              <strong className="text-gray-700">
                                {source.title}
                              </strong>
                            )}
                            {source.date ? (
                              <span className="text-gray-400 ml-1">
                                ({source.date})
                              </span>
                            ) : null}
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </section>
            )}

            {/* Related case studies */}
            {relatedPosts.length > 0 && (
              <section className="bg-gray-50 border-b border-gray-200">
                <div className="px-6 lg:px-12 py-10 lg:py-12 max-w-3xl">
                  <h2 className="text-[20px] sm:text-[24px] font-semibold text-gray-900 leading-[1.2] mb-6">
                    More case studies
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {relatedPosts.map((related) => (
                      <Link
                        key={related.slug}
                        href={`/case-studies/${related.slug}`}
                        className="group flex flex-col rounded-xl border border-gray-200/80 hover:border-[#1240cc]/20 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-0.5 transition-all duration-200 p-5"
                      >
                        <span className="inline-flex w-fit px-2 py-0.5 rounded-md text-[9px] font-semibold uppercase tracking-wider bg-[#1240cc]/10 text-[#1240cc] mb-3">
                          {related.category}
                        </span>
                        <h3 className="text-[14px] font-semibold text-gray-900 leading-snug mb-2 group-hover:text-[#1240cc]">
                          {related.title}
                        </h3>
                        <p className="text-[12px] text-gray-500 leading-relaxed line-clamp-3">
                          {related.excerpt}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* CTA */}
            <section className="bg-[#1240cc]">
              <div className="px-6 lg:px-12 py-14 lg:py-20 flex flex-col items-center text-center">
                <h2 className="text-[24px] sm:text-[32px] font-bold text-white leading-tight mb-3">
                  Ready to build infrastructure that scales?
                </h2>
                <p className="text-white/70 text-base max-w-md mb-8 leading-relaxed">
                  Plans from $39/mo with 10 mailboxes included. Automated DNS, warmup,
                  and InfraGuard monitoring included.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <a
                    href="https://app.infrabox.software/signup"
                    className="inline-flex items-center gap-2 bg-white text-[#1240cc] font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors text-sm"
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
                  <Link
                    href="/customer-stories/case-studies"
                    className="inline-flex items-center gap-2 border border-white/30 text-white font-medium px-8 py-3 rounded-lg hover:bg-white/10 transition-colors text-sm"
                  >
                    Browse all case studies
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
