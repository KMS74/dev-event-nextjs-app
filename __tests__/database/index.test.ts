import { Event, Booking } from '@/database';
import EventModel from '@/database/event.model';
import BookingModel from '@/database/booking.model';

describe('Database Index Exports', () => {
  it('should export Event model', () => {
    expect(Event).toBeDefined();
    expect(Event).toBe(EventModel);
  });

  it('should export Booking model', () => {
    expect(Booking).toBeDefined();
    expect(Booking).toBe(BookingModel);
  });
});