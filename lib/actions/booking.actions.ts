"use server";

import { Booking } from "@/database";
import connectToDatabase from "../mongodb";

export type BookingState = {
  success: boolean;
  message: string;
  error?: string;
};

export const createBooking = async (
  prevState: BookingState | null,
  formData: FormData
): Promise<BookingState> => {
  try {
    const eventId = formData.get("eventId") as string;
    const slug = formData.get("slug") as string;
    const email = formData.get("email") as string;

    // Validate required fields
    if (!eventId || !slug || !email) {
      return {
        success: false,
        message: "Missing required fields",
        error: "Please provide all required information",
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: "Invalid email format",
        error: "Please provide a valid email address",
      };
    }

    await connectToDatabase();
    await Booking.create({ eventId, slug, email });

    return {
      success: true,
      message:
        "Thank you for booking the event! 🎉 You will receive a confirmation email 📩.",
    };
  } catch (error) {
    console.error("[createBooking] Error creating booking: ", error);
    return {
      success: false,
      message: "Failed to create booking",
      error: "An unexpected error occurred. Please try again later.",
    };
  }
};
