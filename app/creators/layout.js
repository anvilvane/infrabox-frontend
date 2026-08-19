import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags({
  title: "Creator Program: 10% Lifetime Commissions",
  description: "Join Infrabox's creator program. Earn 10% recurring commission on every referral, forever. Free Pro account, creator community, and ad amplification for top GTM creators.",
  keywords: "infrabox creators, infrabox affiliate program, email affiliate, gtm creator program, saas creator program, lifetime commission",
  canonicalUrlRelative: "/creators",
  openGraph: {
    title: "Infrabox Creator Program",
    description: "Earn 10% recurring commission forever. Join the community of GTM leaders building with Infrabox.",
  },
});

export default function CreatorsLayout({ children }) {
  return children;
}
