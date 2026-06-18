import assert from 'node:assert/strict';
import test from 'node:test';

import { saints } from '../lib/data';

const REQUIRED_TEXT_FIELDS = [
  'feastDay',
  'sourceTradition',
  'patronageRationale',
] as const;

test('every saint includes parent-facing source metadata', () => {
  for (const saint of saints) {
    for (const field of REQUIRED_TEXT_FIELDS) {
      assert.equal(
        typeof saint[field],
        'string',
        `${saint.id} is missing ${field}`,
      );
      assert.ok(saint[field].trim().length >= 8, `${saint.id} has a thin ${field}`);
    }

    assert.ok(
      saint.patronageRationale.length >= saint.patronages.join(', ').length,
      `${saint.id} should explain its patronage tags`,
    );
  }
});

test('devotional tradition notes are explicit when present', () => {
  for (const saint of saints) {
    if (!saint.devotionalNote) continue;

    assert.match(
      saint.devotionalNote,
      /tradition|age-appropriate|claims|private revelation|devotional history/i,
      `${saint.id} devotional note should clarify how parents should read the claim`,
    );
  }
});
