const EventsSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <section className="mt-20 animate-pulse space-y-7">
      {/* Section Title */}
      <div className="h-8 bg-white/5 rounded-md w-1/4"></div>

      <div className="events">
        {[...Array(count)].map((_, index) => (
          <div key={index} className="flex flex-col gap-3">
            {/* Poster */}
            <div className="h-[300px] w-full bg-white/5 rounded-lg"></div>

            {/* Location */}
            <div className="flex flex-row gap-2 items-center">
              <div className="w-[14px] h-[14px] bg-white/5 rounded-full"></div>
              <div className="h-4 bg-white/5 rounded-md w-1/3"></div>
            </div>

            {/* Title */}
            <div className="h-7 bg-white/5 rounded-md w-3/4"></div>

            {/* Datetime */}
            <div className="flex flex-row flex-wrap items-center gap-4">
              <div className="flex flex-row gap-2 items-center">
                <div className="w-[14px] h-[14px] bg-white/5 rounded-full"></div>
                <div className="h-4 bg-white/5 rounded-md w-20"></div>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <div className="w-[14px] h-[14px] bg-white/5 rounded-full"></div>
                <div className="h-4 bg-white/5 rounded-md w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EventsSkeleton;
