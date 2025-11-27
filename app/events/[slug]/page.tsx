import EventDetails from "@/components/EventDetails";
import EventDetailsSkelton from "@/components/EventDetailsSkelton";
import EventsSkelton from "@/components/EventsSkelton";
import SimilarEvents from "@/components/SimilarEvents";
import { Suspense } from "react";

type Props = {
  params: Promise<{ slug: string }>;
};

const EventDetailsPage = ({ params }: Props) => {
  return (
    <section id="event">
      <Suspense fallback={<EventDetailsSkelton />}>
        <EventDetails params={params} />
      </Suspense>

      <Suspense fallback={<EventsSkelton />}>
        <SimilarEvents params={params} />
      </Suspense>
    </section>
  );
};

export default EventDetailsPage;
