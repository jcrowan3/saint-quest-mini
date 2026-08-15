'use client';

import { useState, useCallback, useMemo } from 'react';
import type { ActiveQuestSession, QuestPhase, Saint, Quest, QuestResult } from '@/lib/types';
import { SAINT_ACCENTS, DEFAULT_ACCENT, getVirtueStyle } from '@/lib/data';
import DilemmaChallenge from './DilemmaChallenge';
import TriviaChallenge from './TriviaChallenge';
import MatchingChallenge from './MatchingChallenge';
import TimelineChallenge from './TimelineChallenge';
import VirtueTracker from './VirtueTracker';

interface Props {
  saint: Saint;
  quests: Quest[];
  initialSession: ActiveQuestSession;
  onCheckpoint: (session: ActiveQuestSession) => void;
  onComplete: (results: QuestResult[]) => void;
  onBack: () => void;
}

const CHALLENGE_LABELS: Record<string, string> = {
  dilemma: 'Moral Dilemma',
  trivia: 'Knowledge Quest',
  matching: 'Matching Challenge',
  timeline: 'Timeline Puzzle',
};

const CHALLENGE_ICONS: Record<string, string> = {
  dilemma: '🤔',
  trivia: '📖',
  matching: '🔗',
  timeline: '📅',
};

export default function QuestFlow({
  saint,
  quests,
  initialSession,
  onCheckpoint,
  onComplete,
  onBack,
}: Props) {
  const safeInitialIndex = Math.min(initialSession.questIndex, Math.max(quests.length - 1, 0));
  const [questIndex, setQuestIndex] = useState(safeInitialIndex);
  const [phase, setPhase] = useState<QuestPhase>(initialSession.phase);
  const [allResults, setAllResults] = useState<QuestResult[]>(initialSession.results);

  const accent = SAINT_ACCENTS[saint.id] ?? DEFAULT_ACCENT;
  const currentQuest = quests[questIndex];
  const progress = (questIndex + (phase === 'feedback' ? 1 : 0)) / quests.length;
  const progressPercent = Math.round(progress * 100);
  const currentResult = allResults.find(result => result.questIndex === questIndex);
  const lastCorrect = currentResult?.correct ?? false;
  const cumulativeVirtues = useMemo(() => {
    const virtues: Record<string, number> = {};
    for (const result of allResults) {
      for (const [virtue, points] of Object.entries(result.virtueGained)) {
        virtues[virtue] = (virtues[virtue] ?? 0) + points;
      }
    }
    return virtues;
  }, [allResults]);

  const checkpoint = useCallback((
    nextQuestIndex: number,
    nextPhase: QuestPhase,
    nextResults: QuestResult[],
  ) => {
    onCheckpoint({
      runId: initialSession.runId,
      saintId: saint.id,
      questIndex: nextQuestIndex,
      phase: nextPhase,
      results: nextResults,
    });
  }, [initialSession.runId, onCheckpoint, saint.id]);

  const handleAnswer = useCallback(
    (correct: boolean) => {
      if (allResults.some(result => result.questIndex === questIndex)) return;
      const virtueGained: Record<string, number> = correct ? { ...currentQuest.reward } : {};

      const result: QuestResult = { questIndex, correct, virtueGained };
      const nextResults = [...allResults, result];
      setAllResults(nextResults);
      setPhase('feedback');
      checkpoint(questIndex, 'feedback', nextResults);
    },
    [allResults, checkpoint, currentQuest, questIndex],
  );

  const handleBeginChallenge = useCallback(() => {
    setPhase('challenge');
    checkpoint(questIndex, 'challenge', allResults);
  }, [allResults, checkpoint, questIndex]);

  const handleNext = useCallback(() => {
    if (questIndex + 1 >= quests.length) {
      onComplete([...allResults]);
    } else {
      const nextQuestIndex = questIndex + 1;
      setQuestIndex(nextQuestIndex);
      setPhase('story');
      checkpoint(nextQuestIndex, 'story', allResults);
    }
  }, [allResults, checkpoint, onComplete, questIndex, quests.length]);

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header band */}
      <header
        className="px-4 py-4 border-b sticky top-0 z-10"
        style={{ backgroundColor: accent.bg, borderColor: accent.border }}
      >
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-sm font-semibold flex items-center gap-1.5 transition-opacity hover:opacity-70"
            style={{ color: accent.text }}
          >
            ← Saints
          </button>

          <div className="flex items-center gap-2">
            <span className="text-2xl">{saint.avatar}</span>
            <span className="font-bold text-sm hidden sm:inline" style={{ color: accent.text }}>
              {saint.name}
            </span>
          </div>

          <div
            className="text-sm font-bold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: accent.border + '33', color: accent.text }}
          >
            {questIndex + 1} / {quests.length}
          </div>
        </div>

        {/* Progress bar */}
        <div className="max-w-2xl mx-auto mt-3">
          <div
            className="h-1.5 bg-black/10 rounded-full overflow-hidden"
            role="progressbar"
            aria-label="Quest progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progressPercent}
            aria-valuetext={`Quest ${questIndex + 1} of ${quests.length}, ${phase}`}
          >
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{ backgroundColor: accent.border, width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Running virtue tally */}
        {Object.keys(cumulativeVirtues).length > 0 && (
          <div className="bg-white rounded-2xl px-4 py-3 border border-amber-100 shadow-sm">
            <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-2">
              Virtues Earned
            </p>
            <VirtueTracker virtues={cumulativeVirtues} compact />
          </div>
        )}

        {/* Quest card */}
        <div className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden">
          {/* Card header */}
          <div
            className="px-5 pt-5 pb-4 border-b"
            style={{ borderColor: accent.border + '40' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">
                {CHALLENGE_ICONS[currentQuest.challenge.type]}
              </span>
              <span
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: accent.button }}
              >
                {CHALLENGE_LABELS[currentQuest.challenge.type]}
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 leading-snug">
              {currentQuest.title}
            </h2>
          </div>

          <div className="p-5 space-y-5">
            {/* Story blurb */}
            <div
              className="rounded-xl p-4 border text-sm text-gray-700 leading-relaxed"
              style={{ backgroundColor: accent.bg, borderColor: accent.border + '40' }}
            >
              {currentQuest.story}
            </div>

            {/* Phase rendering */}
            {phase === 'story' && (
              <button
                onClick={handleBeginChallenge}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-opacity hover:opacity-90 shadow-sm"
                style={{ backgroundColor: accent.button }}
              >
                Begin Challenge →
              </button>
            )}

            {phase === 'challenge' && (
              <div key={`${initialSession.runId}:${questIndex}`}>
                {currentQuest.challenge.type === 'dilemma' && (
                  <DilemmaChallenge challenge={currentQuest.challenge} onAnswer={handleAnswer} />
                )}
                {currentQuest.challenge.type === 'trivia' && (
                  <TriviaChallenge challenge={currentQuest.challenge} onAnswer={handleAnswer} />
                )}
                {currentQuest.challenge.type === 'matching' && (
                  <MatchingChallenge challenge={currentQuest.challenge} onAnswer={handleAnswer} />
                )}
                {currentQuest.challenge.type === 'timeline' && (
                  <TimelineChallenge challenge={currentQuest.challenge} onAnswer={handleAnswer} />
                )}
              </div>
            )}

            {phase === 'feedback' && (
              <div className="space-y-4">
                {/* Result banner */}
                <div
                  className={`flex items-start gap-3 p-4 rounded-xl border ${
                    lastCorrect
                      ? 'border-emerald-200 bg-emerald-50'
                      : 'border-amber-200 bg-amber-50'
                  }`}
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <span className="text-3xl shrink-0" aria-hidden="true">
                    {lastCorrect ? '🌟' : '💛'}
                  </span>
                  <div>
                    <p
                      className={`font-bold text-base ${
                        lastCorrect ? 'text-emerald-800' : 'text-amber-800'
                      }`}
                    >
                      {lastCorrect ? 'Well done!' : 'Not quite — keep going!'}
                    </p>
                    {lastCorrect && Object.keys(currentQuest.reward).length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {Object.entries(currentQuest.reward).map(([virtue, pts]) => {
                          const vs = getVirtueStyle(virtue);
                          return (
                            <span
                              key={virtue}
                              className="text-xs px-2 py-0.5 rounded-full border font-bold"
                              style={{
                                backgroundColor: vs.bg,
                                color: vs.text,
                                borderColor: vs.border,
                              }}
                            >
                              +{pts} {virtue}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Fun fact */}
                {currentQuest.funFact && (
                  <div className="bg-sky-50 border border-sky-100 rounded-xl p-4">
                    <p className="text-xs font-bold text-sky-600 mb-1">📚 Did you know?</p>
                    <p className="text-sm text-sky-800 leading-relaxed">{currentQuest.funFact}</p>
                  </div>
                )}

                <button
                  onClick={handleNext}
                  className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-opacity hover:opacity-90 shadow-sm"
                  style={{ backgroundColor: accent.button }}
                >
                  {questIndex + 1 < quests.length ? 'Next Quest →' : 'See My Results 🏆'}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
