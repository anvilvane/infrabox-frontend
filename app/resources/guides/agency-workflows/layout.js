import { generatePageMetadata } from '@/libs/metadata';

export const metadata = generatePageMetadata({
  title: "Agency Email Workflow Automation Guide",
  description: 'Complete guide to email workflow automation for agencies. Learn client management, bulk operations, team collaboration, and scaling strategies for email campaigns.',
  keywords: 'agency email workflows, email automation for agencies, client email management, bulk email operations, agency email tools, team collaboration email, email campaign scaling, agency productivity tools',
  path: '/resources/guides/agency-workflows'
});

export default function AgencyWorkflowsLayout({ children }) {
  return children;
}