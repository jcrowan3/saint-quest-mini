import assert from 'node:assert/strict';
import test from 'node:test';

import reflectionsRaw from '../data/reflections.json';
import { getDailyRecommendation, getQuestsForSaint, saints } from '../lib/data';

const feastOnlyQuestGuides: Record<string, string> = {
  all_saints: 'therese',
  all_souls: 'padrepio',
  catherine: 'johnpaulii',
  cecilia: 'carlo',
  dominic: 'carlo',
  fatima: 'bernadette',
  francis_xavier: 'francis',
  holy_innocents: 'joseph',
  isidore: 'joseph',
  james: 'johnpaulii',
  jesus: 'francis',
  john: 'johnpaulii',
  john_baptist: 'bernadette',
  lucy: 'therese',
  mark: 'johnpaulii',
  martin: 'francis',
  mary: 'bernadette',
  matthew: 'padrepio',
  monica: 'therese',
  our_lady_of_guadalupe: 'bernadette',
  patrick: 'johnpaulii',
  peter_paul: 'johnpaulii',
  philip_james: 'johnpaulii',
  presentation: 'bernadette',
  silvester: 'joseph',
  stephen: 'kolbe',
  teresa: 'therese',
  thomas: 'carlo',
  transfiguration: 'johnpaulii',
  valentine: 'kolbe',
};

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

test('every feast-only recommendation has an intentional, playable quest guide', () => {
  const playableSaintIds = new Set(saints.map(saint => saint.id));
  const feastOnlyReflections = Object.entries(reflectionsRaw).filter(
    ([, feast]) => !playableSaintIds.has(feast.saint),
  );

  assert.deepEqual(
    Array.from(new Set(feastOnlyReflections.map(([, feast]) => feast.saint))).sort(),
    Object.keys(feastOnlyQuestGuides).sort(),
    'update feast-only quest guide coverage when reflections change',
  );

  for (const [monthDay, feast] of feastOnlyReflections) {
    const expectedGuideId = feastOnlyQuestGuides[feast.saint];
    const recommendation = getDailyRecommendation(
      new Date(`2026-${monthDay}T12:00:00`),
    );

    assert.equal(recommendation.source, 'feast', monthDay);
    assert.equal(recommendation.feastHasQuest, false, monthDay);
    assert.equal(recommendation.saint.id, expectedGuideId, monthDay);
    assert.equal(
      recommendation.questGuide,
      `Quest guide: ${recommendation.saint.name}`,
      monthDay,
    );
    assert.ok(getQuestsForSaint(expectedGuideId).length > 0, monthDay);
  }
});
