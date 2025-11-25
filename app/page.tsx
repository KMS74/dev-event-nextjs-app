import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { IEvent } from "@/database";
import { BASE_URL } from "@/lib/config";

const HomePage = async () => {
  let events: IEvent[] = [];

  try {
    const response = await fetch(`${BASE_URL}/api/events`);
    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    events = Array.isArray(data?.events) ? data.events : [];
  } catch (error) {
    console.error("Failed to fetch events:", error);
    events = [];
  }

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
                <EventCard {...event} />
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
};

export default HomePage;
