import { cacheLife } from "next/cache";
import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { IEvent } from "@/database/event.model";
import { BASE_URL } from "@/lib/config";

const HomePage = async () => {
  "use cache";
  cacheLife("hours");
  const res = await fetch(`${BASE_URL}/api/events`);
  const { events } = (await res.json()) as { events: IEvent[] };

  return (
    <section>
      <h1 className="text-center">
        The Hub for Every Dev <br /> Event You Can&apos;t Miss
      </h1>
      <p className="text-center mt-5">
        Hackathons, Meetups, and Conferences, All in One Place
      </p>
      <ExploreBtn />
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
    </section>
  );
};

export default HomePage;
