'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

const STATUS_OPTIONS = ['pending', 'under_review', 'approved', 'rejected', 'published'];

function fmtDate(s) {
  if (!s) return '';
  try {
    return new Date(s).toLocaleString();
  } catch {
    return s;
  }
}

export default function AdminPartnerOnboardingDetailPage() {
  const params = useParams();
  const id = params?.id;

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('pending');
  const [notes, setNotes] = useState('');
  const [assignedSlug, setAssignedSlug] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/partner-onboarding/${id}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data?.error || 'Failed to load');
          return;
        }
        const it = data?.data || data;
        setItem(it);
        setStatus(it.status || 'pending');
        setNotes(it.notes || '');
        setAssignedSlug(it.assigned_slug || '');
      } catch (e) {
        setError(e.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const onSave = async () => {
    try {
      setSaving(true);
      const res = await fetch(`/api/admin/partner-onboarding/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          notes,
          assigned_slug: assignedSlug.trim().toLowerCase(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error || 'Save failed');
        return;
      }
      toast.success('Saved');
      const it = data?.data || data;
      setItem((prev) => ({ ...(prev || {}), ...it }));
    } catch (e) {
      toast.error(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-gray-500">Loading…</p>;
  if (error || !item) {
    return (
      <div>
        <BackLink />
        <p className="mt-4 text-sm text-rose-700">{error || 'Submission not found.'}</p>
      </div>
    );
  }

  return (
    <div>
      <BackLink />
      <header className="mt-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">{item.company_name}</h1>
        <p className="text-sm text-gray-500 mt-1">
          Submitted {fmtDate(item.createdAt)} by {item.submitter_email}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <Card title="Company">
            <Grid>
              <Pair label="Name" value={item.company_name} />
              <Pair label="Website" value={item.website_url} />
              <Pair label="Headquarters" value={item.headquarters} />
              <Pair label="Year founded" value={item.year_founded} />
              <Pair label="Logo URL" value={item.logo_url || '—'} />
              <Pair label="One-liner" value={item.one_liner} />
            </Grid>
          </Card>

          <Card title="Services & industries">
            <Grid>
              <Pair label="Services" value={(item.services || []).join(', ')} />
              <Pair label="Industries" value={(item.industries || []).join(', ')} />
              <Pair label="Tool stack" value={(item.tool_stack || []).join(', ')} />
              <Pair label="Pricing" value={item.pricing} />
            </Grid>
          </Card>

          <Card title="Description">
            <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
              {item.description}
            </p>
          </Card>

          <Card title="Proof">
            <Grid>
              <Pair label="Companies supported" value={item.companies_supported} />
              <Pair label="Headline stats" value={item.headline_stats} />
            </Grid>
            {(item.testimonials || []).length > 0 && (
              <div className="mt-4 space-y-3">
                {(item.testimonials || []).map((t, i) => (
                  <div key={i} className="border border-gray-200 rounded-md p-3 bg-gray-50">
                    <p className="text-sm text-gray-800 italic">&ldquo;{t.quote}&rdquo;</p>
                    <p className="text-xs text-gray-500 mt-2">
                      — {t.name}
                      {t.title ? `, ${t.title}` : ''}
                      {t.company ? ` · ${t.company}` : ''}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title="Booking & co-marketing">
            <Grid>
              <Pair label="Booking URL" value={item.booking_url || '—'} />
              <Pair
                label="Co-marketing"
                value={item.comarketing_opt_in ? 'Opt-in' : 'No'}
              />
              <Pair label="Infrabox usage" value={item.infrabox_usage_notes} />
            </Grid>
          </Card>

          <Card title="Meta">
            <Grid>
              <Pair label="UID" value={item.uid} />
              <Pair label="Source" value={item.source} />
              <Pair label="IP" value={item.meta_ip || '—'} />
              <Pair label="User agent" value={item.meta_ua || '—'} />
            </Grid>
          </Card>
        </div>

        <aside className="bg-white rounded-lg shadow p-5 space-y-4 self-start">
          <div>
            <Label>Status</Label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Assigned slug</Label>
            <input
              type="text"
              value={assignedSlug}
              onChange={(e) => setAssignedSlug(e.target.value)}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              placeholder="e.g. acme-co"
            />
            <p className="text-xs text-gray-500 mt-1">
              Set after adding the partner to <code>app/partners/data.js</code>.
            </p>
          </div>
          <div>
            <Label>Internal notes</Label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
              maxLength={2000}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
            />
          </div>
          <button
            onClick={onSave}
            disabled={saving}
            className="w-full rounded-md bg-[#1240cc] text-white text-sm font-medium px-4 py-2 disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </aside>
      </div>
    </div>
  );
}

function BackLink() {
  return (
    <Link
      href="/admin/partner-onboarding"
      className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900"
    >
      <ArrowLeft className="w-3.5 h-3.5" /> Back to applications
    </Link>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white rounded-lg shadow p-5">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Grid({ children }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
}

function Label({ children }) {
  return (
    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
      {children}
    </label>
  );
}

function Pair({ label, value }) {
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm text-gray-900 break-words">
        {value === '' || value === null || value === undefined ? '—' : value}
      </div>
    </div>
  );
}
