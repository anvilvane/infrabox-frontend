'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

const STATUS_OPTIONS = ['new', 'contacted', 'archived', 'spam'];

function fmtDate(s) {
  if (!s) return '';
  try {
    return new Date(s).toLocaleString();
  } catch {
    return s;
  }
}

export default function AdminPartnerContactDetailPage() {
  const params = useParams();
  const id = params?.id;

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('new');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/partner-contacts/${id}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data?.error || 'Failed to load');
          return;
        }
        const it = data?.data || data;
        setItem(it);
        setStatus(it.status || 'new');
        setNotes(it.notes || '');
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
      const res = await fetch(`/api/admin/partner-contacts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
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

  if (loading) {
    return <p className="text-sm text-gray-500">Loading…</p>;
  }

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
        <h1 className="text-2xl font-semibold text-gray-900">
          {item.name} → {item.partner_name}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Received {fmtDate(item.createdAt)}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="bg-white rounded-lg shadow p-6 space-y-5">
          <Section title="Message">
            <p className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
              {item.message}
            </p>
          </Section>

          <div className="grid grid-cols-2 gap-4">
            <Pair label="Name" value={item.name} />
            <Pair label="Email" value={item.email} />
            <Pair label="Company" value={item.company || '—'} />
            <Pair label="Website" value={item.website || '—'} />
            <Pair label="Volume" value={item.volume} />
            <Pair label="Source" value={item.source} />
            <Pair label="IP" value={item.meta_ip || '—'} />
            <Pair label="User agent" value={item.meta_ua || '—'} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Pair label="Partner" value={item.partner_name} />
            <Pair label="Partner slug" value={item.partner_slug} />
            <Pair label="Partner tier" value={item.partner_tier} />
            <Pair label="UID" value={item.uid} />
          </div>
        </div>

        <aside className="bg-white rounded-lg shadow p-5 space-y-4 self-start">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
              Status
            </label>
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
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
              Internal notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
              maxLength={2000}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              placeholder="Visible only to ops."
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
      href="/admin/partner-contacts"
      className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900"
    >
      <ArrowLeft className="w-3.5 h-3.5" /> Back to contacts
    </Link>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Pair({ label, value }) {
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm text-gray-900 break-words">{value}</div>
    </div>
  );
}
