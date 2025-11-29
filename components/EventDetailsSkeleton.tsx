const EventDetailsSkeleton = () => {
  return (
    <section id="event" className="animate-pulse">
      <div className="header">
        {/* Title */}
        <div className="h-12 bg-white/5 rounded-md w-3/4 mb-4"></div>
        {/* Description */}
        <div className="h-4 bg-white/5 rounded-md w-full mb-2"></div>
        <div className="h-4 bg-white/5 rounded-md w-2/3"></div>
      </div>

      <div className="details">
        <div className="content">
          {/* Banner Image */}
          <div className="w-full h-[400px] bg-white/5 rounded-xl mb-8"></div>

          {/* Overview */}
          <div className="flex flex-col gap-4 w-full">
            <div className="h-8 bg-white/5 rounded-md w-1/4"></div>
            <div className="space-y-2 w-full">
              <div className="h-4 bg-white/5 rounded-md w-full"></div>
              <div className="h-4 bg-white/5 rounded-md w-full"></div>
              <div className="h-4 bg-white/5 rounded-md w-3/4"></div>
            </div>
          </div>

          {/* Event Details Items */}
          <div className="flex flex-col gap-4 w-full">
            <div className="h-8 bg-white/5 rounded-md w-1/3"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-6 h-6 bg-white/5 rounded-full"></div>
                  <div className="h-4 bg-white/5 rounded-md w-1/3"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Agenda */}
          <div className="flex flex-col gap-4 w-full">
            <div className="h-8 bg-white/5 rounded-md w-1/4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-white/5 rounded-lg w-full"
                ></div>
              ))}
            </div>
          </div>

          {/* Organizer */}
          <div className="flex flex-col gap-4 w-full">
            <div className="h-8 bg-white/5 rounded-md w-1/4"></div>
            <div className="h-4 bg-white/5 rounded-md w-1/2"></div>
          </div>

          {/* Tags */}
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 w-24 bg-white/5 rounded-full"></div>
            ))}
          </div>
        </div>

        {/* Booking Sidebar */}
        <aside className="booking">
          <div className="signup-card">
            <div className="h-8 bg-white/5 rounded-md w-2/3 mb-4"></div>
            <div className="h-4 bg-white/5 rounded-md w-full mb-6"></div>

            {/* Form Inputs */}
            <div className="space-y-4 w-full">
              <div className="h-10 bg-white/5 rounded-md w-full"></div>
              <div className="h-10 bg-white/5 rounded-md w-full"></div>
              <div className="h-12 bg-white/5 rounded-md w-full mt-6"></div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default EventDetailsSkeleton;
