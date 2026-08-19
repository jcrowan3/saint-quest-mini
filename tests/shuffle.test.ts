import assert from 'node:assert/strict';
import test from 'node:test';

import { shuffle } from '../lib/shuffle';

test('shuffle returns a new array with the same members and does not mutate the source', () => {
  const items = [1, 2, 3, 4, 5, 6];
  const next = shuffle(items);

  assert.notEqual(next, items);
  assert.deepEqual(items, [1, 2, 3, 4, 5, 6]);
  assert.deepEqual([...next].sort((a, b) => a - b), items);
});

test('shuffle can reorder a larger collection', () => {
  const items = Array.from({ length: 20 }, (_, index) => index);
  const seen = new Set<string>();

  for (let attempt = 0; attempt < 8; attempt += 1) {
    seen.add(shuffle(items).join(','));
  }

  assert.ok(seen.size > 1, 'Fisher–Yates should produce more than one order across retries');
});
