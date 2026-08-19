'use client';

import { useState, useEffect, useRef } from 'react';


const langLabels = {
  typescript: 'TypeScript', ts: 'TypeScript',
  javascript: 'JavaScript', js: 'JavaScript',
  bash: 'Terminal', sh: 'Terminal', shell: 'Terminal',
  go: 'Go', json: 'JSON', curl: 'cURL',
  python: 'Python', py: 'Python', tsx: 'TSX', jsx: 'JSX',
  dns: 'DNS', txt: 'Text', xml: 'XML', html: 'HTML',
  css: 'CSS', yaml: 'YAML', yml: 'YAML', sql: 'SQL',
};

const langIcons = {
  typescript: 'TS', ts: 'TS', javascript: 'JS', js: 'JS',
  bash: '$', sh: '$', shell: '$', go: 'Go',
  json: '{ }', curl: '>>', python: 'Py', py: 'Py',
  tsx: 'TSX', jsx: 'JSX', dns: 'DNS', txt: 'Aa',
  xml: '</>', html: '</>', css: '#', yaml: '---',
  yml: '---', sql: 'SQL',
};

const langMap = {
  ts: 'typescript', js: 'javascript', sh: 'bash',
  shell: 'bash', py: 'python', curl: 'bash',
  dns: 'text', txt: 'text', yml: 'yaml',
};

export default function LearnCodeBlock({ code, lang }) {
  const [copied, setCopied] = useState(false);
  const [html, setHtml] = useState('');
  const codeRef = useRef(null);

  useEffect(() => {
    import('shiki').then(({ codeToHtml }) => {
      codeToHtml(code, {
        lang: langMap[lang] || lang || 'text',
        theme: 'github-dark',
      })
        .then(setHtml)
        .catch(() => {
          const escaped = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
          setHtml(`<pre style="color:#e6edf3"><code>${escaped}</code></pre>`);
        });
    });
  }, [code, lang]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const label = langLabels[lang] || lang;
  const icon = langIcons[lang] || '>';
  const fallbackHtml = `<pre style="opacity:0.5"><code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;

  return (
    <div className="rounded-lg overflow-hidden my-5 group/code border border-[#3e4451]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#30363d] bg-[#161b22]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#f85149]/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#d29922]/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#3fb950]/60" />
          </div>
          {lang && (
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[9px] text-[#8b949e] bg-[#21262d] px-1.5 py-0.5 rounded">{icon}</span>
              <span className="font-mono text-[10px] text-[#8b949e]">{label}</span>
            </div>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[#8b949e] hover:text-[#e6edf3] transition-colors opacity-0 group-hover/code:opacity-100"
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5 text-[#3fb950]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="font-mono text-[10px] text-[#3fb950]">Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
              <span className="font-mono text-[10px]">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <div
        ref={codeRef}
        className="overflow-x-auto bg-[#0d1117] text-[13px] [&_pre]:!bg-transparent [&_pre]:!m-0 [&_pre]:!p-4 [&_code]:!bg-transparent [&_code]:!text-[13px] [&_code]:!leading-relaxed [&_code]:font-mono [&_.line]:!m-0 [&_.line]:!p-0"
        dangerouslySetInnerHTML={{ __html: html || fallbackHtml }}
      />
    </div>
  );
}
