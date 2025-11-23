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
    expect(generateSlug('Hello World')).toBe('hello-world');
  });

  it('should handle special characters', () => {
    expect(generateSlug('React & Next.js')).toBe('react-nextjs');
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
    expect(normalizeTime('12:00')).toBe('12:00 PM');
  });
});