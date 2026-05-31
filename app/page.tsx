'use client';

import { useState, useCallback, useEffect } from 'react';
import { saints, getDailyRecommendation, getQuestsForSaint } from '@/lib/data';
import type { DailyRecommendation, Saint, Quest, QuestResult } from '@/lib/types';
import SaintCard from '@/app/components/SaintCard';
import QuestFlow from '@/app/components/QuestFlow';
import CompletionScreen from '@/app/components/CompletionScreen';
import { useGame } from '@/lib/context/GameContext';

type GameView = 'home' | 'questing' | 'complete';

const STREAK_STORAGE_KEY = 'saintQuestStreak';

interface StreakState {
  lastVisitDate: string;
  count: number;
}

function getPreviousDateKey(dateKey: string) {
  const date = new Date(`${dateKey}T00:00:00`);
  date.setDate(date.getDate() - 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function updateStreak(dateKey: string): StreakState {
  try {
    const saved = localStorage.getItem(STREAK_STORAGE_KEY);
    const previous = saved ? JSON.parse(saved) as StreakState : null;
    if (previous?.lastVisitDate === dateKey) return previous;

    const next: StreakState = {
      lastVisitDate: dateKey,
      count: previous?.lastVisitDate === getPreviousDateKey(dateKey) ? previous.count + 1 : 1,
    };
    localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(next));
    return next;
  } catch {
    return { lastVisitDate: dateKey, count: 1 };
  }
}

export default function Home() {
  const { gameState, selectSaint: ctxSelectSaint, resetProgress } = useGame();
  const [view, setView] = useState<GameView>('home');
  const [selectedSaint, setSelectedSaint] = useState<Saint | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [results, setResults] = useState<QuestResult[]>([]);
  const [recommendation, setRecommendation] = useState<DailyRecommendation | null>(null);
  const [streak, setStreak] = useState<StreakState | null>(null);
  const [resumed, setResumed] = useState(false);

  useEffect(() => {
    const daily = getDailyRecommendation();
    /* eslint-disable react-hooks/set-state-in-effect -- local date/localStorage are client-only after hydration */
    setRecommendation(daily);
    setStreak(updateStreak(daily.dateKey));
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Resume an in-progress saint from localStorage after hydration. Must run
  // post-mount to avoid SSR/client mismatch — the server render has no access
  // to localStorage, so the 'home' view is always the initial paint.
  useEffect(() => {
    if (resumed) return;
    const saintId = gameState.userProgress.currentSaintId;
    const saint = saintId ? saints.find(s => s.id === saintId) : null;
    if (saint) {
      /* eslint-disable react-hooks/set-state-in-effect -- see comment above */
      setSelectedSaint(saint);
      setQuests(getQuestsForSaint(saint.id));
      setView('questing');
      /* eslint-enable react-hooks/set-state-in-effect */
    }
    setResumed(true);
  }, [gameState.userProgress.currentSaintId, resumed]);

  const handleSelectSaint = useCallback((saint: Saint) => {
    ctxSelectSaint(saint);
    setSelectedSaint(saint);
    setQuests(getQuestsForSaint(saint.id));
    setResults([]);
    setView('questing');
  }, [ctxSelectSaint]);

  const handleStartRecommendation = useCallback(() => {
    if (!recommendation) return;
    handleSelectSaint(recommendation.saint);
  }, [handleSelectSaint, recommendation]);

  const handleQuestComplete = useCallback((allResults: QuestResult[]) => {
    resetProgress();
    setResults(allResults);
    setView('complete');
  }, [resetProgress]);

  const handleRestart = useCallback(() => {
    resetProgress();
    setSelectedSaint(null);
    setQuests([]);
    setResults([]);
    setView('home');
  }, [resetProgress]);

  if (view === 'questing' && selectedSaint) {
    return (
      <QuestFlow
        saint={selectedSaint}
        quests={quests}
        onComplete={handleQuestComplete}
        onBack={handleRestart}
      />
    );
  }

  if (view === 'complete' && selectedSaint) {
    return (
      <CompletionScreen
        saint={selectedSaint}
        results={results}
        onPlayAgain={handleRestart}
      />
    );
  }

  return (
    <main className="min-h-screen bg-amber-50 px-4 pb-16 pt-12">
      {/* Hero header */}
      <header className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 border-2 border-amber-200 mb-5 text-4xl shadow-sm">
          ✨
        </div>
        <h1 className="text-5xl font-bold text-amber-900 tracking-tight leading-none mb-3">
          Saint Quest
        </h1>
        <p className="text-amber-700 text-lg max-w-xs mx-auto leading-snug">
          Walk with the saints. Answer challenges. Grow in virtue.
        </p>
      </header>

      {/* Saint picker */}
      <section className="max-w-3xl mx-auto">
        {recommendation && (
          <div className="mb-8 rounded-3xl border-2 border-amber-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="text-5xl" aria-hidden="true">
                  {recommendation.displayAvatar ?? recommendation.saint.avatar}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-amber-600">
                      {recommendation.label}
                    </p>
                    {streak && (
                      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
                        🔥 {streak.count}-day streak
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-amber-950">
                    {recommendation.displayName ?? recommendation.saint.name}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-amber-800">
                    {recommendation.reflection}
                  </p>
                  {recommendation.seasonalQuest && (
                    <p className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900">
                      Today&apos;s quest: {recommendation.seasonalQuest}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={handleStartRecommendation}
                className="shrink-0 rounded-2xl bg-amber-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-90"
              >
                Start recommended quest →
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 justify-center mb-6">
          <div className="h-px flex-1 bg-amber-200 max-w-16" />
          <p className="text-xs font-bold text-amber-600 uppercase tracking-widest">
            Choose your saint
          </p>
          <div className="h-px flex-1 bg-amber-200 max-w-16" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {saints.map(saint => (
            <SaintCard key={saint.id} saint={saint} onClick={handleSelectSaint} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-xl mx-auto mt-14">
        <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest text-center mb-5">
            How it works
          </h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { icon: '🙏', label: 'Pick a saint', desc: 'Choose a holy guide' },
              { icon: '⚔️', label: 'Face challenges', desc: 'Trivia, dilemmas & puzzles' },
              { icon: '🌟', label: 'Earn virtues', desc: 'Grow in faith & wisdom' },
            ].map(step => (
              <div key={step.label}>
                <div className="text-3xl mb-2">{step.icon}</div>
                <p className="font-bold text-gray-800 text-xs">{step.label}</p>
                <p className="text-gray-500 text-xs mt-0.5 leading-snug">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="text-center mt-10 text-amber-500/60 text-xs">
        Saint Quest · A virtuous adventure
      </footer>
    </main>
  );
}
