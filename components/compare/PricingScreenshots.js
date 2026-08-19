import Image from "next/image";

export default function PricingScreenshots({ slug, competitorName, competitorScreenshots }) {
  const hasPricing = competitorScreenshots?.pricing;
  if (!hasPricing) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
          <Image
            src="/images/compare/infrabox-pricing.png"
            alt="Infrabox Pricing"
            width={640}
            height={400}
            className="w-full h-auto"
          />
        </div>
        <p className="mt-2 text-xs text-gray-500 italic">Infrabox Pricing</p>
      </div>
      <div>
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
          <Image
            src={competitorScreenshots.pricing}
            alt={`${competitorName} Pricing`}
            width={640}
            height={400}
            className="w-full h-auto"
          />
        </div>
        <p className="mt-2 text-xs text-gray-500 italic">{competitorName} Pricing</p>
      </div>
    </div>
  );
}
