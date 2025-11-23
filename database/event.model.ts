import { Schema, model, models, Document } from "mongoose";
import {
  generateSlug,
  formatToISODate,
  normalizeTime,
  isValidTime,
} from "@/lib/utils";

/**
 * TypeScript interface for Event document
 * Extends mongoose Document for proper typing
 */
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Event Schema Definition
 * Defines the structure and validation rules for Event documents
 */
const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      maxLength: [100, "Title must be at most 100 characters"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxLength: [1000, "Description cannot exceed 1000 characters"],
    },
    overview: {
      type: String,
      required: [true, "Overview is required"],
      trim: true,
      maxLength: [500, "Overview cannot exceed 500 characters"],
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, "Venue is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    date: {
      type: String,
      required: [true, "Date is required"],
    },
    time: {
      type: String,
      required: [true, "Time is required"],
    },
    mode: {
      type: String,
      required: [true, "Mode is required"],
      enum: {
        values: ["online", "offline", "hybrid"],
        message: "Mode must be either online, offline, or hybrid",
      },
    },
    audience: {
      type: String,
      required: [true, "Audience is required"],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, "Agenda is required"],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "At least one agenda item is required",
      },
    },
    organizer: {
      type: String,
      required: [true, "Organizer is required"],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, "Tags are required"],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "At least one tag is required",
      },
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

/**
 * Pre-save hook for slug generation and data normalization
 * Runs before each save operation
 */
EventSchema.pre("save", async function () {
  // Generate slug only if title is modified or document is new
  if (this.isModified("title") || this.isNew) {
    this.slug = generateSlug(this.title);
  }

  // Normalize date to ISO format if modified
  if (this.isModified("date")) {
    this.date = formatToISODate(this.date);
  }

  // Normalize time format (h:MM AM/PM)
  if (this.isModified("time")) {
    if (!isValidTime(this.time)) {
      throw new Error(
        "Invalid time format. Please use HH:MM (24-hour) or h:MM AM/PM (12-hour)."
      );
    }
    this.time = normalizeTime(this.time);
  }
});

/**
 * Export Event model
 * Uses models cache to prevent model recompilation in development
 */
const Event = models.Event || model<IEvent>("Event", EventSchema);

export default Event;
