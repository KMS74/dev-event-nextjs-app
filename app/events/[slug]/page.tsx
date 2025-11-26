import Image from "next/image";
import { notFound } from "next/navigation";
import { BASE_URL } from "@/lib/config";
import { IEvent } from "@/database/event.model";
import EventDetailItem from "@/components/EventDetailItem";
import EventAgenda from "@/components/EventAgenda";
import EventTags from "@/components/EventTags";
import BookEvent from "@/components/BookEvent";

type Props = {
  params: Promise<{ slug: string }>;
};

const EventDetailsPage = async ({ params }: Props) => {
  const { slug } = await params;

  const response = await fetch(`${BASE_URL}/api/events/${slug}`);

  if (!response.ok) {
    return notFound();
  }

  const { event } = (await response.json()) as { event: IEvent };

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
    <section id="event">
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

          <EventAgenda agendaItems={agenda?.[0] ? JSON.parse(agenda[0]) : []} />

          <section className="flex-col-gap-2">
            <h2>About Organizer</h2>
            <p>{organizer}</p>
          </section>

          <EventTags tags={JSON.parse(tags[0])} />
        </div>

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
            <BookEvent />
          </div>
        </aside>
      </div>
    </section>
  );
};

export default EventDetailsPage;
