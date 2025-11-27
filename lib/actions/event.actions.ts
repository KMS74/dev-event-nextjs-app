import connectToDatabase from "../mongodb";
import { Event, IEvent } from "@/database";

export const getEvents = async () => {
  try {
    await connectToDatabase();
    const events = (await Event.find().lean().sort({ date: -1 })) as IEvent[];
    return events;
  } catch (error) {
    console.error("[getEvents] Error fetching events: ", error);
    return [];
  }
};

export const getSimilarEventsBySlug = async (slug: string) => {
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

    return similarEvents;
  } catch (error) {
    console.error(
      "[getSimilarEventsBySlug] Error fetching similar events: ",
      error
    );
    return [];
  }
};
