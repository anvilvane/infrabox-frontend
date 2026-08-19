'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle2 } from 'lucide-react';
import { trackEvent } from '@/libs/posthog';
import {
  validateContact,
  VOLUME_ENUM,
  VOLUME_LABELS,
} from '@/lib/partner-directory-validation';

const MESSAGE_MAX = 2000;

const INITIAL = {
  name: '',
  email: '',
  company: '',
  website: '',
  volume: '',
  message: '',
  hp_field: '',
};

const inputCls =
  'w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1240cc] transition-colors';

export default function PartnerContactForm({ partner }) {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setRateLimited(false);

    const payload = {
      partnerSlug: partner.slug,
      partnerName: partner.name,
      partnerTier: partner.tier,
      ...form,
    };

    const { valid, errors: fieldErrors } = validateContact(payload);
    if (!valid) {
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      const res = await fetch('/api/partner-contact', {
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
          toast.error("Couldn't send your message. Try again in a moment.");
        }
        return;
      }

      trackEvent('partner_contact_submitted', {
        partnerSlug: partner.slug,
        partnerTier: partner.tier,
      });
      setSubmitted(true);
    } catch {
      toast.error("Couldn't send your message. Try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#1240cc]/10 text-[#1240cc] mb-4">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-semibold tracking-tight text-black">
          Message sent to {partner.name}.
        </h3>
        <p className="mt-3 text-sm text-gray-600 max-w-xl leading-relaxed">
          They typically reply within a few business days. We&apos;ve also logged
          your request with Infrabox ops in case you need a hand connecting.
        </p>
      </div>
    );
  }

  const msgLen = form.message.length;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
      <h3 className="text-xl font-semibold tracking-tight text-black">
        Talk to {partner.name}
      </h3>
      <p className="mt-2 text-sm text-gray-600 max-w-xl">
        Drop a few details and {partner.name} will reach out directly. We share
        what you write here with the agency - nothing else.
      </p>

      {rateLimited && (
        <div className="mt-5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 text-sm">
          You&apos;ve sent a few of these recently. Try again in an hour.
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="Your name"
          value={form.name}
          onChange={set('name')}
          error={errors.name}
          required
        />
        <Field
          label="Work email"
          type="email"
          value={form.email}
          onChange={set('email')}
          error={errors.email}
          required
        />
        <Field
          label="Company"
          value={form.company}
          onChange={set('company')}
          error={errors.company}
        />
        <Field
          label="Website"
          value={form.website}
          onChange={set('website')}
          error={errors.website}
          placeholder="example.com"
        />

        <div className="sm:col-span-2">
          <Label>Monthly send volume *</Label>
          <select value={form.volume} onChange={set('volume')} className={inputCls}>
            <option value="" disabled>
              Pick a volume range…
            </option>
            {VOLUME_ENUM.map((v) => (
              <option key={v} value={v}>
                {VOLUME_LABELS[v]}
              </option>
            ))}
          </select>
          {errors.volume && <ErrorText>{errors.volume}</ErrorText>}
        </div>

        <div className="sm:col-span-2">
          <Label>What do you need help with? *</Label>
          <textarea
            value={form.message}
            onChange={set('message')}
            maxLength={MESSAGE_MAX}
            rows={5}
            className={inputCls}
            placeholder="Goals, current setup, timeline - whatever helps them respond well."
          />
          <div className="flex justify-between mt-1">
            {errors.message ? (
              <ErrorText>{errors.message}</ErrorText>
            ) : (
              <span className="text-xs text-gray-500">Minimum 10 characters.</span>
            )}
            <span className="text-xs text-gray-500">
              {msgLen}/{MESSAGE_MAX}
            </span>
          </div>
        </div>

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

        <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-3 pt-2">
          <p className="text-xs text-gray-500">
            By submitting you agree to share these details with {partner.name}.
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-full bg-[#1240cc] hover:bg-[#0b34b4] text-white px-6 py-3 font-semibold text-sm transition-colors disabled:opacity-60"
          >
            {submitting ? 'Sending…' : `Send to ${partner.name}`}
          </button>
        </div>
      </form>
    </div>
  );
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

function Field({ label, value, onChange, error, required, type = 'text', placeholder }) {
  return (
    <div>
      <Label>
        {label}
        {required ? ' *' : ''}
      </Label>
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
