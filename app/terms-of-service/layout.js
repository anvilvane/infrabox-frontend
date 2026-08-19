import { generatePageMetadata } from '@/libs/metadata';

export const metadata = generatePageMetadata({
  title: "Terms of Service",
  description: 'Infrabox terms of service defining user agreements, service usage, limitations, and legal responsibilities. Read our complete terms before using our services.',
  keywords: 'terms of service, legal agreement, usage terms, service conditions, user agreement, legal terms, service policies, acceptable use, liability, terms and conditions',
  path: '/terms-of-service'
});

export default function TermsOfServiceLayout({ children }) {
  return children;
}