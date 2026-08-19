'use client';

import { useMemo, useState } from 'react';
import type { DilemmaChallenge as DilemmaType } from '@/lib/types';
import { shuffle } from '@/lib/shuffle';

interface Props {
  challenge: DilemmaType;
  onAnswer: (correct: boolean, usedRetry: boolean) => void;
}

const LABELS = ['A', 'B', 'C', 'D'];

interface ShuffledChoice {
  text: string;
  originalIndex: number;
}

export default function DilemmaChallenge({ challenge, onAnswer }: Props) {
  const options = useMemo<ShuffledChoice[]>(
    () => shuffle(challenge.options.map((text, originalIndex) => ({ text, originalIndex }))),
    [challenge],
  );
  const [selected, setSelected] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [usedRetry, setUsedRetry] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const correctShuffled = options.findIndex(option => option.originalIndex === challenge.answer_index);
  const announcement = locked && selected !== null
    ? options[selected].originalIndex === challenge.answer_index
      ? `Correct. ${options[selected].text}`
      : `Not quite. The correct answer is ${options[correctShuffled]?.text ?? ''}`
    : showHint
      ? `Not yet. One more try. ${challenge.hint}`
      : selected !== null
        ? `${options[selected].text} selected.`
        : '';

  const handleSelect = (index: number) => {
    if (locked) return;
    setSelected(index);
  };

  const handleCommit = () => {
    if (selected === null || locked) return;
    const correct = options[selected].originalIndex === challenge.answer_index;
    if (!correct && !usedRetry) {
      setUsedRetry(true);
      setShowHint(true);
      setSelected(null);
      return;
    }
    setLocked(true);
    onAnswer(correct, usedRetry);
  };

  return (
    <div className="space-y-4">
      <p className="text-base font-medium text-gray-800 text-center leading-relaxed">
        {challenge.prompt}
      </p>
      <div className="grid grid-cols-1 gap-3">
        {options.map((option, i) => {
          const base = 'w-full text-left p-4 rounded-xl border-2 text-sm font-medium transition-all duration-200 cursor-pointer flex items-start gap-3';
          let className = base;
          if (locked) {
            if (i === correctShuffled) className += ' border-emerald-400 bg-emerald-50 text-emerald-800 shadow-sm';
            else if (i === selected) className += ' border-red-400 bg-red-50 text-red-800';
            else className += ' border-gray-100 bg-gray-50 text-gray-400 opacity-60';
          } else if (i === selected) {
            className += ' border-amber-400 bg-amber-50 text-amber-900 ring-2 ring-amber-200';
          } else {
            className += ' border-gray-200 bg-white text-gray-700 hover:border-amber-300 hover:bg-amber-50 hover:shadow-sm';
          }

          return (
            <button
              key={`${option.originalIndex}-${option.text}`}
              className={className}
              onClick={() => handleSelect(i)}
              disabled={locked}
              aria-pressed={selected === i}
            >
              <span className="shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center mt-0.5">
                {LABELS[i]}
              </span>
              <span className="flex-1">{option.text}</span>
              {locked && i === correctShuffled && (
                <span className="shrink-0 text-emerald-500 text-lg" aria-hidden="true">✓</span>
              )}
              {locked && i === selected && i !== correctShuffled && (
                <span className="shrink-0 text-red-400 text-lg" aria-hidden="true">✗</span>
              )}
            </button>
          );
        })}
      </div>
      {showHint && !locked && (
        <p
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900"
          role="status"
          aria-live="polite"
        >
          Not yet. One more try. {challenge.hint}
        </p>
      )}
      {!locked && (
        <button
          onClick={handleCommit}
          disabled={selected === null}
          className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          style={
            selected === null
              ? { backgroundColor: '#E5E7EB', color: '#9CA3AF' }
              : { backgroundColor: '#F59E0B', color: '#fff' }
          }
        >
          {usedRetry ? 'Try this answer' : 'Lock in answer'}
        </button>
      )}
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
    </div>
  );
}
