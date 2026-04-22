'use client';

import type { Saint } from '@/lib/types';
import { SAINT_ACCENTS, DEFAULT_ACCENT, getVirtueStyle } from '@/lib/data';

interface Props {
  saint: Saint;
  onClick: (saint: Saint) => void;
}

export default function SaintCard({ saint, onClick }: Props) {
  const accent = SAINT_ACCENTS[saint.id] ?? DEFAULT_ACCENT;

  return (
    <button
      onClick={() => onClick(saint)}
      className="group bg-white rounded-2xl p-4 text-center border-2 shadow-sm transition-all duration-150 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer w-full"
      style={{
        borderColor: accent.border,
        // @ts-expect-error custom property
        '--tw-ring-color': accent.ring,
      }}
    >
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
    </button>
  );
}
