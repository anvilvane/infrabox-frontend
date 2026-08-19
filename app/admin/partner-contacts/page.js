'use client';

import { useEffect, useMemo, useState } from 'react';
import { ALL_SLUGS, PARTNER_BY_SLUG } from '@/app/partners/data';

const STATUS_FILTERS = [
  { key: 'new', label: 'New' },
  { key: 'contacted', label: 'Contacted' },
  { key: 'archived', label: 'Archived' },
  { key: 'spam', label: 'Spam' },
  { key: 'all', label: 'All' },
];

const STATUS_PILL = {
  new: 'bg-emerald-100 text-emerald-800',
  contacted: 'bg-blue-100 text-blue-800',
  archived: 'bg-gray-100 text-gray-700',
  spam: 'bg-rose-100 text-rose-800',
};

function fmtDate(s) {
  if (!s) return '';
  try {
    return new Date(s).toLocaleString();
  } catch {
    return s;
  }
}

export default function AdminPartnerContactsPage() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 25, total: 0, pages: 0 });
  const [status, setStatus] = useState('new');
  const [partnerSlug, setPartnerSlug] = useState('');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const partnerOptions = useMemo(
    () =>
      ALL_SLUGS.slice()
        .sort((a, b) => PARTNER_BY_SLUG[a].name.localeCompare(PARTNER_BY_SLUG[b].name))
        .map((slug) => ({ slug, name: PARTNER_BY_SLUG[slug].name })),
    []
  );

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, partnerSlug]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (status && status !== 'all') params.set('status', status);
      if (partnerSlug) params.set('partner_slug', partnerSlug);
      if (q) params.set('q', q);
      const res = await fetch(`/api/admin/partner-contacts?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Failed to load');
        return;
      }
      setItems(data?.data?.items || []);
      setPagination(data?.data?.pagination || { page: 1, limit: 25, total: 0, pages: 0 });
    } catch (e) {
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const onSearch = (e) => {
    e.preventDefault();
    fetchItems();
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Partner contacts</h1>
        <p className="text-sm text-gray-500 mt-1">
          Inbound messages sent through partner profile contact forms.
        </p>
      </header>

      <div className="bg-white rounded-lg shadow mb-4 p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s.key}
              onClick={() => setStatus(s.key)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium border ${
                status === s.key
                  ? 'bg-[#1240cc] text-white border-[#1240cc]'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <form onSubmit={onSearch} className="flex flex-wrap items-center gap-3">
          <select
            value={partnerSlug}
            onChange={(e) => setPartnerSlug(e.target.value)}
            className="rounded-md border border-gray-200 px-3 py-2 text-sm"
          >
            <option value="">All partners</option>
            {partnerOptions.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, email, company…"
            className="rounded-md border border-gray-200 px-3 py-2 text-sm flex-1 min-w-[200px]"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-[#1240cc] text-white text-sm font-medium"
          >
            Search
          </button>
        </form>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-rose-50 text-rose-800 border border-rose-200 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <Th>Partner</Th>
              <Th>From</Th>
              <Th>Email</Th>
              <Th>Volume</Th>
              <Th>Received</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">
                  Loading…
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">
                  No submissions match these filters.
                </td>
              </tr>
            ) : (
              items.map((it) => (
                <tr
                  key={it._id || it.uid}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    window.location.href = `/admin/partner-contacts/${it._id || it.uid}`;
                  }}
                >
                  <Td>
                    <div className="font-medium text-gray-900">{it.partner_name}</div>
                    <div className="text-xs text-gray-500">{it.partner_slug}</div>
                  </Td>
                  <Td>
                    <div className="font-medium text-gray-900">{it.name}</div>
                    {it.company && <div className="text-xs text-gray-500">{it.company}</div>}
                  </Td>
                  <Td className="text-gray-700">{it.email}</Td>
                  <Td className="text-gray-700">{it.volume}</Td>
                  <Td className="text-gray-500 text-xs">{fmtDate(it.createdAt)}</Td>
                  <Td>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        STATUS_PILL[it.status] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {it.status}
                    </span>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination.total > 0 && (
        <p className="mt-3 text-xs text-gray-500">
          {pagination.total} total · page {pagination.page} of {pagination.pages}
        </p>
      )}
    </div>
  );
}

function Th({ children }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      {children}
    </th>
  );
}

function Td({ children, className = '' }) {
  return <td className={`px-4 py-3 text-sm align-top ${className}`}>{children}</td>;
}
