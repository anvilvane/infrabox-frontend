import { generatePageMetadata } from '@/libs/metadata';

export const metadata = generatePageMetadata({
  title: "Email Resources Hub: Tools & Guides",
  description: 'Email deliverability resources hub. Tools for SPF, DKIM, DMARC validation, expert guides, tutorials, and best practices for email infrastructure.',
  keywords: 'email resources, deliverability tools, email guides, spf checker, dkim validator, dmarc analyzer, email best practices, dns tools, email tutorials, infrastructure resources',
  path: '/resources'
});

export default function ResourcesLayout({ children }) {
  return children;
}