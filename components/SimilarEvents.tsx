import { getSimilarEventsBySlug } from "@/lib/event.service";
import EventCard from "./EventCard";
import { cacheLife, cacheTag } from "next/cache";

const SimilarEvents = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  "use cache";
  cacheLife("hours");
  cacheTag("similar-events");

  const { slug } = await params;

  const similarEvents = await getSimilarEventsBySlug(slug);

  return (
    <div className="flex w-full flex-col gap-4 pt-20">
      <h2>Similar Events</h2>
      <ul className="events">
        {similarEvents.length > 0 ? (
          similarEvents.map((event) => (
            <li key={event.slug}>
              <EventCard
                title={event.title}
                image={event.image}
                slug={event.slug}
                date={event.date}
                time={event.time}
                location={event.location}
              />
            </li>
          ))
        ) : (
          <p>No similar events found.</p>
        )}
      </ul>
    </div>
  );
};

export default SimilarEvents;
