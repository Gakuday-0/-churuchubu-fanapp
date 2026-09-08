import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

/** Merge Tailwind classes without conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a date string to Japanese locale (e.g. 2025年1月15日). */
export function formatDateJa(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** Format a date string to short Japanese locale (e.g. 1/15). */
export function formatDateShortJa(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('ja-JP', {
    month: 'numeric',
    day: 'numeric',
  });
}
