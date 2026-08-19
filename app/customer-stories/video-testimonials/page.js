import CustomerStoriesHero from "@/components/CustomerStoriesHero";
import CustomerStoriesStatCard from "@/components/CustomerStoriesStatCard";
import VideoTestimonialCard from "@/components/VideoTestimonialCard";

export const metadata = {
  title: "Video Testimonials - Customer Stories",
  description:
    "Real customer video testimonials — Infrabox customers on camera.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://www.infrabox.software/customer-stories/video-testimonials",
  },
};

// Real testimonial videos, pulled from the shared Google Drive folder.
// domain = the company's real website, used to pull their real logo.
const VIDEOS = [
  { name: "Wesley Hoang", title: "Co-founder, Cymate", driveId: "11Uk81K_CWDKwJuIGRoTBhHigZlTg8Sx3", domain: "cymate.io" },
  { name: "Walter Winn", title: "Anevo Marketing", driveId: "1pMpcrwHtv42pEHVSQ8hVV5omMOuWtSeI", domain: "anevomarketing.com" },
  { name: "Harvey Le", title: "Founder, Legacy GTM", driveId: "1IIK9DXlUbWQPzdUJYD3_zNZ2u4wYfkq8", domain: "legacygtm.com" },
  { name: "Samuel Weinstein", title: "CEO, TGP", driveId: "1ebQflb1Gc-XiIL0HIPTJjbMVfJsncRB9", domain: "thegrowth.pro" },
  { name: "Utkarsh Rana", title: "C17 Lab", driveId: "1RKtdJFRoiH9eoUzZmJLPTRj8677f_GdK", domain: "c17.ai" },
  { name: "Floris Jansen", title: "Vectify", driveId: "1T_-uyUGEy9ICTBF956L3lS63F6jMJeVk", domain: "vectify.io" },
  { name: "Abe Abdul Rehman", title: "Outreach Boosters", driveId: "1UN7xguyJixhWxeG-t_TqDCNjbiGvGMYk", domain: "outreachboosters.io" },
  { name: "OutreachBloom", title: "Infrabox Customer", driveId: "1iKoCY9oPHalmAkO6a8S9aZtNFK2djlF_", domain: "outreachbloom.com" },
  { name: "129Scaled", title: "Infrabox Customer", driveId: "1UIizUftZgfDT9EiIoMHQGl5uuFK9ksxI", domain: "129scaled.com" },
  { name: "B2b-Boosted", title: "Infrabox Customer", driveId: "10l4vVHEDDU2kehKZVgbjG7oAc4rFguQc", domain: "b2b-boosted.com" },
];

export default function VideoTestimonialsPage() {
  return (
    <main>
      <CustomerStoriesHero
        breadcrumb="Video Testimonials"
        eyebrow="On camera"
        headlineLead="Hear it straight"
        headlineAccent="from the teams sending."
        subtext="Real customers talking through how Infrabox changed their outbound infrastructure. Click any video to watch."
      />

      <section className="px-6 pb-16 sm:pb-20 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {VIDEOS.slice(0, 3).map((video, i) => (
            <VideoTestimonialCard key={`a-${i}`} video={video} />
          ))}

          <CustomerStoriesStatCard
            variant="dark"
            value="<10 min"
            label="Average time from signup to first mailbox live"
            layout="stretch"
          />

          {VIDEOS.slice(3, 10).map((video, i) => (
            <VideoTestimonialCard key={`b-${i}`} video={video} />
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
          </a>
        </div>
      </section>
    </main>
  );
}
