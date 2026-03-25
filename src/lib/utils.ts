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

/** Get initials for avatar */
export function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Professional color palette */
export const CATEGORY_COLORS: Record<string, string> = {
  'Jedzenie': '#D4A373',
  'Czynsz/Hipoteka': '#4A6FA5',
  'Transport': '#6E8898',
  'Rozrywka': '#9E768F',
  'Zdrowie': '#5D737E',
  'Edukacja': '#8B94A3',
  'Ubrania': '#B08493',
  'Rachunki': '#D0A352',
  'Oszczędności': '#688E75',
  'Inne': '#636975',
  'Wynagrodzenie': '#688E75',
  'Freelance': '#4A6FA5',
  'Inwestycje': '#5D737E',
  'Alimenty': '#8B94A3',
  'Zasiłek': '#B08493',
};

export const COLOR_OPTIONS = [
  '#4A6FA5', '#6E8898', '#9E768F', '#5D737E',
  '#8B94A3', '#B08493', '#D0A352', '#688E75',
  '#D4A373', '#636975'
];

export const EXPENSE_CATEGORIES = [
  'Jedzenie', 'Czynsz/Hipoteka', 'Transport', 'Rozrywka',
  'Zdrowie', 'Edukacja', 'Ubrania', 'Rachunki', 'Oszczędności', 'Inne',
];

export const INCOME_CATEGORIES = [
  'Wynagrodzenie', 'Freelance', 'Inwestycje', 'Alimenty', 'Zasiłek', 'Inne',
];
