'use client';

import { useCallback, useRef } from 'react';
import { useGoogleOneTapLogin } from '@react-oauth/google';
import { getStoredAttribution } from '@/lib/attribution';

export default function GoogleOneTap({
  disabled = false,
  context = 'signup',
  autoSelect = false,
  cancelOnTapOutside = true,
}) {
  const isLoadingRef = useRef(false);

  // Handle credential response from Google
  const handleCredentialResponse = useCallback(async (credentialResponse) => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;

    try {
      // Redirect to app.infrabox.software callback with credential
      // The callback page will handle the API call and cookie setting
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.infrabox.software';
      const credential = encodeURIComponent(credentialResponse.credential);
      // Forward promo_slug cookie if present (set by /r/[slug] route)
      const promoSlug = document.cookie.split('; ').find(c => c.startsWith('promo_slug='))?.split('=')[1] || '';
      const promoParam = promoSlug ? `&promo_slug=${encodeURIComponent(promoSlug)}` : '';
      // Forward ad attribution captured on landing (gclid + real ad UTMs) so a
      // One-Tap signup ties back to its ad / keyword — the regular signup link
      // does this via decorateUrl; One-Tap bypasses links, so we append it here.
      // Normalize click id the same way the dashboard does: gclid || wbraid || gbraid.
      let attrParam = '';
      try {
        const stored = getStoredAttribution();
        const sp = new URLSearchParams();
        const clickId = stored.gclid || stored.wbraid || stored.gbraid;
        if (clickId) sp.set('gclid', clickId);
        for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']) {
          if (stored[key]) sp.set(key, stored[key]);
        }
        const qs = sp.toString();
        if (qs) attrParam = `&${qs}`;
      } catch {
        /* never block sign-in over analytics */
      }
      // Hand the Google credential to the app subdomain via a short-lived cookie
      // on the shared parent domain (.infrabox.software) instead of the URL. Putting a
      // JWT in the query string leaks it into analytics (PostHog initial URL),
      // server access logs, browser history and Referer headers. The callback page
      // reads and immediately deletes this cookie.
      const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
      const cookieAttrs = isLocal
        ? 'path=/; max-age=120; SameSite=Lax'
        : 'path=/; max-age=120; SameSite=Lax; Secure; domain=.infrabox.software';
      document.cookie = `ik_one_tap=${credential}; ${cookieAttrs}`;
      window.location.href = `${appUrl}/auth/callback?source=landing_page${promoParam}${attrParam}`;
    } catch (err) {
      console.error('Google One-Tap error:', err);
      isLoadingRef.current = false;
    }
  }, []);

  // Use the Google One Tap hook from @react-oauth/google
  useGoogleOneTapLogin({
    onSuccess: handleCredentialResponse,
    onError: () => {
      console.error('Google One-Tap login failed');
    },
    promptMomentNotification: (notification) => {
      // Debug logging
      if (notification.isDisplayMoment()) {
        console.log('Google One-Tap: Prompt displayed');
      }
      if (notification.isSkippedMoment()) {
        console.log('Google One-Tap: Prompt skipped, reason:', notification.getSkippedReason());
      }
      if (notification.isDismissedMoment()) {
        console.log('Google One-Tap: Prompt dismissed, reason:', notification.getDismissedReason());
      }
    },
    disabled: disabled,
    auto_select: autoSelect,
    cancel_on_tap_outside: false,
    context: context,
    use_fedcm_for_prompt: false,
  });

  // This component doesn't render anything visible
  return null;
}
