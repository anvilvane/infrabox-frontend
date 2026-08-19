import { generatePageMetadata } from '@/libs/metadata';

export const metadata = generatePageMetadata({
  title: "Email Mailbox Calculator: Free Pricing Tool",
  description: 'Free email mailbox calculator. Size how many mailboxes and domains you need across Google Workspace, Microsoft 365, and Azure, from a daily send volume or a monthly meetings goal, and see the monthly cost and first-year total.',
  keywords: 'mailbox calculator, email calculator, how many mailboxes do I need, email infrastructure cost, mailbox cost calculator, email pricing, mailboxes per domain, google workspace email',
  path: '/resources/tools/mailbox-calculator'
});

export default function MailboxCalculatorLayout({ children }) {
  // JSON-LD (WebPage, Breadcrumb, FAQPage, HowTo, WebApplication) is emitted by the
  // page component via the shared seo/json-ld helpers, so it stays in sync with the
  // on-page content. Keep this layout metadata-only to avoid duplicate/contradictory schema.
  return children;
}