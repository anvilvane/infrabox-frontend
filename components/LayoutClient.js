"use client";

import dynamic from "next/dynamic";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";
import { Tooltip } from "react-tooltip";
import config from "@/config";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import AttributionForwarder from "@/components/AttributionForwarder";

const ExitIntentModal = dynamic(() => import("@/components/ExitIntentModal"), { ssr: false });


// All the client wrappers are here (they can't be in server components)
// 1. NextTopLoader: Show a progress bar at the top when navigating between pages
// 2. Toaster: Show Success/Error messages anywhere from the app with toast()
// 3. Tooltip: Show tooltips if any JSX elements has these 2 attributes: data-tooltip-id="tooltip" data-tooltip-content=""
const ClientLayout = ({ children }) => {
  return (
    <>
      {/* Capture ad attribution (gclid/utm) and forward it on app.infrabox.software links */}
      <AttributionForwarder />

      {/* Show a progress bar at the top when navigating between pages */}
      <NextTopLoader color={config.colors.main} showSpinner={false} />

      {/* Announcement Banner */}
      <AnnouncementBanner />

      {/* Content inside app/page.js files  */}
      {children}

      {/* Show Success/Error messages anywhere from the app with toast() */}
      <Toaster
        toastOptions={{
          duration: 3000,
        }}
      />

      {/* Show tooltips if any JSX elements has these 2 attributes: data-tooltip-id="tooltip" data-tooltip-content="" */}
      <Tooltip
        id="tooltip"
        className="z-[60] !opacity-100 max-w-sm shadow-lg"
      />

      {/* Exit-intent modal with Calendly embed — mounts once, self-arms after delay, shows once per session */}
      <ExitIntentModal />
    </>
  );
};

export default ClientLayout;
