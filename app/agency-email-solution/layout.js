import { generatePageMetadata } from '@/libs/metadata';

export const metadata = generatePageMetadata({
  title: "Email Solution for Agencies: Multi-Client",
  description: 'Manage 100s of client email accounts from one dashboard. Scale your agency with bulk operations, multi-workspace management, and enterprise deliverability.',
  keywords: 'agency email solution, multi-client email management, bulk email operations, agency dashboard, white label email, email infrastructure for agencies, client workspace management, agency pricing, scalable email solution',
  path: '/agency-email-solution'
});

export default function AgencyEmailSolutionLayout({ children }) {
  return children;
}