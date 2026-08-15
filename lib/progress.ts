import type {
  ActiveQuestSession,
  PlayerProgress,
  QuestPhase,
  QuestResult,
} from './types';

export const PROGRESS_STORAGE_KEY = 'saintQuestProgress:v2';
export const LEGACY_PROGRESS_STORAGE_KEY = 'saintQuestProgress';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function nonNegativeInteger(value: unknown, fallback = 0) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : fallback;
}

function sanitizeVirtues(value: unknown): Record<string, number> {
  if (!isRecord(value)) return {};

  const virtues: Record<string, number> = {};
  for (const [virtue, points] of Object.entries(value)) {
    if (
      virtue.trim().length > 0 &&
      typeof points === 'number' &&
      Number.isFinite(points) &&
      points >= 0
    ) {
      virtues[virtue] = points;
    }
  }
  return virtues;
}

function sanitizeResults(value: unknown): QuestResult[] {
  if (!Array.isArray(value)) return [];

  const byIndex = new Map<number, QuestResult>();
  for (const candidate of value) {
    if (!isRecord(candidate) || typeof candidate.correct !== 'boolean') continue;
    const questIndex = nonNegativeInteger(candidate.questIndex, -1);
    if (questIndex < 0 || byIndex.has(questIndex)) continue;
    byIndex.set(questIndex, {
      questIndex,
      correct: candidate.correct,
      virtueGained: sanitizeVirtues(candidate.virtueGained),
    });
  }

  const contiguous: QuestResult[] = [];
  while (byIndex.has(contiguous.length)) {
    contiguous.push(byIndex.get(contiguous.length)!);
  }
  return contiguous;
}

function sanitizePhase(value: unknown): QuestPhase {
  return value === 'challenge' || value === 'feedback' ? value : 'story';
}

function sanitizeSession(value: unknown): ActiveQuestSession | null {
  if (!isRecord(value)) return null;
  if (typeof value.runId !== 'string' || value.runId.trim().length === 0) return null;
  if (typeof value.saintId !== 'string' || value.saintId.trim().length === 0) return null;

  const results = sanitizeResults(value.results);
  const requestedIndex = nonNegativeInteger(value.questIndex);
  const requestedPhase = sanitizePhase(value.phase);
  const canRestoreFeedback = requestedPhase === 'feedback' && requestedIndex < results.length;
  const questIndex = canRestoreFeedback
    ? requestedIndex
    : Math.min(requestedIndex, results.length);

  return {
    runId: value.runId,
    saintId: value.saintId,
    questIndex,
    phase: canRestoreFeedback ? 'feedback' : requestedPhase === 'challenge' ? 'challenge' : 'story',
    results: results.slice(0, canRestoreFeedback ? questIndex + 1 : questIndex),
  };
}

export function createDefaultProgress(): PlayerProgress {
  return {
    version: 2,
    activeSession: null,
    completedSaintIds: [],
    cumulativeVirtues: {},
    totalChallengesCompleted: 0,
    completedRuns: 0,
    lastCompletedRunId: null,
  };
}

function parseJson(raw: string | null): unknown {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function parsePlayerProgress(
  raw: string | null,
  legacyRaw: string | null = null,
): PlayerProgress {
  const parsed = parseJson(raw);
  if (isRecord(parsed) && parsed.version === 2) {
    const completedSaintIds = Array.isArray(parsed.completedSaintIds)
      ? Array.from(new Set(parsed.completedSaintIds.filter(
          (id): id is string => typeof id === 'string' && id.trim().length > 0,
        )))
      : [];

    return {
      version: 2,
      activeSession: sanitizeSession(parsed.activeSession),
      completedSaintIds,
      cumulativeVirtues: sanitizeVirtues(parsed.cumulativeVirtues),
      totalChallengesCompleted: nonNegativeInteger(parsed.totalChallengesCompleted),
      completedRuns: nonNegativeInteger(parsed.completedRuns),
      lastCompletedRunId:
        typeof parsed.lastCompletedRunId === 'string' ? parsed.lastCompletedRunId : null,
    };
  }

  const legacy = parseJson(legacyRaw);
  if (isRecord(legacy) && typeof legacy.currentSaintId === 'string' && legacy.currentSaintId) {
    return {
      ...createDefaultProgress(),
      activeSession: {
        runId: `legacy:${legacy.currentSaintId}`,
        saintId: legacy.currentSaintId,
        questIndex: 0,
        phase: 'story',
        results: [],
      },
    };
  }

  return createDefaultProgress();
}

export function startQuest(
  progress: PlayerProgress,
  saintId: string,
  runId: string,
): PlayerProgress {
  return {
    ...progress,
    activeSession: {
      runId,
      saintId,
      questIndex: 0,
      phase: 'story',
      results: [],
    },
  };
}

export function checkpointQuest(
  progress: PlayerProgress,
  session: ActiveQuestSession,
): PlayerProgress {
  if (progress.activeSession?.runId !== session.runId) return progress;
  const activeSession = sanitizeSession(session);
  if (!activeSession || activeSession.saintId !== progress.activeSession.saintId) return progress;
  return { ...progress, activeSession };
}

export function finishQuest(
  progress: PlayerProgress,
  saintId: string,
  results: QuestResult[],
): PlayerProgress {
  const runId = progress.activeSession?.runId;
  if (!runId || progress.activeSession?.saintId !== saintId) return progress;
  if (progress.lastCompletedRunId === runId) {
    return { ...progress, activeSession: null };
  }

  const safeResults = sanitizeResults(results);
  if (safeResults.length === 0) return progress;

  const cumulativeVirtues = { ...progress.cumulativeVirtues };
  for (const result of safeResults) {
    for (const [virtue, points] of Object.entries(result.virtueGained)) {
      cumulativeVirtues[virtue] = (cumulativeVirtues[virtue] ?? 0) + points;
    }
  }

  return {
    ...progress,
    activeSession: null,
    completedSaintIds: progress.completedSaintIds.includes(saintId)
      ? progress.completedSaintIds
      : [...progress.completedSaintIds, saintId],
    cumulativeVirtues,
    totalChallengesCompleted: progress.totalChallengesCompleted + safeResults.length,
    completedRuns: progress.completedRuns + 1,
    lastCompletedRunId: runId,
  };
}

export function abandonQuest(progress: PlayerProgress): PlayerProgress {
  return progress.activeSession ? { ...progress, activeSession: null } : progress;
}
