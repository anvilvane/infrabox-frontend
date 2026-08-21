'use client'

import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PageLayout({ 
  children, 
  showPartneroTracking = true 
}) {
  return (
    <>
      <main>
        <Header />
        {children}
        <Footer />
        
        {/*
          Partnero visitor tracking. window.po is only ever defined by
          DeferredAnalytics.js's script, and only when
          NEXT_PUBLIC_PARTNERO_PROGRAM is set — this deployment doesn't have
          it, so a bare `po(...)` call here threw "po is not defined" and
          crashed this component (visible as a pageerror on every page using
          PageLayout). Guard on window.po actually existing.
        */}
        {showPartneroTracking && (
          <Script id="partnero-tracking" strategy="afterInteractive">
            {`if (typeof window.po === 'function') { po('integration', 'universal', null); }`}
          </Script>
        )}
      </main>
    </>
  );
}