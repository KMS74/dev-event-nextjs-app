import connectToDatabase from "./mongodb";
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
  try {
    await connectToDatabase();

    const event = await Event.findOne({ slug });

    if (!event) {
      return [];
    }

    const similarEvents = (await Event.find({
      $and: [
        {
          _id: { $ne: event._id },
        },
        {
          tags: { $in: event.tags },
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
