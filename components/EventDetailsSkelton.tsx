import React from "react";

const EventDetailsSkelton = () => {
  return (
    <section id="event">
      {/* Event Details */}
      <div className="header">
        <div className="h-6 bg-gray-800 rounded w-1/2 mb-2"></div>
        <div className="h-6 bg-gray-800 rounded w-3/4 mb-2"></div>
      </div>
      <div className="details">
        <div className="content">
          <div className="h-6 bg-gray-800 rounded w-1/2 mb-2"></div>
          <div className="h-6 bg-gray-800 rounded w-3/4 mb-2"></div>
        </div>
        <div className="booking">
          <div className="signup-card">
            <div className="h-6 bg-gray-800 rounded w-1/2 mb-2"></div>
            <div className="h-6 bg-gray-800 rounded w-3/4 mb-2"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventDetailsSkelton;
