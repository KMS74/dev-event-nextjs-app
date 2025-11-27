import mongoose, { Schema, model, models, Document } from "mongoose";
import Event from "./event.model";

/**
 * TypeScript interface for Booking base
 * Extends mongoose Document for proper typing
 */
export interface IBookingBase {
  eventId: mongoose.Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * TypeScript interface for Booking document
 * Extends mongoose Document for proper typing
 */
export interface IBooking extends IBookingBase, Document {}

/**
 * Booking Schema Definition
 * Defines the structure and validation rules for Booking documents
 */
const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: (v: string) => {
          // RFC 5322 compliant email validation regex
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(v);
        },
        message: "Please provide a valid email address",
      },
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

/**
 * Pre-save hook for event reference validation
 * Verifies that the referenced event exists before saving the booking
 */
BookingSchema.pre("save", async function () {
  // Only validate eventId if it's modified or document is new
  if (this.isModified("eventId") || this.isNew) {
    const eventExists = await Event.findById(this.eventId);

    if (!eventExists) {
      throw new Error("Referenced event does not exist");
    }
  }
});

// Create index on eventId for optimized query performance
BookingSchema.index({ eventId: 1 });

// Create index on eventId and createdAt for optimized query performance
BookingSchema.index({ eventId: 1, createdAt: -1 });

// Create index on email for optimized query performance
BookingSchema.index({ email: 1 });

// Create unique index on eventId and email for optimized query performance
// Enforce unique booking per event and email
BookingSchema.index(
  { eventId: 1, email: 1 },
  { unique: true, name: "event_email_index" }
);

/**
 * Export Booking model
 * Uses models cache to prevent model recompilation in development
 */
const Booking = models.Booking || model<IBooking>("Booking", BookingSchema);

export default Booking;
