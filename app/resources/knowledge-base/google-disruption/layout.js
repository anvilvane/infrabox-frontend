import { generatePageMetadata } from '@/libs/metadata';

export const metadata = generatePageMetadata({
  title: "Google Workspace Disruption Protection",
  description: "How to spot, prevent, and recover from Google Workspace disruptions. Diagnostic playbooks, monitoring tips, and backup strategies for email senders.",
  keywords: 'google workspace disruption, gmail suspension recovery, workspace backup, email continuity, business email protection, google account recovery, workspace monitoring, email disaster recovery, suspension prevention',
  path: '/resources/knowledge-base/google-disruption'
});

export default function GoogleDisruptionLayout({ children }) {
  return children;
}