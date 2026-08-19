import { generatePageMetadata } from '@/libs/metadata';

export const metadata = generatePageMetadata({
  title: "Privacy Policy",
  description: 'Infrabox privacy policy outlining data collection, usage, protection, and user rights. Learn how we safeguard your information and maintain compliance.',
  keywords: 'privacy policy, data protection, user privacy, information security, gdpr compliance, data collection, privacy rights, security measures, personal information, privacy terms',
  path: '/privacy-policy'
});

export default function PrivacyPolicyLayout({ children }) {
  return children;
}