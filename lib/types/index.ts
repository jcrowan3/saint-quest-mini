export interface Saint {
  id: string;
  name: string;
  avatar: string;
  virtues: string[];
}

export interface DilemmaChallenge {
  type: 'dilemma';
  prompt: string;
  options: string[];
  answer_index: number;
}

export interface TriviaChallenge {
  type: 'trivia';
  question: string;
  choices: string[];
  answer_index: number;
}

export interface MatchingPair {
  left: string;
  right: string;
}

export interface MatchingChallenge {
  type: 'matching';
  prompt: string;
  pairs: MatchingPair[];
}

export interface TimelineEvent {
  text: string;
  year: number;
}

export interface TimelineChallenge {
  type: 'timeline';
  prompt: string;
  events: TimelineEvent[];
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
  correct: boolean;
  virtueGained: Record<string, number>;
}

export type GameView = 'home' | 'questing' | 'complete';
