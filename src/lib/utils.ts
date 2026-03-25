import { v4 as uuidv4 } from 'uuid';

export { uuidv4 as uuid };

/** Format number as PLN currency */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 2,
  }).format(amount);
}

/** Format ISO date string as human-readable Polish date */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso));
}

/** Return 'YYYY-MM' for a given Date (default: today) */
export function toMonthKey(date: Date = new Date()): string {
  return date.toISOString().slice(0, 7);
}

/** Return display label for a month key like '2026-03' → 'Marzec 2026' */
export function monthLabel(key: string): string {
  const [year, month] = key.split('-');
  const date = new Date(Number(year), Number(month) - 1, 1);
  return new Intl.DateTimeFormat('pl-PL', { month: 'long', year: 'numeric' }).format(date);
}

/** Generate array of last N months as 'YYYY-MM' strings, newest first */
export function lastNMonths(n: number): string[] {
  const months: string[] = [];
  const now = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(toMonthKey(d));
  }
  return months;
}

/** Clamp value between min and max */
export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

/** Calculate percentage safely */
export function percentage(value: number, total: number): number {
  if (total === 0) return 0;
  return clamp(Math.round((value / total) * 100), 0, 100);
}

/** Category emoji icons map */
export const CATEGORY_ICONS: Record<string, string> = {
  'Jedzenie': '🍕',
  'Czynsz/Hipoteka': '🏠',
  'Transport': '🚗',
  'Rozrywka': '🎬',
  'Zdrowie': '💊',
  'Edukacja': '📚',
  'Ubrania': '👗',
  'Rachunki': '⚡',
  'Oszczędności': '💰',
  'Inne': '📦',
  'Wynagrodzenie': '💼',
  'Freelance': '💻',
  'Inwestycje': '📈',
  'Alimenty': '👨‍👧',
  'Zasiłek': '🏛️',
};

/** Category colors */
export const CATEGORY_COLORS: Record<string, string> = {
  'Jedzenie': '#f59e0b',
  'Czynsz/Hipoteka': '#4f8ef7',
  'Transport': '#8b5cf6',
  'Rozrywka': '#ec4899',
  'Zdrowie': '#10d9a0',
  'Edukacja': '#06b6d4',
  'Ubrania': '#f97316',
  'Rachunki': '#eab308',
  'Oszczędności': '#22c55e',
  'Inne': '#94a3b8',
  'Wynagrodzenie': '#10d9a0',
  'Freelance': '#4f8ef7',
  'Inwestycje': '#22c55e',
  'Alimenty': '#8b5cf6',
  'Zasiłek': '#06b6d4',
};

export const AVATAR_OPTIONS = ['👨', '👩', '👧', '👦', '👴', '👵', '🧑', '👶', '🐶', '🐱'];
export const COLOR_OPTIONS = [
  '#4f8ef7', '#ec4899', '#10d9a0', '#f59e0b',
  '#8b5cf6', '#f97316', '#06b6d4', '#ef4444',
];

export const EXPENSE_CATEGORIES = [
  'Jedzenie', 'Czynsz/Hipoteka', 'Transport', 'Rozrywka',
  'Zdrowie', 'Edukacja', 'Ubrania', 'Rachunki', 'Oszczędności', 'Inne',
];

export const INCOME_CATEGORIES = [
  'Wynagrodzenie', 'Freelance', 'Inwestycje', 'Alimenty', 'Zasiłek', 'Inne',
];
