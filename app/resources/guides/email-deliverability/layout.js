import { generatePageMetadata } from '@/libs/metadata';

export const metadata = generatePageMetadata({
  title: "Email Deliverability Optimization Guide",
  description: 'Comprehensive email deliverability guide. Learn inbox placement strategies, reputation management, authentication setup, and monitoring for maximum email success rates.',
  keywords: 'email deliverability guide, inbox placement optimization, email reputation management, deliverability best practices, email authentication guide, spam folder avoidance, email success rates',
  path: '/resources/guides/email-deliverability'
});

export default function EmailDeliverabilityLayout({ children }) {
  return children;
}