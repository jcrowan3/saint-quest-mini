'use client';

import { useState } from 'react';
import type { DilemmaChallenge as DilemmaType } from '@/lib/types';

interface Props {
  challenge: DilemmaType;
  onAnswer: (correct: boolean) => void;
}

const LABELS = ['A', 'B', 'C', 'D'];

export default function DilemmaChallenge({ challenge, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const announcement = selected === null
    ? ''
    : selected === challenge.answer_index
      ? `Correct. ${challenge.options[selected]}`
      : `Not quite. The correct answer is ${challenge.options[challenge.answer_index]}`;

  const handleSelect = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    setTimeout(() => onAnswer(index === challenge.answer_index), 700);
  };

  const getButtonStyle = (i: number): React.CSSProperties & { className: string } => {
    const base = 'w-full text-left p-4 rounded-xl border-2 text-sm font-medium transition-all duration-200 cursor-pointer flex items-start gap-3';
    if (selected === null) {
      return { className: `${base} border-gray-200 bg-white text-gray-700 hover:border-amber-300 hover:bg-amber-50 hover:shadow-sm` };
    }
    if (i === challenge.answer_index) {
      return { className: `${base} border-emerald-400 bg-emerald-50 text-emerald-800 shadow-sm` };
    }
    if (i === selected) {
      return { className: `${base} border-red-400 bg-red-50 text-red-800` };
    }
    return { className: `${base} border-gray-100 bg-gray-50 text-gray-400 opacity-60` };
  };

  return (
    <div className="space-y-4">
      <p className="text-base font-medium text-gray-800 text-center leading-relaxed">
        {challenge.prompt}
      </p>
      <div className="grid grid-cols-1 gap-3">
        {challenge.options.map((option, i) => {
          const { className } = getButtonStyle(i);
          return (
            <button
              key={i}
              className={className}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
              aria-pressed={selected === i}
            >
              <span className="shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center mt-0.5">
                {LABELS[i]}
              </span>
              <span className="flex-1">{option}</span>
              {selected !== null && i === challenge.answer_index && (
                <span className="shrink-0 text-emerald-500 text-lg" aria-hidden="true">✓</span>
              )}
              {selected === i && i !== challenge.answer_index && (
                <span className="shrink-0 text-red-400 text-lg" aria-hidden="true">✗</span>
              )}
            </button>
          );
        })}
      </div>
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
    </div>
  );
}
