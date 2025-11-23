import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a unique URL-friendly slug from a given string
 * Appends a random 8-character hexadecimal string to ensure uniqueness
 * @param text - The text to convert to a slug
 * @returns A unique URL-friendly slug string
 *
 * @example
 * generateSlug("Hello World!") // returns "hello-world-a1b2c3"
 * generateSlug("React & Next.js Conference 2024") // returns "react-nextjs-conference-2024-x9y8z7"
 */
export function generateSlug(text: string): string {
  if (!text) return "";
  const baseSlug = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens

  // Generate a unique identifier using crypto for better randomness
  // Take first 8 characters of UUID (without hyphens) for a compact unique suffix
  const uniqueId = crypto.randomUUID().replace(/-/g, "").substring(0, 8);

  const uniqueGeneratedSlug = `${baseSlug}-${uniqueId}`;

  return uniqueGeneratedSlug;
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
 * Validates time format (HH:MM 24-hour or h:MM AM/PM 12-hour)
 * @param time - The time string to validate
 * @returns True if valid, false otherwise
 *
 * @example
 * isValidTime("09:00") // returns true
 * isValidTime("9:00 AM") // returns true
 * isValidTime("25:00") // returns false
 */
export function isValidTime(time: string): boolean {
  const time24 = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  const time12 = /^(1[0-2]|0?[1-9]):[0-5][0-9]\s?(AM|PM|am|pm)$/;
  return time24.test(time) || time12.test(time);
}

/**
 * Normalizes a time string to canonical 12-hour format (h:MM AM/PM)
 * @param time - The time string to normalize (assumes valid input)
 * @returns Normalized time string in 12-hour format
 *
 * @example
 * normalizeTime("09:00") // returns "9:00 AM"
 * normalizeTime("13:30") // returns "1:30 PM"
 * normalizeTime("9:00am") // returns "9:00 AM"
 */
export function normalizeTime(time: string): string {
  const time24 = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (time24.test(time)) {
    const [hours, minutes] = time.split(":");
    const h = parseInt(hours, 10);
    const amPm = h >= 12 ? "PM" : "AM";
    const normalizedHours = h % 12 || 12;
    return `${normalizedHours}:${minutes} ${amPm}`;
  }

  const time12 = /^(1[0-2]|0?[1-9]):([0-5][0-9])\s?(AM|PM|am|pm)$/i;
  const match = time.match(time12);
  if (match) {
    const hours = parseInt(match[1], 10);
    const minutes = match[2];
    const amPm = match[3].toUpperCase();
    return `${hours}:${minutes} ${amPm}`;
  }

  return time;
}
