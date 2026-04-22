'use client';

import { getVirtueStyle } from '@/lib/data';

interface Props {
  virtues: Record<string, number>;
  compact?: boolean;
}

export default function VirtueTracker({ virtues, compact = false }: Props) {
  const entries = Object.entries(virtues).filter(([, v]) => v > 0);

  if (entries.length === 0) {
    return (
      <p className="text-sm text-amber-600 text-center italic">
        {compact ? 'No virtues earned yet' : 'Complete quests to earn virtue points!'}
      </p>
    );
  }

  return (
    <div className={`flex flex-wrap gap-2 ${compact ? '' : 'justify-center'}`}>
      {entries.map(([virtue, points]) => {
        const vs = getVirtueStyle(virtue);
        return (
          <div
            key={virtue}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-semibold"
            style={{ backgroundColor: vs.bg, color: vs.text, borderColor: vs.border }}
          >
            <span>{virtue}</span>
            <span
              className="text-xs font-bold px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: vs.border, color: vs.text }}
            >
              +{points}
            </span>
          </div>
        );
      })}
    </div>
  );
}
