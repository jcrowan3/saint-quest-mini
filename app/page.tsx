'use client';

import { useState, useCallback, useEffect } from 'react';
import { saints, getQuestsForSaint } from '@/lib/data';
import type { Saint, Quest, QuestResult } from '@/lib/types';
import SaintCard from '@/app/components/SaintCard';
import QuestFlow from '@/app/components/QuestFlow';
import CompletionScreen from '@/app/components/CompletionScreen';
import { useGame } from '@/lib/context/GameContext';

type GameView = 'home' | 'questing' | 'complete';

export default function Home() {
  const { gameState, selectSaint: ctxSelectSaint, resetProgress } = useGame();
  const [view, setView] = useState<GameView>('home');
  const [selectedSaint, setSelectedSaint] = useState<Saint | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [results, setResults] = useState<QuestResult[]>([]);
  const [resumed, setResumed] = useState(false);

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
