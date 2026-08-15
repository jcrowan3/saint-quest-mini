'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ActiveQuestSession, PlayerProgress, QuestResult } from '@/lib/types';
import {
  LEGACY_PROGRESS_STORAGE_KEY,
  PROGRESS_STORAGE_KEY,
  abandonQuest as abandonQuestProgress,
  checkpointQuest as checkpointQuestProgress,
  createDefaultProgress,
  finishQuest as finishQuestProgress,
  parsePlayerProgress,
  startQuest as startQuestProgress,
} from '@/lib/progress';

interface GameContextType {
  progress: PlayerProgress;
  hydrated: boolean;
  startQuest: (saintId: string) => void;
  checkpointQuest: (session: ActiveQuestSession) => void;
  finishQuest: (saintId: string, results: QuestResult[]) => void;
  abandonQuest: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

function createRunId(saintId: string) {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${saintId}:${Date.now()}:${Math.random().toString(36).slice(2)}`;
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<PlayerProgress>(createDefaultProgress);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      setProgress(parsePlayerProgress(
        localStorage.getItem(PROGRESS_STORAGE_KEY),
        localStorage.getItem(LEGACY_PROGRESS_STORAGE_KEY),
      ));
    } catch {
      setProgress(createDefaultProgress());
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Private browsing or a full storage quota should not block play.
    }
  }, [hydrated, progress]);

  const startQuest = useCallback((saintId: string) => {
    setProgress(current => startQuestProgress(current, saintId, createRunId(saintId)));
  }, []);

  const checkpointQuest = useCallback((session: ActiveQuestSession) => {
    setProgress(current => checkpointQuestProgress(current, session));
  }, []);

  const finishQuest = useCallback((saintId: string, results: QuestResult[]) => {
    setProgress(current => finishQuestProgress(current, saintId, results));
  }, []);

  const abandonQuest = useCallback(() => {
    setProgress(abandonQuestProgress);
  }, []);

  return (
    <GameContext.Provider
      value={{ progress, hydrated, startQuest, checkpointQuest, finishQuest, abandonQuest }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
