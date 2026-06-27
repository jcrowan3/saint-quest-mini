import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createDraft,
  previewSaintCard,
  validateDraft,
  validateSaintCatalog,
} from '../scripts/saint-authoring.ts';

test('current saint catalog passes authoring validation', () => {
  const result = validateSaintCatalog();

  assert.deepEqual(result.errors, []);
});

test('new saint draft template is immediately valid and previewable', () => {
  const draft = createDraft('joan', 'St. Joan of Arc');
  const result = validateDraft(draft);
  const preview = previewSaintCard(draft.saint, draft.quests);

  assert.deepEqual(result.errors, []);
  assert.match(preview, /St\. Joan of Arc/);
  assert.match(preview, /quests: 3/);
});

test('draft validation catches broken answer indexes', () => {
  const draft = createDraft('ambrose', 'St. Ambrose');
  draft.quests[0].challenge = {
    type: 'trivia',
    question: 'Which answer should be selected?',
    choices: ['First', 'Second'],
    answer_index: 3,
  };

  const result = validateDraft(draft);

  assert.match(result.errors.join('\n'), /answer_index must point at a choice/);
});
