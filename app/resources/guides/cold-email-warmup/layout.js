import { generatePageMetadata } from '@/libs/metadata';

export const metadata = generatePageMetadata({
  title: "Email Warmup Guide (2026)",
  description: 'Master email warmup with proven strategies. Learn gradual volume increase, engagement tactics, reputation building, and deliverability optimization techniques.',
  keywords: 'email warmup, email warmup strategies, email reputation building, gradual volume increase, engagement tactics, deliverability optimization, email warmup best practices, sender reputation',
  path: '/resources/guides/email-warmup'
});

export default function ColdEmailWarmupLayout({ children }) {
  return children;
}