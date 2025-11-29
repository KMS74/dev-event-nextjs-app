import { Suspense } from "react";
import EventsSkeleton from "@/components/EventsSkeleton";
import ExploreBtn from "@/components/ExploreBtn";
import FeaturedEvents from "@/components/FeaturedEvents";

const HomePage = async () => {
  return (
    <section>
      <h1 className="text-center">
        The Hub for Every Dev <br /> Event You Can&apos;t Miss
      </h1>
      <p className="text-center mt-5">
        Hackathons, Meetups, and Conferences, All in One Place
      </p>

      <ExploreBtn />

      <Suspense fallback={<EventsSkeleton />}>
        <FeaturedEvents />
      </Suspense>
    </section>
  );
};

export default HomePage;
