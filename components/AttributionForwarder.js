"use client";

import { useEffect } from "react";
import { captureAttribution, decorateUrl } from "@/lib/attribution";

/**
 * AttributionForwarder
 * --------------------
 * Mounted once in the client layout. Two jobs:
 *   1. On mount, capture ad params (gclid/gbraid/wbraid/utm_*) from the landing
 *      URL into the shared `.infrabox.software` cookie (see lib/attribution.js).
 *   2. Delegate-listen for clicks on any <a> pointing at app.infrabox.software and
 *      rewrite its href with the stored ad attribution just-in-time, so the real
 *      gclid + ad UTMs survive the cross-domain hop to signup. The internal CTA
 *      label is preserved under a `cta` param (handled in decorateUrl).
 *
 * This replaces the need to edit every hardcoded CTA link individually and also
 * covers any link added in the future. It is purely additive: if no ad
 * attribution is stored, links are left exactly as they were.
 */
export default function AttributionForwarder() {
  useEffect(() => {
    // 1. Capture on landing (and on client-side route changes via re-mount).
    try {
      captureAttribution();
    } catch {
      /* never break the page over analytics */
    }

    // 2. Decorate app.infrabox.software links at interaction time. We handle
    //    pointerdown (covers normal + middle-click + ctrl/cmd-click + "open in
    //    new tab") and click as a fallback. Setting a.href before default
    //    navigation runs is what makes the param survive the hop.
    const decorateAnchor = (target) => {
      if (!target || typeof target.closest !== "function") return;
      const anchor = target.closest("a");
      if (!anchor || !anchor.href) return;
      try {
        const next = decorateUrl(anchor.href);
        if (next && next !== anchor.href) anchor.href = next;
      } catch {
        /* leave the original href untouched on any error */
      }
    };

    const handler = (e) => decorateAnchor(e.target);

    document.addEventListener("pointerdown", handler, true);
    document.addEventListener("click", handler, true);
    document.addEventListener("auxclick", handler, true);

    return () => {
      document.removeEventListener("pointerdown", handler, true);
      document.removeEventListener("click", handler, true);
      document.removeEventListener("auxclick", handler, true);
    };
  }, []);

  return null;
}
