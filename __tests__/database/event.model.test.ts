import Event from '@/database/event.model';

jest.mock('@/lib/utils', () => ({
  generateSlug: jest.fn((text: string) => text.toLowerCase().replace(/\s+/g, '-')),
  formatToISODate: jest.fn((date: string) => date.split('T')[0]),
  normalizeTime: jest.fn((time: string) => time),
}));

describe('Event Model', () => {
  it('should have correct schema fields', () => {
    const schema = Event.schema;
    expect(schema.path('title')).toBeDefined();
    expect(schema.path('slug')).toBeDefined();
    expect(schema.path('mode')).toBeDefined();
  });

  it('should have timestamps enabled', () => {
    const schema = Event.schema;
    expect(schema.path('createdAt')).toBeDefined();
    expect(schema.path('updatedAt')).toBeDefined();
  });

  it('should validate mode enum', () => {
    const modePath = Event.schema.path('mode') as any;
    expect(modePath.options.enum.values).toEqual(['online', 'offline', 'hybrid']);
  });
});