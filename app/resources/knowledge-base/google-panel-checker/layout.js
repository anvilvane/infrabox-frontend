import { generatePageMetadata } from '@/libs/metadata';

export const metadata = generatePageMetadata({
  title: "Google Workspace Admin Panel Health Check",
  description: "Understand the Google Workspace admin panel for email — account status, suspension warnings, license usage, and the health signals worth tracking weekly.",
  keywords: 'google workspace checker, admin panel monitor, workspace health check, google account status, suspension checker, workspace diagnostics, email account validator, google admin tools, workspace verification',
  path: '/resources/knowledge-base/google-panel-checker'
});

export default function GooglePanelCheckerLayout({ children }) {
  return children;
}