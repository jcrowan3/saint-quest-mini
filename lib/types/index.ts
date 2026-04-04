export type Virtue = 'Faith' | 'Mercy' | 'Courage' | 'Wisdom';

export type ChallengeType = 'trivia' | 'dilemma' | 'memory';

export interface VirtueReward {
  virtue: Virtue;
  points: number;
}

export interface Challenge {
  id: string;
  type: ChallengeType;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Quest {
  id: string;
  title: string;
  story: string;
  challenge: Challenge;
  rewards: VirtueReward[];
  imageUrl?: string;
}

export interface Saint {
  id: string;
  name: string;
  fullName: string;
  description: string;
  primaryVirtues: Virtue[];
  quests: Quest[];
  imageUrl?: string;
  color: string;
}

export interface VirtueProgress {
  Faith: number;
  Mercy: number;
  Courage: number;
  Wisdom: number;
}

export interface UserProgress {
  currentSaintId: string | null;
  currentQuestIndex: number;
  virtues: VirtueProgress;
  completedQuests: string[];
  relicsUnlocked: string[];
}

export interface GameState {
  selectedSaint: Saint | null;
  userProgress: UserProgress;
}
