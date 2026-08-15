'use client';

import { useState, useMemo } from 'react';
import type { MatchingChallenge as MatchingType } from '@/lib/types';

interface Props {
  challenge: MatchingType;
  onAnswer: (correct: boolean) => void;
}

interface ShuffledItem {
  text: string;
  originalIndex: number;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MatchingChallenge({ challenge, onAnswer }: Props) {
  const pairs = challenge.pairs;

  const shuffledRight = useMemo<ShuffledItem[]>(
    () => shuffle(pairs.map((p, i) => ({ text: p.right, originalIndex: i }))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // maps leftIndex → shuffledRightIndex
  const [matches, setMatches] = useState<Record<number, number>>({});
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);

  const matchedLeftSet = new Set(Object.keys(matches).map(Number));
  const matchedRightSet = new Set(Object.values(matches));
  const matchedCount = Object.keys(matches).length;
  const announcement = submitted
    ? correct
      ? 'All pairs are matched correctly.'
      : 'Some pairs are not matched correctly.'
    : selectedLeft !== null
      ? `${pairs[selectedLeft].left} selected. Choose its match from the right column.`
      : matchedCount > 0
        ? `${matchedCount} of ${pairs.length} pairs matched.`
        : '';

  const handleLeftClick = (idx: number) => {
    if (submitted) return;
    setSelectedLeft(prev => (prev === idx ? null : idx));
  };

  const handleRightClick = (shuffledIdx: number) => {
    if (submitted || selectedLeft === null) return;

    setMatches(prev => {
      const next = { ...prev };
      // Un-match any left item previously pointing here
      const existingLeft = Object.entries(next).find(([, ri]) => ri === shuffledIdx);
      if (existingLeft) delete next[Number(existingLeft[0])];
      next[selectedLeft] = shuffledIdx;
      return next;
    });
    setSelectedLeft(null);
  };

  const allMatched = pairs.every((_, i) => matches[i] !== undefined);

  const handleSubmit = () => {
    const isCorrect = pairs.every((_, leftIdx) => {
      const ri = matches[leftIdx];
      return ri !== undefined && shuffledRight[ri].originalIndex === leftIdx;
    });
    setCorrect(isCorrect);
    setSubmitted(true);
    setTimeout(() => onAnswer(isCorrect), 900);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-gray-600 text-center">{challenge.prompt}</p>

      <div className="grid grid-cols-2 gap-3">
        {/* Left column */}
        <div className="space-y-2" role="group" aria-label="Items to match">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Match…</p>
          {pairs.map((pair, leftIdx) => {
            const isSelected = selectedLeft === leftIdx;
            const isMatched = matchedLeftSet.has(leftIdx);
            const matchedRightIndex = matches[leftIdx];
            const matchedRight = matchedRightIndex === undefined
              ? null
              : shuffledRight[matchedRightIndex];

            let className =
              'w-full p-3 rounded-xl text-xs text-left border-2 font-medium transition-all duration-150 cursor-pointer leading-snug ';
            if (submitted) {
              className += correct
                ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
                : 'border-red-400 bg-red-50 text-red-800';
            } else if (isSelected) {
              className += 'border-amber-400 bg-amber-50 text-amber-800 ring-2 ring-amber-200';
            } else if (isMatched) {
              className += 'border-blue-300 bg-blue-50 text-blue-700';
            } else {
              className +=
                'border-gray-200 bg-white text-gray-700 hover:border-amber-300 hover:bg-amber-50';
            }

            return (
              <button
                key={leftIdx}
                className={className}
                onClick={() => handleLeftClick(leftIdx)}
                aria-pressed={isSelected}
                aria-disabled={submitted}
                aria-label={`${pair.left}. ${
                  isSelected
                    ? 'Selected; choose a match from the right column.'
                    : matchedRight
                      ? `Matched with ${matchedRight.text}; select to change this match.`
                      : 'Select this item to start a match.'
                }`}
              >
                {pair.left}
              </button>
            );
          })}
        </div>

        {/* Right column */}
        <div className="space-y-2" role="group" aria-label="Possible matches">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider text-center">…to</p>
          {shuffledRight.map((item, shuffledIdx) => {
            const isMatched = matchedRightSet.has(shuffledIdx);
            const canTarget = selectedLeft !== null && !submitted;
            const matchedLeftEntry = Object.entries(matches).find(([, rightIdx]) => (
              rightIdx === shuffledIdx
            ));
            const matchedLeft = matchedLeftEntry
              ? pairs[Number(matchedLeftEntry[0])]
              : null;

            let className =
              'w-full p-3 rounded-xl text-xs text-left border-2 font-medium transition-all duration-150 leading-snug ';
            if (submitted) {
              className += correct
                ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
                : 'border-red-400 bg-red-50 text-red-800';
            } else if (isMatched) {
              className += 'border-blue-300 bg-blue-50 text-blue-700';
            } else if (canTarget) {
              className +=
                'border-dashed border-amber-300 bg-amber-50 text-gray-700 cursor-pointer hover:border-amber-400 hover:bg-amber-100';
            } else {
              className += 'border-gray-200 bg-white text-gray-500 cursor-default';
            }

            return (
              <button
                key={shuffledIdx}
                className={className}
                onClick={() => handleRightClick(shuffledIdx)}
                disabled={submitted}
                aria-pressed={isMatched}
                aria-label={`${item.text}. ${
                  matchedLeft
                    ? `Matched with ${matchedLeft.left}.`
                    : canTarget
                      ? `Match with ${pairs[selectedLeft].left}.`
                      : 'Select an item from the left column first.'
                }`}
              >
                {item.text}
              </button>
            );
          })}
        </div>
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!allMatched}
          className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          style={
            allMatched
              ? { backgroundColor: '#F59E0B', color: '#fff' }
              : { backgroundColor: '#E5E7EB', color: '#9CA3AF' }
          }
        >
          {allMatched ? 'Check Matches →' : `Select all ${pairs.length} pairs to continue`}
        </button>
      )}
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
    </div>
  );
}
