'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Saint } from '@/lib/types';

interface VirtueProgress {
  [virtue: string]: number;
}

interface UserProgress {
  currentSaintId: string | null;
  currentQuestIndex: number;
  virtues: VirtueProgress;
  completedQuests: string[];
}

interface GameState {
  selectedSaint: Saint | null;
  userProgress: UserProgress;
}

interface GameContextType {
  gameState: GameState;
  selectSaint: (saint: Saint) => void;
  completeQuest: (questTitle: string, rewards: Record<string, number>) => void;
  resetProgress: () => void;
}

const defaultProgress: UserProgress = {
  currentSaintId: null,
  currentQuestIndex: 0,
  virtues: {},
  completedQuests: [],
};

const GameContext = createContext<GameContextType | undefined>(undefined);

function loadInitialState(): GameState {
  if (typeof window === 'undefined') {
    return { selectedSaint: null, userProgress: defaultProgress };
  }
  try {
    const saved = localStorage.getItem('saintQuestProgress');
    if (saved) {
      const progress = JSON.parse(saved) as UserProgress;
      return { selectedSaint: null, userProgress: progress };
    }
  } catch {
    // ignore corrupted saves
  }
  return { selectedSaint: null, userProgress: defaultProgress };
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(loadInitialState);

  useEffect(() => {
    localStorage.setItem('saintQuestProgress', JSON.stringify(gameState.userProgress));
  }, [gameState.userProgress]);

  const selectSaint = (saint: Saint) => {
    setGameState({
      selectedSaint: saint,
      userProgress: {
        currentSaintId: saint.id,
        currentQuestIndex: 0,
        virtues: {},
        completedQuests: [],
      },
    });
  };

  const completeQuest = (questTitle: string, rewards: Record<string, number>) => {
    setGameState(prev => {
      const newVirtues = { ...prev.userProgress.virtues };
      for (const [virtue, pts] of Object.entries(rewards)) {
        newVirtues[virtue] = (newVirtues[virtue] ?? 0) + pts;
      }
      return {
        ...prev,
        userProgress: {
          ...prev.userProgress,
          virtues: newVirtues,
          completedQuests: [...prev.userProgress.completedQuests, questTitle],
          currentQuestIndex: prev.userProgress.currentQuestIndex + 1,
        },
      };
    });
  };

  const resetProgress = () => {
    setGameState({ selectedSaint: null, userProgress: defaultProgress });
    localStorage.removeItem('saintQuestProgress');
  };

  return (
    <GameContext.Provider value={{ gameState, selectSaint, completeQuest, resetProgress }}>
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
