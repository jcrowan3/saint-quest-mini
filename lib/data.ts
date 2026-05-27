import saintsRaw from '@/data/saints.json';
import questsRaw from '@/data/quests.json';
import reflectionsRaw from '@/data/reflections.json';
import type { DailyRecommendation, Saint, Quest } from '@/lib/types';

export const saints = saintsRaw as unknown as Saint[];

export function getQuestsForSaint(saintId: string): Quest[] {
  const all = questsRaw as unknown as Record<string, Quest[]>;
  return all[saintId] ?? [];
}

const reflections = reflectionsRaw as Record<string, { saint: string; reflection: string }>;

const WEEKLY_ROTATION_START = Date.UTC(2026, 0, 4);

const SEASONAL_QUESTS: Array<{
  start: string;
  end: string;
  label: string;
  saintId: string;
  quest: string;
  reflection: string;
}> = [
  {
    start: '12-01',
    end: '12-24',
    label: 'Advent Quest',
    saintId: 'therese',
    quest: 'Prepare a small act of hidden love today.',
    reflection: 'Advent invites little, faithful acts that make room for Christ.',
  },
  {
    start: '12-25',
    end: '01-07',
    label: 'Christmas Quest',
    saintId: 'francis',
    quest: 'Share joy with someone who may feel overlooked.',
    reflection: 'Christmas joy grows when it is given away with simplicity and peace.',
  },
  {
    start: '02-14',
    end: '03-31',
    label: 'Lenten Quest',
    saintId: 'padrepio',
    quest: 'Offer one small sacrifice with patience and prayer.',
    reflection: 'Lent turns ordinary struggle into a path of mercy and conversion.',
  },
  {
    start: '04-01',
    end: '05-31',
    label: 'Easter Quest',
    saintId: 'johnpaulii',
    quest: 'Choose hope: encourage someone with a brave, kind word.',
    reflection: 'Easter courage says, “Be not afraid,” because Christ is risen.',
  },
];

function pad2(value: number) {
  return String(value).padStart(2, '0');
}

function getDateKey(date: Date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function getMonthDay(date: Date) {
  return `${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function isMonthDayInRange(monthDay: string, start: string, end: string) {
  return start <= end
    ? monthDay >= start && monthDay <= end
    : monthDay >= start || monthDay <= end;
}

function getWeeklySaint(date: Date) {
  const current = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const weekIndex = Math.floor((current - WEEKLY_ROTATION_START) / (7 * 24 * 60 * 60 * 1000));
  const safeIndex = ((weekIndex % saints.length) + saints.length) % saints.length;
  return saints[safeIndex];
}

export function getDailyRecommendation(date = new Date()): DailyRecommendation {
  const dateKey = getDateKey(date);
  const monthDay = getMonthDay(date);
  const feast = reflections[monthDay];
  const feastSaint = feast ? saints.find(s => s.id === feast.saint) : undefined;

  if (feastSaint && feast) {
    return {
      dateKey,
      label: `Today's feast: ${feastSaint.name}`,
      saint: feastSaint,
      source: 'feast',
      reflection: feast.reflection,
    };
  }

  const season = SEASONAL_QUESTS.find(s => isMonthDayInRange(monthDay, s.start, s.end));
  if (season) {
    const saint = saints.find(s => s.id === season.saintId) ?? getWeeklySaint(date);
    return {
      dateKey,
      label: season.label,
      saint,
      source: 'season',
      reflection: season.reflection,
      seasonalQuest: season.quest,
    };
  }

  const saint = getWeeklySaint(date);
  return {
    dateKey,
    label: 'Saint of the week',
    saint,
    source: 'weekly',
    reflection: `This week, walk with ${saint.name} and practice ${saint.virtues.join(' and ')}.`,
  };
}

export const SAINT_ACCENTS: Record<string, {
  bg: string;
  border: string;
  ring: string;
  text: string;
  button: string;
}> = {
  francis:    { bg: '#FFFBEB', border: '#F59E0B', ring: '#FCD34D', text: '#92400E', button: '#D97706' },
  carlo:      { bg: '#EFF6FF', border: '#3B82F6', ring: '#93C5FD', text: '#1E3A8A', button: '#2563EB' },
  joseph:     { bg: '#FEFCE8', border: '#CA8A04', ring: '#FDE047', text: '#713F12', button: '#CA8A04' },
  therese:    { bg: '#FDF2F8', border: '#DB2777', ring: '#F9A8D4', text: '#831843', button: '#BE185D' },
  kolbe:      { bg: '#F5F3FF', border: '#7C3AED', ring: '#C4B5FD', text: '#4C1D95', button: '#6D28D9' },
  bernadette: { bg: '#F0F9FF', border: '#0284C7', ring: '#7DD3FC', text: '#0C4A6E', button: '#0369A1' },
  padrepio:   { bg: '#FFF1F2', border: '#E11D48', ring: '#FDA4AF', text: '#881337', button: '#BE123C' },
  johnpaulii: { bg: '#FFFBEB', border: '#B45309', ring: '#FCD34D', text: '#78350F', button: '#92400E' },
};

export const DEFAULT_ACCENT = SAINT_ACCENTS.francis;

export const VIRTUE_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  Faith:          { bg: '#DBEAFE', text: '#1D4ED8', border: '#93C5FD' },
  Mercy:          { bg: '#D1FAE5', text: '#065F46', border: '#6EE7B7' },
  Courage:        { bg: '#FFEDD5', text: '#C2410C', border: '#FDBA74' },
  Wisdom:         { bg: '#EDE9FE', text: '#6D28D9', border: '#C4B5FD' },
  Love:           { bg: '#FCE7F3', text: '#BE185D', border: '#F9A8D4' },
  Simplicity:     { bg: '#CCFBF1', text: '#0F766E', border: '#5EEAD4' },
  Hope:           { bg: '#E0F2FE', text: '#0369A1', border: '#7DD3FC' },
  Strength:       { bg: '#FEF3C7', text: '#B45309', border: '#FDE68A' },
  Humility:       { bg: '#F1F5F9', text: '#475569', border: '#CBD5E1' },
  Responsibility: { bg: '#F0FDF4', text: '#166534', border: '#86EFAC' },
  Charity:        { bg: '#FDF4FF', text: '#7E22CE', border: '#E9D5FF' },
  Piety:          { bg: '#FFF7ED', text: '#9A3412', border: '#FDBA74' },
  Suffering:      { bg: '#F8FAFC', text: '#334155', border: '#CBD5E1' },
  Obedience:      { bg: '#F0FDF4', text: '#166534', border: '#86EFAC' },
  Prayer:         { bg: '#F5F3FF', text: '#5B21B6', border: '#DDD6FE' },
  Sacrifice:      { bg: '#FFF7ED', text: '#9A3412', border: '#FDBA74' },
  Unity:          { bg: '#ECFEFF', text: '#155E75', border: '#A5F3FC' },
  Truth:          { bg: '#F8FAFC', text: '#334155', border: '#CBD5E1' },
};

export function getVirtueStyle(virtue: string) {
  return VIRTUE_STYLES[virtue] ?? { bg: '#F3F4F6', text: '#374151', border: '#D1D5DB' };
}
