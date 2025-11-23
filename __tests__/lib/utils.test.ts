import { generateSlug, formatToISODate, isValidTime, normalizeTime, cn } from '@/lib/utils';

describe('cn (className utility)', () => {
  it('should merge class names correctly', () => {
    const result = cn('foo', 'bar');
    expect(result).toContain('foo');
    expect(result).toContain('bar');
  });

  it('should handle conditional classes', () => {
    const result = cn('foo', false && 'bar', 'baz');
    expect(result).toContain('foo');
    expect(result).toContain('baz');
  });

  it('should handle empty inputs', () => {
    const result = cn();
    expect(result).toBe('');
  });
});

describe('generateSlug', () => {
  it('should generate a basic slug from simple text', () => {
    expect(generateSlug('Hello World')).toContain('hello-world');
  });

  it('should handle special characters', () => {
    expect(generateSlug('React & Next.js')).toContain('react-nextjs');
  });

  it('should handle empty string', () => {
    expect(generateSlug('')).toBe('');
  });
});

describe('formatToISODate', () => {
  it('should format ISO date correctly', () => {
    expect(formatToISODate('2024-10-12')).toBe('2024-10-12');
  });

  it('should throw error for invalid date', () => {
    expect(() => formatToISODate('invalid')).toThrow('Invalid date format');
  });
});

describe('isValidTime', () => {
  it('should validate correct time format', () => {
    expect(isValidTime('09:00')).toBe(true);
    expect(isValidTime('23:59')).toBe(true);
  });

  it('should reject invalid time', () => {
    expect(isValidTime('25:00')).toBe(false);
    expect(isValidTime('12:60')).toBe(false);
  });
});

describe('normalizeTime', () => {
  it('should normalize to 12-hour format', () => {
    expect(normalizeTime('09:00')).toBe('9:00 AM');
    expect(normalizeTime('13:30')).toBe('1:30 PM');
  });

  it('should handle midnight', () => {
    expect(normalizeTime('00:00')).toBe('12:00 AM');
  });

  it('should handle noon', () => {

describe('generateSlug - Enhanced with Unique ID', () => {
  it('should generate a slug with unique identifier suffix', () => {
    const slug = generateSlug('Hello World');
    expect(slug).toMatch(/^hello-world-[a-f0-9]{8}$/);
  });

  it('should ensure uniqueness by generating different IDs for same text', () => {
    const slug1 = generateSlug('Same Title');
    const slug2 = generateSlug('Same Title');
    expect(slug1).not.toBe(slug2);
    expect(slug1).toMatch(/^same-title-[a-f0-9]{8}$/);
    expect(slug2).toMatch(/^same-title-[a-f0-9]{8}$/);
  });

  it('should handle text with multiple special characters', () => {
    const slug = generateSlug('React & Next.js @ 2024!');
    expect(slug).toMatch(/^react-nextjs-2024-[a-f0-9]{8}$/);
  });

  it('should handle text with unicode characters', () => {
    const slug = generateSlug('Café ☕ Conference');
    expect(slug).toMatch(/^caf-conference-[a-f0-9]{8}$/);
  });

  it('should handle text with excessive whitespace', () => {
    const slug = generateSlug('Too   Many    Spaces');
    expect(slug).toMatch(/^too-many-spaces-[a-f0-9]{8}$/);
  });

  it('should handle text with leading and trailing hyphens', () => {
    const slug = generateSlug('---trimmed---');
    expect(slug).toMatch(/^trimmed-[a-f0-9]{8}$/);
  });

  it('should handle very long text by creating slug with unique ID', () => {
    const longText = 'A'.repeat(200);
    const slug = generateSlug(longText);
    expect(slug).toMatch(/^a{200}-[a-f0-9]{8}$/);
    expect(slug.length).toBeGreaterThan(200);
  });

  it('should handle text with only special characters', () => {
    const slug = generateSlug('!@#$%^&*()');
    expect(slug).toMatch(/^[a-f0-9]{8}$/);
  });

  it('should handle text with numbers', () => {
    const slug = generateSlug('Conference 2024 Edition 3');
    expect(slug).toMatch(/^conference-2024-edition-3-[a-f0-9]{8}$/);
  });

  it('should handle mixed case consistently', () => {
    const slug = generateSlug('MiXeD CaSe TiTlE');
    expect(slug).toMatch(/^mixed-case-title-[a-f0-9]{8}$/);
  });

  it('should handle text with underscores', () => {
    const slug = generateSlug('event_with_underscores');
    expect(slug).toMatch(/^event_with_underscores-[a-f0-9]{8}$/);
  });

  it('should handle text with hyphens already present', () => {
    const slug = generateSlug('already-has-hyphens');
    expect(slug).toMatch(/^already-has-hyphens-[a-f0-9]{8}$/);
  });

  it('should produce slug with exactly 8 character unique suffix', () => {
    const slug = generateSlug('Test');
    const parts = slug.split('-');
    const uniqueId = parts[parts.length - 1];
    expect(uniqueId).toHaveLength(8);
    expect(uniqueId).toMatch(/^[a-f0-9]{8}$/);
  });

  it('should handle whitespace-only string by returning only unique ID', () => {
    const slug = generateSlug('   ');
    expect(slug).toMatch(/^[a-f0-9]{8}$/);
  });
});

describe('formatToISODate - Edge Cases', () => {
  it('should handle date with time component', () => {
    expect(formatToISODate('2024-10-12T15:30:00Z')).toBe('2024-10-12');
  });

  it('should handle date with milliseconds', () => {
    expect(formatToISODate('2024-10-12T15:30:00.123Z')).toBe('2024-10-12');
  });

  it('should throw error for null input', () => {
    expect(() => formatToISODate(null as any)).toThrow('Invalid date format');
  });

  it('should throw error for undefined input', () => {
    expect(() => formatToISODate(undefined as any)).toThrow('Invalid date format');
  });

  it('should handle various date string formats', () => {
    expect(formatToISODate('2024-01-01')).toBe('2024-01-01');
    expect(formatToISODate('2024/01/01')).toBe('2024-01-01');
  });

  it('should throw error for malformed date strings', () => {
    expect(() => formatToISODate('not-a-date')).toThrow('Invalid date format');
    expect(() => formatToISODate('2024-13-01')).toThrow('Invalid date format');
    expect(() => formatToISODate('')).toThrow('Invalid date format');
  });
});

describe('isValidTime - Comprehensive Validation', () => {
  it('should validate 24-hour format edge cases', () => {
    expect(isValidTime('00:00')).toBe(true);
    expect(isValidTime('23:59')).toBe(true);
    expect(isValidTime('12:30')).toBe(true);
  });

  it('should validate 12-hour format edge cases', () => {
    expect(isValidTime('12:00 AM')).toBe(true);
    expect(isValidTime('12:00 PM')).toBe(true);
    expect(isValidTime('1:00 AM')).toBe(true);
    expect(isValidTime('11:59 PM')).toBe(true);
  });

  it('should handle case insensitivity for AM/PM', () => {
    expect(isValidTime('9:00 am')).toBe(true);
    expect(isValidTime('9:00 pm')).toBe(true);
    expect(isValidTime('9:00 AM')).toBe(true);
    expect(isValidTime('9:00 PM')).toBe(true);
  });

  it('should reject invalid hour values', () => {
    expect(isValidTime('24:00')).toBe(false);
    expect(isValidTime('25:00')).toBe(false);
    expect(isValidTime('13:00 PM')).toBe(false);
    expect(isValidTime('0:00 AM')).toBe(false);
  });

  it('should reject invalid minute values', () => {
    expect(isValidTime('12:60')).toBe(false);
    expect(isValidTime('12:99')).toBe(false);
    expect(isValidTime('9:60 AM')).toBe(false);
  });

  it('should reject malformed time strings', () => {
    expect(isValidTime('not a time')).toBe(false);
    expect(isValidTime('12:30:45')).toBe(false);
    expect(isValidTime('12')).toBe(false);
    expect(isValidTime(':30')).toBe(false);
    expect(isValidTime('')).toBe(false);
  });

  it('should handle leading zeros correctly', () => {
    expect(isValidTime('09:00')).toBe(true);
    expect(isValidTime('9:00')).toBe(true);
    expect(isValidTime('09:00 AM')).toBe(true);
  });
});

describe('normalizeTime - Format Normalization', () => {
  it('should convert early morning 24-hour to 12-hour', () => {
    expect(normalizeTime('00:00')).toBe('12:00 AM');
    expect(normalizeTime('00:30')).toBe('12:30 AM');
    expect(normalizeTime('01:00')).toBe('1:00 AM');
  });

  it('should convert late night 24-hour to 12-hour', () => {
    expect(normalizeTime('23:00')).toBe('11:00 PM');
    expect(normalizeTime('23:59')).toBe('11:59 PM');
  });

  it('should handle noon correctly', () => {
    expect(normalizeTime('12:00')).toBe('12:00 PM');
    expect(normalizeTime('12:30')).toBe('12:30 PM');
  });

  it('should handle afternoon hours', () => {
    expect(normalizeTime('13:00')).toBe('1:00 PM');
    expect(normalizeTime('15:30')).toBe('3:30 PM');
    expect(normalizeTime('18:45')).toBe('6:45 PM');
  });

  it('should normalize existing 12-hour format', () => {
    expect(normalizeTime('9:00 am')).toBe('9:00 AM');
    expect(normalizeTime('9:00 pm')).toBe('9:00 PM');
    expect(normalizeTime('09:00 AM')).toBe('9:00 AM');
  });

  it('should handle edge case 12-hour inputs', () => {
    expect(normalizeTime('12:00 AM')).toBe('12:00 AM');
    expect(normalizeTime('12:00 PM')).toBe('12:00 PM');
  });

  it('should return original string for invalid format', () => {
    const invalid = 'invalid time';
    expect(normalizeTime(invalid)).toBe(invalid);
  });

  it('should handle single digit hours in 12-hour format', () => {
    expect(normalizeTime('1:30 AM')).toBe('1:30 AM');
    expect(normalizeTime('9:45 PM')).toBe('9:45 PM');
  });
});
    expect(normalizeTime('12:00')).toBe('12:00 PM');
  });
});