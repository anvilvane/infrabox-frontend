// Shared validation for partner directory submission forms.
// Used by client form components for inline feedback AND by the Next.js proxy
// routes as defense-in-depth before forwarding to the Express API.
// Hand-rolled to match the inline-validation style used in app/admin/login/page.js.

export const SERVICES_ENUM = [
  'email',
  'cold_calling',
  'ads',
  'content',
  'gtm_engineering',
  'revops_consultancy',
  'clay_automation',
  'linkedin_outreach',
  'crm_setup',
  'other',
];

export const SERVICE_LABELS = {
  email: 'Email',
  cold_calling: 'Cold calling',
  ads: 'Paid ads',
  content: 'Content',
  gtm_engineering: 'GTM engineering',
  revops_consultancy: 'RevOps consultancy',
  clay_automation: 'Clay automation',
  linkedin_outreach: 'LinkedIn outreach',
  crm_setup: 'CRM setup',
  other: 'Other',
};

export const VOLUME_ENUM = ['<1k', '1k-10k', '10k-50k', '50k+'];

export const VOLUME_LABELS = {
  '<1k': 'Under 1,000 / month',
  '1k-10k': '1,000 – 10,000 / month',
  '10k-50k': '10,000 – 50,000 / month',
  '50k+': '50,000+ / month',
};

export const TIER_LABELS = {
  platinum: 'Platinum Elite',
  gold: 'Gold Partners',
  growth: 'Growth Partners',
  certified: 'Certified Partners',
};

const SLUG_RE = /^[a-z0-9-]+$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function trim(v) {
  return typeof v === 'string' ? v.trim() : '';
}

function wordCount(s) {
  return trim(s).split(/\s+/).filter(Boolean).length;
}

export function validateContact(body = {}) {
  const errors = {};

  const partnerSlug = trim(body.partnerSlug);
  if (!partnerSlug) errors.partnerSlug = 'Missing partner';
  else if (partnerSlug.length > 80 || !SLUG_RE.test(partnerSlug))
    errors.partnerSlug = 'Invalid partner slug';

  const name = trim(body.name);
  if (!name) errors.name = 'Name is required';
  else if (name.length > 120) errors.name = 'Name is too long';

  const email = trim(body.email).toLowerCase();
  if (!email) errors.email = 'Email is required';
  else if (email.length > 200 || !EMAIL_RE.test(email))
    errors.email = 'Enter a valid email';

  const company = trim(body.company);
  if (company && company.length > 160) errors.company = 'Company name is too long';

  const website = trim(body.website);
  if (website && website.length > 200) errors.website = 'Website URL is too long';

  const volume = trim(body.volume);
  if (!volume) errors.volume = 'Pick a volume range';
  else if (!VOLUME_ENUM.includes(volume)) errors.volume = 'Invalid volume';

  const message = trim(body.message);
  if (!message) errors.message = 'Message is required';
  else if (message.length < 10) errors.message = 'Message must be at least 10 characters';
  else if (message.length > 2000) errors.message = 'Message must be 2000 characters or fewer';

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateOnboarding(body = {}) {
  const errors = {};

  const company_name = trim(body.company_name);
  if (!company_name) errors.company_name = 'Company name is required';
  else if (company_name.length > 200) errors.company_name = 'Company name is too long';

  const website_url = trim(body.website_url);
  if (!website_url) errors.website_url = 'Website is required';
  else if (website_url.length > 500) errors.website_url = 'Website URL is too long';

  const logo_url = trim(body.logo_url);
  if (logo_url && logo_url.length > 1000) errors.logo_url = 'Logo URL is too long';

  const screenshot_url = trim(body.screenshot_url);
  if (screenshot_url && screenshot_url.length > 1000)
    errors.screenshot_url = 'Screenshot URL is too long';

  const headquarters = trim(body.headquarters);
  if (!headquarters) errors.headquarters = 'Headquarters is required';
  else if (headquarters.length > 500) errors.headquarters = 'Headquarters is too long';

  const year_founded = Number(body.year_founded);
  const currentYear = new Date().getFullYear();
  if (!Number.isInteger(year_founded) || year_founded < 1900 || year_founded > currentYear) {
    errors.year_founded = `Year must be between 1900 and ${currentYear}`;
  }

  const one_liner = trim(body.one_liner);
  if (!one_liner) errors.one_liner = 'Add a one-liner';
  else if (one_liner.length > 200) errors.one_liner = 'One-liner is too long';
  else if (wordCount(one_liner) > 15) errors.one_liner = 'Keep the one-liner to 15 words or fewer';

  const services = Array.isArray(body.services) ? body.services : [];
  if (services.length === 0) errors.services = 'Pick at least one service';
  else if (services.some((s) => !SERVICES_ENUM.includes(s)))
    errors.services = 'One or more services are invalid';

  const industries = Array.isArray(body.industries) ? body.industries.filter((s) => trim(s)) : [];
  if (industries.length === 0) errors.industries = 'Add at least one industry';

  const pricing = trim(body.pricing);
  if (!pricing) errors.pricing = 'Pricing summary is required';
  else if (pricing.length > 300) errors.pricing = 'Pricing summary is too long';

  const tool_stack = Array.isArray(body.tool_stack) ? body.tool_stack.filter((s) => trim(s)) : [];
  if (tool_stack.length === 0) errors.tool_stack = 'Add at least one tool';
  else if (tool_stack.length > 10) errors.tool_stack = 'Limit tool stack to 10 entries';

  const description = trim(body.description);
  if (!description) errors.description = 'Description is required';
  else if (description.length < 150) errors.description = 'Description must be at least 150 characters';
  else if (description.length > 2000) errors.description = 'Description must be 2000 characters or fewer';

  const companies_supported = Number(body.companies_supported);
  if (!Number.isFinite(companies_supported) || companies_supported < 0) {
    errors.companies_supported = 'Enter the number of companies you have supported';
  }

  const headline_stats = trim(body.headline_stats);
  if (!headline_stats) errors.headline_stats = 'Add a headline stat or two';
  else if (headline_stats.length > 500) errors.headline_stats = 'Headline stats are too long';

  const testimonials = Array.isArray(body.testimonials) ? body.testimonials : [];
  if (testimonials.length > 3) errors.testimonials = 'Limit testimonials to 3';
  for (let i = 0; i < testimonials.length; i++) {
    const t = testimonials[i] || {};
    if (trim(t.quote) && trim(t.quote).length > 1000) {
      errors[`testimonials.${i}.quote`] = 'Quote is too long';
    }
  }

  const booking_url = trim(body.booking_url);
  if (booking_url && booking_url.length > 500) errors.booking_url = 'Booking URL is too long';

  const infrabox_usage_notes = trim(body.infrabox_usage_notes);
  if (!infrabox_usage_notes) errors.infrabox_usage_notes = 'Tell us how you use Infrabox';
  else if (infrabox_usage_notes.length > 1500) errors.infrabox_usage_notes = 'Notes are too long';

  if (typeof body.comarketing_opt_in !== 'boolean') {
    errors.comarketing_opt_in = 'Confirm your co-marketing preference';
  }

  const submitter_email = trim(body.submitter_email).toLowerCase();
  if (!submitter_email) errors.submitter_email = 'Submitter email is required';
  else if (submitter_email.length > 200 || !EMAIL_RE.test(submitter_email))
    errors.submitter_email = 'Enter a valid email';

  return { valid: Object.keys(errors).length === 0, errors };
}
