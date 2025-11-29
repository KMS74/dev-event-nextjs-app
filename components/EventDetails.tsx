import { getEventBySlug } from "@/lib/event.service";
import { notFound } from "next/navigation";
import BookEvent from "./BookEvent";
import EventAgenda from "./EventAgenda";
import EventDetailItem from "./EventDetailItem";
import EventTags from "./EventTags";
import Image from "next/image";
import { cacheLife, cacheTag } from "next/cache";

const EventDetails = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  "use cache";
  cacheLife("hours");
  cacheTag("featured-events");

  const { slug } = await params;

  const event = await getEventBySlug(slug);

  if (!event) {
    return notFound();
  }

  const {
    title,
    description,
    image,
    date,
    time,
    location,
    overview,
    agenda,
    tags,
    audience,
    organizer,
    mode,
  } = event;

  const bookings = 10;

  return (
    <>
      <div className="header">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <div className="details">
        <div className="content">
          <Image
            src={image}
            alt={title}
            width={800}
            height={800}
            className="banner"
          />

          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>

          <section className="flex-col-gap-2">
            <h2>Event Details</h2>

            <EventDetailItem
              icon="/icons/calendar.svg"
              alt="calendar"
              label={date}
            />
            <EventDetailItem icon="/icons/clock.svg" alt="clock" label={time} />
            <EventDetailItem icon="/icons/pin.svg" alt="pin" label={location} />
            <EventDetailItem icon="/icons/mode.svg" alt="mode" label={mode} />
            <EventDetailItem
              icon="/icons/audience.svg"
              alt="audience"
              label={audience}
            />
          </section>

          <EventAgenda agendaItems={agenda} />

          <section className="flex-col-gap-2">
            <h2>About Organizer</h2>
            <p>{organizer}</p>
          </section>

          <EventTags tags={tags} />
        </div>

        {/* Event Booking */}
        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            {bookings > 0 ? (
              <p className="text-sm">
                Join {bookings} people who have already booked their spot!
              </p>
            ) : (
              <p className="text-sm">Be the first to book your spot!</p>
            )}
            <BookEvent eventId={event._id.toString()} slug={event.slug} />
          </div>
        </aside>
      </div>
    </>
  );
};

export default EventDetails;
