import EventDetails from "@/components/EventDetails";
import EventDetailsSkeleton from "@/components/EventDetailsSkeleton";
import EventsSkeleton from "@/components/EventsSkeleton";
import SimilarEvents from "@/components/SimilarEvents";
import { Suspense } from "react";

type Props = {
  params: Promise<{ slug: string }>;
};

const EventDetailsPage = ({ params }: Props) => {
  return (
    <section id="event">
      <Suspense fallback={<EventDetailsSkeleton />}>
        <EventDetails params={params} />
      </Suspense>

      <Suspense fallback={<EventsSkeleton />}>
        <SimilarEvents params={params} />
      </Suspense>
    </section>
  );
};

export default EventDetailsPage;
