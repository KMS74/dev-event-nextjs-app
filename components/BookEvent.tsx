"use client";

import {
  createBooking,
  type BookingState,
} from "@/lib/actions/booking.actions";
import posthog from "posthog-js";
import { useActionState, useEffect } from "react";

type Props = {
  eventId: string;
  slug: string;
};

const initialState: BookingState = {
  success: false,
  message: "",
};

const BookEvent = ({ eventId, slug }: Props) => {
  const [state, formAction, isPending] = useActionState(
    createBooking,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      posthog.capture("event_booked", {
        eventId,
        slug,
      });
    } else if (state.error) {
      posthog.captureException(state.error);
    }
  }, [state.success, state.error, eventId, slug]);

  return (
    <div id="book-event">
      {state.success ? (
        <div className="success-message">
          <p>{state.message}</p>
        </div>
      ) : (
        <form action={formAction}>
          {/* Hidden fields for eventId and slug */}
          <input type="hidden" name="eventId" value={eventId} />
          <input type="hidden" name="slug" value={slug} />

          <div>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="Enter your email address"
              disabled={isPending}
            />
          </div>

          {state.error && (
            <div className="error-message">
              <p className="text-red-500">{state.error}</p>
            </div>
          )}

          <button type="submit" disabled={isPending}>
            {isPending ? "Booking..." : "Book Now"}
          </button>
        </form>
      )}
    </div>
  );
};

export default BookEvent;
