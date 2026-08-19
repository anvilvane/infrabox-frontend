import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import CustomerStoriesHero from "@/components/CustomerStoriesHero";
import LinkedInPostCard from "@/components/LinkedInPostCard";
import G2ReviewCard from "@/components/G2ReviewCard";
import VideoTestimonialCard from "@/components/VideoTestimonialCard";
import { getAllCaseStudies } from "@/app/case-studies/[slug]/case-studies-data";

export const metadata = {
  title: "Customer Stories - Infrabox",
  description:
    "See how teams scale email infrastructure on Infrabox — LinkedIn love, case studies, G2 reviews, and video testimonials in one place.",
  robots: { index: false, follow: false },
};

// Real posts (subset), pulled from the LinkedIn URLs provided — see wall-of-love/page.js for the full wall.
const WALL_OF_LOVE_PREVIEW = [
  {
    name: "S. Can Timağur",
    title: "Founder, Allbound OS",
    postedAt: "4mo",
    reactions: 62,
    comments: 75,
    url: "https://www.linkedin.com/posts/cantimagur_something-most-people-dont-think-about-activity-7439614858855075840-zW-i",
    avatar: "https://media.licdn.com/dms/image/v2/D4D03AQFWuTL7A7Zw4w/profile-displayphoto-shrink_100_100/B4DZQmj5.CHYAc-/0/1735813734955?e=1788393600&v=beta&t=NcPUpiQgJ7Ku6PlOfPI3M1YWqlWsN1tlTderzpeZ9wI",
    text: "Something most people don't think about: setting up mailboxes should take seconds, not hours. That's exactly why I started paying attention to tools like Infrabox. Under 10 seconds. That's all it takes.",
  },
  {
    name: "Wesley Hoang",
    title: "Co-founder, Cymate",
    postedAt: "2mo",
    reactions: 41,
    comments: 16,
    url: "https://www.linkedin.com/posts/heywesley_i-dont-recommend-inbox-providers-unless-activity-7470125154547744770-9xvi",
    avatar: "https://media.licdn.com/dms/image/v2/D5603AQHFFqlL6CA4sw/profile-displayphoto-scale_200_200/B56Z0uKM5sH8Ac-/0/1774595920589?e=1788393600&v=beta&t=I4UGXjq5LdZpBtiRLAROsqsHgs3Lggo4RdQm0ncoV-A",
    text: "I don't recommend inbox providers unless I have used them myself. Deliverability is too important to guess on. Today we officially became a Platinum Partner.",
  },
  {
    name: "Dimitar Petkov",
    title: "Co-founder, LeadHaste",
    postedAt: "1mo",
    reactions: 10,
    comments: 2,
    url: "https://www.linkedin.com/posts/dimitar-d-petkov_your-cold-email-infrastructure-provider-isnt-activity-7476255769706024962-Mt0N",
    avatar: "https://media.licdn.com/dms/image/v2/D4E03AQFFyLxcrmPIFg/profile-displayphoto-scale_200_200/B4EZh5mYtDGYAc-/0/1754386764298?e=1788393600&v=beta&t=-R6-8pUZGbTnrr3aW8koyMATdodah4M6BQX48zNh3EE",
    text: "Your cold email infrastructure provider isn't a vendor at scale. It's load-bearing. We run 100+ active client campaigns on Infrabox — thousands of domains, millions of sends a month.",
  },
];

// Real reviews (subset), excerpted from Infrabox's G2 profile — see g2-reviews/page.js for the full wall.
const G2_REVIEWS_PREVIEW = [
  {
    name: "Harvey L.",
    title: "Founder, Legacy GTM",
    rating: 5,
    headline: "10% Reply Rate: Better Deliverability, Great Cost",
    body: "My emails are getting a 10% reply rate sending to Microsoft mailboxes — never happened before. I haven't had to worry about deliverability for the last 3 months since switching.",
  },
  {
    name: "Walter W.",
    title: "Anevo Marketing",
    rating: 5,
    headline: "Effortless Mailbox Management with Stellar Support",
    body: "Their support is very good and involved, with a dedicated rep who does biweekly calls if needed. Everything can be done start to finish in a few hours, not the one to two weeks other vendors take.",
  },
  {
    name: "Youssef H.",
    title: "Head of GTM Engineering",
    rating: 5,
    headline: "Infrabox is Our Secret Ingredient to Outbound ROI",
    body: "Their support team is incredibly helpful — someone's available 24/7 on our dedicated Slack channel. Pre-warmed infrastructure is always ready when we need to scale fast.",
  },
];

const VIDEO_TESTIMONIALS_PREVIEW = [
  { name: "Wesley Hoang", title: "Co-founder, Cymate", driveId: "11Uk81K_CWDKwJuIGRoTBhHigZlTg8Sx3", domain: "cymate.io" },
  { name: "Harvey Le", title: "Founder, Legacy GTM", driveId: "1IIK9DXlUbWQPzdUJYD3_zNZ2u4wYfkq8", domain: "legacygtm.com" },
  { name: "Samuel Weinstein", title: "CEO, TGP", driveId: "1ebQflb1Gc-XiIL0HIPTJjbMVfJsncRB9", domain: "thegrowth.pro" },
];

function SectionHeader({ eyebrow, title, description, href, cta }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
      <div>
        <span className="text-[11px] font-bold text-[#1240cc] uppercase tracking-wider">
          {eyebrow}
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{title}</h2>
        {description && (
          <p className="text-sm text-gray-500 mt-2 max-w-lg">{description}</p>
        )}
      </div>
      <Link
        href={href}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1240cc] hover:text-[#0b34b4] transition-colors shrink-0"
      >
        {cta}
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

export default function CustomerStoriesPage() {
  const caseStudies = getAllCaseStudies().slice(0, 3);

  return (
    <main>
      <CustomerStoriesHero
        eyebrow="Customer Stories"
        headlineLead="Loved by the teams who run their"
        headlineAccent="outbound on Infrabox."
        pillMode="hash"
        showTrustBar={false}
      />

      {/* Wall of Love */}
      <section id="wall-of-love" className="px-6 py-12 sm:py-14 max-w-4xl mx-auto scroll-mt-24">
        <SectionHeader
          eyebrow="LinkedIn"
          title="Wall of Love"
          description="Unfiltered posts from customers, straight from LinkedIn."
          href="/customer-stories/wall-of-love"
          cta="View the full wall"
        />
        <div className="columns-1 sm:columns-3 gap-5">
          {WALL_OF_LOVE_PREVIEW.map((post, i) => (
            <LinkedInPostCard key={i} post={post} />
          ))}
        </div>
      </section>

      {/* Case Studies */}
      <section id="case-studies" className="px-6 py-12 sm:py-14 max-w-4xl mx-auto scroll-mt-24">
        <SectionHeader
          eyebrow="In depth"
          title="Case Studies"
          description="The systems, the math, and the results behind reliable inbox placement."
          href="/customer-stories/case-studies"
          cta="View all case studies"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {caseStudies.map((study) => (
            <Link
              key={study.slug}
              href={`/case-studies/${study.slug}`}
              className="group flex flex-col rounded-2xl bg-white shadow-[0_1px_2px_rgba(18, 64, 204,0.06)] hover:shadow-[0_8px_24px_rgba(18, 64, 204,0.1)] transition-shadow duration-200 overflow-hidden"
            >
              <div className="relative h-[140px] overflow-hidden bg-gray-50">
                {study.coverImage ? (
                  <Image
                    src={study.coverImage}
                    alt={study.headline}
                    width={640}
                    height={340}
                    className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#bcd4fb] to-[#d5e4fd]" />
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col">
                {study.client?.name && (
                  <div className="text-sm font-semibold text-gray-900 mb-2">
                    {study.client.name}
                  </div>
                )}
                <p className="text-[12px] text-gray-500 leading-relaxed line-clamp-2 flex-1">
                  {study.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="g2-reviews" className="px-6 py-12 sm:py-14 max-w-4xl mx-auto scroll-mt-24">
        <SectionHeader
          eyebrow="Verified"
          title="G2 Reviews"
          description="Independently verified reviews from Infrabox customers."
          href="/customer-stories/g2-reviews"
          cta="Read all reviews"
        />
        <div className="columns-1 sm:columns-3 gap-5 mb-8">
          {G2_REVIEWS_PREVIEW.map((review, i) => (
            <G2ReviewCard key={i} review={review} />
          ))}
        </div>
        <div className="flex justify-center">
        </div>
      </section>

      {/* Video Testimonials */}
      <section id="video-testimonials" className="px-6 py-12 sm:py-14 max-w-4xl mx-auto scroll-mt-24">
        <SectionHeader
          eyebrow="Watch"
          title="Video Testimonials"
          description="Customers talking through how Infrabox changed their outbound infrastructure."
          href="/customer-stories/video-testimonials"
          cta="Watch all videos"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {VIDEO_TESTIMONIALS_PREVIEW.map((video, i) => (
            <VideoTestimonialCard key={i} video={video} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20 max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl px-6 sm:px-10 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Ready to build your infrastructure?
            </h2>
            <p className="text-sm text-gray-500">
              Plans from $39/mo with 10 mailboxes included. No platform fee.
              Setup in under 10 minutes.
            </p>
          </div>
          <a
            href="https://app.infrabox.software/signup"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1240cc] text-white font-semibold rounded-full hover:bg-[#0b34b4] transition-colors text-sm shrink-0"
          >
            Get Started
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>
    </main>
  );
}
