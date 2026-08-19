'use client';

import { useState, useMemo } from 'react';
import type { TimelineChallenge as TimelineType, TimelineEvent } from '@/lib/types';
import { shuffle } from '@/lib/shuffle';

interface Props {
  challenge: TimelineType;
  onAnswer: (correct: boolean, usedRetry: boolean) => void;
}

export default function TimelineChallenge({ challenge, onAnswer }: Props) {
  const [orderedEvents, setOrderedEvents] = useState<TimelineEvent[]>(() => shuffle([...challenge.events]));
  const [usedRetry, setUsedRetry] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [locked, setLocked] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  const correctOrder = useMemo(
    () => [...challenge.events].sort((a, b) => a.year - b.year),
    [challenge.events],
  );

  const moveUp = (i: number) => {
    if (i === 0 || locked) return;
    const event = orderedEvents[i];
    const next = [...orderedEvents];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    setOrderedEvents(next);
    setAnnouncement(`Moved ${event.text} to position ${i}.`);
  };

  const moveDown = (i: number) => {
    if (i === orderedEvents.length - 1 || locked) return;
    const event = orderedEvents[i];
    const next = [...orderedEvents];
    [next[i], next[i + 1]] = [next[i + 1], next[i]];
    setOrderedEvents(next);
    setAnnouncement(`Moved ${event.text} to position ${i + 2}.`);
  };

  const isCorrect = () => orderedEvents.every((e, i) => e.year === correctOrder[i].year);

  const handleSubmit = () => {
    if (locked) return;
    const correct = isCorrect();
    if (!correct && !usedRetry) {
      setUsedRetry(true);
      setShowHint(true);
      setAnnouncement(`Not yet in order. ${challenge.hint}`);
      return;
    }
    setLocked(true);
    setAnnouncement(
      correct
        ? 'The timeline is in the correct order.'
        : `The timeline is not in the correct order. Correct years: ${correctOrder.map(event => event.year).join(', ')}.`,
    );
    onAnswer(correct, usedRetry);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-gray-600 text-center">{challenge.prompt}</p>

      <div className="space-y-2">
        {orderedEvents.map((event, i) => {
          const inRightSpot = locked && event.year === correctOrder[i].year;
          const inWrongSpot = locked && event.year !== correctOrder[i].year;

          let cardClass =
            'flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-150 ';
          if (inRightSpot) cardClass += 'border-emerald-400 bg-emerald-50';
          else if (inWrongSpot) cardClass += 'border-red-300 bg-red-50';
          else cardClass += 'border-gray-200 bg-white';

          return (
            <div key={`${event.year}-${event.text}`} className={cardClass}>
              <span className="shrink-0 w-7 h-7 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <span className="flex-1 text-sm font-medium text-gray-700 leading-snug">
                {event.text}
                {locked && (
                  <span className="ml-2 text-xs text-gray-400 font-normal">({event.year})</span>
                )}
              </span>
              {!locked && (
                <div className="flex flex-col gap-0.5 shrink-0">
                  <button
                    onClick={() => moveUp(i)}
                    disabled={i === 0}
                    className="p-1 text-gray-400 hover:text-amber-600 disabled:opacity-20 text-xs leading-none transition-colors"
                    aria-label={`Move ${event.text} up`}
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => moveDown(i)}
                    disabled={i === orderedEvents.length - 1}
                    className="p-1 text-gray-400 hover:text-amber-600 disabled:opacity-20 text-xs leading-none transition-colors"
                    aria-label={`Move ${event.text} down`}
                  >
                    ▼
                  </button>
                </div>
              )}
              {locked && (
                <span className="shrink-0 text-lg" aria-hidden="true">
                  {inRightSpot ? '✓' : '✗'}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {showHint && !locked && (
        <p
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900"
          role="status"
        >
          Not yet in order. {challenge.hint}
        </p>
      )}

      {!locked && (
        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-colors"
          style={{ backgroundColor: '#F59E0B' }}
        >
          {usedRetry ? 'Check order again' : 'Lock In My Order →'}
        </button>
      )}

      {locked && (
        <div className="text-center">
          <p className="text-xs text-gray-500 mt-1">
            Correct order: {correctOrder.map(e => e.year).join(' → ')}
          </p>
        </div>
      )}
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
    </div>
  );
}
