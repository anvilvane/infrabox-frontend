import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAuthorByName } from "@/lib/authors";
import LearnToc from "@/components/learn/LearnToc";
import { LearnFaq, LearnCodeBlock } from "@/components/learn";
import {
  JsonLd,
  createBreadcrumbSchema,
  createArticleSchema,
  createToolFaqSchema,
  createReviewSchema,
} from "@/components/seo/json-ld";
import {
  getLearnArticle,
  getAllLearnSlugs,
  getRelatedPosts,
} from "./learn-data";
import { outboundRel } from "@/lib/outbound-links";

/** Convert inline markdown (bold, code, links, italic, strikethrough) to HTML */
function md(text) {
  return text
    .replace(
      /\[(.+?)\]\((.+?)\)/g,
      (_m, label, href) => {
        // Only Infrabox and case-study partner sites are dofollow.
        const rel = outboundRel(href);
        return `<a href="${href}" class="text-[#1240cc] hover:underline" target="_blank" rel="${rel}">${label}</a>`;
      }
    )
    .replace(
      /\*\*(.+?)\*\*/g,
      '<strong class="text-gray-900">$1</strong>'
    )
    .replace(
      /(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g,
      '<em>$1</em>'
    )
    .replace(
      /~~(.+?)~~/g,
      '<del class="text-gray-400">$1</del>'
    )
    .replace(
      /`(.+?)`/g,
      '<code class="font-mono text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">$1</code>'
    );
}

/** Known platform name → domain mapping for table header icons */
const PLATFORM_DOMAINS = {
  infrabox: "infrabox.software", mailforge: "mailforge.ai", primeforge: "primeforge.ai",
  infraforge: "infraforge.ai", zapmail: "zapmail.ai", maildoso: "maildoso.com",
  cheapinboxes: "cheapinboxes.com", inframail: "inframail.io", mailreef: "mailreef.com",
  hypertide: "hypertide.io", instantly: "instantly.ai", smartlead: "smartlead.ai",
  hypergen: "hypergen.ai", mailpool: "mailpool.com",
};

/** Extract plain platform name from header cell (strip markdown bold) */
function getPlatformIcon(cellText) {
  const plain = cellText.replace(/\*\*/g, "").trim().toLowerCase();
  const domain = PLATFORM_DOMAINS[plain];
  if (!domain) return null;
  if (plain === "infrabox") return { src: "/logo.png", isInfrabox: true };
  return { src: `/images/compare/logos/${plain}.png`, isInfrabox: false };
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
      const closingIdx = lines.findIndex(
        (l, i) => i > 0 && l.trim() === "```"
      );
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

/* Deep, rich gradients per category (matching listing page) */
const CARD_GRADIENTS = {
  Guides: "from-blue-600 via-indigo-700 to-blue-800",
  Comparisons: "from-amber-600 via-orange-700 to-amber-800",
  Reviews: "from-violet-600 via-purple-700 to-violet-800",
  Alternatives: "from-emerald-600 via-teal-700 to-emerald-800",
  Pricing: "from-orange-600 via-red-700 to-orange-800",
  Educational: "from-sky-600 via-blue-700 to-sky-800",
  Solutions: "from-rose-600 via-pink-700 to-rose-800",
};

const TAG_STYLE = {
  Guides:       "bg-[#1240cc]/10 text-[#1240cc]",
  Comparisons:  "bg-amber-100 text-amber-700",
  Reviews:      "bg-violet-100 text-violet-700",
  Alternatives: "bg-emerald-100 text-emerald-700",
  Pricing:      "bg-orange-100 text-orange-700",
  Educational:  "bg-sky-100 text-sky-700",
  Solutions:    "bg-rose-100 text-rose-700",
};
const CTA_LABEL = {
  Guides: "Read guide", Comparisons: "View comparison", Reviews: "Read review",
  Alternatives: "Explore options", Pricing: "See breakdown", Educational: "Learn more", Solutions: "Read solution",
};

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
  return getAllLearnSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getLearnArticle(slug);
  if (!post) return {};

  return {
    // metaTitle, when set, is the exact final <title> — bypasses the root
    // layout's "%s | Infrabox" template (used to keep long titles under length).
    title: post.metaTitle ? { absolute: post.metaTitle } : post.title,
    description: post.metaDescription,
    keywords: post.tags,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription,
      url: `https://www.infrabox.software/learn/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      // Only emit an author when the article actually has a byline. Pages that
      // double as evergreen product explainers leave `author` blank on purpose.
      ...(post.author ? { authors: [post.author] } : {}),
      tags: post.tags,
      section: post.category,
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle || post.title,
      description: post.metaDescription,
    },
    alternates: {
      canonical: `https://www.infrabox.software/learn/${post.slug}`,
    },
  };
}

export default async function LearnPostPage({ params }) {
  const { slug } = await params;
  const post = getLearnArticle(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(slug);
  const authorData = getAuthorByName(post.author);

  const articleImage = `https://www.infrabox.software/learn/${post.slug}/opengraph-image`;

  const articleSchema = createArticleSchema({
    headline: post.title,
    description: post.metaDescription,
    url: `https://www.infrabox.software/learn/${post.slug}`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: post.author,
    image: articleImage,
    keywords: post.tags,
  });

  // Review schema for review-type articles
  const isReview =
    post.category?.toLowerCase() === "reviews" ||
    post.category?.toLowerCase() === "review" ||
    (post.type && post.type.includes("review"));
  const reviewSchema = isReview
    ? createReviewSchema({
        name: post.headline,
        description: post.metaDescription,
        url: `https://www.infrabox.software/learn/${post.slug}`,
        author: post.author,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        ratingValue: post.overallRating || undefined,
        itemReviewed: post.itemReviewed || undefined,
      })
    : null;

  // HowTo schema intentionally removed: Google deprecated HowTo rich results, and the
  // steps were auto-extracted from section first-sentences (low quality). See SEO audit.

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
          { name: "Learn", url: "https://www.infrabox.software/learn" },
          {
            name: post.headline,
            url: `https://www.infrabox.software/learn/${post.slug}`,
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
      {reviewSchema && <JsonLd data={reviewSchema} />}

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
                    href="/learn"
                    className="hover:text-[#1240cc] transition-colors"
                  >
                    Learn
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

                <h1 className="text-[28px] sm:text-[36px] md:text-[42px] font-semibold text-gray-900 leading-[1.2] mb-6">
                  {post.headline}
                </h1>

                {/* Author + meta row. Rendered only when the article declares an
                    author. Articles with a blank `author` (evergreen product
                    explainers promoted out of the blog, e.g. what-is-infrabox)
                    render with no byline at all. */}
                {post.author && (
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-3">
                    {authorData ? (
                      <Image
                        src={authorData.avatar}
                        alt={authorData.name}
                        width={36}
                        height={36}
                        className="w-9 h-9 rounded-full object-cover border border-gray-200"
                      />
                    ) : post.authorImage ? (
                      <Image
                        src={post.authorImage}
                        alt={post.author}
                        width={36}
                        height={36}
                        className="w-9 h-9 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[#1240cc]/10 flex items-center justify-center border border-gray-200">
                        <Image
                          src="/logo.png"
                          alt="Infrabox"
                          width={20}
                          height={20}
                          className="w-5 h-5"
                        />
                      </div>
                    )}
                    <div>
                      {authorData ? (
                        <Link
                          href={`/author/${authorData.slug}`}
                          className="text-sm font-medium text-[#1240cc] block leading-none hover:underline"
                        >
                          By {post.author}
                        </Link>
                      ) : (
                        <span className="text-sm font-medium text-[#1240cc] block leading-none">
                          By {post.author}
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        Published on:{" "}
                        {new Date(post.publishedAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                        {post.updatedAt &&
                          post.updatedAt !== post.publishedAt && (
                            <>
                              {" "}
                              &middot; Updated:{" "}
                              {new Date(post.updatedAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </>
                          )}
                        {" "}&middot;{" "}{post.readingTime}
                        {" "}&middot;{" "}Last reviewed:{" "}
                        {new Date(post.updatedAt).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "short" }
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                )}
              </div>
            </article>

            {/* Screenshots */}
            {post.screenshots && post.screenshots.length > 0 && (
              <section className="bg-gray-50 border-b border-gray-200">
                <div className="px-6 lg:px-12 py-10 max-w-3xl">
                  {post.screenshots.map((screenshot) => (
                    <figure key={screenshot.src} className="mb-8 last:mb-0">
                      <div className="border border-gray-200 bg-white overflow-hidden rounded-lg shadow-sm">
                        <Image src={screenshot.src} alt={screenshot.alt} width={1280} height={800} className="w-full h-auto" />
                      </div>
                      <figcaption className="mt-3 text-xs text-gray-500 leading-relaxed italic">{screenshot.caption}</figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            )}

            {/* TL;DR */}
            <section className="bg-white border-b border-gray-200 scroll-mt-4" data-speakable="true">
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
                      {splitContentBlocks(section.content).map(
                        (paragraph, j) => {
                          // Code blocks
                          if (paragraph.startsWith("```")) {
                            const lines = paragraph.split("\n");
                            const lang = lines[0]
                              .replace("```", "")
                              .trim();
                            const codeLines = lines.slice(1);
                            if (
                              codeLines.length > 0 &&
                              codeLines[codeLines.length - 1].trim() ===
                                "```"
                            ) {
                              codeLines.pop();
                            }
                            const cleaned = codeLines.reduce(
                              (acc, line) => {
                                if (
                                  line.trim() === "" &&
                                  acc.length > 0 &&
                                  acc[acc.length - 1].trim() === ""
                                )
                                  return acc;
                                acc.push(line);
                                return acc;
                              },
                              []
                            );
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
                            const items = paragraph.split(
                              /\n(?=\d+\.\s)/
                            );
                            return (
                              <ol key={j} className="list-none space-y-3">
                                {items.map((item, k) => {
                                  const match = item.match(
                                    /^(\d+)\.\s([\s\S]*)/
                                  );
                                  if (!match) return null;
                                  return (
                                    <li
                                      key={k}
                                      className="flex gap-3"
                                    >
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
                                        __html: md(
                                          item.replace(/^- /, "")
                                        ),
                                      }}
                                    />
                                  </li>
                                ))}
                              </ul>
                            );
                          }

                          // Markdown tables
                          if (
                            paragraph.startsWith("|") &&
                            paragraph.includes("\n|")
                          ) {
                            const rows = paragraph
                              .split("\n")
                              .filter((r) => r.trim().startsWith("|"));
                            const headerCells = rows[0]
                              .split("|")
                              .filter(Boolean)
                              .map((c) => c.trim());
                            const dataRows = rows.slice(2);
                            return (
                              <div
                                key={j}
                                className="overflow-x-auto rounded-lg border border-gray-200"
                              >
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="bg-gray-50">
                                      {headerCells.map((cell, ci) => {
                                        const icon = getPlatformIcon(cell);
                                        const cleanText = cell.replace(/\*\*/g, "").trim();
                                        return (
                                          <th
                                            key={ci}
                                            className="px-4 py-2.5 text-left font-semibold text-gray-700 border-b border-gray-200 whitespace-nowrap"
                                          >
                                            <span className="inline-flex items-center gap-1.5">
                                              {icon && (
                                                <img
                                                  src={icon.src}
                                                  alt=""
                                                  className="w-3.5 h-3.5 rounded-sm object-contain"
                                                />
                                              )}
                                              {icon ? cleanText : <span dangerouslySetInnerHTML={{ __html: md(cell) }} />}
                                            </span>
                                          </th>
                                        );
                                      })}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {dataRows.map((row, ri) => {
                                      const cells = row
                                        .split("|")
                                        .filter(Boolean)
                                        .map((c) => c.trim());
                                      return (
                                        <tr
                                          key={ri}
                                          className={
                                            ri % 2 === 0
                                              ? "bg-white"
                                              : "bg-gray-50/50"
                                          }
                                        >
                                          {cells.map((cell, ci) => (
                                            <td
                                              key={ci}
                                              className="px-4 py-2 text-gray-600 border-b border-gray-100"
                                              dangerouslySetInnerHTML={{
                                                __html: md(cell),
                                              }}
                                            />
                                          ))}
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
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
                            const imgMatch = paragraph.trim().match(/^!\[(.+?)\]\((.+?)\)(?:\s*\n(.+))?/);
                            if (imgMatch) {
                              return (
                                <figure key={j} className="my-2">
                                  <div className="border border-gray-200 bg-white overflow-hidden rounded-lg shadow-sm">
                                    <Image src={imgMatch[2]} alt={imgMatch[1]} width={1200} height={675} className="w-full h-auto" />
                                  </div>
                                  {imgMatch[3] && (
                                    <figcaption className="mt-2 text-xs text-gray-500 leading-relaxed italic">{imgMatch[3]}</figcaption>
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
                                __html: md(paragraph).replace(
                                  /\n- /g,
                                  "<br/>- "
                                ),
                              }}
                            />
                          );
                        }
                      )}
                    </div>

                    {/* Section images */}
                    {section.images && section.images.length > 0 && (
                      <div className="mt-6 space-y-6">
                        {section.images.map((img, imgIdx) => (
                          <figure key={imgIdx}>
                            <div className="border border-gray-200 bg-white overflow-hidden rounded-lg shadow-sm">
                              <Image src={img.src} alt={img.alt} width={1200} height={675} className="w-full h-auto" />
                            </div>
                            {img.caption && (
                              <figcaption className="mt-2 text-xs text-gray-500 leading-relaxed italic">{img.caption}</figcaption>
                            )}
                          </figure>
                        ))}
                      </div>
                    )}

                    {/* Callout */}
                    {section.callout && (
                      <Callout
                        variant={section.callout.variant}
                        title={section.callout.title}
                        text={section.callout.text}
                      />
                    )}

                    {/* Pros/Cons */}
                    {section.proscons && (
                      <ProsCons
                        pros={section.proscons.pros}
                        cons={section.proscons.cons}
                      />
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
                      const domain = source.url ? source.url.replace(/^https?:\/\//, "").split("/")[0] : "";
                      const favicon = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=32` : null;
                      return (
                        <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                          <span className="font-mono text-xs text-gray-400 mt-0.5 shrink-0 w-5 h-5 bg-gray-100 rounded flex items-center justify-center">
                            {i + 1}
                          </span>
                          {favicon && (
                            <img src={favicon} alt="" className="h-4 w-4 mt-0.5 shrink-0 rounded-sm object-contain" />
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
                              <strong className="text-gray-700">{source.title}</strong>
                            )}
                            {source.date ? (
                              <span className="text-gray-400 ml-1">({source.date})</span>
                            ) : null}
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </section>
            )}

            {/* Related Posts - Gradient card style */}
            {relatedPosts.length > 0 && (
              <section className="bg-gray-50 border-b border-gray-200">
                <div className="px-6 lg:px-12 py-10 lg:py-12 max-w-3xl">
                  <h2 className="text-[20px] sm:text-[24px] font-semibold text-gray-900 leading-[1.2] mb-6">
                    Related articles
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {relatedPosts.map((related) => {
                      const tag = TAG_STYLE[related.category] || TAG_STYLE.Guides;
                      const cta = CTA_LABEL[related.category] || "Read more";
                      return (
                        <Link
                          key={related.slug}
                          href={`/learn/${related.slug}`}
                          className="group flex flex-col rounded-xl border border-gray-200/80 hover:border-[#1240cc]/20 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
                        >
                          {/* Pastel green mesh thumbnail */}
                          <div className="relative h-[130px] overflow-hidden">
                            <div className="absolute inset-0 bg-[#e8f0fe]">
                              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                  <filter id={`r-${related.slug}`} x="-50%" y="-50%" width="200%" height="200%">
                                    <feGaussianBlur in="SourceGraphic" stdDeviation="50" />
                                  </filter>
                                </defs>
                                <ellipse cx="340" cy="30" rx="150" ry="100" fill="#bcd4fb" opacity="0.9" filter={`url(#r-${related.slug})`} />
                                <ellipse cx="60" cy="170" rx="130" ry="90" fill="#d5e4fd" opacity="0.8" filter={`url(#r-${related.slug})`} />
                                <ellipse cx="200" cy="90" rx="100" ry="80" fill="#a9c6fa" opacity="0.6" filter={`url(#r-${related.slug})`} />
                              </svg>
                            </div>
                            <div className="relative z-10 h-full p-4 flex flex-col justify-between">
                              <div className="flex items-center justify-between">
                                <img src="/logo.png" alt="" aria-hidden="true" className="h-5 w-auto opacity-30" />
                                <span className={`inline-flex px-2 py-0.5 rounded-md text-[9px] font-semibold uppercase tracking-wider ${tag}`}>
                                  {related.category}
                                </span>
                              </div>
                              <h3 className="text-[13px] font-semibold text-[#1240cc] leading-snug line-clamp-2">
                                {related.title}
                              </h3>
                            </div>
                          </div>
                          <div className="px-4 pt-3 pb-0 flex-1 flex flex-col">
                            <p className="text-[12px] text-gray-500 leading-relaxed line-clamp-2 flex-1">
                              {related.excerpt}
                            </p>
                          </div>
                          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                            {/* Related cards carry the Infrabox mark rather than a personal
                                byline — the article itself credits its author. */}
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-5 h-5 rounded-full bg-[#1240cc]/10 flex items-center justify-center shrink-0">
                                <Image src="/logo.png" alt="" aria-hidden="true" width={12} height={12} className="w-3 h-3" />
                              </div>
                              <span className="text-[11px] text-gray-500 truncate">Infrabox</span>
                            </div>
                            <span className="text-[11px] font-semibold text-[#1240cc] group-hover:translate-x-0.5 transition-transform whitespace-nowrap flex items-center gap-1">
                              {cta}
                              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* CTA */}
            <section className="bg-[#1240cc]">
              <div className="px-6 lg:px-12 py-14 lg:py-20 flex flex-col items-center text-center">
                <h2 className="text-[24px] sm:text-[32px] font-bold text-white leading-tight mb-3">
                  Ready to set up your infrastructure?
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
                    href="/learn"
                    className="inline-flex items-center gap-2 border border-white/30 text-white font-medium px-8 py-3 rounded-lg hover:bg-white/10 transition-colors text-sm"
                  >
                    Browse all guides
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

/* --- Inline Components ------------------------------------------------- */

function Callout({ variant, title, text }) {
  const styles = {
    tip: {
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      titleColor: "text-emerald-800",
      textColor: "text-emerald-700",
      icon: (
        <svg
          className="w-4 h-4 text-emerald-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
    },
    warning: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      titleColor: "text-amber-800",
      textColor: "text-amber-700",
      icon: (
        <svg
          className="w-4 h-4 text-amber-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      titleColor: "text-blue-800",
      textColor: "text-blue-700",
      icon: (
        <svg
          className="w-4 h-4 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    verdict: {
      bg: "bg-[#1240cc]/5",
      border: "border-[#1240cc]/20",
      titleColor: "text-[#1240cc]",
      textColor: "text-gray-700",
      icon: (
        <svg
          className="w-4 h-4 text-[#1240cc]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  };

  const s = styles[variant] || styles.info;

  return (
    <div className={`mt-6 ${s.bg} border ${s.border} rounded-lg p-5`}>
      <div className="flex items-center gap-2 mb-2">
        {s.icon}
        <p
          className={`text-xs font-semibold ${s.titleColor} uppercase tracking-wider`}
        >
          {title}
        </p>
      </div>
      <p className={`text-sm ${s.textColor} leading-relaxed`}>{text}</p>
    </div>
  );
}

function ProsCons({ pros, cons }) {
  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Pros */}
      <div className="border border-emerald-200 bg-emerald-50/50 rounded-lg p-5">
        <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-3">
          Pros
        </p>
        <ul className="space-y-2">
          {pros.map((pro, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-gray-700"
            >
              <svg
                className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>{pro}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Cons */}
      <div className="border border-red-200 bg-red-50/50 rounded-lg p-5">
        <p className="text-xs font-semibold text-red-700 uppercase tracking-wider mb-3">
          Cons
        </p>
        <ul className="space-y-2">
          {cons.map((con, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-gray-700"
            >
              <svg
                className="w-4 h-4 text-red-400 mt-0.5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span>{con}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
