import { generatePageMetadata } from '@/libs/metadata';

export const metadata = generatePageMetadata({
  title: "Affiliate Program: 10% Lifetime Commissions",
  description: 'Join Infrabox affiliate program and earn 10% lifetime commissions. Promote premium email infrastructure, Google Workspace accounts, and deliverability solutions.',
  keywords: 'affiliate program, recurring commissions, email marketing affiliate, partner program, referral rewards, passive income, saas affiliate, workspace reseller, commission structure, affiliate dashboard',
  path: '/affiliates'
});

export default function AffiliatesLayout({ children }) {
  return children;
}