'use client';

import { useRef, useState } from 'react';

const ALLOWED_MIME = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
];
const MAX_BYTES = 4 * 1024 * 1024;

const BRAND_TEAL = '#1240cc';

function humanSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AssetUploadField({
  kind,        // 'logo' | 'screenshot'
  label,
  value,       // current URL (string)
  onChange,    // (url) => void
  error,
  hint,
}) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [localErr, setLocalErr] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const accept = ALLOWED_MIME.join(',');

  const handleFile = async (file) => {
    setLocalErr('');
    if (!file) return;
    if (!ALLOWED_MIME.includes((file.type || '').toLowerCase())) {
      setLocalErr('Use JPEG, PNG, WebP, GIF, or SVG.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setLocalErr(`Too large (${humanSize(file.size)}). Max 4 MB.`);
      return;
    }
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('kind', kind);
      const res = await fetch('/api/partner-asset-upload', {
        method: 'POST',
        body: fd,
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.url) {
        const msg = json?.error === 'rate-limited' ? 'Too many uploads. Wait a bit.' : (json?.message || json?.error || 'Upload failed');
        setLocalErr(msg);
        return;
      }
      onChange(json.url);
    } catch (e) {
      setLocalErr('Upload failed. Try again.');
    } finally {
      setBusy(false);
    }
  };

  const onSelect = (e) => {
    const f = e.target.files?.[0];
    handleFile(f);
    // Allow re-uploading the same filename
    e.target.value = '';
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer?.files?.[0];
    handleFile(f);
  };

  const clear = () => {
    onChange('');
    setLocalErr('');
  };

  const hasFile = !!value;
  const shown = error || localErr;

  return (
    <div>
      <label className="block text-[12px] font-medium text-gray-700 mb-1.5">
        {label}
      </label>

      {hasFile ? (
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3">
          <div
            className="w-14 h-14 rounded-md border border-gray-200 flex items-center justify-center overflow-hidden shrink-0"
            style={{ background: kind === 'logo' ? '#fff' : '#f8fafc' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="uploaded preview"
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[12px] text-gray-500 truncate">{value}</div>
            <div className="mt-1.5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={busy}
                className="text-[12px] font-medium hover:underline"
                style={{ color: BRAND_TEAL }}
              >
                Replace
              </button>
              <button
                type="button"
                onClick={clear}
                disabled={busy}
                className="text-[12px] font-medium text-gray-500 hover:text-gray-800"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          disabled={busy}
          className={`w-full rounded-lg border border-dashed px-4 py-5 text-center transition-colors ${
            dragOver
              ? 'border-[#1240cc] bg-[#1240cc]/5'
              : 'border-gray-300 bg-white hover:border-[#1240cc]/40'
          } ${busy ? 'opacity-60 cursor-wait' : 'cursor-pointer'}`}
        >
          <div className="flex flex-col items-center gap-1.5">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400"
              aria-hidden="true"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <div className="text-[13px] font-medium" style={{ color: BRAND_TEAL }}>
              {busy ? 'Uploading…' : 'Click or drag to upload'}
            </div>
            <div className="text-[11px] text-gray-500">
              {hint || 'PNG, SVG, WebP, JPG up to 4 MB'}
            </div>
          </div>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={onSelect}
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
      />

      {shown && (
        <p className="mt-1.5 text-[12px] text-red-600" role="alert">
          {shown}
        </p>
      )}
    </div>
  );
}
