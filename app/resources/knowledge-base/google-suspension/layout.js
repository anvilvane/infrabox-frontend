import { generatePageMetadata } from '@/libs/metadata';

export const metadata = generatePageMetadata({
  title: "Google Workspace Suspension Recovery",
  description: "Playbook for recovering Google Workspace accounts after suspension. Reactivation steps, what to send Google support, and how to prevent it next time.",
  keywords: 'google suspension recovery, workspace account reactivation, gmail suspension fix, email account recovery, google workspace restore, suspension appeal, account reinstatement, workspace troubleshooting, email recovery service',
  path: '/resources/knowledge-base/google-suspension'
});

export default function GoogleSuspensionLayout({ children }) {
  return children;
}