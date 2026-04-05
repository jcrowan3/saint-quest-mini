'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { GameState, UserProgress, Saint, VirtueProgress } from '../types';

interface GameContextType {
  gameState: GameState;
  selectSaint: (saint: Saint, resetVirtues?: boolean) => void;
  completeQuest: (questId: string, rewards: { virtue: string; points: number }[]) => void;
  nextQuest: () => void;
  resetProgress: () => void;
}

const defaultVirtues: VirtueProgress = {
  Faith: 0,
  Mercy: 0,
  Courage: 0,
  Wisdom: 0,
};

const defaultProgress: UserProgress = {
  currentSaintId: null,
  currentQuestIndex: 0,
  virtues: defaultVirtues,
  completedQuests: [],
  relicsUnlocked: [],
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>({
    selectedSaint: null,
    userProgress: defaultProgress,
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('saintQuestProgress');
    if (saved) {
      try {
        const progress = JSON.parse(saved);
        setGameState(prev => ({
          ...prev,
          userProgress: progress,
        }));
      } catch (e) {
        console.error('Failed to load progress:', e);
      }
    }
  }, []);

  // Save to localStorage whenever progress changes
  useEffect(() => {
    localStorage.setItem('saintQuestProgress', JSON.stringify(gameState.userProgress));
  }, [gameState.userProgress]);

  const selectSaint = (saint: Saint, resetVirtues: boolean = false) => {
    // Check if switching to a different saint or starting fresh
    const isSameSaint = gameState.userProgress.currentSaintId === saint.id;

    setGameState({
      selectedSaint: saint,
      userProgress: {
        currentSaintId: saint.id,
        currentQuestIndex: isSameSaint ? gameState.userProgress.currentQuestIndex : 0,
        virtues: resetVirtues ? defaultVirtues : gameState.userProgress.virtues, // Reset or keep virtues
        completedQuests: isSameSaint ? gameState.userProgress.completedQuests : [],
        relicsUnlocked: isSameSaint ? gameState.userProgress.relicsUnlocked : [],
      },
    });
  };

  const completeQuest = (questId: string, rewards: { virtue: string; points: number }[]) => {
    setGameState(prev => {
      const newVirtues = { ...prev.userProgress.virtues };
      rewards.forEach(reward => {
        const virtue = reward.virtue as keyof VirtueProgress;
        newVirtues[virtue] = (newVirtues[virtue] || 0) + reward.points;
      });

      return {
        ...prev,
        userProgress: {
          ...prev.userProgress,
          virtues: newVirtues,
          completedQuests: [...prev.userProgress.completedQuests, questId],
        },
      };
    });
  };

  const nextQuest = () => {
    setGameState(prev => ({
      ...prev,
      userProgress: {
        ...prev.userProgress,
        currentQuestIndex: prev.userProgress.currentQuestIndex + 1,
      },
    }));
  };

  const resetProgress = () => {
    setGameState({
      selectedSaint: null,
      userProgress: defaultProgress,
    });
    localStorage.removeItem('saintQuestProgress');
  };

  return (
    <GameContext.Provider value={{ gameState, selectSaint, completeQuest, nextQuest, resetProgress }}>
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
