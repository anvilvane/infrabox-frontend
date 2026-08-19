import Image from "next/image";

export default function SideBySideScreenshots({
  slug,
  competitorName,
  infraboxImage = "/images/compare/infrabox-dashboard.png",
  competitorScreenshots,
}) {
  const competitorHomepage = competitorScreenshots?.homepage || `/images/compare/${slug}-homepage.png`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
          <Image
            src={infraboxImage}
            alt="Infrabox dashboard managing 18M+ emails sent, 5,039 domains, and 16,754 mailboxes across Google, Microsoft, and Azure"
            width={640}
            height={400}
            className="w-full h-auto"
          />
        </div>
        <p className="mt-2 text-xs text-gray-500 italic">Infrabox dashboard — 18M+ emails sent, 5,039 domains, 16,754 mailboxes across Google, Microsoft & Azure for a single client</p>
      </div>
      <div>
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
          <Image
            src={competitorHomepage}
            alt={`${competitorName} homepage`}
            width={640}
            height={400}
            className="w-full h-auto"
          />
        </div>
        <p className="mt-2 text-xs text-gray-500 italic">{competitorName} Homepage</p>
      </div>
    </div>
  );
}
