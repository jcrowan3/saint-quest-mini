export interface Saint {
  id: string;
  name: string;
  avatar: string;
  virtues: string[];
  patronages: string[];
  lifeSituations: string[];
  finderPrompt: string;
  feastDay: string;
  sourceTradition: string;
  patronageRationale: string;
  devotionalNote?: string;
}

export interface DailyRecommendation {
  dateKey: string;
  label: string;
  saint: Saint;
  displayName?: string;
  displayAvatar?: string;
  questGuideLabel?: string;
  feastHasQuest?: boolean;
  source: 'feast' | 'season' | 'weekly';
  reflection: string;
  questGuide?: string;
  seasonalQuest?: string;
}

export interface DilemmaChallenge {
  type: 'dilemma';
  prompt: string;
  options: string[];
  answer_index: number;
  hint: string;
  explanation: string;
}

export interface TriviaChallenge {
  type: 'trivia';
  question: string;
  choices: string[];
  answer_index: number;
  hint: string;
  explanation: string;
}

export interface MatchingPair {
  left: string;
  right: string;
}

export interface MatchingChallenge {
  type: 'matching';
  prompt: string;
  pairs: MatchingPair[];
  hint: string;
  explanation: string;
}

export interface TimelineEvent {
  text: string;
  year: number;
}

export interface TimelineChallenge {
  type: 'timeline';
  prompt: string;
  events: TimelineEvent[];
  hint: string;
  explanation: string;
}

export type Challenge =
  | DilemmaChallenge
  | TriviaChallenge
  | MatchingChallenge
  | TimelineChallenge;

export interface Quest {
  title: string;
  story: string;
  challenge: Challenge;
  reward: Record<string, number>;
  funFact?: string;
}

export interface QuestResult {
  questIndex: number;
  title?: string;
  correct: boolean;
  usedRetry?: boolean;
  virtueGained: Record<string, number>;
}

export type QuestPhase = 'story' | 'challenge' | 'feedback';

export interface ActiveQuestSession {
  runId: string;
  saintId: string;
  questIndex: number;
  phase: QuestPhase;
  results: QuestResult[];
}

export interface PlayerProgress {
  version: 2;
  activeSession: ActiveQuestSession | null;
  completedSaintIds: string[];
  cumulativeVirtues: Record<string, number>;
  totalChallengesCompleted: number;
  completedRuns: number;
  lastCompletedRunId: string | null;
}

export type GameView = 'home' | 'questing' | 'complete';
