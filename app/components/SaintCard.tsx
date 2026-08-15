'use client';

import type { Saint } from '@/lib/types';
import { SAINT_ACCENTS, DEFAULT_ACCENT, getVirtueStyle } from '@/lib/data';

interface Props {
  saint: Saint;
  completed?: boolean;
  onClick: (saint: Saint) => void;
}

export default function SaintCard({ saint, completed = false, onClick }: Props) {
  const accent = SAINT_ACCENTS[saint.id] ?? DEFAULT_ACCENT;

  return (
    <article
      className="group relative flex h-full flex-col bg-white rounded-2xl p-4 text-center border-2 shadow-sm transition-all duration-150 hover:shadow-lg hover:-translate-y-1"
      style={{
        borderColor: accent.border,
      }}
    >
      {completed && (
        <span className="absolute right-2 top-2 rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-800">
          ✓ Done
        </span>
      )}
      <div className="text-5xl mb-3 transition-transform duration-150 group-hover:scale-110">
        {saint.avatar}
      </div>
      <div className="font-semibold text-sm leading-snug mb-2.5" style={{ color: accent.text }}>
        {saint.name}
      </div>
      <div className="flex flex-wrap gap-1 justify-center">
        {saint.virtues.map(v => {
          const vs = getVirtueStyle(v);
          return (
            <span
              key={v}
              className="text-xs px-2 py-0.5 rounded-full font-medium border"
              style={{ backgroundColor: vs.bg, color: vs.text, borderColor: vs.border }}
            >
              {v}
            </span>
          );
        })}
      </div>
      <details className="mt-3 text-left">
        <summary
          className="cursor-pointer rounded-xl px-2 py-1.5 text-center text-xs font-bold uppercase tracking-wide outline-none transition-colors hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{
            color: accent.text,
            // @ts-expect-error custom property
            '--tw-ring-color': accent.ring,
          }}
        >
          Parent sources
        </summary>
        <div className="mt-2 space-y-2 rounded-xl bg-gray-50 p-3 text-xs leading-relaxed text-gray-700">
          <p>
            <span className="font-bold text-gray-900">Feast:</span> {saint.feastDay}
          </p>
          <p>
            <span className="font-bold text-gray-900">Source:</span> {saint.sourceTradition}
          </p>
          <p>
            <span className="font-bold text-gray-900">Why these patronages:</span>{' '}
            {saint.patronageRationale}
          </p>
          {saint.devotionalNote && (
            <p>
              <span className="font-bold text-gray-900">Note:</span> {saint.devotionalNote}
            </p>
          )}
        </div>
      </details>
      <button
        onClick={() => onClick(saint)}
        className="mt-auto w-full rounded-xl px-3 py-2.5 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
        style={{
          backgroundColor: accent.button,
          // @ts-expect-error custom property
          '--tw-ring-color': accent.ring,
        }}
      >
        Start quest
      </button>
    </article>
  );
}
