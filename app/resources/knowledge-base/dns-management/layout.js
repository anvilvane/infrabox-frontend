import { generatePageMetadata } from '@/libs/metadata';

export const metadata = generatePageMetadata({
  title: "DNS Management Guide for Email: SPF, DKIM & DMARC Setup",
  description: "Step-by-step guides for managing email DNS — SPF, DKIM, DMARC, MX records, and key rotation. Best practices and troubleshooting from the Infrabox team.",
  keywords: 'dns management, email dns setup, spf configuration, dkim setup, dmarc records, dns automation, email authentication, bulk dns updates, dns monitoring, mx records, email infrastructure',
  path: '/resources/knowledge-base/dns-management'
});

export default function DNSManagementLayout({ children }) {
  return children;
}