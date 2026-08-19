import { generatePageMetadata } from '@/libs/metadata';

export const metadata = generatePageMetadata({
  title: "Email Setup Tutorials | Step-by-Step Guides",
  description: 'Email setup tutorials and step-by-step guides. Learn workspace configuration, DNS setup, authentication protocols, and deliverability optimization techniques.',
  keywords: 'email tutorials, setup guides, workspace configuration, dns tutorials, authentication setup, deliverability guides, step by step instructions, email best practices, technical tutorials',
  path: '/tutorials'
});

export default function TutorialsLayout({ children }) {
  return children;
}