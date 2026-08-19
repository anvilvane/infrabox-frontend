import { generatePageMetadata } from '@/libs/metadata';

export const metadata = generatePageMetadata({
  title: "Partner Network: Certified Email Partners",
  description: "Hand-picked agencies and operators who build, run, or rescue email infrastructure. 66 Infrabox-certified partners across Platinum, Gold, and more.",
  keywords: 'infrabox partners, email agency, gtm agency, partner directory, email expert, deliverability agency, outbound agency, platinum partner, certified partner',
  path: '/partners',
});

export default function PartnersLayout({ children }) {
  return children;
}
