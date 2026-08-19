"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

/**
 * Loads all non-essential third-party analytics/marketing scripts AFTER the first
 * user interaction (or a short idle fallback), instead of during the critical page load.
 *
 * Why: GTM/GA, PostHog, Vector, Gleap, Clarity and HappierLeads together added ~4-5s of
 * main-thread work that blocked first paint and tanked the Lighthouse TBT. None of them
 * are needed before the user engages with the page.
 *
 * No data is lost: real users fire scroll/mousemove/touch within ~1s, so the scripts
 * initialize almost immediately and capture pageviews + events as normal. The DataFast
 * queue stub in <head> buffers any events fired before the script flushes.
 *
 * Every vendor below is gated on its own NEXT_PUBLIC_* env var and renders nothing when
 * that var is unset. The previously hardcoded IDs belonged to InboxKit's vendor accounts
 * and were removed during the Infrabox rebrand — set the Infrabox equivalents in .env to
 * switch a vendor back on. See README "Analytics & support vendors".
 */

const INTERACTION_EVENTS = [
  "scroll",
  "pointerdown",
  "mousemove",
  "touchstart",
  "keydown",
  "click",
];

// Fallback for sessions that never interact (e.g. a tab left open) so analytics still fire.
const FALLBACK_DELAY_MS = 5000;

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const DATAFAST_WEBSITE_ID = process.env.NEXT_PUBLIC_DATAFAST_WEBSITE_ID;
const DATAFAST_DOMAIN = process.env.NEXT_PUBLIC_DATAFAST_DOMAIN;
const VECTOR_ID = process.env.NEXT_PUBLIC_VECTOR_ID;
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";
const PARTNERO_PROGRAM = process.env.NEXT_PUBLIC_PARTNERO_PROGRAM;
const GLEAP_KEY = process.env.NEXT_PUBLIC_GLEAP_KEY;
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;
const HAPPIERLEADS_CLIENT_ID = process.env.NEXT_PUBLIC_HAPPIERLEADS_CLIENT_ID;
const COOKIE_DOMAIN = process.env.NEXT_PUBLIC_COOKIE_DOMAIN || ".infrabox.software";

export default function DeferredAnalytics() {
  const [load, setLoad] = useState(false);

  useEffect(() => {
    if (load) return;

    let fallbackTimer;
    const trigger = () => {
      setLoad(true);
      cleanup();
    };

    const cleanup = () => {
      INTERACTION_EVENTS.forEach((evt) =>
        window.removeEventListener(evt, trigger, { passive: true })
      );
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };

    INTERACTION_EVENTS.forEach((evt) =>
      window.addEventListener(evt, trigger, { passive: true, once: false })
    );
    fallbackTimer = setTimeout(trigger, FALLBACK_DELAY_MS);

    return cleanup;
  }, [load]);

  if (!load) return null;

  return (
    <>
      {/* Google Analytics (gtag) */}
      {GA_ID && (
        <>
          <Script
            id="ga-gtag"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          />
          <Script
            id="ga-config"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              page_title: document.title,
              page_location: window.location.href,
              cookie_domain: '${COOKIE_DOMAIN}',
              linker: { domains: ['infrabox.software', 'app.infrabox.software'], accept_incoming: true }
            });
          `,
            }}
          />
        </>
      )}

      {/* DataFast tracking — queued events in the <head> stub flush once this loads */}
      {DATAFAST_WEBSITE_ID && (
        <Script
          id="datafast-tracking"
          strategy="afterInteractive"
          src="/js/script.js"
          data-website-id={DATAFAST_WEBSITE_ID}
          data-domain={DATAFAST_DOMAIN || "infrabox.software"}
        />
      )}

      {/* Vector */}
      {VECTOR_ID && (
        <Script
          id="vector-tracking"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            !function(e,r){try{if(e.vector)return;var t={};t.q=t.q||[];for(var o=["load","identify","on"],n=function(e){return function(){var r=Array.prototype.slice.call(arguments);t.q.push([e,r])}},c=0;c<o.length;c++){var a=o[c];t[a]=n(a)}if(e.vector=t,!t.loaded){var i=r.createElement("script");i.type="text/javascript",i.async=!0,i.src="https://cdn.vector.co/pixel.js";var l=r.getElementsByTagName("script")[0];l.parentNode.insertBefore(i,l),t.loaded=!0}}catch(e){}}(window,document);
            vector.load("${VECTOR_ID}");
          `,
          }}
        />
      )}

      {/* PostHog */}
      {POSTHOG_KEY && (
        <Script
          id="posthog-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            !function(t,e){var o,n,p,r;e.__SV||(window.posthog && window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init Xr es pi Zr rs Kr Qr capture Ni calculateEventProperties os register register_once register_for_session unregister unregister_for_session ds getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey displaySurvey cancelPendingSurvey canRenderSurvey canRenderSurveyAsync identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException startExceptionAutocapture stopExceptionAutocapture loadToolbar get_property getSessionProperty us ns createPersonProfile hs Vr vs opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing get_explicit_consent_status is_capturing clear_opt_in_out_capturing ss debug O ls getPageViewId captureTraceFeedback captureTraceMetric qr".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
            // Strip auth tokens / Google One-Tap credentials out of any URL
            // property before PostHog stores or sends it (e.g. an entry URL like
            // /auth/callback?credential=<JWT> on the app subdomain).
            var PH_SENSITIVE_PARAMS = ['credential','token','access_token','id_token','refresh_token','code','password','secret','api_key','apikey','jwt','auth','session'];
            function phScrubUrl(value){
              if (typeof value !== 'string' || value.indexOf('?') === -1) return value;
              return value.replace(new RegExp('([?&](?:' + PH_SENSITIVE_PARAMS.join('|') + ')=)[^&#]*','gi'), '$1__redacted__');
            }
            var PH_URL_PROPS = ['$current_url','$initial_current_url','$referrer','$initial_referrer','$pathname'];
            function phScrubProps(props){
              if (!props || typeof props !== 'object') return props;
              for (var k in props){
                if (!Object.prototype.hasOwnProperty.call(props, k)) continue;
                var v = props[k];
                if (typeof v === 'string' && (PH_URL_PROPS.indexOf(k) !== -1 || v.indexOf('?') !== -1)) {
                  props[k] = phScrubUrl(v);
                } else if (v && typeof v === 'object' && (k === '$set' || k === '$set_once')) {
                  phScrubProps(v);
                }
              }
              return props;
            }
            posthog.init('${POSTHOG_KEY}', {
              api_host: '${POSTHOG_HOST}',
              capture_pageview: true,
              capture_pageleave: true,
              persistence: 'localStorage',
              autocapture: true,
              person_profiles: 'identified_only',
              cross_subdomain_cookie: true,
              sanitize_properties: phScrubProps,
              session_recording: {
                recordCrossOriginIframes: true,
                maskAllInputs: false,
                maskInputOptions: { password: true }
              }
            });
          `,
          }}
        />
      )}

      {/* Partnero */}
      {PARTNERO_PROGRAM && (
        <Script
          id="partnero-js"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            (function(p,t,n,e,r,o){ p['__partnerObject']=r;function f(){
            var c={ a:arguments,q:[]};var r=this.push(c);return "number"!=typeof r?r:f.bind(c.q);}
            f.q=f.q||[];p[r]=p[r]||f.bind(f.q);p[r].q=p[r].q||f.q;o=t.createElement(n);
            var _=t.getElementsByTagName(n)[0];o.async=1;o.src=e+'?v'+(~~(new Date().getTime()/1e6));
            _.parentNode.insertBefore(o,_);})(window, document, 'script', 'https://app.partnero.com/js/universal.js', 'po');
            po('settings', 'assets_host', 'https://assets.partnero.com');
            po('program', '${PARTNERO_PROGRAM}', 'load');
          `,
          }}
        />
      )}

      {/* Gleap support widget */}
      {GLEAP_KEY && (
        <Script
          id="gleap-widget"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            !function(Gleap,t,i){if(!(Gleap=window.Gleap=window.Gleap||[]).invoked){for(window.GleapActions=[],Gleap.invoked=!0,Gleap.methods=["identify","setContact","attachCustomData","setCustomData","removeCustomData","clearCustomData","registerCustomAction","trackEvent","log","preFillForm","showSurvey","sendSilentCrashReport","startFeedbackFlow","startBot","setAiTools","setTicketAttribute","showFeedbackButton","setLanguage","setFrameUrl","isOpened","open","close","on","setOfflineMode","initialize","disableConsoleLogOverwrite","logEvent","hide","enableShortcuts","showNotification","setStyles","destroy","isLiveMode","getIdentity","clearIdentity"],Gleap.f=function(e){return function(){var t=Array.prototype.slice.call(arguments);window.GleapActions.push({e:e,a:t})}},i=0;i<Gleap.methods.length;i++)t=Gleap.methods[i],Gleap[t]=Gleap.f(t);Gleap.load=function(){var t=document.getElementsByTagName("head")[0],i=document.createElement("script");i.type="text/javascript",i.async=!0,i.src="https://sdk.gleap.io/latest/index.js",t.appendChild(i)},Gleap.load(),Gleap.initialize("${GLEAP_KEY}"),Gleap.on("initialized",function(){Gleap.showFeedbackButton();Gleap.setCustomData("sla",180);Gleap.setStyles({zIndex:999999})})}}();
          `,
          }}
        />
      )}

      {/* Microsoft Clarity */}
      {CLARITY_ID && (
        <Script
          id="clarity-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${CLARITY_ID}");
          `,
          }}
        />
      )}

      {/* HappierLeads visitor tracking */}
      {HAPPIERLEADS_CLIENT_ID && (
        <Script
          id="happierleads"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `!function(){var e="rest.happierleads.com/v3/script?clientId=${HAPPIERLEADS_CLIENT_ID}&version=4.0.0",t=document.createElement("script");window.location.protocol.split(":")[0];t.src="https://"+e;var c=document.getElementsByTagName("script")[0];t.async=true;t.onload=function(){new Happierleads.default};c.parentNode.insertBefore(t,c)}();`,
          }}
        />
      )}
    </>
  );
}
