'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  getDailyRecommendation,
  getQuestsForSaint,
  getSaintFinderMatches,
  lifeSituationOptions,
  patronageOptions,
  saints,
} from '@/lib/data';
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
  const {
    progress,
    hydrated,
    startQuest,
    checkpointQuest,
    finishQuest,
    abandonQuest,
  } = useGame();
  const [view, setView] = useState<GameView>('home');
  const [selectedSaint, setSelectedSaint] = useState<Saint | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [results, setResults] = useState<QuestResult[]>([]);
  const [recommendation, setRecommendation] = useState<DailyRecommendation | null>(null);
  const [streak, setStreak] = useState<StreakState | null>(null);
  const [resumed, setResumed] = useState(false);
  const [finderTags, setFinderTags] = useState<string[]>([]);

  const finderMatches = useMemo(() => getSaintFinderMatches(finderTags), [finderTags]);
  const hasFinderFilters = finderTags.length > 0;
  const lifetimeVirtuePoints = useMemo(
    () => Object.values(progress.cumulativeVirtues).reduce((total, points) => total + points, 0),
    [progress.cumulativeVirtues],
  );
  const topVirtue = useMemo(
    () => Object.entries(progress.cumulativeVirtues).sort(([, a], [, b]) => b - a)[0],
    [progress.cumulativeVirtues],
  );

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
    if (!hydrated || resumed) return;
    const session = progress.activeSession;
    const saintId = session?.saintId;
    const saint = saintId ? saints.find(s => s.id === saintId) : null;
    const saintQuests = saint ? getQuestsForSaint(saint.id) : [];
    if (saint && session && session.questIndex < saintQuests.length) {
      /* eslint-disable react-hooks/set-state-in-effect -- see comment above */
      setSelectedSaint(saint);
      setQuests(saintQuests);
      setView('questing');
      /* eslint-enable react-hooks/set-state-in-effect */
    } else if (session) {
      abandonQuest();
    }
    setResumed(true);
  }, [abandonQuest, hydrated, progress.activeSession, resumed]);

  const handleSelectSaint = useCallback((saint: Saint) => {
    startQuest(saint.id);
    setSelectedSaint(saint);
    setQuests(getQuestsForSaint(saint.id));
    setResults([]);
    setView('questing');
  }, [startQuest]);

  const handleStartRecommendation = useCallback(() => {
    if (!recommendation) return;
    handleSelectSaint(recommendation.saint);
  }, [handleSelectSaint, recommendation]);

  const recommendationLaunchLabel = useMemo(() => {
    if (!recommendation) return 'Start recommended quest';
    if (recommendation.source === 'feast' && recommendation.feastHasQuest === false) {
      return `Start ${recommendation.saint.name}'s quest`;
    }
    return 'Start recommended quest';
  }, [recommendation]);

  const toggleFinderTag = useCallback((tag: string) => {
    setFinderTags(current => (
      current.includes(tag)
        ? current.filter(item => item !== tag)
        : [...current, tag]
    ));
  }, []);

  const handleQuestComplete = useCallback((allResults: QuestResult[]) => {
    if (selectedSaint) finishQuest(selectedSaint.id, allResults);
    setResults(allResults);
    setView('complete');
  }, [finishQuest, selectedSaint]);

  const handleRestart = useCallback(() => {
    abandonQuest();
    setSelectedSaint(null);
    setQuests([]);
    setResults([]);
    setView('home');
  }, [abandonQuest]);

  if (view === 'questing' && selectedSaint && progress.activeSession) {
    return (
      <QuestFlow
        saint={selectedSaint}
        quests={quests}
        initialSession={progress.activeSession}
        onCheckpoint={checkpointQuest}
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
                  {(recommendation.questGuideLabel ?? recommendation.questGuide) && (
                    <p className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900">
                      {recommendation.questGuideLabel ?? recommendation.questGuide}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={handleStartRecommendation}
                className="shrink-0 rounded-2xl bg-amber-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-90"
              >
                {recommendationLaunchLabel} →
              </button>
            </div>
          </div>
        )}

        {hydrated && (
          <section
            aria-labelledby="journey-heading"
            className="mb-8 rounded-3xl border border-amber-200 bg-amber-100/60 p-5"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-amber-600">
                  Your journey
                </p>
                <h2 id="journey-heading" className="mt-1 text-xl font-bold text-amber-950">
                  Progress that stays with you
                </h2>
                {topVirtue && (
                  <p className="mt-1 text-sm text-amber-800">
                    Strongest virtue: <span className="font-bold">{topVirtue[0]} +{topVirtue[1]}</span>
                  </p>
                )}
              </div>
              <dl className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-2xl bg-white px-3 py-2 shadow-sm">
                  <dt className="text-xs text-amber-700">Saints</dt>
                  <dd className="text-xl font-bold text-amber-950">
                    {progress.completedSaintIds.length}
                  </dd>
                </div>
                <div className="rounded-2xl bg-white px-3 py-2 shadow-sm">
                  <dt className="text-xs text-amber-700">Challenges</dt>
                  <dd className="text-xl font-bold text-amber-950">
                    {progress.totalChallengesCompleted}
                  </dd>
                </div>
                <div className="rounded-2xl bg-white px-3 py-2 shadow-sm">
                  <dt className="text-xs text-amber-700">Virtue</dt>
                  <dd className="text-xl font-bold text-amber-950">{lifetimeVirtuePoints}</dd>
                </div>
              </dl>
            </div>
          </section>
        )}

        <div className="flex items-center gap-3 justify-center mb-6">
          <div className="h-px flex-1 bg-amber-200 max-w-16" />
          <p className="text-xs font-bold text-amber-600 uppercase tracking-widest">
            Find your saint
          </p>
          <div className="h-px flex-1 bg-amber-200 max-w-16" />
        </div>

        <div className="mb-6 rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-amber-950">
                What do you need today?
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-amber-800">
                Choose patronages or life situations to reveal saints who fit.
              </p>
            </div>
            {hasFinderFilters && (
              <button
                onClick={() => setFinderTags([])}
                className="self-start rounded-xl border border-amber-200 px-3 py-2 text-xs font-bold uppercase tracking-wide text-amber-700 transition-colors hover:bg-amber-50"
              >
                Clear
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-amber-600">
                Patronage
              </p>
              <div className="flex flex-wrap gap-2">
                {patronageOptions.map(tag => {
                  const selected = finderTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleFinderTag(tag)}
                      aria-pressed={selected}
                      className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors ${
                        selected
                          ? 'border-amber-700 bg-amber-700 text-white'
                          : 'border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-amber-600">
                Life Situation
              </p>
              <div className="flex flex-wrap gap-2">
                {lifeSituationOptions.map(tag => {
                  const selected = finderTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleFinderTag(tag)}
                      aria-pressed={selected}
                      className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors ${
                        selected
                          ? 'border-amber-700 bg-amber-700 text-white'
                          : 'border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
            {hasFinderFilters
              ? `${finderMatches.length} matching saint${finderMatches.length === 1 ? '' : 's'}`
              : 'All saints are ready for a quest'}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {finderMatches.map(({ saint, matchedTags }) => (
            <div key={saint.id} className="space-y-2">
              <SaintCard
                saint={saint}
                completed={progress.completedSaintIds.includes(saint.id)}
                onClick={handleSelectSaint}
              />
              {hasFinderFilters && (
                <p className="rounded-xl bg-white/80 px-3 py-2 text-center text-xs font-semibold leading-snug text-amber-800 shadow-sm">
                  {matchedTags.length > 0 ? saint.finderPrompt : 'Available for any quest'}
                </p>
              )}
            </div>
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
