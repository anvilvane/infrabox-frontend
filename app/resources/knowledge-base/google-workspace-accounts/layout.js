import { generatePageMetadata } from '@/libs/metadata';

export const metadata = generatePageMetadata({
  title: "US-IP Google Workspace Accounts: $2.50/mo",
  description: "What to know before buying Google Workspace accounts for email — US IPs, admin access, 2FA, domain isolation, and how Infrabox sets them up.",
  keywords: 'Google Workspace accounts, US IP addresses, cheap Google Workspace, $2.50 mailbox, US IP email accounts, Google Workspace for email, bulk Google accounts, email accounts with US IP, Google Workspace pricing',
  path: '/resources/knowledge-base/google-workspace-accounts'
});

export default function GoogleWorkspaceAccountsLayout({ children }) {
  return children;
}