import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Truncates a given text to a specified length.
 * If the text is longer than the specified length, it appends "..." at the end.
 * @param {string} text - The text to be truncated.
 * @param {number} length - The maximum length of the truncated text.
 * @returns {string} The truncated text.
 */
export function truncate(text: string, length: number) {
  return text.length > length ? text.substring(0, length - 3) + "..." : text;
}

/**
 * Debounces a function by delaying its execution until a certain amount of time has passed without any further calls.
 * @param fn The function to be debounced.
 * @param delay The delay in milliseconds before the debounced function is executed.
 * @returns A debounced version of the original function.
 */
export function debounce(fn: Function, delay: number) {
  let timer: ReturnType<typeof setTimeout>;
  return function (...args: any[]) {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
