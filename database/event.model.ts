import { Schema, model, models, Document } from "mongoose";
import { generateSlug, formatToISODate, normalizeTime } from "@/lib/utils";

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
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxLength: [1000, "Description must be at most 1000 characters"],
      trim: true,
    },
    overview: {
      type: String,
      required: [true, "Overview is required"],
      maxLength: [500, "Overview must be at most 500 characters"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Image is required"],
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
      trim: true,
    },
    time: {
      type: String,
      required: [true, "Time is required"],
      trim: true,
    },
    mode: {
      type: String,
      required: [true, "Mode is required"],
      enum: {
        values: ["online", "offline", "hybrid"],
        message: "Mode must be online, offline, or hybrid",
      },
      lowercase: true,
      trim: true,
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
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: "Agenda must contain at least one item",
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
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: "Tags must contain at least one item",
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

  // Normalize time format (HH:MM)
  if (this.isModified("time")) {
    this.time = normalizeTime(this.time);
  }
});

// Create unique index on slug for faster queries and uniqueness enforcement
EventSchema.index({ slug: 1 }, { unique: true });

/**
 * Export Event model
 * Uses models cache to prevent model recompilation in development
 */
const Event = models.Event || model<IEvent>("Event", EventSchema);

export default Event;
