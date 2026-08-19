import { generatePageMetadata } from '@/libs/metadata';

export const metadata = generatePageMetadata({
  title: "Email Tools: SPF, DKIM, DMARC Validators",
  description: 'Email deliverability tools suite. Check and generate SPF, DKIM, DMARC records. Analyze headers, validate DNS, test spam scores, monitor reputation.',
  keywords: 'email validation tools, spf checker, dkim generator, dmarc validator, dns checker, spam score test, email header analyzer, domain reputation, email tools, deliverability testing',
  path: '/resources/tools'
});

export default function ToolsLayout({ children }) {
  return children;
}
