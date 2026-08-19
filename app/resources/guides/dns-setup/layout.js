import { generatePageMetadata } from '@/libs/metadata';

export const metadata = generatePageMetadata({
  title: "DNS Setup for Email Authentication (2026)",
  description: 'Complete DNS configuration guide for email authentication. Learn SPF, DKIM, DMARC setup, domain verification, and troubleshooting for optimal email deliverability.',
  keywords: 'dns setup email, spf dkim dmarc configuration, email authentication dns, domain verification email, dns troubleshooting email, email security dns records, mail server dns setup',
  path: '/resources/guides/dns-setup'
});

export default function DnsSetupLayout({ children }) {
  return children;
}