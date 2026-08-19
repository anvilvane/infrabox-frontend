import { generatePageMetadata } from '@/libs/metadata';

export const metadata = generatePageMetadata({
  title: "Email Deliverability Guides & Tutorials",
  description: 'In-depth email deliverability guides and tutorials. Learn email authentication, DNS configuration, warmup strategies, and agency workflows from industry experts.',
  keywords: 'email guides, deliverability tutorials, email authentication guide, dns setup tutorial, warmup best practices, agency workflows, email infrastructure guides, technical documentation, implementation guides',
  path: '/resources/guides'
});

export default function GuidesLayout({ children }) {
  return children;
}