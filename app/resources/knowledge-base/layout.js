import { generatePageMetadata } from '@/libs/metadata';

export const metadata = generatePageMetadata({
  title: "Knowledge Base: DNS & Email Infrastructure",
  description: "Knowledge base for email infrastructure. DNS management, Google Workspace configuration, panel diagnostics, disruption handling, and suspension recovery.",
  keywords: 'email knowledge base, dns management guide, google workspace guide, google suspension recovery, email infrastructure help, google disruption guide, google panel checker guide',
  path: '/resources/knowledge-base'
});

export default function KnowledgeBaseLayout({ children }) {
  return children;
}
