import { generatePageMetadata } from '@/libs/metadata';

export const metadata = generatePageMetadata({
  title: "Refund Policy",
  description: "Infrabox refund policy. Subscription fees, wallet credits, domain purchases, chargebacks, billing disputes, and how to request a refund from our billing team.",
  keywords: 'refund policy, cancellation policy, billing, chargebacks, wallet credits, subscription refund, Infrabox refund',
  path: '/refund-policy'
});

export default function RefundPolicyLayout({ children }) {
  return children;
}
