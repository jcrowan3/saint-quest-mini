import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import saintsRaw from '../data/saints.json';
import questsRaw from '../data/quests.json';
import type { Challenge, Quest, Saint } from '../lib/types';

type QuestMap = Record<string, Quest[]>;

interface DraftFile {
  saint: Saint;
  quests: Quest[];
}

export interface ValidationResult {
  errors: string[];
  warnings: string[];
}

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const saints = saintsRaw as Saint[];
// JSON imports infer a union of every concrete reward object. That inference
// includes optional `undefined` keys, which is narrower than our validated
// runtime QuestMap shape. Keep the untrusted-data boundary explicit here; the
// validator below is responsible for checking the imported catalog.
const questsBySaint = questsRaw as unknown as QuestMap;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function pushTextFieldErrors(errors: string[], owner: string, source: Record<string, unknown>, fields: string[]) {
  for (const field of fields) {
    if (asString(source[field]).length === 0) errors.push(`${owner} is missing ${field}`);
  }
}

function patronageSearchTerms(tag: string) {
  return tag
    .toLowerCase()
    .split(/\s+/)
    .flatMap(word => {
      const terms = [word];
      if (word.endsWith('ies')) terms.push(`${word.slice(0, -3)}y`);
      if (word.endsWith('s') && word.length > 3) terms.push(word.slice(0, -1));
      return terms;
    });
}

function validateSaint(saint: Saint, ids: Set<string>, context = saint.id): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const source = saint as unknown as Record<string, unknown>;

  pushTextFieldErrors(errors, context, source, [
    'id',
    'name',
    'avatar',
    'finderPrompt',
    'feastDay',
    'sourceTradition',
    'patronageRationale',
  ]);

  if (!/^[a-z][a-z0-9_]*$/.test(saint.id)) {
    errors.push(`${context} id must be a lowercase slug using letters, numbers, or underscores`);
  }

  if (ids.has(saint.id) && context.startsWith('draft:')) {
    warnings.push(`${context} reuses existing saint id ${saint.id}`);
  }

  for (const field of ['virtues', 'patronages', 'lifeSituations'] as const) {
    const value = source[field];
    if (!Array.isArray(value) || value.length === 0) {
      errors.push(`${context} must include at least one ${field} entry`);
      continue;
    }
    value.forEach((entry, index) => {
      if (asString(entry).length === 0) errors.push(`${context}.${field}[${index}] must be a non-empty string`);
    });
  }

  if (saint.feastDay && !/^[A-Z][a-z]+ \d{1,2}$/.test(saint.feastDay)) {
    warnings.push(`${context} feastDay should look like "October 4"`);
  }

  if (saint.patronageRationale && saint.patronages?.length > 0) {
    const rationale = saint.patronageRationale.toLowerCase();
    const mentionsPatronage = saint.patronages.some(tag =>
      patronageSearchTerms(tag).some(term => rationale.includes(term)),
    );
    if (!mentionsPatronage) warnings.push(`${context} patronageRationale should explain at least one patronage tag`);
  }

  return { errors, warnings };
}

function validateChallenge(challenge: Challenge, owner: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const source = challenge as unknown as Record<string, unknown>;

  if (!['dilemma', 'trivia', 'matching', 'timeline'].includes(String(source.type))) {
    errors.push(`${owner} has unsupported challenge type ${String(source.type)}`);
    return { errors, warnings };
  }

  if (challenge.type === 'dilemma') {
    if (asString(challenge.prompt).length === 0) errors.push(`${owner} dilemma is missing prompt`);
    if (!Array.isArray(challenge.options) || challenge.options.length < 2) {
      errors.push(`${owner} dilemma needs at least two options`);
    } else {
      challenge.options.forEach((option, index) => {
        if (asString(option).length === 0) errors.push(`${owner} option ${index + 1} is blank`);
      });
      if (!Number.isInteger(challenge.answer_index) || challenge.answer_index < 0 || challenge.answer_index >= challenge.options.length) {
        errors.push(`${owner} answer_index must point at an option`);
      }
    }
  }

  if (challenge.type === 'trivia') {
    if (asString(challenge.question).length === 0) errors.push(`${owner} trivia is missing question`);
    if (!Array.isArray(challenge.choices) || challenge.choices.length < 2) {
      errors.push(`${owner} trivia needs at least two choices`);
    } else {
      challenge.choices.forEach((choice, index) => {
        if (asString(choice).length === 0) errors.push(`${owner} choice ${index + 1} is blank`);
      });
      if (!Number.isInteger(challenge.answer_index) || challenge.answer_index < 0 || challenge.answer_index >= challenge.choices.length) {
        errors.push(`${owner} answer_index must point at a choice`);
      }
    }
  }

  if (challenge.type === 'matching') {
    if (asString(challenge.prompt).length === 0) errors.push(`${owner} matching is missing prompt`);
    if (!Array.isArray(challenge.pairs) || challenge.pairs.length < 2) {
      errors.push(`${owner} matching needs at least two pairs`);
    } else {
      challenge.pairs.forEach((pair, index) => {
        if (!isObject(pair) || asString(pair.left).length === 0 || asString(pair.right).length === 0) {
          errors.push(`${owner} pair ${index + 1} needs left and right text`);
        }
      });
    }
  }

  if (challenge.type === 'timeline') {
    if (asString(challenge.prompt).length === 0) errors.push(`${owner} timeline is missing prompt`);
    if (!Array.isArray(challenge.events) || challenge.events.length < 2) {
      errors.push(`${owner} timeline needs at least two events`);
    } else {
      challenge.events.forEach((event, index) => {
        if (!isObject(event)) {
          errors.push(`${owner} event ${index + 1} must be an object with text and numeric year`);
          return;
        }
        if (asString(event.text).length === 0) errors.push(`${owner} event ${index + 1} is missing text`);
        if (!Number.isFinite(event.year)) errors.push(`${owner} event ${index + 1} is missing numeric year`);
      });
      const sortableEvents = challenge.events.filter(
        (event): event is { text: string; year: number } => isObject(event) && Number.isFinite(event.year),
      );
      const sorted = [...sortableEvents].sort((a, b) => a.year - b.year);
      if (sortableEvents.length === challenge.events.length && JSON.stringify(sorted) !== JSON.stringify(challenge.events)) {
        warnings.push(`${owner} timeline events should be stored in chronological order`);
      }
    }
  }

  return { errors, warnings };
}

function validateQuest(quest: Quest, saint: Saint, index: number): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const owner = `${saint.id} quest ${index + 1}`;
  const source = quest as unknown as Record<string, unknown>;

  pushTextFieldErrors(errors, owner, source, ['title', 'story']);

  if (!isObject(source.challenge)) {
    errors.push(`${owner} is missing challenge`);
  } else {
    const result = validateChallenge(quest.challenge, owner);
    errors.push(...result.errors);
    warnings.push(...result.warnings);
  }

  if (!isObject(source.reward) || Object.keys(quest.reward).length === 0) {
    errors.push(`${owner} must include at least one virtue reward`);
  } else {
    for (const [virtue, amount] of Object.entries(quest.reward)) {
      if (asString(virtue).length === 0) errors.push(`${owner} has a blank reward virtue`);
      if (!Number.isFinite(amount) || amount <= 0) errors.push(`${owner} reward for ${virtue} must be a positive number`);
    }
  }

  return { errors, warnings };
}

export function validateSaintCatalog(catalogSaints = saints, catalogQuests = questsBySaint): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const ids = new Set<string>();

  for (const saint of catalogSaints) {
    if (ids.has(saint.id)) errors.push(`${saint.id} is duplicated in saints.json`);
    ids.add(saint.id);
  }

  for (const saint of catalogSaints) {
    const saintResult = validateSaint(saint, ids);
    errors.push(...saintResult.errors);
    warnings.push(...saintResult.warnings);

    const quests = catalogQuests[saint.id];
    if (!Array.isArray(quests) || quests.length < 3) {
      errors.push(`${saint.id} needs at least three quest slots`);
      continue;
    }

    quests.forEach((quest, index) => {
      const questResult = validateQuest(quest, saint, index);
      errors.push(...questResult.errors);
      warnings.push(...questResult.warnings);
    });
  }

  for (const saintId of Object.keys(catalogQuests)) {
    if (!ids.has(saintId)) errors.push(`${saintId} has quests but no saint metadata`);
  }

  return { errors, warnings };
}

export function validateDraft(draft: DraftFile): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const ids = new Set(saints.map(saint => saint.id));

  if (!isObject(draft.saint)) errors.push('draft is missing saint object');
  if (!Array.isArray(draft.quests)) errors.push('draft is missing quests array');
  if (errors.length > 0) return { errors, warnings };

  const saintResult = validateSaint(draft.saint, ids, `draft:${draft.saint.id}`);
  errors.push(...saintResult.errors);
  warnings.push(...saintResult.warnings);

  if (draft.quests.length < 3) errors.push(`draft:${draft.saint.id} needs at least three quest slots`);

  draft.quests.forEach((quest, index) => {
    const questResult = validateQuest(quest, draft.saint, index);
    errors.push(...questResult.errors);
    warnings.push(...questResult.warnings);
  });

  return { errors, warnings };
}

export function createDraft(id: string, name = 'St. Example'): DraftFile {
  const saint: Saint = {
    id,
    name,
    avatar: '*',
    virtues: ['Faith', 'Courage'],
    patronages: ['Students'],
    lifeSituations: ['Learning something difficult'],
    finderPrompt: `${name} helps when faith needs courage in ordinary life.`,
    feastDay: 'January 1',
    sourceTradition: 'Add a concise source note from Scripture, a Catholic calendar, or a reliable saint biography before committing.',
    patronageRationale: 'Explain why this saint is a fitting guide for students in parent-facing language before committing.',
    devotionalNote: 'Add age-appropriate devotional tradition notes when stories need context, or remove this field.',
  };

  return {
    saint,
    quests: [
      {
        title: 'First Quest Title',
        story: 'Describe the saintly moment children will play through.',
        challenge: {
          type: 'dilemma',
          prompt: 'What choice best practices the featured virtue?',
          options: ['Choose the virtuous response', 'Choose a weaker response', 'Avoid the choice'],
          answer_index: 0,
        },
        reward: { Faith: 2, Courage: 1 },
        funFact: 'Optional short fact for the completion screen.',
      },
      {
        title: 'Second Quest Title',
        story: 'Describe another moment from the saint story.',
        challenge: {
          type: 'trivia',
          question: 'What should children remember from this story?',
          choices: ['The correct answer', 'A distractor', 'Another distractor'],
          answer_index: 0,
        },
        reward: { Faith: 1 },
      },
      {
        title: 'Third Quest Title',
        story: 'Describe a final playable moment.',
        challenge: {
          type: 'matching',
          prompt: 'Match each person or idea with the right meaning.',
          pairs: [
            { left: name, right: 'Featured saint' },
            { left: 'Featured virtue', right: 'How children practice the story' },
          ],
        },
        reward: { Courage: 1 },
      },
    ],
  };
}

export function previewSaintCard(saint: Saint, quests: Quest[]) {
  const rewards = Array.from(new Set(quests.flatMap(quest => Object.keys(quest.reward))));
  return [
    `${saint.avatar} ${saint.name}`,
    `id: ${saint.id}`,
    `feast: ${saint.feastDay}`,
    `virtues: ${saint.virtues.join(', ')}`,
    `patronages: ${saint.patronages.join(', ')}`,
    `finder: ${saint.finderPrompt}`,
    `quests: ${quests.length} (${quests.map(quest => quest.challenge.type).join(', ')})`,
    `quest rewards: ${rewards.join(', ')}`,
  ].join('\n');
}

function readJsonFile(filePath: string) {
  return JSON.parse(readFileSync(filePath, 'utf8')) as unknown;
}

function readDraft(filePath: string): DraftFile {
  const json = readJsonFile(filePath);
  if (isObject(json) && isObject(json.saint) && Array.isArray(json.quests)) return json as unknown as DraftFile;
  throw new Error('Draft files must contain { "saint": ..., "quests": [...] }');
}

function resolveInput(input: string) {
  return path.isAbsolute(input) ? input : path.resolve(ROOT, input);
}

function printValidation(result: ValidationResult) {
  for (const warning of result.warnings) console.warn(`warning: ${warning}`);
  for (const error of result.errors) console.error(`error: ${error}`);
  console.log(result.errors.length === 0 ? 'Validation passed' : 'Validation failed');
}

function usage() {
  console.log(`Usage:
  npm run saint:author -- validate [draft.json]
  npm run saint:author -- new <saint-id> --name "St. Name" [--out drafts/name.json]
  npm run saint:author -- preview <saint-id|draft.json>`);
}

async function main(argv: string[]) {
  const [command, arg, ...rest] = argv;

  if (!command || command === '--help' || command === 'help') {
    usage();
    return;
  }

  if (command === 'validate') {
    const result = arg ? validateDraft(readDraft(resolveInput(arg))) : validateSaintCatalog();
    printValidation(result);
    process.exitCode = result.errors.length === 0 ? 0 : 1;
    return;
  }

  if (command === 'new') {
    if (!arg) throw new Error('new requires a saint id');
    const nameIndex = rest.indexOf('--name');
    const outIndex = rest.indexOf('--out');
    const name = nameIndex >= 0 ? rest[nameIndex + 1] : undefined;
    const draft = createDraft(arg, name);
    const body = `${JSON.stringify(draft, null, 2)}\n`;

    if (outIndex >= 0) {
      const outArg = rest[outIndex + 1];
      if (!outArg) throw new Error('--out requires a file path');
      const out = resolveInput(outArg);
      mkdirSync(path.dirname(out), { recursive: true });
      writeFileSync(out, body);
      console.log(`Created ${path.relative(ROOT, out)}`);
    } else {
      console.log(body);
    }
    return;
  }

  if (command === 'preview') {
    if (!arg) throw new Error('preview requires a saint id or draft path');
    const input = resolveInput(arg);

    if (existsSync(input)) {
      const draft = readDraft(input);
      printValidation(validateDraft(draft));
      console.log(previewSaintCard(draft.saint, draft.quests));
      return;
    }

    const saint = saints.find(candidate => candidate.id === arg);
    if (!saint) throw new Error(`Unknown saint id: ${arg}`);
    console.log(previewSaintCard(saint, questsBySaint[saint.id] ?? []));
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch(error => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
