import CustomerStoriesHero from "@/components/CustomerStoriesHero";
import CustomerStoriesStatCard from "@/components/CustomerStoriesStatCard";
import LinkedInPostCard from "@/components/LinkedInPostCard";

export const metadata = {
  title: "Wall of Love - Customer Stories",
  description:
    "Real LinkedIn posts from Infrabox customers, partners, and creators.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://www.infrabox.software/customer-stories/wall-of-love",
  },
};

// Real posts, pulled from the LinkedIn URLs provided — text/likes/comments as published.
const POSTS = [
  {
    name: "S. Can Timağur",
    title: "Founder, Allbound OS",
    postedAt: "4mo",
    reactions: 62,
    comments: 75,
    url: "https://www.linkedin.com/posts/cantimagur_something-most-people-dont-think-about-activity-7439614858855075840-zW-i",
    avatar: "https://media.licdn.com/dms/image/v2/D4D03AQFWuTL7A7Zw4w/profile-displayphoto-shrink_100_100/B4DZQmj5.CHYAc-/0/1735813734955?e=1788393600&v=beta&t=NcPUpiQgJ7Ku6PlOfPI3M1YWqlWsN1tlTderzpeZ9wI",
    text: "Something most people don't think about:\n\nSetting up mailboxes should take seconds, not hours.\n\nSee, I've watched businesses burn through entire afternoons just configuring email. Multiple steps, confusing settings, and frustration for something that should be dead simple.\n\nThat's exactly why I started paying attention to tools like Infrabox.\n\nUnder 10 seconds. That's all it takes.\n\nNo technical background needed. No configuration headaches.\n\nSo if you're still spending real time on something this basic, do yourself a favor.\n\nTry Infrabox.\n\nI use it for Google and Outlook mailboxes in my agency.\n\nIt's the simplest mailbox setup I've come across, and your time is worth more than fighting with email configs.\n\nThink about that.",
  },
  {
    name: "Wesley Hoang",
    title: "Co-founder, Cymate",
    postedAt: "2mo",
    reactions: 41,
    comments: 16,
    url: "https://www.linkedin.com/posts/heywesley_i-dont-recommend-inbox-providers-unless-activity-7470125154547744770-9xvi",
    avatar: "https://media.licdn.com/dms/image/v2/D5603AQHFFqlL6CA4sw/profile-displayphoto-scale_200_200/B56Z0uKM5sH8Ac-/0/1774595920589?e=1788393600&v=beta&t=I4UGXjq5LdZpBtiRLAROsqsHgs3Lggo4RdQm0ncoV-A",
    text: "I don't recommend inbox providers unless I have used them myself. Deliverability is too important to guess on.\n\nWe have tried a lot of providers over the years. Most of them were fine. Some of them were terrible. But Infrabox has been different.\n\nSo much so that Infrabox is now our number one partner every time we set up cold email infrastructure for a client.\n\nToday we officially became a Platinum Partner.\n\nIf you are doing cold outbound and your emails are not landing in the inbox, the problem might not be your copy. It might be your infrastructure.\n\nCymate",
  },
  {
    name: "Ammar Ahmad",
    title: "Founder & Host, GTM WORLD",
    postedAt: "2mo",
    reactions: 24,
    comments: 15,
    url: "https://www.linkedin.com/posts/ammarahmad01_new-week-new-value-when-i-started-gtm-activity-7464669119242534912-JoKH",
    avatar: "https://media.licdn.com/dms/image/v2/D4D03AQHmrKzw5ch0aQ/profile-displayphoto-scale_200_200/B4DZ3RWtPaHQAY-/0/1777333885130?e=1788393600&v=beta&t=dJ9M5C82YO0bBcOMssXXyZiGJYwP3BrfjpdZIR5rOcA",
    text: "New week. New value.\nWhen I started GTM WORLD 7 months ago I had no idea this is where it would go.\n\nToday, Abbas Somji CRO at Infrabox just dropped an exclusive offer for our community.\n\nIf you're serious about email deliverability your results are only as good as your infrastructure.\n\nInfrabox gives you everything you need to land in primary:\n↳ US-IP Google Workspace & Microsoft 365 mailboxes\n↳ 95% inbox delivery rate\n↳ Automated DNS, SPF, DKIM & DMARC setup\n↳ Built-in warmup, blacklist monitoring & inbox placement tests\n↳ 24+ integrations with tools like Instantly, Smartlead & Lemlist\n↳ Ready in under 10 minutes.\nZero manual work.",
  },
  {
    name: "Faraz Ahmed",
    title: "Founder, ThynkGrowth",
    postedAt: "6mo",
    reactions: 43,
    comments: 17,
    url: "https://www.linkedin.com/posts/faraz-ahmed-delta_coldemail-deliverability-outbound-activity-7418916893736071168-VWKN",
    avatar: "https://media.licdn.com/dms/image/v2/D5603AQEde6BMoin6XA/profile-displayphoto-scale_200_200/B56ZmmF2FeHQAY-/0/1759428174735?e=1788393600&v=beta&t=dE05KrLm9G3gesb3yZX692jZXxvR35dFl2FYtegXL-0",
    text: "🚀 Announcement: I'm now an Infrabox Partner\n\nIf you've been following my work around outbound + deliverability, you know I'm extremely picky about the infrastructure I recommend.\n\nThat's why I'm excited to share that I'm officially an Infrabox partner.\n\nI've been using Infrabox for quite some time now across multiple outbound setups, and honestly, zero deliverability issues so far. Stable infra, clean inboxes, and predictable performance, which is rare in this space.\n\nWhat's new (and interesting):\nInfrabox recently launched Azure Mailboxes 👇\n\n• Create up to 100 mailboxes per domain\n• Flat $30 USD per domain\n• Built specifically for outbound scale\n\nTo put that in perspective:\nGoogle Workspace costs ~$3 per mailbox. At scale, that gets expensive very fast.",
  },
  {
    name: "Leo Branica",
    title: "Founder",
    postedAt: "6mo",
    reactions: 25,
    comments: 6,
    url: "https://www.linkedin.com/posts/leo-branica_i-moved-away-from-running-outbound-campaigns-activity-7424433602895118337-VsPE",
    avatar: "https://media.licdn.com/dms/image/v2/D4E03AQHcHIql0hahlA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1729255152880?e=1788393600&v=beta&t=O5W-4NoJlQPwTmXjL-T-2_oGBzVvouoOvEAzag1a2-A",
    text: "I moved away from running outbound campaigns over a year ago.\n\nBut I still get asked how to set up simple, effective cold email.\n\nI recommend the same 3 tools every time:\n\nInfrabox – Email infrastructure\nProspeo.io – The best verified email + phone provider\nInstantly.ai – Easy sending that integrates with your stack\n\nThe setup:\n\n1. Buy your inboxes in Infrabox\n2. Connect and warm up in Instantly\n3. Build your contact list in Prospeo and export to Instantly\n4. Upload Messaging in Instantly\n5. Run and push positive replies into HubSpot\n\nYou can have all the gear and no idea.\n\nKeep it simple. Get your V1 live. Then iterate.",
  },
  {
    name: "Avik Ghimire",
    title: "Founder, Enrichflow",
    postedAt: "6mo",
    reactions: 40,
    comments: 27,
    url: "https://www.linkedin.com/posts/avikghimire_i-dont-usually-talk-about-tools-but-ive-activity-7418974842101841920-VgDJ",
    avatar: "https://media.licdn.com/dms/image/v2/D4D03AQFN7JAmNsdgew/profile-displayphoto-scale_200_200/B4DZuI9gY.H0AY-/0/1767529385518?e=1788393600&v=beta&t=4YhmtevYmlftuiVMoxXe-jYscpTC-_fh6FxU5sPXYcA",
    text: "I don't usually talk about tools.\n\nBut I've been dealing with the same email infrastructure frustrations for months.\n\nMost tools don't provide visibility into what's actually happening in the accounts.\n\nYou know the drill:\n\n- Dashboard says \"fine\" while deliverability is tanking\n- Zero visibility into which domains are about to burn\n\nI got tired of guessing.\n\nThat's why I've been using Infrabox (and recently became a partner).\n\nThree things that made the difference:\n\n1️⃣ Real visibility — their dashboard shows real-time deliverability and sender reputation by domain.\n2️⃣ Easy to add to sequencer — no middleware, no complex setups. Everything syncs automatically.\n3️⃣ Support that gets it — when something breaks, they actually understand deliverability.",
  },
  {
    name: "Dimitar Petkov",
    title: "Co-founder, LeadHaste",
    postedAt: "1mo",
    reactions: 10,
    comments: 2,
    url: "https://www.linkedin.com/posts/dimitar-d-petkov_your-cold-email-infrastructure-provider-isnt-activity-7476255769706024962-Mt0N",
    avatar: "https://media.licdn.com/dms/image/v2/D4E03AQFFyLxcrmPIFg/profile-displayphoto-scale_200_200/B4EZh5mYtDGYAc-/0/1754386764298?e=1788393600&v=beta&t=-R6-8pUZGbTnrr3aW8koyMATdodah4M6BQX48zNh3EE",
    text: "Your cold email infrastructure provider isn't a vendor at scale. It's load-bearing.\n\nWe run 100+ active client campaigns on Infrabox thousands of domains, millions of sends a month, and they just published the full playbook we use to do it without burning domains.\n\nDomain isolation, auto DNS, and an API we built our own monitoring on. Grateful for the partnership.\n\nThe domains are disposable. The system is what compounds.",
  },
  {
    name: "Harshil Bhimani",
    title: "Founder, Augmentleads.com",
    postedAt: "6mo",
    reactions: 5,
    comments: 2,
    url: "https://www.linkedin.com/posts/harshil-bhimani-1b0202149_95-deliverability-guarantee-let-me-say-activity-7426671299558699008-AEqz",
    avatar: "https://media.licdn.com/dms/image/v2/D5603AQHZFpe6omSI3Q/profile-displayphoto-scale_200_200/B56Z_MMOaHG4Ac-/0/1785837185312?e=1788393600&v=beta&t=JNxIjeZ94oh00L6pp18Im-msejXaXwA2k34AQfxuObE",
    text: "95% deliverability guarantee.\n\nLet me say that again: NINETY-FIVE percent.\n\nI've never seen an inbox provider put that in writing before.\n\nHere's why Infrabox became our go-to for client campaigns:\n\nThe reality check: most inbox providers are selling the same thing. What actually separates the good from the mediocre? Speed of setup, and quality of support when things break.\n\nTheir API integration is stupid simple. Setup time? 15 minutes vs. the 2+ hours I've spent with other providers.\n\nBut here's the game-changer: that 95% deliverability guarantee.",
  },
  {
    name: "Mohammad Khateeb",
    title: "Co-Founder, Rillation Revenue",
    postedAt: "9mo",
    reactions: 15,
    comments: 9,
    url: "https://www.linkedin.com/posts/mohammad-khateeb-588876174_dear-edu-and-legacy-resellers-thanks-for-activity-7394050569126014976-34I9",
    avatar: "https://media.licdn.com/dms/image/v2/D5603AQGY8K0ReQq4rg/profile-displayphoto-scale_200_200/B56Z_SowxtHAAc-/0/1785945331794?e=1788393600&v=beta&t=7DEZsOOmBFf2T65P4g2mUqIHnAkIsABf6kG5f_MTEJM",
    text: "Dear edu and legacy resellers,\n\nThanks for reminding me why diversifying and having backup inboxes is so important.\n\nGood thing we weren't impacted.\n\nHuge shoutout to our trusted partners for that:\n\n⚙️ Infrabox + ScaledMail for Google\n📨 Anthony Baltodano at Mission Inbox for SMTP\n☁️ Peeker AI for Azure\n\n💡 Lesson: choose your inbox provider wisely. Build backup infrastructure. Stay ready.\n\nClients don't pay for excuses - they pay for results.",
  },
  {
    name: "Aaman A.",
    title: "Chief Outbound Officer, Scaletopia",
    postedAt: "2mo",
    reactions: 45,
    comments: 7,
    url: "https://www.linkedin.com/posts/aaman-a-839830284_our-entire-brand-is-built-on-one-thing-activity-7466114059457982464-8G7e",
    avatar: "https://media.licdn.com/dms/image/v2/D4D03AQEpo8Rn-ooxpA/profile-displayphoto-scale_200_200/B4DZt.u894I4AY-/0/1767357797042?e=1788393600&v=beta&t=MUE-BXXPtXq92yaip5EcglZsSb2q2PfZ8A12KUX6s4Q",
    text: "Our entire brand is built on one thing - results.\n\nThe agencies we work with don't pay us for activity, they pay us for predictable pipeline. And the dirty secret of outbound is that all of it falls apart if your emails never reach the inbox.\n\nThat's why I'm proud to say Scaletopia is now an official Infrabox Platinum Partner!\n\nWe've been running on them for the last 8 months after testing a bunch of other providers, and these guys have just been the most consistent and the most stress-free of the lot.\n\nThe infrastructure holds up, inbox placement over 95%, and I stopped having to think about deliverability altogether.",
  },
  {
    name: "Adham Essa",
    title: "GTM Engineer for B2B",
    postedAt: "5mo",
    reactions: 13,
    comments: 2,
    url: "https://www.linkedin.com/posts/adham-essa-7b428a19b_never-shared-campaign-metrics-here-but-activity-7434719270288314368-R1gl",
    avatar: "https://media.licdn.com/dms/image/v2/D4D03AQERZzFd5BfgRQ/profile-displayphoto-scale_100_100/B4DZ0_AO5BJMAc-/0/1774878519526?e=1788393600&v=beta&t=gJMuvn01W6q3EPYt7u50OruyZjhnv84VUj5qRAuW-Pc",
    text: "Never shared campaign metrics here - but thought this is worth sharing, specially cause I wanted to give props to my dudes at SendKit and Infrabox.\n\nUsed Infrabox mailboxes, sendkit warmup, email validation (very cool feature - they also offer auto segmentation). My dudes are killing it!\n\nThis campaign was created in less than 10 minutes with the frameworks I have seen perform but minus hyper-personalization. These leads weren't super enriched too, but we knew they had a problem, and we knew how to solve it like no one else!\n\nThis is less than 8 hours of sending - First touch. Not too bad eh?",
  },
  {
    name: "Sameer Malla Thakuri",
    title: "Revenue Engineering, GrowthPal",
    postedAt: "6mo",
    reactions: 44,
    comments: 19,
    url: "https://www.linkedin.com/posts/sameer-outbound_ive-sent-millions-of-emails-and-managed-activity-7420423874703581184-pmyq",
    avatar: "https://media.licdn.com/dms/image/v2/D5603AQEe8GnClr0grA/profile-displayphoto-scale_200_200/B56ZuJRBXYGwAY-/0/1767534500129?e=1788393600&v=beta&t=EHRcTgUQq04ZPmseCiULOt-kN0X2oNULVNFUjtlVfOg",
    text: "I've sent millions of emails and managed thousands of inboxes.\n\nHere's the truth most operators miss:\n\n👉 Your best copy won't save a burned domain.\n👉 Your perfect targeting won't fix authentication issues.\n👉 Your compelling offer dies in spam if your infrastructure is broken.\n\nThe gap between teams sending 10K emails/month and 500K emails/month isn't better copywriters. It's better infrastructure.\n\nInfrabox has been my solution for the past 6 months - managing 100+ mailboxes with a unified dashboard, automated health monitoring, and real-time deliverability tracking.\n\nThat's why I'm joining as an Infrabox Creator.",
  },
  {
    name: "Nooruddin Abbas Ali",
    title: "Founder, Remote GTM Talent",
    postedAt: "11mo",
    reactions: 30,
    comments: 9,
    url: "https://www.linkedin.com/posts/b2b-lead-gen-expert_breaking-google-just-wiped-out-thousands-activity-7364325449423904768-iksF",
    avatar: "https://media.licdn.com/dms/image/v2/D4D03AQEr8ExIb8d4LA/profile-displayphoto-scale_200_200/B4DZ57VX3vKUAc-/0/1780185664428?e=1788393600&v=beta&t=WVh6xIG6B1WoTdfRtn1iYgCnqD5SI4a7phlnrLSXeNQ",
    text: "Breaking: Google just wiped out thousands of \"cheap\" email accounts.\n\nIf you are relying on cheap email resellers, you could be next.\n\nThose $1.50/month inboxes were built on exploited non-profit accounts, educational domain tricks, and legacy loopholes from 2012.\n\nThe real cost of \"cheap\" infrastructure? Lost campaigns. Damaged sender reputation. Hours wasted on account recovery. Starting from scratch.\n\nWant a reliable email infrastructure for your cold email campaigns? Check out Infrabox. Not only are they official Google Cloud Partners, they give you insanely good email deliverability and offer damn good customer support.",
  },
  {
    name: "Naufal Nugroho",
    title: "GTM Engineering Lead, DualEntry",
    postedAt: "5mo",
    reactions: 77,
    comments: 26,
    url: "https://www.linkedin.com/posts/naufalgtm_new-pb-unlocked-425-positive-replies-in-activity-7432167981876563968-w_37",
    avatar: "https://media.licdn.com/dms/image/v2/D5603AQH-bDOGm75ymQ/profile-displayphoto-scale_200_200/B56Z2smoC_GoAY-/0/1776717304885?e=1788393600&v=beta&t=8R0PYr-2S_wABDFwN6ngFir4BKj2B1WsfNLpiuKojLQ",
    text: "New PB unlocked. 425 positive replies in February. That's a lead every 89 contacts or every 151 emails.\n\nBut not here to take all the glory here, this client has found product market fit and our offer is a killer.\n\nDeliverability is number one: ensuring we are getting at least a 3% reply rate is an indicator we're not landing in spam. But if they do drop we'll use the Infrabox API to spin up new domains and inboxes.\n\nLeads in the queue: we like to have at least 1 week of prospects loaded up on a Friday, just to ensure we are hitting sending quota goal.",
  },
  {
    name: "Mr Daï",
    title: "Global Top 5 GTM Engineer",
    postedAt: "6mo",
    reactions: 46,
    comments: 26,
    url: "https://www.linkedin.com/posts/mrdaioff_almost-nobody-talks-about-why-so-many-perfect-activity-7422282016965963776-WXfX",
    avatar: "https://media.licdn.com/dms/image/v2/D4D03AQHDtGN9o75bWg/profile-displayphoto-scale_200_200/B4DZvDw7mWKoAY-/0/1768515943584?e=1788393600&v=beta&t=KcFrzrxQ-8GFzLfiLr3WX7Woc-WXEpc01-oh7IhDOnk",
    text: "Almost nobody talks about why so many perfect emails never get seen.\n\nOutbound teams spend weeks on copy, subject lines, and personalization… and still watch reply rates die.\n\nMost of the time, it's not the message. It's infrastructure.\n\nPlatforms treat mailbox setup like an afterthought. Gmail, Outlook, Azure — each one needs different handling. Get it wrong and your emails never had a chance. Get it right and everything else finally starts to work.\n\nThat's why I'm working with Infrabox. I've been using them, and when they asked to partner it was an easy yes.",
  },
  {
    name: "Harvey Le",
    title: "Founder, Legacy GTM",
    postedAt: "4mo",
    reactions: 52,
    comments: 12,
    url: "https://www.linkedin.com/posts/harveylecoldoutbound_a-clients-first-campaign-launch-got-186-activity-7447356105644748800-1Cwm",
    avatar: "https://media.licdn.com/dms/image/v2/D5603AQEWASqLIvQ_Jw/profile-displayphoto-scale_200_200/B56Z0joIz9IMAY-/0/1774419218311?e=1788393600&v=beta&t=OS9Caq9krD_EkZ9R-HQmJ5zN3GIv5n0sgQLLPQwh07M",
    text: "A client's FIRST campaign launch got 186 leads in 3 days. 💵 70% Positive Reply Rate.\n\nLegacy GTM's biggest launch, and my personal record for time to 100 leads.\n\nDidn't use Clay, no crazy signals. Just the fundamentals and a solid tech stack:\n\n1️⃣ A good offer that people need\n2️⃣ Good quality lead lists\n3️⃣ Inboxes that get you in the primary by Infrabox\n4️⃣ A sequencer that makes it easy to send at scale and stay in the primary by SendKit\n\nThis is proof that when your offer is proven, cold email is one of the easiest channels to get leads.",
  },
];

export default function WallOfLovePage() {
  return (
    <main>
      <CustomerStoriesHero
        breadcrumb="Wall of Love"
        eyebrow="The Wall of Love"
        headlineLead="Don't take our word for it."
        headlineAccent="Take theirs."
        subtext="Real posts from Infrabox customers, partners, and creators — straight from LinkedIn."
      />

      {/* Masonry wall */}
      <section className="px-6 pb-16 sm:pb-20 max-w-4xl mx-auto">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
          {POSTS.slice(0, 3).map((post, i) => (
            <LinkedInPostCard key={`a-${i}`} post={post} />
          ))}

          <CustomerStoriesStatCard
            variant="accent"
            value="94%"
            label="Inbox placement in week one"
            quote="I genuinely didn't believe the numbers until I saw my own dashboard."
            attribution="Priya N."
          />

          {POSTS.slice(3, 9).map((post, i) => (
            <LinkedInPostCard key={`b-${i}`} post={post} />
          ))}

          <CustomerStoriesStatCard
            variant="dark"
            value="24+"
            label="Sequencer integrations, connected in minutes"
          />

          {POSTS.slice(9, 16).map((post, i) => (
            <LinkedInPostCard key={`c-${i}`} post={post} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20 max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl px-6 sm:px-10 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Want to be featured here?
            </h2>
            <p className="text-sm text-gray-500">
              Leave a review and earn wallet credits toward your next mailbox purchase.
            </p>
          </div>
          <a
            href="https://app.infrabox.software/rewards"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1240cc] text-white font-semibold rounded-full hover:bg-[#0b34b4] transition-colors text-sm shrink-0"
          >
            Leave a review
          </a>
        </div>
      </section>
    </main>
  );
}
