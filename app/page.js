'use client'

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Hero from "@/components/Hero";
import Header from "@/components/Header";
import { initializePageTracking } from '@/lib/datafast';
import { JsonLd, createWebPageSchema } from '@/components/seo/json-ld';

// Google One Tap — client-only, loaded after hydration
const GoogleOneTapWrapper = dynamic(() => import("@/components/GoogleOneTapWrapper"), { ssr: false });

// Below-fold components: code-split into separate chunks, SSR preserved
const FeaturesSection = dynamic(() => import("@/components/Highlights"));
const ProductSections = dynamic(() => import("@/components/Highlights1"));
const ComparisonTable = dynamic(() => import("@/components/Comparison"));
const Pricing = dynamic(() => import("@/components/Pricing"));
const BookCall = dynamic(() => import("@/components/BookCall"));
const FAQ = dynamic(() => import("@/components/FAQ"));
const CTA = dynamic(() => import("@/components/CTA"));
const Footer = dynamic(() => import("@/components/Footer"));

export default function Home() {
  useEffect(() => {
    initializePageTracking('homepage');
  }, []);

  return (
    <>
      <JsonLd data={createWebPageSchema({
        name: "Infrabox - Email Infrastructure Platform",
        description: "Enterprise email infrastructure with US-IP Google Workspace & Microsoft 365 accounts from $2.50/mo. 95% inbox delivery, automated DNS, 24+ integrations.",
        url: "https://www.infrabox.software",
      })} />
      <main id="main-content">
        <GoogleOneTapWrapper context="signup" />
        <Header/>
        <Hero />
        <FeaturesSection/>
        <ProductSections/>
        <ComparisonTable/>
        <Pricing/>
<BookCall/>
        <FAQ />
        <CTA />
        <Footer />
      </main>
    </>
  );
}
