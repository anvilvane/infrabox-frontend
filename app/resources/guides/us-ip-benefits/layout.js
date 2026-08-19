import { generatePageMetadata } from '@/libs/metadata';

export const metadata = generatePageMetadata({
  title: 'US IP Address Benefits for Email | Complete Guide',
  description: 'Discover benefits of US IP addresses for email campaigns. Learn about improved deliverability, reputation advantages, and compliance for better performance.',
  keywords: 'us ip address email benefits, email deliverability us ip, american ip email advantages, email reputation us servers, compliance email us infrastructure, geolocation email benefits',
  path: '/resources/guides/us-ip-benefits'
});

export default function UsIpBenefitsLayout({ children }) {
  return children;
}