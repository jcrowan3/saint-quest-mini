import saintsRaw from '@/data/saints.json';
import questsRaw from '@/data/quests.json';
import type { Saint, Quest } from '@/lib/types';

export const saints = saintsRaw as unknown as Saint[];

export function getQuestsForSaint(saintId: string): Quest[] {
  const all = questsRaw as unknown as Record<string, Quest[]>;
  return all[saintId] ?? [];
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
