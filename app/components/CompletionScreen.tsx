'use client';

import type { Saint, QuestResult } from '@/lib/types';
import { SAINT_ACCENTS, DEFAULT_ACCENT, getVirtueStyle } from '@/lib/data';
import VirtueTracker from './VirtueTracker';

interface Props {
  saint: Saint;
  results: QuestResult[];
  onPlayAgain: () => void;
}

function getMessage(pct: number) {
  if (pct === 100) return { emoji: '🏆', headline: 'Perfect!', sub: 'You truly walk with the saints.' };
  if (pct >= 75)  return { emoji: '⭐', headline: 'Excellent!', sub: 'Your virtue shines bright.' };
  if (pct >= 50)  return { emoji: '✨', headline: 'Good effort!', sub: 'Keep growing in virtue.' };
  return { emoji: '💛', headline: 'Keep going!', sub: 'The saints know perseverance.' };
}

export default function CompletionScreen({ saint, results, onPlayAgain }: Props) {
  const accent = SAINT_ACCENTS[saint.id] ?? DEFAULT_ACCENT;

  const correctCount = results.filter(r => r.correct).length;
  const totalCount = results.length;
  const pct = Math.round((correctCount / totalCount) * 100);
  const { emoji, headline, sub } = getMessage(pct);

  const totalVirtues: Record<string, number> = {};
  for (const r of results) {
    for (const [v, pts] of Object.entries(r.virtueGained)) {
      totalVirtues[v] = (totalVirtues[v] ?? 0) + pts;
    }
  }

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col items-center px-4 py-10">
      <div className="max-w-md w-full space-y-5">

        {/* Hero card */}
        <div
          className="rounded-3xl p-8 text-center border-2 shadow-sm"
          style={{ backgroundColor: accent.bg, borderColor: accent.border }}
        >
          <div className="text-7xl mb-2">{saint.avatar}</div>
          <div className="text-5xl mb-3">{emoji}</div>
          <h1 className="text-3xl font-bold mb-1" style={{ color: accent.text }}>
            {headline}
          </h1>
          <p className="text-sm font-medium opacity-70" style={{ color: accent.text }}>
            Quest with {saint.name} complete
          </p>
        </div>

        {/* Score */}
        <div className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm text-center">
          <p className="text-5xl font-bold text-gray-900 mb-1">
            {correctCount}
            <span className="text-2xl text-gray-400 font-medium">/{totalCount}</span>
          </p>
          <p className="text-gray-500 text-sm mb-3">challenges answered correctly</p>
          {/* Score bar */}
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ backgroundColor: accent.border, width: `${pct}%` }}
            />
          </div>
          <p className="text-base font-semibold" style={{ color: accent.button }}>
            {sub}
          </p>
        </div>

        {/* Virtues earned */}
        {Object.keys(totalVirtues).length > 0 && (
          <div className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
              Total Virtues Earned
            </h2>
            <VirtueTracker virtues={totalVirtues} />
          </div>
        )}

        {/* Quest recap */}
        <div className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
            Quest Recap
          </h2>
          <div className="space-y-2">
            {results.map((r, i) => (
              <div key={i} className="flex items-center gap-3 py-1">
                <span className="text-xl shrink-0">{r.correct ? '✅' : '❌'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700">
                    {r.title ?? `Quest ${i + 1}`}
                  </p>
                  {r.usedRetry && (
                    <p className="text-xs text-gray-400">Used a second try</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 justify-end">
                  {r.correct
                    ? Object.entries(r.virtueGained).map(([v, pts]) => {
                        const vs = getVirtueStyle(v);
                        return (
                          <span
                            key={v}
                            className="text-xs px-2 py-0.5 rounded-full border font-semibold"
                            style={{
                              backgroundColor: vs.bg,
                              color: vs.text,
                              borderColor: vs.border,
                            }}
                          >
                            +{pts} {v}
                          </span>
                        );
                      })
                    : (
                      <span className="text-xs text-gray-400 italic">No virtue earned</span>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onPlayAgain}
          className="w-full py-4 rounded-2xl font-bold text-white text-base shadow-sm transition-opacity hover:opacity-90"
          style={{ backgroundColor: accent.button }}
        >
          Choose Another Saint ✨
        </button>
      </div>
    </div>
  );
}
