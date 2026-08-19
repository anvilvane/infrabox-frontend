import { generatePageMetadata } from '@/libs/metadata';

export const metadata = generatePageMetadata({
  title: "Acceptable Use Policy",
  description: 'Infrabox acceptable use policy covering permitted uses, prohibited activities, and compliance requirements for our email infrastructure services.',
  keywords: 'acceptable use policy, email compliance, prohibited uses, anti-spam policy, email infrastructure rules',
  path: '/acceptable-use-policy'
});

export default function AcceptableUsePolicyLayout({ children }) {
  return children;
}
