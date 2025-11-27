import EventsSkelton from "@/components/EventsSkelton";
import ExploreBtn from "@/components/ExploreBtn";
import FeaturedEvents from "@/components/FeaturedEvents";
import { Suspense } from "react";

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

      <Suspense fallback={<EventsSkelton />}>
        <FeaturedEvents />
      </Suspense>
    </section>
  );
};

export default HomePage;
