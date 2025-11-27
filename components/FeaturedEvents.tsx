import EventCard from "./EventCard";
import { getEvents } from "@/lib/actions/event.actions";

const FeaturedEvents = async () => {
  const events = await getEvents();

  return (
    <div className="mt-20 space-y-7">
      <h3>Featured Events</h3>
      <ul className="events">
        {events &&
          events.length > 0 &&
          events.map((event) => (
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
          ))}
      </ul>
    </div>
  );
};

export default FeaturedEvents;
