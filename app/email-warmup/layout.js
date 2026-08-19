import { generatePageMetadata } from '@/libs/metadata';

export const metadata = generatePageMetadata({
  title: "Email Warmup | 24+ Sequencer Integrations",
  description: "Built-in email warmup for Infrabox mailboxes or any of 24+ sequencers like Instantly, SmartLead, and Lemlist. Smart volume scaling and real-time health scoring.",
  keywords: 'email warmup, built-in warmup engine, sender reputation, email warmup, warmup health score, SmartLead integration, Instantly warmup, Lemlist warmup, email deliverability, warmup scaling, Azure warmup presets, sequencer warmup',
  path: '/email-warmup'
});

export default function ColdEmailWarmupLayout({ children }) {
  return children;
}