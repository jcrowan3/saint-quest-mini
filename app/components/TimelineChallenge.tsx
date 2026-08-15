'use client';

import { useState, useMemo } from 'react';
import type { TimelineChallenge as TimelineType, TimelineEvent } from '@/lib/types';

interface Props {
  challenge: TimelineType;
  onAnswer: (correct: boolean) => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function TimelineChallenge({ challenge, onAnswer }: Props) {
  const initialOrder = useMemo(
    () => shuffle([...challenge.events]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [orderedEvents, setOrderedEvents] = useState<TimelineEvent[]>(initialOrder);
  const [submitted, setSubmitted] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  const correctOrder = useMemo(
    () => [...challenge.events].sort((a, b) => a.year - b.year),
    [challenge.events],
  );

  const moveUp = (i: number) => {
    if (i === 0 || submitted) return;
    const event = orderedEvents[i];
    const next = [...orderedEvents];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    setOrderedEvents(next);
    setAnnouncement(`Moved ${event.text} to position ${i}.`);
  };

  const moveDown = (i: number) => {
    if (i === orderedEvents.length - 1 || submitted) return;
    const event = orderedEvents[i];
    const next = [...orderedEvents];
    [next[i], next[i + 1]] = [next[i + 1], next[i]];
    setOrderedEvents(next);
    setAnnouncement(`Moved ${event.text} to position ${i + 2}.`);
  };

  const handleSubmit = () => {
    const isCorrect = orderedEvents.every((e, i) => e.year === correctOrder[i].year);
    setSubmitted(true);
    setAnnouncement(
      isCorrect
        ? 'The timeline is in the correct order.'
        : `The timeline is not in the correct order. Correct years: ${correctOrder.map(event => event.year).join(', ')}.`,
    );
    setTimeout(() => onAnswer(isCorrect), 900);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-gray-600 text-center">{challenge.prompt}</p>

      <div className="space-y-2">
        {orderedEvents.map((event, i) => {
          const inRightSpot = submitted && event.year === correctOrder[i].year;
          const inWrongSpot = submitted && event.year !== correctOrder[i].year;

          let cardClass =
            'flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-150 ';
          if (inRightSpot) cardClass += 'border-emerald-400 bg-emerald-50';
          else if (inWrongSpot) cardClass += 'border-red-300 bg-red-50';
          else cardClass += 'border-gray-200 bg-white';

          return (
            <div key={`${event.year}-${i}`} className={cardClass}>
              <span className="shrink-0 w-7 h-7 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <span className="flex-1 text-sm font-medium text-gray-700 leading-snug">
                {event.text}
                {submitted && (
                  <span className="ml-2 text-xs text-gray-400 font-normal">({event.year})</span>
                )}
              </span>
              {!submitted && (
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
              {submitted && (
                <span className="shrink-0 text-lg" aria-hidden="true">
                  {inRightSpot ? '✓' : '✗'}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-colors"
          style={{ backgroundColor: '#F59E0B' }}
        >
          Lock In My Order →
        </button>
      )}

      {submitted && (
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
