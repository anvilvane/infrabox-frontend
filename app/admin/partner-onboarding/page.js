'use client';

import { useEffect, useState } from 'react';

const STATUS_FILTERS = [
  { key: 'pending', label: 'Pending' },
  { key: 'under_review', label: 'Under review' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'published', label: 'Published' },
  { key: 'all', label: 'All' },
];

const STATUS_PILL = {
  pending: 'bg-amber-100 text-amber-800',
  under_review: 'bg-blue-100 text-blue-800',
  approved: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-rose-100 text-rose-800',
  published: 'bg-violet-100 text-violet-800',
};

function fmtDate(s) {
  if (!s) return '';
  try {
    return new Date(s).toLocaleString();
  } catch {
    return s;
  }
}

export default function AdminPartnerOnboardingPage() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 25, total: 0, pages: 0 });
  const [status, setStatus] = useState('pending');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (status && status !== 'all') params.set('status', status);
      if (q) params.set('q', q);
      const res = await fetch(`/api/admin/partner-onboarding?${params.toString()}`);
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
        <h1 className="text-2xl font-semibold text-gray-900">Partner onboarding</h1>
        <p className="text-sm text-gray-500 mt-1">
          Applications from the &quot;Become a Partner&quot; questionnaire.
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
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search company, email, services…"
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
              <Th>Company</Th>
              <Th>Services</Th>
              <Th>Year</Th>
              <Th>Status</Th>
              <Th>Submitted</Th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                  Loading…
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                  No applications match these filters.
                </td>
              </tr>
            ) : (
              items.map((it) => (
                <tr
                  key={it._id || it.uid}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    window.location.href = `/admin/partner-onboarding/${it._id || it.uid}`;
                  }}
                >
                  <Td>
                    <div className="font-medium text-gray-900">{it.company_name}</div>
                    <div className="text-xs text-gray-500">{it.submitter_email}</div>
                  </Td>
                  <Td className="text-gray-700 text-xs">
                    {(it.services || []).join(', ') || '—'}
                  </Td>
                  <Td className="text-gray-700">{it.year_founded || '—'}</Td>
                  <Td>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        STATUS_PILL[it.status] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {it.status}
                    </span>
                  </Td>
                  <Td className="text-gray-500 text-xs">{fmtDate(it.createdAt)}</Td>
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
