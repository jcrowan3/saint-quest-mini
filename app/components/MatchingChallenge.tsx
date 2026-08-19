'use client';

import { useState, useMemo } from 'react';
import type { MatchingChallenge as MatchingType } from '@/lib/types';
import { shuffle } from '@/lib/shuffle';

interface Props {
  challenge: MatchingType;
  onAnswer: (correct: boolean, usedRetry: boolean) => void;
}

interface ShuffledItem {
  text: string;
  originalIndex: number;
}

export default function MatchingChallenge({ challenge, onAnswer }: Props) {
  const pairs = challenge.pairs;

  const shuffledRight = useMemo<ShuffledItem[]>(
    () => shuffle(pairs.map((p, i) => ({ text: p.right, originalIndex: i }))),
    [pairs],
  );

  const [matches, setMatches] = useState<Record<number, number>>({});
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [usedRetry, setUsedRetry] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [locked, setLocked] = useState(false);
  const [wrongLeft, setWrongLeft] = useState<number[]>([]);

  const matchedLeftSet = new Set(Object.keys(matches).map(Number));
  const matchedRightSet = new Set(Object.values(matches));
  const matchedCount = Object.keys(matches).length;
  const allMatched = pairs.every((_, i) => matches[i] !== undefined);

  const missIndexes = () =>
    pairs
      .map((_, leftIdx) => leftIdx)
      .filter(leftIdx => {
        const ri = matches[leftIdx];
        return ri === undefined || shuffledRight[ri].originalIndex !== leftIdx;
      });

  const announcement = locked
    ? wrongLeft.length === 0
      ? 'All pairs are matched correctly.'
      : 'Some pairs are not matched correctly.'
    : showHint
      ? `Some pairs are still off. ${challenge.hint}`
      : selectedLeft !== null
        ? `${pairs[selectedLeft].left} selected. Choose its match from the right column.`
        : matchedCount > 0
          ? `${matchedCount} of ${pairs.length} pairs matched.`
          : '';

  const handleLeftClick = (idx: number) => {
    if (locked) return;
    setSelectedLeft(prev => (prev === idx ? null : idx));
  };

  const handleRightClick = (shuffledIdx: number) => {
    if (locked || selectedLeft === null) return;

    setMatches(prev => {
      const next = { ...prev };
      const existingLeft = Object.entries(next).find(([, ri]) => ri === shuffledIdx);
      if (existingLeft) delete next[Number(existingLeft[0])];
      next[selectedLeft] = shuffledIdx;
      return next;
    });
    setSelectedLeft(null);
  };

  const handleSubmit = () => {
    if (!allMatched || locked) return;
    const misses = missIndexes();
    const isCorrect = misses.length === 0;
    if (!isCorrect && !usedRetry) {
      setWrongLeft(misses);
      setUsedRetry(true);
      setShowHint(true);
      return;
    }
    setWrongLeft(isCorrect ? [] : misses);
    setLocked(true);
    onAnswer(isCorrect, usedRetry);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-gray-600 text-center">{challenge.prompt}</p>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2" role="group" aria-label="Items to match">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Match…</p>
          {pairs.map((pair, leftIdx) => {
            const isSelected = selectedLeft === leftIdx;
            const isMatched = matchedLeftSet.has(leftIdx);
            const matchedRightIndex = matches[leftIdx];
            const matchedRight = matchedRightIndex === undefined
              ? null
              : shuffledRight[matchedRightIndex];
            const isWrong = wrongLeft.includes(leftIdx);

            let className =
              'w-full p-3 rounded-xl text-xs text-left border-2 font-medium transition-all duration-150 cursor-pointer leading-snug ';
            if (locked) {
              className += isWrong
                ? 'border-red-400 bg-red-50 text-red-800'
                : 'border-emerald-400 bg-emerald-50 text-emerald-800';
            } else if (isSelected) {
              className += 'border-amber-400 bg-amber-50 text-amber-800 ring-2 ring-amber-200';
            } else if (isWrong) {
              className += 'border-amber-300 bg-amber-50 text-amber-800';
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
                aria-disabled={locked}
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

        <div className="space-y-2" role="group" aria-label="Possible matches">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider text-center">…to</p>
          {shuffledRight.map((item, shuffledIdx) => {
            const isMatched = matchedRightSet.has(shuffledIdx);
            const canTarget = selectedLeft !== null && !locked;
            const matchedLeftEntry = Object.entries(matches).find(([, rightIdx]) => (
              rightIdx === shuffledIdx
            ));
            const matchedLeft = matchedLeftEntry
              ? pairs[Number(matchedLeftEntry[0])]
              : null;

            let className =
              'w-full p-3 rounded-xl text-xs text-left border-2 font-medium transition-all duration-150 leading-snug ';
            if (locked) {
              className += 'border-gray-200 bg-gray-50 text-gray-600';
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
                disabled={locked}
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

      {showHint && !locked && (
        <p
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900"
          role="status"
        >
          Some pairs are still off. {challenge.hint}
        </p>
      )}

      {!locked && (
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
          {usedRetry
            ? 'Check again'
            : allMatched
              ? 'Check Matches →'
              : `Select all ${pairs.length} pairs to continue`}
        </button>
      )}
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
    </div>
  );
}
