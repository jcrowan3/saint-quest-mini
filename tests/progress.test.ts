import assert from 'node:assert/strict';
import test from 'node:test';

import {
  abandonQuest,
  checkpointQuest,
  createDefaultProgress,
  finishQuest,
  parsePlayerProgress,
  startQuest,
} from '../lib/progress';
import type { ActiveQuestSession, QuestResult } from '../lib/types';

const firstResult: QuestResult = {
  questIndex: 0,
  correct: true,
  virtueGained: { Courage: 2 },
};

const secondResult: QuestResult = {
  questIndex: 1,
  correct: false,
  virtueGained: {},
};

test('invalid progress data falls back to a fresh versioned profile', () => {
  assert.deepEqual(parsePlayerProgress('{not json'), createDefaultProgress());
});

test('legacy progress preserves the selected saint without inventing prior results', () => {
  const progress = parsePlayerProgress(null, JSON.stringify({
    currentSaintId: 'therese',
    currentQuestIndex: 2,
    virtues: { Faith: 5 },
    completedQuests: ['One', 'Two'],
  }));

  assert.deepEqual(progress.activeSession, {
    runId: 'legacy:therese',
    saintId: 'therese',
    questIndex: 0,
    phase: 'story',
    results: [],
  });
  assert.deepEqual(progress.cumulativeVirtues, {});
});

test('versioned progress sanitizes malformed totals, duplicate saints, and result gaps', () => {
  const progress = parsePlayerProgress(JSON.stringify({
    version: 2,
    completedSaintIds: ['carlo', 'carlo', '', 42],
    cumulativeVirtues: { Faith: 3, Bad: -2, Nope: 'many' },
    totalChallengesCompleted: 4.8,
    completedRuns: -1,
    lastCompletedRunId: 10,
    activeSession: {
      runId: 'run-1',
      saintId: 'carlo',
      questIndex: 4,
      phase: 'story',
      results: [firstResult, { ...secondResult, questIndex: 2 }],
    },
  }));

  assert.deepEqual(progress.completedSaintIds, ['carlo']);
  assert.deepEqual(progress.cumulativeVirtues, { Faith: 3 });
  assert.equal(progress.totalChallengesCompleted, 4);
  assert.equal(progress.completedRuns, 0);
  assert.equal(progress.lastCompletedRunId, null);
  assert.equal(progress.activeSession?.questIndex, 1);
  assert.deepEqual(progress.activeSession?.results, [firstResult]);
});

test('starting and checkpointing a quest preserves lifetime totals', () => {
  const lifetime = {
    ...createDefaultProgress(),
    completedSaintIds: ['carlo'],
    cumulativeVirtues: { Faith: 4 },
    totalChallengesCompleted: 3,
    completedRuns: 1,
  };
  const started = startQuest(lifetime, 'therese', 'run-2');
  const feedback: ActiveQuestSession = {
    runId: 'run-2',
    saintId: 'therese',
    questIndex: 0,
    phase: 'feedback',
    results: [firstResult],
  };
  const checkpointed = checkpointQuest(started, feedback);

  assert.deepEqual(checkpointed.activeSession, feedback);
  assert.deepEqual(checkpointed.completedSaintIds, ['carlo']);
  assert.deepEqual(checkpointed.cumulativeVirtues, { Faith: 4 });
  assert.equal(checkpointed.totalChallengesCompleted, 3);
});

test('checkpointing rejects stale runs and restores an answered feedback phase', () => {
  const started = startQuest(createDefaultProgress(), 'therese', 'current-run');
  const stale = checkpointQuest(started, {
    runId: 'old-run',
    saintId: 'therese',
    questIndex: 0,
    phase: 'feedback',
    results: [firstResult],
  });
  assert.equal(stale, started);

  const current = checkpointQuest(started, {
    runId: 'current-run',
    saintId: 'therese',
    questIndex: 0,
    phase: 'feedback',
    results: [firstResult],
  });
  const roundTripped = parsePlayerProgress(JSON.stringify(current));

  assert.equal(roundTripped.activeSession?.phase, 'feedback');
  assert.deepEqual(roundTripped.activeSession?.results, [firstResult]);
});

test('finishing is atomic, cumulative, and safe to repeat', () => {
  const started = startQuest(createDefaultProgress(), 'therese', 'run-3');
  const finished = finishQuest(started, 'therese', [firstResult, secondResult]);
  const repeated = finishQuest(finished, 'therese', [firstResult, secondResult]);

  assert.equal(finished.activeSession, null);
  assert.deepEqual(finished.completedSaintIds, ['therese']);
  assert.deepEqual(finished.cumulativeVirtues, { Courage: 2 });
  assert.equal(finished.totalChallengesCompleted, 2);
  assert.equal(finished.completedRuns, 1);
  assert.equal(finished.lastCompletedRunId, 'run-3');
  assert.deepEqual(repeated, finished);
});

test('replaying a saint adds lifetime totals without duplicating its badge', () => {
  const firstRun = finishQuest(
    startQuest(createDefaultProgress(), 'therese', 'run-4'),
    'therese',
    [firstResult],
  );
  const secondRun = finishQuest(
    startQuest(firstRun, 'therese', 'run-5'),
    'therese',
    [firstResult],
  );

  assert.deepEqual(secondRun.completedSaintIds, ['therese']);
  assert.deepEqual(secondRun.cumulativeVirtues, { Courage: 4 });
  assert.equal(secondRun.totalChallengesCompleted, 2);
  assert.equal(secondRun.completedRuns, 2);
});

test('abandoning clears only the active session', () => {
  const lifetime = {
    ...createDefaultProgress(),
    completedSaintIds: ['carlo'],
    cumulativeVirtues: { Faith: 4 },
    totalChallengesCompleted: 3,
    completedRuns: 1,
  };
  const abandoned = abandonQuest(startQuest(lifetime, 'therese', 'run-6'));

  assert.equal(abandoned.activeSession, null);
  assert.deepEqual(abandoned.completedSaintIds, ['carlo']);
  assert.deepEqual(abandoned.cumulativeVirtues, { Faith: 4 });
  assert.equal(abandoned.totalChallengesCompleted, 3);
});
