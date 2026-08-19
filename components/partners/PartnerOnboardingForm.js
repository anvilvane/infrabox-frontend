'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { ArrowLeft, ArrowRight, Check, CheckCircle2 } from 'lucide-react';
import { trackEvent } from '@/libs/posthog';
import {
  validateOnboarding,
  SERVICES_ENUM,
  SERVICE_LABELS,
} from '@/lib/partner-directory-validation';
import AssetUploadField from '@/components/partners/AssetUploadField';

const DESC_MAX = 2000;
const ONE_LINER_MAX = 200;

const EMPTY_TESTIMONIAL = { quote: '', name: '', title: '', company: '' };

const INITIAL = {
  company_name: '',
  website_url: '',
  logo_url: '',
  screenshot_url: '',
  headquarters: '',
  year_founded: '',
  one_liner: '',
  services: [],
  industries: '',
  pricing: '',
  tool_stack: '',
  description: '',
  companies_supported: '',
  headline_stats: '',
  testimonials: [{ ...EMPTY_TESTIMONIAL }],
  booking_url: '',
  infrabox_usage_notes: '',
  comarketing_opt_in: false,
  submitter_email: '',
  hp_field: '',
};

const inputCls =
  'w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1240cc] transition-colors';

const STEPS = [
  { n: 1, label: 'Company & services' },
  { n: 2, label: 'Pricing, tools & proof' },
  { n: 3, label: 'Booking & contact' },
];

const STEP_FIELDS = {
  1: [
    'company_name',
    'website_url',
    'logo_url',
    'screenshot_url',
    'headquarters',
    'year_founded',
    'one_liner',
    'services',
    'industries',
  ],
  2: [
    'pricing',
    'tool_stack',
    'description',
    'companies_supported',
    'headline_stats',
    'testimonials',
  ],
  3: ['booking_url', 'infrabox_usage_notes', 'comarketing_opt_in', 'submitter_email'],
};

function isStepError(step, key) {
  const fields = STEP_FIELDS[step];
  if (fields.includes(key)) return true;
  // testimonials.N.quote belongs to step 2
  if (step === 2 && key.startsWith('testimonials.')) return true;
  return false;
}

function filterErrorsForStep(allErrors, step) {
  const out = {};
  for (const [k, v] of Object.entries(allErrors)) {
    if (isStepError(step, k)) out[k] = v;
  }
  return out;
}

function commaSplit(s) {
  return String(s || '')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
}

function wordCount(s) {
  return String(s || '').trim().split(/\s+/).filter(Boolean).length;
}

export default function PartnerOnboardingForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  // Direct value setter (no event wrapper). Used by AssetUploadField etc.
  const setValue = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const setBool = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.checked }));

  const toggleService = (svc) => {
    setForm((f) => {
      const has = f.services.includes(svc);
      return {
        ...f,
        services: has ? f.services.filter((s) => s !== svc) : [...f.services, svc],
      };
    });
  };

  const setTestimonial = (idx, k) => (e) => {
    setForm((f) => {
      const next = f.testimonials.map((t, i) => (i === idx ? { ...t, [k]: e.target.value } : t));
      return { ...f, testimonials: next };
    });
  };

  const addTestimonial = () => {
    setForm((f) =>
      f.testimonials.length >= 3
        ? f
        : { ...f, testimonials: [...f.testimonials, { ...EMPTY_TESTIMONIAL }] }
    );
  };

  const removeTestimonial = (idx) => {
    setForm((f) => ({
      ...f,
      testimonials:
        f.testimonials.length <= 1 ? f.testimonials : f.testimonials.filter((_, i) => i !== idx),
    }));
  };

  const buildPayload = () => ({
    company_name: form.company_name,
    website_url: form.website_url,
    logo_url: form.logo_url,
    screenshot_url: form.screenshot_url,
    headquarters: form.headquarters,
    year_founded: form.year_founded === '' ? null : Number(form.year_founded),
    one_liner: form.one_liner,
    services: form.services,
    industries: commaSplit(form.industries),
    pricing: form.pricing,
    tool_stack: commaSplit(form.tool_stack),
    description: form.description,
    companies_supported:
      form.companies_supported === '' ? null : Number(form.companies_supported),
    headline_stats: form.headline_stats,
    testimonials: form.testimonials.filter(
      (t) => t.quote || t.name || t.title || t.company
    ),
    booking_url: form.booking_url,
    infrabox_usage_notes: form.infrabox_usage_notes,
    comarketing_opt_in: !!form.comarketing_opt_in,
    submitter_email: form.submitter_email,
    hp_field: form.hp_field,
  });

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const onNext = (e) => {
    e.preventDefault();
    const payload = buildPayload();
    const { errors: allErrors } = validateOnboarding(payload);
    const stepErrors = filterErrorsForStep(allErrors, step);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setStep((s) => Math.min(3, s + 1));
    scrollToTop();
  };

  const onBack = () => {
    setErrors({});
    setStep((s) => Math.max(1, s - 1));
    scrollToTop();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setRateLimited(false);

    const payload = buildPayload();
    const { valid, errors: fieldErrors } = validateOnboarding(payload);
    if (!valid) {
      setErrors(fieldErrors);
      // jump to the first step that has an error
      for (const s of [1, 2, 3]) {
        if (Object.keys(filterErrorsForStep(fieldErrors, s)).length > 0) {
          setStep(s);
          scrollToTop();
          break;
        }
      }
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      const res = await fetch('/api/partner-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.status === 429) {
        setRateLimited(true);
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        if (data.error === 'validation-failed' && data.details) {
          setErrors(data.details);
        } else {
          toast.error("Couldn't submit your application. Try again in a moment.");
        }
        return;
      }

      trackEvent('partner_onboarding_submitted', {});
      setSubmitted(true);
    } catch {
      toast.error("Couldn't submit your application. Try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-3xl bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#1240cc]/10 text-[#1240cc] mb-4">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-black">
          Thanks - your application is in.
        </h2>
        <p className="mt-3 text-sm text-gray-600 max-w-xl leading-relaxed">
          The Infrabox partnerships team reviews new applications weekly. If
          your fit looks strong, we&apos;ll reach out at {form.submitter_email} to
          schedule an intro call.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <StepIndicator current={step} />

      {rateLimited && (
        <div className="mb-5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 text-sm">
          You&apos;ve submitted a few of these recently. Try again in an hour.
        </div>
      )}

      <form onSubmit={step === 3 ? onSubmit : onNext} className="space-y-10">
        {step === 1 && (
          <Step1
            form={form}
            errors={errors}
            set={set}
            setValue={setValue}
            toggleService={toggleService}
          />
        )}
        {step === 2 && (
          <Step2
            form={form}
            errors={errors}
            set={set}
            setTestimonial={setTestimonial}
            addTestimonial={addTestimonial}
            removeTestimonial={removeTestimonial}
          />
        )}
        {step === 3 && (
          <Step3
            form={form}
            errors={errors}
            set={set}
            setBool={setBool}
          />
        )}

        {/* Honeypot */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '-10000px',
            width: 1,
            height: 1,
            overflow: 'hidden',
          }}
        >
          <label>
            Leave this field empty
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={form.hp_field}
              onChange={set('hp_field')}
            />
          </label>
        </div>

        <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-200">
          {step > 1 ? (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 text-gray-800 hover:bg-white hover:border-gray-400 px-5 py-2.5 font-medium text-sm transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
          ) : (
            <span />
          )}

          {step < 3 ? (
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-[#1240cc] hover:bg-[#0b34b4] text-white px-6 py-3 font-semibold text-sm transition-colors"
            >
              Next
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-full bg-[#1240cc] hover:bg-[#0b34b4] text-white px-6 py-3 font-semibold text-sm transition-colors disabled:opacity-60"
            >
              {submitting ? 'Submitting…' : 'Submit application'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current }) {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between gap-2">
        {STEPS.map((s, idx) => {
          const isCurrent = s.n === current;
          const isDone = s.n < current;
          const isFuture = s.n > current;
          const nextDone = STEPS[idx + 1] && STEPS[idx + 1].n <= current;
          return (
            <div key={s.n} className="flex items-center flex-1">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-colors ${
                    isCurrent
                      ? 'bg-[#1240cc] text-white'
                      : isDone
                      ? 'bg-[#1240cc] text-white'
                      : 'bg-white border border-gray-300 text-gray-400'
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4" /> : s.n}
                </div>
                <div className="min-w-0 hidden sm:block">
                  <div className="font-mono text-[10px] font-medium uppercase tracking-[0.48px] text-gray-500">
                    Step {s.n}
                  </div>
                  <div
                    className={`text-sm font-medium truncate ${
                      isFuture ? 'text-gray-400' : 'text-black'
                    }`}
                  >
                    {s.label}
                  </div>
                </div>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-px mx-3 transition-colors ${
                    nextDone ? 'bg-[#1240cc]' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 1: Company & services ──────────────────────────────────────────────

function Step1({ form, errors, set, setValue, toggleService }) {
  const oneLinerWords = wordCount(form.one_liner);
  return (
    <>
      <Section title="Company" subtitle="The basics - how we list you.">
        <Grid>
          <Field
            label="Company name *"
            value={form.company_name}
            onChange={set('company_name')}
            error={errors.company_name}
          />
          <Field
            label="Website *"
            value={form.website_url}
            onChange={set('website_url')}
            error={errors.website_url}
            placeholder="example.com"
          />
          <Field
            label="Headquarters *"
            value={form.headquarters}
            onChange={set('headquarters')}
            error={errors.headquarters}
            placeholder="City · Country"
          />
          <Field
            label="Year founded *"
            type="number"
            value={form.year_founded}
            onChange={set('year_founded')}
            error={errors.year_founded}
          />
        </Grid>
        <Grid>
          <AssetUploadField
            kind="logo"
            label="Logo"
            value={form.logo_url}
            onChange={setValue('logo_url')}
            error={errors.logo_url}
            hint="Square or wordmark, PNG/SVG preferred. Up to 4 MB."
          />
          <AssetUploadField
            kind="screenshot"
            label="Website screenshot"
            value={form.screenshot_url}
            onChange={setValue('screenshot_url')}
            error={errors.screenshot_url}
            hint="Above-the-fold capture of your homepage. Up to 4 MB."
          />
        </Grid>
        <div className="mt-4">
          <Label>One-liner *</Label>
          <input
            type="text"
            value={form.one_liner}
            onChange={set('one_liner')}
            maxLength={ONE_LINER_MAX}
            className={inputCls}
            placeholder="A single sentence - 15 words or fewer."
          />
          <div className="flex justify-between mt-1">
            {errors.one_liner ? (
              <ErrorText>{errors.one_liner}</ErrorText>
            ) : (
              <span className="text-xs text-gray-500">
                Used as the directory tagline.
              </span>
            )}
            <span className="text-xs text-gray-500">{oneLinerWords}/15 words</span>
          </div>
        </div>
      </Section>

      <Section title="Services & industries" subtitle="What you sell, who you sell to.">
        <Label>Services *</Label>
        <div className="flex flex-wrap gap-2">
          {SERVICES_ENUM.map((svc) => {
            const active = form.services.includes(svc);
            return (
              <button
                key={svc}
                type="button"
                onClick={() => toggleService(svc)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors border ${
                  active
                    ? 'bg-[#1240cc] text-white border-transparent'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                }`}
              >
                {SERVICE_LABELS[svc]}
              </button>
            );
          })}
        </div>
        {errors.services && <ErrorText>{errors.services}</ErrorText>}

        <div className="mt-5">
          <Field
            label="Industries served * (comma-separated)"
            value={form.industries}
            onChange={set('industries')}
            error={errors.industries}
            placeholder="B2B SaaS, Fintech, Industrial"
          />
        </div>
      </Section>
    </>
  );
}

// ─── Step 2: Pricing, tools & proof ──────────────────────────────────────────

function Step2({
  form,
  errors,
  set,
  setTestimonial,
  addTestimonial,
  removeTestimonial,
}) {
  const descLen = form.description.length;
  return (
    <>
      <Section title="Pricing & tools" subtitle="Money and machinery.">
        <Grid>
          <Field
            label="Pricing summary *"
            value={form.pricing}
            onChange={set('pricing')}
            error={errors.pricing}
            placeholder="Starts at $1,500/mo"
          />
          <Field
            label="Tool stack * (comma-separated, up to 10)"
            value={form.tool_stack}
            onChange={set('tool_stack')}
            error={errors.tool_stack}
            placeholder="Infrabox, Clay, Smartlead"
          />
        </Grid>
      </Section>

      <Section title="Description & proof" subtitle="Tell the story.">
        <Label>Description *</Label>
        <textarea
          value={form.description}
          onChange={set('description')}
          maxLength={DESC_MAX}
          rows={6}
          className={inputCls}
        />
        <div className="flex justify-between mt-1">
          {errors.description ? (
            <ErrorText>{errors.description}</ErrorText>
          ) : (
            <span className="text-xs text-gray-500">Minimum 150 characters.</span>
          )}
          <span className="text-xs text-gray-500">
            {descLen}/{DESC_MAX}
          </span>
        </div>

        <div className="mt-5">
          <Grid>
            <Field
              label="Companies supported *"
              type="number"
              value={form.companies_supported}
              onChange={set('companies_supported')}
              error={errors.companies_supported}
            />
            <Field
              label="Headline stats *"
              value={form.headline_stats}
              onChange={set('headline_stats')}
              error={errors.headline_stats}
              placeholder="1.2M sends/mo · 40% avg cost savings"
            />
          </Grid>
        </div>

        <div className="mt-6">
          <Label>Testimonials (up to 3)</Label>
          <div className="space-y-4">
            {form.testimonials.map((t, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[11px] font-medium uppercase tracking-[0.48px] text-gray-500">
                    Testimonial {i + 1}
                  </span>
                  {form.testimonials.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTestimonial(i)}
                      className="text-xs text-rose-600 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <textarea
                  value={t.quote}
                  onChange={setTestimonial(i, 'quote')}
                  rows={3}
                  placeholder="Quote"
                  className={inputCls}
                  maxLength={1000}
                />
                {errors[`testimonials.${i}.quote`] && (
                  <ErrorText>{errors[`testimonials.${i}.quote`]}</ErrorText>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                  <input
                    type="text"
                    placeholder="Name"
                    value={t.name}
                    onChange={setTestimonial(i, 'name')}
                    className={inputCls}
                  />
                  <input
                    type="text"
                    placeholder="Title"
                    value={t.title}
                    onChange={setTestimonial(i, 'title')}
                    className={inputCls}
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    value={t.company}
                    onChange={setTestimonial(i, 'company')}
                    className={inputCls}
                  />
                </div>
              </div>
            ))}
          </div>
          {form.testimonials.length < 3 && (
            <button
              type="button"
              onClick={addTestimonial}
              className="mt-3 text-sm font-semibold text-[#1240cc] hover:text-[#0b34b4]"
            >
              + Add another testimonial
            </button>
          )}
          {errors.testimonials && <ErrorText>{errors.testimonials}</ErrorText>}
        </div>
      </Section>
    </>
  );
}

// ─── Step 3: Booking & contact ───────────────────────────────────────────────

function Step3({ form, errors, set, setBool }) {
  return (
    <>
      <Section title="Booking & co-marketing">
        <Grid>
          <Field
            label="Booking URL"
            value={form.booking_url}
            onChange={set('booking_url')}
            error={errors.booking_url}
            placeholder="https://cal.com/your-team"
          />
          <Field
            label="How you use Infrabox *"
            value={form.infrabox_usage_notes}
            onChange={set('infrabox_usage_notes')}
            error={errors.infrabox_usage_notes}
            placeholder="Infrastructure, deliverability, both, etc."
          />
        </Grid>
        <label className="flex items-start gap-3 mt-4 cursor-pointer">
          <input
            type="checkbox"
            checked={form.comarketing_opt_in}
            onChange={setBool('comarketing_opt_in')}
            className="mt-1 accent-[#1240cc]"
          />
          <span className="text-sm text-gray-700">
            We&apos;re open to co-marketing - case studies, joint webinars,
            and shared content - with Infrabox.
          </span>
        </label>
        {errors.comarketing_opt_in && (
          <ErrorText>{errors.comarketing_opt_in}</ErrorText>
        )}
      </Section>

      <Section title="Your contact" subtitle="Who we should respond to.">
        <Field
          label="Submitter email *"
          type="email"
          value={form.submitter_email}
          onChange={set('submitter_email')}
          error={errors.submitter_email}
        />
      </Section>
    </>
  );
}

// ─── Primitives ──────────────────────────────────────────────────────────────

function Section({ title, subtitle, children }) {
  return (
    <section>
      <h2 className="text-xl font-semibold tracking-tight text-black">{title}</h2>
      {subtitle && <p className="text-sm text-gray-600 mt-1 mb-5">{subtitle}</p>}
      <div className={subtitle ? '' : 'mt-3'}>{children}</div>
    </section>
  );
}

function Grid({ children }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
}

function Label({ children }) {
  return (
    <label className="block font-mono text-[11px] font-medium uppercase tracking-[0.48px] text-gray-600 mb-1.5">
      {children}
    </label>
  );
}

function ErrorText({ children }) {
  return <p className="text-xs text-rose-600 mt-1">{children}</p>;
}

function Field({ label, value, onChange, error, type = 'text', placeholder }) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={inputCls}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}
