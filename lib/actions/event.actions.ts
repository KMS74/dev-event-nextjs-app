"use server";

import { cacheLife, cacheTag } from "next/cache";
import connectToDatabase from "../mongodb";
import { Event, IEvent, IEventBase } from "@/database";

/**
 * Serializes a Mongoose event document to a plain object
 * Converts ObjectId and Date objects to strings for Client Component compatibility
 */
type SerializedEvent = Omit<IEventBase, "createdAt" | "updatedAt"> & {
  _id: string;
  createdAt: string;
  updatedAt: string;
};

const serializeEvent = (event: IEvent): SerializedEvent => {
  return {
    ...event,
    _id: event._id.toString(),
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString(),
  };
};

export const getEvents = async () => {
  "use cache";
  // This cache can be revalidated by webhook or server action
  // when you call revalidateTag("events")
  cacheTag("events");
  // This cache will revalidate after an hour even if no explicit
  // revalidate instruction was received
  cacheLife("hours");

  try {
    await connectToDatabase();
    const events = (await Event.find().lean().sort({ date: -1 })) as IEvent[];
    return events.map(serializeEvent);
  } catch (error) {
    console.error("[getEvents] Error fetching events: ", error);
    return [];
  }
};

export const getEventBySlug = async (slug: string) => {
  "use cache";
  // This cache can be revalidated by webhook or server action
  // when you call revalidateTag("events")
  cacheTag(`events-${slug}`);
  // This cache will revalidate after an hour even if no explicit
  // revalidate instruction was received
  cacheLife("hours");
  try {
    await connectToDatabase();
    const event = (await Event.findOne({ slug }).lean()) as IEvent | null;
    return event ? serializeEvent(event) : null;
  } catch (error) {
    console.error("[getEventBySlug] Error fetching event: ", error);
    return null;
  }
};

export const getSimilarEventsBySlug = async (slug: string) => {
  "use cache";
  // This cache can be revalidated by webhook or server action
  // when you call revalidateTag("events")
  cacheTag(`events-${slug}`);
  // This cache will revalidate after an hour even if no explicit
  // revalidate instruction was received
  cacheLife("hours");
  try {
    await connectToDatabase();

    const event = await Event.findOne({ slug });
    const similarEvents = (await Event.find({
      $and: [
        {
          _id: { $ne: event?._id },
        },
        {
          tags: { $in: event?.tags },
        },
      ],
    })
      .lean()
      .sort({ date: -1 })) as IEvent[];

    return similarEvents.map(serializeEvent);
  } catch (error) {
    console.error(
      "[getSimilarEventsBySlug] Error fetching similar events: ",
      error
    );
    return [];
  }
};
