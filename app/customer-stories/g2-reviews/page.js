import CustomerStoriesHero from "@/components/CustomerStoriesHero";
import CustomerStoriesStatCard from "@/components/CustomerStoriesStatCard";
import G2ReviewCard from "@/components/G2ReviewCard";

export const metadata = {
  title: "G2 Reviews - Customer Stories",
  description:
    "Real, verified reviews from Infrabox customers on G2.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://www.infrabox.software/customer-stories/g2-reviews",
  },
};

// Real reviews, excerpted from Infrabox's G2 profile ("What do you like best?" answers).
const REVIEWS = [
  {
    name: "Dominiqe C.",
    title: "Marketing Specialist",
    rating: 5,
    headline: "Simple and Reliable Mailbox Management for Growing Teams",
    body: "Managing multiple mailboxes in one place is easy — the setup is straightforward, the interface is simple to navigate, and handling domains and mailboxes is far more convenient than doing it manually. Support is responsive whenever I have questions.",
  },
  {
    name: "Priyansh M.",
    title: "Founder",
    rating: 5,
    headline: "Effortless Email Infrastructure Management",
    body: "I can set up Google Workspace, Microsoft, and Azure inboxes from one centralized panel across multiple domains. It saves a huge amount of time — what used to take days now takes a few hours, even for someone new to cold email.",
  },
  {
    name: "Harvey L.",
    title: "Founder, Legacy GTM",
    rating: 5,
    headline: "10% Reply Rate: Better Deliverability, Great Cost",
    body: "My emails are getting a 10% reply rate sending to Microsoft mailboxes — never happened before. I haven't had to worry about deliverability for the last 3 months since switching. Their UI is also the most intuitive I've used.",
  },
  {
    name: "Abe A.",
    title: "Chief Growth Officer, Outreach Boosters",
    rating: 5,
    headline: "How Infrabox is Helping Me Scale Outreach Boosters",
    body: "Infrabox integrates seamlessly with sequencers like EmailBison, saving significant time by automating mailbox management. The dashboard is intuitive, setup is straightforward, and support is responsive whenever we need it.",
  },
  {
    name: "Francesco C.",
    title: "Operations Lead",
    rating: 4.5,
    headline: "Easy to Use, Scalability, and Excellent Customer Service",
    body: "Easy to use, good prices at scale, and very good customer service. In everything I've used, I have no real complaints.",
  },
  {
    name: "Youssef H.",
    title: "Head of GTM Engineering",
    rating: 5,
    headline: "Infrabox is Our Secret Ingredient to Outbound ROI",
    body: "Their support team is incredibly helpful — someone's available 24/7 on our dedicated Slack channel. The REST API makes it easy to build dashboards around, and pre-warmed infrastructure is always ready when we need to scale fast.",
  },
  {
    name: "Shrikant W.",
    title: "Founder & CEO",
    rating: 5,
    headline: "Effortless Cold Email Setup with Reliable Deliverability",
    body: "I can get inboxes live without touching DNS, and deliverability is handled out of the box. That lets me launch campaigns the same week a client signs — no hours lost on DNS and warmup.",
  },
  {
    name: "Walter W.",
    title: "Anevo Marketing",
    rating: 5,
    headline: "Effortless Mailbox Management with Stellar Support",
    body: "Their support is very good and involved, with a dedicated rep who does biweekly calls if needed. Purchasing inboxes, DNS propagation, sequencer integration — all done start to finish in a few hours, not the one to two weeks other vendors take.",
  },
  {
    name: "Bianca T.",
    title: "Head of Lead Generation",
    rating: 5,
    headline: "Reliable, Efficient All-in-One Email Platform",
    body: "We've been using Infrabox since February and it's performed well as a complete email infrastructure solution — reliable, efficient, and it makes handling email operations much simpler from domain purchase through account setup.",
  },
  {
    name: "Muhsin H.",
    title: "Founder",
    rating: 5,
    headline: "Effortless Setup with Great Value",
    body: "The setup process was very easy — a perfect 10/10 in my opinion. I especially appreciate the DNS setup: I didn't have to touch anything myself, so I never have to worry whether records are configured correctly.",
  },
  {
    name: "Garik T.",
    title: "CEO",
    rating: 4.5,
    headline: "Infrabox Makes Email Infrastructure Effortless",
    body: "What I like most is how easy it makes managing and scaling email infrastructure. The interface is straightforward and saves a lot of time setting up and managing mailboxes.",
  },
  {
    name: "Zack G.",
    title: "President",
    rating: 4.5,
    headline: "Highly Functional API with Minimal Human Interaction",
    body: "Infrabox's API is very functional compared to the competition — I can set up new Google and Microsoft workspaces without any human involvement, and connect accounts to clients' sending tools with very limited manual work.",
  },
  {
    name: "Robert R M.",
    title: "Founder",
    rating: 5,
    headline: "Essential for Effortless Email Outreach",
    body: "It's easy to use, setup was quick, and the warm-up feature made it safe for my emails to go out. The integration with SmartLead has also been very valuable to me.",
  },
  {
    name: "Shamim A.",
    title: "Founder",
    rating: 5,
    headline: "The Complete Email Infrastructure Provider",
    body: "The whole setup is automated, so there's almost nothing to do manually. Inboxes were delivered fast and connected without any issues to my sequencer — works with pretty much every tool in the cold email space.",
  },
  {
    name: "Hassan T.",
    title: "Founder",
    rating: 5,
    headline: "Outstanding Platform with Exceptional Features",
    body: "Infrabox has significantly improved our inbox placement and deliverability, helped by its warmup features and domain reputation tools. Support is fast, technically knowledgeable, and proactive about flagging issues before they become real problems.",
  },
  {
    name: "Timothey T.",
    title: "Outbound Lead Generation",
    rating: 5,
    headline: "Scalable Email Solution with Stellar Support",
    body: "It gives me a scalable way to access high-quality email addresses. I really appreciate the support — they add you to a Slack channel where they're available to answer questions on an ongoing basis.",
  },
];

function LeaveReviewCard() {
  return (
    <div className="flex flex-col rounded-lg border border-dashed border-[#1240cc]/30 bg-[#1240cc]/5 p-5">
      <h3 className="text-sm font-semibold text-gray-900 leading-snug">
        Used Infrabox? Tell others what you think.
      </h3>
      <p className="mt-2 text-[13px] text-gray-600 leading-relaxed">
        Your review helps other teams figure out if Infrabox is right for them — takes about two minutes on G2.
      </p>
      <a
        href="https://www.g2.com/products/infrabox/reviews"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1240cc] text-white text-[13px] font-semibold rounded-lg hover:bg-[#0b34b4] transition-colors"
      >
        Write a review on G2
      </a>
    </div>
  );
}

// Wall content, in reading order. Kept as tagged items so the same list can drive
// both the deterministic desktop columns below and the simple mobile stack.
const WALL_ITEMS = [
  ...REVIEWS.slice(0, 3).map((review) => ({ type: "review", review })),
  { type: "stat", variant: "dark", value: "4.9/5", label: "Average rating across verified G2 reviews" },
  ...REVIEWS.slice(3, 8).map((review) => ({ type: "review", review })),
  { type: "stat", variant: "accent", value: "81%", label: "Reviewers who gave the full 5 stars" },
  ...REVIEWS.slice(8, 13).map((review) => ({ type: "review", review })),
  { type: "stat", variant: "dark", value: "$2.50/mo", label: "Starting mailbox price on Enterprise annual" },
  ...REVIEWS.slice(13, 16).map((review) => ({ type: "review", review })),
  { type: "leaveReview" },
];

// Rough height estimate per item — enough precision to balance columns well,
// without needing to actually measure rendered DOM nodes.
function estimateItemHeight(item) {
  if (item.type === "stat") return 150;
  if (item.type === "leaveReview") return 190;
  const headlineLines = Math.max(1, Math.ceil(item.review.headline.length / 32));
  const bodyLines = Math.max(1, Math.ceil(item.review.body.length / 44));
  return 128 + headlineLines * 22 + bodyLines * 19;
}

// Deterministic greedy bin-packing: walk items in order, always drop the next
// one into whichever column currently has the least estimated height. Unlike
// CSS multi-column `balance`, this gives the exact same, evenly-ended result
// on every load and at every viewport width.
function distributeIntoColumns(items, columnCount) {
  const columns = Array.from({ length: columnCount }, () => []);
  const heights = new Array(columnCount).fill(0);
  for (const item of items) {
    let shortest = 0;
    for (let i = 1; i < columnCount; i++) {
      if (heights[i] < heights[shortest]) shortest = i;
    }
    columns[shortest].push(item);
    heights[shortest] += estimateItemHeight(item) + 20; // + gap
  }
  return columns;
}

function WallItem({ item }) {
  if (item.type === "stat") {
    return <CustomerStoriesStatCard variant={item.variant} value={item.value} label={item.label} layout="natural" />;
  }
  if (item.type === "leaveReview") {
    return <LeaveReviewCard />;
  }
  return <G2ReviewCard review={item.review} variant="natural" />;
}

export default function G2ReviewsPage() {
  const desktopColumns = distributeIntoColumns(WALL_ITEMS, 3);

  return (
    <main>
      <CustomerStoriesHero
        breadcrumb="G2 Reviews"
        eyebrow="Verified on G2"
        headlineLead="Real reviews."
        headlineAccent="No cherry-picking."
        subtext="Real, verified reviews from Infrabox customers on G2."
      />

      <section className="px-6 pb-10 max-w-4xl mx-auto flex justify-center">
      </section>

      {/* Wall */}
      <section className="px-6 pb-16 sm:pb-20 max-w-4xl mx-auto">
        {/* Mobile/tablet — single natural-order stack, always fully filled */}
        <div className="flex flex-col gap-5 lg:hidden">
          {WALL_ITEMS.map((item, i) => (
            <WallItem key={i} item={item} />
          ))}
        </div>

        {/* Desktop — height-balanced columns computed above, no gaps by construction */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-5 items-start">
          {desktopColumns.map((column, ci) => (
            <div key={ci} className="flex flex-col gap-5">
              {column.map((item, i) => (
                <WallItem key={i} item={item} />
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20 max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl px-6 sm:px-10 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              See all reviews on G2
            </h2>
            <p className="text-sm text-gray-500">
              Read the full, unedited review history on our G2 profile.
            </p>
          </div>
          <a
            href="https://www.g2.com/products/infrabox/reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1240cc] text-white font-semibold rounded-full hover:bg-[#0b34b4] transition-colors text-sm shrink-0"
          >
            View on G2
          </a>
        </div>
      </section>
    </main>
  );
}
