import { ClosingCta } from "./_home/closing-cta";
import { Comparison } from "./_home/comparison";
import { Faq } from "./_home/faq";
import { Features } from "./_home/features";
import { HowItWorks } from "./_home/how-it-works";
import { PricingTeaser } from "./_home/pricing-teaser";
import { Hero } from "./_home/hero";

/*
 * The homepage. Section rhythm, top to bottom:
 *   hero (ink) → features → how it works (muted) → comparison →
 *   pricing (muted) → faq → closing CTA (ink)
 *
 * Each band lives in its own file under `_home/` so a section can be reworked
 * without scrolling past the other six. Every number on the page is imported
 * from src/lib/product.ts, which cites the api-server / dashboard file each
 * value was read out of. Nothing here is a metric, a customer count, a logo
 * wall or an uptime claim, because none of those exist as facts in this
 * repository.
 */

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Comparison />
      <PricingTeaser />
      <Faq />
      <ClosingCta />
    </>
  );
}
