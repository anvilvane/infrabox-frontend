import { generatePageMetadata } from '@/libs/metadata';

export const metadata = generatePageMetadata({
  title: "Azure Mailboxes | 100 Free | $30 Per Domain",
  description: 'Get Azure Mailboxes for email outreach. First 100 mailboxes FREE with code AZURE100FREE. $30/domain for up to 100 mailboxes. Setup in 1-2 hours.',
  keywords: 'Azure mailboxes, Microsoft Azure email, email mailboxes, Azure email accounts, bulk email accounts, $30 domain email, free mailboxes, AZURE100FREE, email outreach, email infrastructure',
  path: '/azure-mailboxes'
});

export default function AzureMailboxesLayout({ children }) {
  return children;
}
