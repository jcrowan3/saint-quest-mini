import assert from 'node:assert/strict';
import test from 'node:test';

import { getDailyRecommendation, getQuestsForSaint } from '../lib/data';

test('feast-only recommendations launch the named quest guide instead of weekly fallback', () => {
  const recommendation = getDailyRecommendation(new Date('2026-08-06T12:00:00'));
  const quests = getQuestsForSaint(recommendation.saint.id);

  assert.equal(recommendation.source, 'feast');
  assert.equal(recommendation.displayName, 'Feast of the Transfiguration');
  assert.match(recommendation.reflection, /Transfiguration/);
  assert.equal(recommendation.saint.id, 'johnpaulii');
  assert.equal(recommendation.questGuide, 'Quest guide: St. John Paul II');
  assert.ok(quests.length > 0);
});

test('playable feast saints continue to launch their own quest', () => {
  const recommendation = getDailyRecommendation(new Date('2026-02-18T12:00:00'));

  assert.equal(recommendation.source, 'feast');
  assert.equal(recommendation.saint.id, 'bernadette');
  assert.equal(recommendation.displayName, 'St. Bernadette Soubirous');
  assert.equal(recommendation.questGuide, undefined);
});
