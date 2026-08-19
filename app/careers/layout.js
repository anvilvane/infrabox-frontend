import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({
  title: "Careers: Join the Team Building Email Infra",
  description: "Hiring across engineering, growth, and operations in our Gurgaon office. Work directly with the founding team on email infrastructure used worldwide.",
  keywords: "infrabox careers, infrabox jobs, email jobs, email infrastructure jobs, gurgaon startup jobs, saas jobs india",
  canonicalUrlRelative: "/careers",
  openGraph: {
    title: "Careers at Infrabox",
    description: "Build the infrastructure behind millions of emails. Open roles across engineering, growth, and operations.",
  },
});

export default function CareersLayout({ children }) {
  return children;
}
