'use client';

import { useState } from 'react';
import type { TriviaChallenge as TriviaType } from '@/lib/types';

interface Props {
  challenge: TriviaType;
  onAnswer: (correct: boolean) => void;
}

const LABELS = ['A', 'B', 'C', 'D'];

export default function TriviaChallenge({ challenge, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const announcement = selected === null
    ? ''
    : selected === challenge.answer_index
      ? `Correct. ${challenge.choices[selected]}`
      : `Not quite. The correct answer is ${challenge.choices[challenge.answer_index]}`;

  const handleSelect = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    setTimeout(() => onAnswer(index === challenge.answer_index), 700);
  };

  return (
    <div className="space-y-4">
      <p className="text-base font-medium text-gray-800 text-center leading-relaxed">
        {challenge.question}
      </p>
      <div className="grid grid-cols-1 gap-3">
        {challenge.choices.map((choice, i) => {
          let className =
            'w-full text-left p-4 rounded-xl border-2 text-sm font-medium transition-all duration-200 cursor-pointer flex items-start gap-3 ';
          if (selected === null) {
            className += 'border-gray-200 bg-white text-gray-700 hover:border-amber-300 hover:bg-amber-50 hover:shadow-sm';
          } else if (i === challenge.answer_index) {
            className += 'border-emerald-400 bg-emerald-50 text-emerald-800 shadow-sm';
          } else if (i === selected) {
            className += 'border-red-400 bg-red-50 text-red-800';
          } else {
            className += 'border-gray-100 bg-gray-50 text-gray-400 opacity-60';
          }

          return (
            <button
              key={i}
              className={className}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
              aria-pressed={selected === i}
            >
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center mt-0.5">
                {LABELS[i]}
              </span>
              <span className="flex-1">{choice}</span>
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
