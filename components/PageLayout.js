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
        
        {/* Partnero visitor tracking */}
        {showPartneroTracking && (
          <Script id="partnero-tracking" strategy="afterInteractive">
            {`po('integration', 'universal', null);`}
          </Script>
        )}
      </main>
    </>
  );
}