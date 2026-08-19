'use client';

import React, { useState, useMemo } from 'react';
import { calculate } from '@/lib/pricing-calculator/engine';
import { reverseFunnel } from '@/lib/pricing-calculator/funnel';
import pricing from '@/lib/pricing-calculator/pricing.config.json';
import { getCalendlyUrl } from '@/lib/booking';

// Provider accents: monochrome Infrabox teal scale (brand colors only).
// The Google/Microsoft/Azure logo blues are not the Infrabox palette, so
// providers are distinguished by shade of the brand teal + label.
const PROVIDER_COLOR = {
  google: '#1240cc',
  microsoft: '#2f6b69',
  azure: '#6f9ef5',
};

// Official provider brand logos as inline SVG (crisp at any size, no network
// dependency). These use each vendor's real brand colors, which brand-profile
// explicitly allows for showing integrations.
function ProviderLogo({ provider, className }) {
  if (provider === 'google') {
    return (
      <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
        <path
          fill="#EA4335"
          d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
        />
        <path
          fill="#4285F4"
          d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
        />
        <path
          fill="#FBBC05"
          d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
        />
        <path
          fill="#34A853"
          d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
        />
      </svg>
    );
  }
  if (provider === 'microsoft') {
    return (
      <svg className={className} viewBox="0 0 23 23" aria-hidden="true">
        <path fill="#F25022" d="M1 1h10v10H1z" />
        <path fill="#7FBA00" d="M12 1h10v10H12z" />
        <path fill="#00A4EF" d="M1 12h10v10H1z" />
        <path fill="#FFB900" d="M12 12h10v10H12z" />
      </svg>
    );
  }
  // azure
  return (
    <svg className={className} viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#114A8B"
        d="M6.13 1.6h4.51L5.96 15.49a.72.72 0 0 1-.68.49H1.77a.72.72 0 0 1-.68-.95L5.45 2.09a.72.72 0 0 1 .68-.49z"
      />
      <path
        fill="#0078D4"
        d="M12.7 11.09H5.55a.33.33 0 0 0-.23.57l4.6 4.29a.72.72 0 0 0 .49.19h4.05z"
      />
      <path
        fill="#3CCBF4"
        d="M12.55 2.09a.72.72 0 0 0-.68-.49H6.18a.72.72 0 0 1 .68.49l4.36 12.95a.72.72 0 0 1-.68.95h5.69a.72.72 0 0 0 .68-.95z"
      />
    </svg>
  );
}

// Theme constants (Infrabox).
const PRIMARY = '#1240cc';
const PRIMARY_HOVER = '#0b34b4';
const INK = '#001050';
const MINT = '#DAFCD5';

// Infrabox booking link (same Calendly the Talk-to-Sales / BookCall flow uses).
const CALENDAR_URL = getCalendlyUrl('sales', { embed: false }) || 'mailto:hey@infrabox.software?subject=Strategy%20call%20request';

// Custom-pricing thresholds live in the config so the engine and the copy
// cannot drift apart. Combined Google + Microsoft mailboxes, or Azure tenants.
const CUSTOM_MAILBOX_THRESHOLD = pricing.customPricingFrom;
const CUSTOM_AZURE_TENANT_THRESHOLD = pricing.customAzureTenantsFrom;

// Forward volume is entered as a monthly figure (how buyers think) and
// converted to the engine's daily basis with the same sending-days assumption
// the reverse funnel uses.
const SENDING_DAYS = pricing.funnel.sendingDaysPerMonth;

// ---- display-only formatting helpers (the rounding boundary) ----
function money(n) {
  return (
    '$' +
    (n || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}
function pct(frac) {
  return Math.round((frac || 0) * 100);
}
function intFmt(n) {
  return Math.round(n || 0).toLocaleString('en-US');
}

// Pick a foreground that meets contrast on a given teal shade (WCAG-ish).
// Light teal (#6f9ef5) gets ink text; darker teals get white.
function readableOn(hex) {
  const h = hex.replace('#', '');
  const toLin = (c) => {
    const s = parseInt(c, 16) / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const L =
    0.2126 * toLin(h.slice(0, 2)) +
    0.7152 * toLin(h.slice(2, 4)) +
    0.0722 * toLin(h.slice(4, 6));
  return L > 0.3 ? INK : '#ffffff';
}

// Initialize per-provider override state FROM pricing.providers so there are
// no literal block/epd numbers in this file.
function initialOverrides() {
  const out = {};
  ['google', 'microsoft', 'azure'].forEach((p) => {
    out[p] = {
      block: pricing.providers[p].block,
      epd: pricing.providers[p].epd,
    };
  });
  return out;
}

const CYCLE_OPTIONS = ['monthly', 'quarterly', 'annual'];
const MODE_OPTIONS = [
  { id: 'forward', main: 'I know my volume', sub: 'size by daily sends' },
  { id: 'reverse', main: 'I have a goal', sub: 'work back from meetings' },
];
const PRESETS = [
  { label: 'Google heavy', mix: { google: 70, microsoft: 30, azure: 0 } },
  { label: 'Balanced', mix: { google: 34, microsoft: 33, azure: 33 } },
  { label: 'Microsoft heavy', mix: { google: 30, microsoft: 70, azure: 0 } },
  { label: 'All Google', mix: { google: 100, microsoft: 0, azure: 0 } },
];

export default function PricingCalculator() {
  const [mode, setMode] = useState('forward');

  // Forward input is a monthly volume (converted to a daily basis for sizing).
  const [monthlyVolume, setMonthlyVolume] = useState(30000);

  // Reverse inputs (rates stored as fractions, shown as percentages).
  const [meetings, setMeetings] = useState(pricing.funnel.defaultMeetings);
  const [meetingRate, setMeetingRate] = useState(pricing.funnel.meetingRate);
  const [positiveReplyRate, setPositiveReplyRate] = useState(
    pricing.funnel.positiveReplyRate
  );
  const [sendingDays, setSendingDays] = useState(
    pricing.funnel.sendingDaysPerMonth
  );

  const [mix, setMix] = useState({ google: 70, microsoft: 30, azure: 0 });
  const [cycle, setCycle] = useState('monthly');
  const [warmup, setWarmup] = useState(false);
  const [infraGuard, setInfraGuard] = useState(false);
  const [tld, setTld] = useState('.com');
  const [overrides, setOverrides] = useState(initialOverrides);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  // Reverse funnel: meetings goal -> required daily send target.
  const funnel = useMemo(
    () =>
      reverseFunnel({ meetings, meetingRate, positiveReplyRate, sendingDays }),
    [meetings, meetingRate, positiveReplyRate, sendingDays]
  );

  // The daily target that drives all downstream sizing. In reverse mode it is
  // derived from the funnel; in forward mode it is entered directly.
  const effectiveDaily =
    mode === 'reverse' ? funnel.dailyTarget : monthlyVolume / SENDING_DAYS;

  // Build the engine input. All math is delegated to calculate(). Every mailbox
  // is charged at a flat band rate (1-29, 30-99, 100-199) with no base fee.
  // Past the custom-pricing thresholds the UI routes to a call, not a quote.
  const input = useMemo(
    () => ({
      dailyTarget: effectiveDaily,
      mix,
      cycle,
      warmup,
      infraGuard,
      tld,
      overrides,
    }),
    [effectiveDaily, mix, cycle, warmup, infraGuard, tld, overrides]
  );

  const r = useMemo(() => calculate(input, pricing), [input]);

  // Same setup priced on every cycle, so the "x% off" labels show the real
  // saving for this configuration rather than a generic headline number.
  const byCycle = useMemo(
    () =>
      CYCLE_OPTIONS.reduce((acc, id) => {
        acc[id] = calculate({ ...input, cycle: id }, pricing);
        return acc;
      }, {}),
    [input]
  );

  const rawMixSum = mix.google + mix.microsoft + mix.azure;
  const showMixNote = !r.mixOk && rawMixSum !== 0;
  const invalid = !r.valid;

  // At high volume we stop quoting list pricing and route to a sales call.
  const customPricing = r.customPricing;

  // Saving against paying monthly, for this exact configuration.
  const savingsByCycle = CYCLE_OPTIONS.reduce((acc, id) => {
    acc[id] = byCycle[id]?.cycleSavings || 0;
    return acc;
  }, {});

  function setMixKey(key, value) {
    setMix((m) => ({ ...m, [key]: value }));
  }

  function setOverride(provider, field, rawValue) {
    const v = rawValue.trim();
    const num = Number(v);
    // Fall back to the config default when blank or non-positive, so the input
    // value always reflects a real sizing parameter sourced from pricing.providers.
    const next = v !== '' && num > 0 ? num : pricing.providers[provider][field];
    setOverrides((o) => ({
      ...o,
      [provider]: { ...o[provider], [field]: next },
    }));
  }

  // Percent-field editing: display fraction*100, store back as a fraction in
  // (0, 1]. Falls back to the config default when blank or out of range.
  function setRate(setter, configValue, rawValue) {
    const v = rawValue.trim();
    const num = Number(v);
    if (v === '' || !(num > 0) || num > 100) {
      setter(configValue);
      return;
    }
    setter(num / 100);
  }
  function asPct(frac) {
    return +(frac * 100).toFixed(2);
  }

  const reduceMotion = 'motion-reduce:transition-none';

  // ---- shared class fragments ----
  const focusRing =
    'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1240cc]';

  const segBtnBase =
    'flex-1 min-w-max text-center rounded-md border px-3 py-2 text-[0.8125rem] font-medium ' +
    'transition-colors ' +
    reduceMotion +
    ' ' +
    focusRing;

  const numberInput =
    'w-full rounded-md border border-gray-300 px-3 py-2.5 text-[0.9375rem] tabular-nums ' +
    focusRing;

  const mixProviders = [
    { key: 'google', label: 'Google Workspace' },
    { key: 'microsoft', label: 'Microsoft 365' },
    { key: 'azure', label: 'Azure' },
  ];

  return (
    <div
      className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pt-2 pb-10"
      style={{
        color: '#4b5563',
        backgroundImage:
          'radial-gradient(circle, rgba(18, 64, 204, 0.05) 1px, transparent 1.5px)',
        backgroundSize: '22px 22px',
      }}
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start">
        {/* ---------------- CONTROLS ---------------- */}
        <section className="ik-rise">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-[0_1px_2px_rgba(0, 16, 80,0.04),0_12px_28px_-16px_rgba(0, 16, 80,0.12)]">
            {/* Mode toggle */}
            <div className="mb-6">
              <div className="mb-2 text-[0.7rem] font-semibold uppercase tracking-wide text-gray-400">
                Start from
              </div>
              <div
                className="grid grid-cols-2 gap-1 rounded-lg bg-[#f9fafb] p-1"
                role="group"
                aria-label="Calculator mode"
              >
                {MODE_OPTIONS.map((m) => {
                  const pressed = mode === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      aria-pressed={pressed}
                      onClick={() => setMode(m.id)}
                      className={
                        'rounded-md px-4 py-3 text-[0.8125rem] font-medium transition-colors ' +
                        reduceMotion +
                        ' ' +
                        focusRing
                      }
                      style={
                        pressed
                          ? { background: PRIMARY, color: '#fff' }
                          : { background: 'transparent', color: '#4b5563' }
                      }
                    >
                      {m.main}
                      <span className="mt-px block text-[0.7rem] font-normal opacity-85">
                        {m.sub}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ---- Forward input: monthly send volume ---- */}
            {mode === 'forward' && (
              <div className="mb-6">
                <div className="mb-2 flex items-baseline justify-between gap-3">
                  <label
                    htmlFor="ik-volume-range"
                    className="text-[0.8125rem] font-semibold"
                    style={{ color: INK }}
                  >
                    Monthly send volume
                  </label>
                  <span className="text-[0.8125rem] text-gray-500">
                    <span className="tabular-nums">{intFmt(monthlyVolume)}</span>{' '}
                    emails / month
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    id="ik-volume-range"
                    type="range"
                    min={0}
                    max={300000}
                    step={1000}
                    value={Math.min(monthlyVolume, 300000)}
                    onChange={(e) => setMonthlyVolume(Number(e.target.value))}
                    aria-label="Monthly send volume slider"
                    className={'ik-range w-full ' + focusRing}
                    style={{ accentColor: PRIMARY }}
                  />
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    value={monthlyVolume}
                    onChange={(e) =>
                      setMonthlyVolume(Math.max(0, Number(e.target.value) || 0))
                    }
                    aria-label="Monthly send volume exact value"
                    className={'w-32 text-base ' + numberInput}
                    style={{ color: INK }}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-400">
                  About{' '}
                  <span className="tabular-nums">
                    {intFmt(monthlyVolume / SENDING_DAYS)}
                  </span>{' '}
                  emails per day across {SENDING_DAYS} sending days.
                </p>
              </div>
            )}

            {/* ---- Reverse input: meetings goal + funnel ---- */}
            {mode === 'reverse' && (
              <div className="mb-6">
                <div className="mb-2 flex items-baseline justify-between gap-3">
                  <label
                    htmlFor="ik-meetings-range"
                    className="text-[0.8125rem] font-semibold"
                    style={{ color: INK }}
                  >
                    Meetings booked / month
                  </label>
                  <span className="text-[0.8125rem] text-gray-500">
                    goal:{' '}
                    <span className="tabular-nums">{intFmt(meetings)}</span>{' '}
                    meetings
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    id="ik-meetings-range"
                    type="range"
                    min={0}
                    max={200}
                    step={1}
                    value={Math.min(meetings, 200)}
                    onChange={(e) => setMeetings(Number(e.target.value))}
                    aria-label="Meetings booked per month slider"
                    className={'ik-range w-full ' + focusRing}
                    style={{ accentColor: PRIMARY }}
                  />
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={meetings}
                    onChange={(e) =>
                      setMeetings(Math.max(0, Number(e.target.value) || 0))
                    }
                    aria-label="Meetings booked per month exact value"
                    className={'w-32 text-base ' + numberInput}
                    style={{ color: INK }}
                  />
                </div>

                {/* Editable funnel rates (benchmark defaults from config) */}
                <div className="mt-4 grid grid-cols-3 gap-2.5">
                  <div>
                    <label
                      htmlFor="ik-meeting-rate"
                      className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-wide text-gray-400"
                    >
                      Reply to meeting
                    </label>
                    <div className="flex items-center gap-1">
                      <input
                        id="ik-meeting-rate"
                        type="number"
                        min={0.1}
                        max={100}
                        step={1}
                        value={asPct(meetingRate)}
                        onChange={(e) =>
                          setRate(
                            setMeetingRate,
                            pricing.funnel.meetingRate,
                            e.target.value
                          )
                        }
                        aria-label="Share of positive replies that become a booked meeting, percent"
                        className={'w-full ' + numberInput}
                        style={{ color: INK }}
                      />
                      <span className="text-sm text-gray-400">%</span>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="ik-reply-rate"
                      className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-wide text-gray-400"
                    >
                      Positive reply
                    </label>
                    <div className="flex items-center gap-1">
                      <input
                        id="ik-reply-rate"
                        type="number"
                        min={0.1}
                        max={100}
                        step={0.1}
                        value={asPct(positiveReplyRate)}
                        onChange={(e) =>
                          setRate(
                            setPositiveReplyRate,
                            pricing.funnel.positiveReplyRate,
                            e.target.value
                          )
                        }
                        aria-label="Positive replies per email sent, percent"
                        className={'w-full ' + numberInput}
                        style={{ color: INK }}
                      />
                      <span className="text-sm text-gray-400">%</span>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="ik-sending-days"
                      className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-wide text-gray-400"
                    >
                      Sending days
                    </label>
                    <input
                      id="ik-sending-days"
                      type="number"
                      min={1}
                      max={31}
                      step={1}
                      value={sendingDays}
                      onChange={(e) => {
                        const n = Number(e.target.value);
                        setSendingDays(
                          n > 0 ? n : pricing.funnel.sendingDaysPerMonth
                        );
                      }}
                      aria-label="Sending days per month"
                      className={numberInput}
                      style={{ color: INK }}
                    />
                  </div>
                </div>

                {/* Funnel chain */}
                {funnel.valid ? (
                  <div className="mt-4 rounded-xl border border-gray-200 bg-[#f9fafb] p-3.5">
                    <div className="mb-2 text-[0.7rem] font-semibold uppercase tracking-wide text-gray-400">
                      What it takes
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[0.8125rem]">
                      <FunnelStep
                        v={intFmt(meetings)}
                        k="meetings / mo"
                      />
                      <Arrow />
                      <FunnelStep
                        v={intFmt(funnel.positiveRepliesNeeded)}
                        k="positive replies"
                      />
                      <Arrow />
                      <FunnelStep
                        v={intFmt(funnel.emailsPerMonth)}
                        k="emails / mo"
                      />
                      <Arrow />
                      <FunnelStep
                        v={intFmt(funnel.dailyTarget)}
                        k="emails / day"
                        emphasize
                      />
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-gray-400">
                    Set a monthly meetings goal above zero to size the
                    infrastructure.
                  </p>
                )}
              </div>
            )}

            {/* Provider mix */}
            <div className="mb-6">
              <div className="mb-3">
                <span
                  className="text-[0.8125rem] font-semibold"
                  style={{ color: INK }}
                >
                  Provider mix
                </span>
              </div>

              {mixProviders.map(({ key, label }) => (
                <div
                  key={key}
                  className="mb-3.5 grid grid-cols-[7rem_1fr_2.75rem] items-center gap-3"
                >
                  <span
                    className="inline-flex items-center gap-2 text-[0.8125rem] font-medium"
                    style={{ color: INK }}
                  >
                    <ProviderLogo provider={key} className="h-4 w-4 flex-none" />
                    {label.split(' ')[0]}
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={mix[key]}
                    onChange={(e) => setMixKey(key, Number(e.target.value))}
                    aria-label={label + ' weight'}
                    className={'ik-range w-full ' + focusRing}
                    style={{ accentColor: PROVIDER_COLOR[key] }}
                  />
                  <span
                    className="text-right font-semibold tabular-nums"
                    style={{ color: INK }}
                  >
                    {pct(r.fractions[key])}%
                  </span>
                </div>
              ))}

              <div className="mt-2 flex flex-wrap gap-2">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setMix({ ...preset.mix })}
                    className={
                      'rounded-full border border-gray-300 bg-white px-3 py-1.5 text-[0.8125rem] font-medium text-gray-600 ' +
                      'transition-colors hover:border-[#1240cc] hover:text-[#1240cc] ' +
                      reduceMotion +
                      ' ' +
                      focusRing
                    }
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {showMixNote && (
                <div
                  className="mt-2.5 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs"
                  style={{ background: '#fef3c7', color: '#b45309' }}
                  role="status"
                >
                  Normalized to 100% automatically.
                </div>
              )}
            </div>

            {/* Billing cycle */}
            <div className="mb-6">
              <div className="mb-2">
                <span
                  className="text-[0.8125rem] font-semibold"
                  style={{ color: INK }}
                >
                  Billing cycle
                </span>
              </div>
              <div
                className="flex flex-wrap gap-1.5"
                role="group"
                aria-label="Billing cycle"
              >
                {CYCLE_OPTIONS.map((id) => {
                  const pressed = cycle === id;
                  const label = id.charAt(0).toUpperCase() + id.slice(1);
                  return (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={pressed}
                      onClick={() => setCycle(id)}
                      className={segBtnBase}
                      style={
                        pressed
                          ? {
                              background: PRIMARY,
                              borderColor: PRIMARY,
                              color: '#fff',
                            }
                          : { borderColor: '#d1d5db', color: '#4b5563' }
                      }
                    >
                      {label}
                      <span className="mt-px block text-[0.7rem] font-normal opacity-85">
                        {savingsByCycle[id] > 0
                          ? pct(savingsByCycle[id]) + '% off'
                          : 'list price'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Toggles */}
            <div className="mb-6">
              <ToggleRow
                id="ik-warmup"
                label="Warmup"
                sub="Automated inbox warmup, priced per mailbox."
                checked={warmup}
                onChange={setWarmup}
                reduceMotion={reduceMotion}
              />
              <ToggleRow
                id="ik-infraguard"
                label="InfraGuard"
                sub="DNS and deliverability monitoring, priced per domain."
                checked={infraGuard}
                onChange={setInfraGuard}
                reduceMotion={reduceMotion}
                last
              />
            </div>

            {/* Advanced */}
            <div className="rounded-xl border border-dashed border-gray-200 px-4">
              <button
                type="button"
                onClick={() => setAdvancedOpen((v) => !v)}
                aria-expanded={advancedOpen}
                aria-controls="ik-advanced-body"
                className={
                  'flex w-full items-center justify-between py-4 text-[0.8125rem] font-semibold ' +
                  focusRing
                }
                style={{ color: INK }}
              >
                <span>Advanced: provider sizing and domain TLD</span>
                <span className="text-lg text-gray-500" aria-hidden="true">
                  {advancedOpen ? '−' : '+'}
                </span>
              </button>

              {advancedOpen && (
                <div id="ik-advanced-body" className="pb-5">
                  {/* Sub-section: Provider sizing */}
                  <div className="pt-1">
                    <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-wide text-gray-400">
                      Provider sizing
                    </p>
                    <div className="grid grid-cols-[1fr_5.5rem_5.5rem] items-end gap-x-3 gap-y-3">
                      <span className="text-[0.7rem] font-semibold uppercase tracking-wide text-gray-400">
                        Provider
                      </span>
                      <span className="whitespace-nowrap text-right text-[0.7rem] font-semibold uppercase tracking-wide text-gray-400">
                        Mailboxes
                        <span className="block font-normal normal-case tracking-normal text-gray-400">
                          per domain
                        </span>
                      </span>
                      <span className="whitespace-nowrap text-right text-[0.7rem] font-semibold uppercase tracking-wide text-gray-400">
                        Emails/day
                        <span className="block font-normal normal-case tracking-normal text-gray-400">
                          per mailbox
                        </span>
                      </span>

                      {mixProviders.map(({ key, label }) => (
                        <React.Fragment key={key}>
                          <span
                            className="inline-flex items-center gap-2 text-[0.85rem] font-medium"
                            style={{ color: INK }}
                          >
                            <span
                              className="h-2.5 w-2.5 flex-none rounded-sm"
                              style={{ background: PROVIDER_COLOR[key] }}
                              aria-hidden="true"
                            />
                            {label}
                          </span>
                          <input
                            type="number"
                            min={1}
                            step={1}
                            value={overrides[key].block}
                            onChange={(e) =>
                              setOverride(key, 'block', e.target.value)
                            }
                            aria-label={label + ' mailboxes per domain'}
                            className={
                              'w-full rounded-md border border-gray-300 px-2.5 py-2 text-[0.85rem] tabular-nums ' +
                              focusRing
                            }
                            style={{ color: INK }}
                          />
                          <input
                            type="number"
                            min={1}
                            step={1}
                            value={overrides[key].epd}
                            onChange={(e) =>
                              setOverride(key, 'epd', e.target.value)
                            }
                            aria-label={label + ' emails per day'}
                            className={
                              'w-full rounded-md border border-gray-300 px-2.5 py-2 text-[0.85rem] tabular-nums ' +
                              focusRing
                            }
                            style={{ color: INK }}
                          />
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="my-5 border-t border-dashed border-gray-200" />

                  {/* Sub-section: Domain TLD */}
                  <div>
                    <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-wide text-gray-400">
                      Domain TLD
                    </p>
                    <label
                      htmlFor="ik-tld"
                      className="mb-2 block text-[0.8125rem] font-semibold"
                      style={{ color: INK }}
                    >
                      Domain TLD (billed annually)
                    </label>
                    <select
                      id="ik-tld"
                      value={tld}
                      onChange={(e) => setTld(e.target.value)}
                      className={
                        'w-full rounded-md border border-gray-300 px-2.5 py-2 text-[0.9375rem] ' +
                        focusRing
                      }
                      style={{ color: INK }}
                    >
                      {Object.keys(pricing.tld).map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ---------------- RESULTS ---------------- */}
        <section className="ik-rise ik-rise-2 lg:sticky lg:top-8">
          <div className="rounded-2xl border border-gray-200 border-l-4 border-l-[#DAFCD5] bg-white p-6 sm:p-8 shadow-[0_1px_2px_rgba(0, 16, 80,0.05),0_18px_44px_-22px_rgba(18, 64, 204,0.22)]">
            {invalid && (
              <div
                className="mb-4 rounded-md px-3.5 py-3 text-[0.8125rem]"
                style={{ background: '#fef3c7', color: '#b45309' }}
                role="alert"
              >
                {mode === 'reverse'
                  ? 'Enter a monthly meetings goal and at least one provider weight to see the infrastructure and cost.'
                  : 'Set a daily target above zero and at least one provider weight to see pricing.'}
              </div>
            )}

            {/* Hero: standard price, OR a custom-pricing call-to-action at scale */}
            {customPricing ? (
              <div
                className="mb-5 rounded-xl border p-5"
                style={{ borderColor: PRIMARY, background: MINT }}
              >
                <div
                  className="text-xs font-semibold uppercase tracking-wide"
                  style={{ color: PRIMARY_HOVER }}
                >
                  Custom volume pricing
                </div>
                <div
                  className="mt-1.5 text-xl font-semibold leading-snug"
                  style={{ color: INK }}
                >
                  At {intFmt(r.totalMailboxes)} mailboxes, you get custom pricing.
                </div>
                <p
                  className="mt-1.5 text-[0.8125rem] leading-relaxed"
                  style={{ color: PRIMARY_HOVER }}
                >
                  Past {CUSTOM_MAILBOX_THRESHOLD} mailboxes (or{' '}
                  {CUSTOM_AZURE_TENANT_THRESHOLD} Azure tenants) we build a
                  volume quote around your exact setup instead of list pricing.
                  Book a quick call and we will size it with you.
                </p>
                <a
                  href={CALENDAR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    'mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0b34b4] ' +
                    focusRing
                  }
                  style={{ background: PRIMARY }}
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                    <path d="m9 16 2 2 4-4" />
                  </svg>
                  Book a call
                </a>
              </div>
            ) : (
              <div className="mb-5 border-b border-dashed border-gray-200 pb-5">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Effective monthly cost
                </h3>
                <div
                  className="mt-1 text-[2.75rem] sm:text-[4.25rem] font-semibold leading-none tabular-nums"
                  style={{ color: INK }}
                >
                  {money(r.effMonthly)}{' '}
                  <span className="text-lg sm:text-xl font-medium text-gray-500">/ mo</span>
                </div>
                <div className="mt-1.5 flex flex-wrap gap-3 text-[0.8125rem] text-gray-500">
                  <span>
                    <b
                      className="font-semibold tabular-nums"
                      style={{ color: INK }}
                    >
                      {money(r.perMailbox)}
                    </b>{' '}
                    per mailbox
                  </span>
                  {r.band && (
                    <span>
                      {intFmt(r.band.from)}&ndash;{intFmt(r.band.upTo)} mailbox
                      band at{' '}
                      <b className="font-semibold" style={{ color: INK }}>
                        {money(r.mailboxRate)}
                      </b>
                    </span>
                  )}
                  <span>billed {cycle}</span>
                </div>
                {mode === 'reverse' && funnel.valid && (
                  <div className="mt-2 text-[0.8125rem] text-gray-500">
                    to book{' '}
                    <b className="font-semibold" style={{ color: INK }}>
                      {intFmt(meetings)}
                    </b>{' '}
                    meetings / month at{' '}
                    <span className="tabular-nums">
                      {intFmt(r.totalMailboxes)}
                    </span>{' '}
                    mailboxes
                  </div>
                )}
              </div>
            )}

            {/* Diversification bar (volume share) */}
            <div className="mb-1 flex justify-between text-xs font-semibold uppercase tracking-wide text-gray-500">
              <span>Volume diversification</span>
            </div>
            <div
              className="flex h-[36px] w-full overflow-hidden rounded-md border border-gray-200"
              style={{ background: '#f9fafb' }}
              role="img"
              aria-label="Provider volume diversification bar"
            >
              {mixProviders.map(({ key }) => {
                const frac = r.fractions[key];
                if (frac <= 0) return null;
                return (
                  <div
                    key={key}
                    className={
                      'flex items-center justify-center overflow-hidden whitespace-nowrap text-[0.7rem] font-semibold transition-[width] ' +
                      reduceMotion
                    }
                    style={{
                      width: frac * 100 + '%',
                      background: PROVIDER_COLOR[key],
                      color: readableOn(PROVIDER_COLOR[key]),
                    }}
                  >
                    {frac >= 0.12 ? pct(frac) + '%' : ''}
                  </div>
                );
              })}
            </div>
            <div className="mt-2.5 flex flex-wrap gap-4 text-xs text-gray-600">
              {mixProviders.map(({ key, label }) => (
                <span key={key} className="inline-flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 rounded-sm"
                    style={{ background: PROVIDER_COLOR[key] }}
                  />
                  {label.split(' ')[0]}{' '}
                  <span className="tabular-nums">{pct(r.fractions[key])}%</span>
                </span>
              ))}
            </div>

            {/* Provider cards (hidden when fraction is 0) */}
            <div className="my-5 grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3">
              {mixProviders.map(({ key, label }) => {
                if (r.fractions[key] === 0) return null;
                const prov = r.providers[key];
                const isAzure = key === 'azure';
                return (
                  <div
                    key={key}
                    className="rounded-xl bg-[#f9fafb] p-3.5"
                  >
                    <div
                      className="mb-2 flex items-center gap-2 text-[0.8125rem] font-semibold"
                      style={{ color: INK }}
                    >
                      <ProviderLogo provider={key} className="h-4 w-4 flex-none" />
                      {label}
                    </div>
                    <ProviderStat k="Sends / day" v={intFmt(prov.sends)} />
                    <ProviderStat k="Mailboxes" v={intFmt(prov.mailboxes)} />
                    <ProviderStat
                      k={isAzure ? 'Tenants' : 'Domains'}
                      v={intFmt(isAzure ? prov.tenants : prov.units)}
                    />
                  </div>
                );
              })}
            </div>

            {/* Cost breakdown (hidden at custom-pricing scale) */}
            {!customPricing && (
            <div className="border-t border-dashed border-gray-200 pt-4">
              <BdLine
                k={
                  r.nStandard > 0
                    ? 'Mailboxes (' +
                      intFmt(r.nStandard) +
                      ' x ' +
                      money(r.mailboxRate) +
                      ')'
                    : 'Mailboxes'
                }
                v={money(r.mailboxCost)}
              />

              {r.providers.azure.tenants > 0 && (
                <BdLine
                  k={
                    'Azure tenants (' +
                    intFmt(r.providers.azure.tenants) +
                    ' x ' +
                    money(pricing.azureTenant) +
                    ')'
                  }
                  v={money(r.azureCost)}
                />
              )}

              {warmup && (
                <BdLine
                  k={
                    'Warmup (' +
                    intFmt(r.totalMailboxes) +
                    ' mailboxes x ' +
                    money(pricing.warmupPerMailbox) +
                    ')'
                  }
                  v={money(r.warmupCost)}
                />
              )}

              {infraGuard && (
                <BdLine
                  k={
                    'InfraGuard (' +
                    intFmt(r.totalDomains) +
                    ' domains x ' +
                    money(pricing.infraGuardPerDomain) +
                    ')'
                  }
                  v={money(r.infraGuardCost)}
                />
              )}

              {/* Same setup on monthly billing, so the saving is legible.
                  Cycle savings are baked into the plan prices, not applied
                  as a separate discount on top. */}
              {r.cycleSavingsAmount > 0 && (
                <>
                  <div className="mt-1.5 flex justify-between gap-4 border-t border-gray-200 pt-2.5 text-sm text-gray-600">
                    <span>Same setup billed monthly</span>
                    <span className="tabular-nums line-through text-gray-400">
                      {money(r.monthlyListRecurring)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 py-1.5 text-sm">
                    <span className="text-gray-600">
                      {cycle === 'annual' ? 'Annual' : 'Quarterly'} billing saving
                      ({pct(r.cycleSavings)}%)
                    </span>
                    <span
                      className="tabular-nums font-medium"
                      style={{ color: PRIMARY }}
                    >
                      -{money(r.cycleSavingsAmount)}
                    </span>
                  </div>
                </>
              )}

              {/* Effective monthly */}
              {r.cycleSavingsAmount > 0 || (
                <div className="mt-1.5 border-t border-gray-200" />
              )}
              <div
                className="my-2 flex justify-between gap-4 rounded-md px-2.5 py-2 text-sm font-semibold"
                style={{ background: MINT, color: PRIMARY_HOVER }}
              >
                <span>Effective monthly</span>
                <span className="tabular-nums">{money(r.effMonthly)}</span>
              </div>

              {/* Domains billed annually (separate) */}
              <div className="flex justify-between gap-4 py-1.5 text-sm text-gray-400">
                <span>
                  Domains billed annually ({intFmt(r.totalDomains)} x{' '}
                  {money(pricing.tld[tld])} {tld})
                </span>
                <span className="tabular-nums">{money(r.domainsAnnual)}</span>
              </div>

              {/* First year total */}
              <div
                className="mt-1.5 flex justify-between gap-4 border-t pt-3 text-base sm:text-lg font-semibold"
                style={{ color: INK, borderColor: '#d1d5db' }}
              >
                <span>First year total</span>
                <span className="tabular-nums">{money(r.firstYear)}</span>
              </div>
            </div>
            )}
          </div>
        </section>
      </div>

      {/* Range thumb styling (teal accents) and reduced-motion guard. */}
      <style jsx>{`
        .ik-range {
          -webkit-appearance: none;
          appearance: none;
          height: 8px;
          border-radius: 9999px;
          background: #e5e7eb;
        }
        .ik-rise {
          opacity: 0;
          animation: ikRise 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .ik-rise-2 {
          animation-delay: 0.13s;
        }
        @keyframes ikRise {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .ik-rise,
          .ik-rise-2 {
            animation: none;
            opacity: 1;
            transform: none;
          }
        }
        .ik-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: ${PRIMARY};
          border: 2px solid #ffffff;
          box-shadow: 0 1px 3px 0 rgba(0, 16, 80, 0.2);
          cursor: pointer;
          transition: box-shadow 0.15s ease, transform 0.1s ease;
        }
        .ik-range:hover::-webkit-slider-thumb {
          box-shadow: 0 1px 3px 0 rgba(0, 16, 80, 0.2),
            0 0 0 6px rgba(218, 252, 213, 0.7);
        }
        .ik-range:active::-webkit-slider-thumb {
          transform: scale(1.08);
          box-shadow: 0 1px 3px 0 rgba(0, 16, 80, 0.25),
            0 0 0 8px rgba(218, 252, 213, 0.9);
        }
        .ik-range::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: ${PRIMARY};
          border: 2px solid #ffffff;
          box-shadow: 0 1px 3px 0 rgba(0, 16, 80, 0.2);
          cursor: pointer;
          transition: box-shadow 0.15s ease;
        }
        .ik-range:hover::-moz-range-thumb {
          box-shadow: 0 1px 3px 0 rgba(0, 16, 80, 0.2),
            0 0 0 6px rgba(218, 252, 213, 0.7);
        }
        @media (prefers-reduced-motion: reduce) {
          .ik-range,
          .transition-\\[width\\] {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}

function FunnelStep({ k, v, emphasize }) {
  return (
    <span className="inline-flex flex-col">
      <span
        className={
          'font-semibold tabular-nums leading-tight ' +
          (emphasize ? 'text-lg' : '')
        }
        style={{ color: emphasize ? '#1240cc' : '#001050' }}
      >
        {v}
      </span>
      <span className="text-[0.65rem] text-gray-500">{k}</span>
    </span>
  );
}

function Arrow() {
  return (
    <span className="text-gray-300" aria-hidden="true">
      &rarr;
    </span>
  );
}

function ProviderStat({ k, v }) {
  return (
    <div className="flex justify-between py-0.5 text-[0.8125rem]">
      <span className="text-gray-500">{k}</span>
      <span className="font-semibold tabular-nums" style={{ color: '#001050' }}>
        {v}
      </span>
    </div>
  );
}

function BdLine({ k, v }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 text-sm">
      <span className="text-gray-600">{k}</span>
      <span className="font-medium tabular-nums" style={{ color: '#001050' }}>
        {v}
      </span>
    </div>
  );
}

function ToggleRow({ id, label, sub, checked, onChange, reduceMotion, last }) {
  return (
    <div
      className={
        'flex items-center justify-between gap-4 py-2.5 ' +
        (last ? '' : 'border-b border-dashed border-gray-200')
      }
    >
      <div>
        <div className="text-sm font-semibold" style={{ color: '#001050' }}>
          {label}
        </div>
        <div className="text-xs text-gray-500">{sub}</div>
      </div>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        aria-label={'Enable ' + label + ' add-on'}
        onClick={() => onChange(!checked)}
        className={
          'relative inline-flex h-6 w-[42px] flex-none items-center rounded-full transition-colors ' +
          reduceMotion +
          ' focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1240cc]'
        }
        style={{ background: checked ? '#1240cc' : '#d1d5db' }}
      >
        <span
          className={
            'inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow transition-transform ' +
            reduceMotion +
            ' ' +
            (checked ? 'translate-x-[21px]' : 'translate-x-[3px]')
          }
        />
      </button>
    </div>
  );
}
