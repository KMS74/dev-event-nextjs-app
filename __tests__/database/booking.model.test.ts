import Booking from '@/database/booking.model';

jest.mock('@/database/event.model', () => ({
  __esModule: true,
  default: { findById: jest.fn() },
}));

describe('Booking Model', () => {
  it('should have correct schema fields', () => {
    const schema = Booking.schema;
    expect(schema.path('eventId')).toBeDefined();
    expect(schema.path('email')).toBeDefined();
  });

  it('should validate email format', () => {
    const emailPath = Booking.schema.path('email') as any;
    const validator = emailPath.options.validate.validator;

    expect(validator('test@example.com')).toBe(true);
    expect(validator('invalid')).toBe(false);
  });

  it('should have indexes configured', () => {
    const indexes = Booking.schema.indexes();
    expect(indexes.length).toBeGreaterThan(0);
  });
});