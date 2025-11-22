import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a URL-friendly slug from a given string
 * @param text - The text to convert to a slug
 * @returns A URL-friendly slug string
 *
 * @example
 * generateSlug("Hello World!") // returns "hello-world"
 * generateSlug("React & Next.js Conference 2024") // returns "react-nextjs-conference-2024"
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Formats a date to ISO format (YYYY-MM-DD)
 * @param dateString - The date string to format
 * @returns ISO formatted date string
 * @throws Error if date is invalid
 *
 * @example
 * formatToISODate("2024-10-12") // returns "2024-10-12"
 * formatToISODate("2024-10-12T12:00:00") // returns "2024-10-12"
 */
export function formatToISODate(dateString: string): string {
  const parsedDate = new Date(dateString);
  if (isNaN(parsedDate.getTime())) {
    throw new Error("Invalid date format");
  }
  return parsedDate.toISOString().split("T")[0];
}

/**
 * Validates time format (HH:MM in 24-hour format)
 * @param time - The time string to validate
 * @returns True if valid, false otherwise
 *
 * @example
 * isValidTime("09:00") // returns true
 * isValidTime("25:00") // returns false
 */
export function isValidTime(time: string): boolean {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}

/**
 * Normalizes a time string to 12-hour format with AM/PM
 * @param time - The time string to normalize
 * @returns Normalized time string in 12-hour format
 *
 * @example
 * normalizeTime("09:00") // returns "9:00 AM"
 * normalizeTime("13:30") // returns "1:30 PM"
 */
export function normalizeTime(time: string): string {
  const [hours, minutes] = time.split(":");
  const amPm = parseInt(hours) >= 12 ? "PM" : "AM";
  const normalizedHours = parseInt(hours) % 12 || 12;
  return `${normalizedHours}:${minutes} ${amPm}`;
}
