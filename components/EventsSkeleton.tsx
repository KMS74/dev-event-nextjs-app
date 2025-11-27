const EventsSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <section className="mt-20">
      <div className="h-8 bg-gray-900 rounded-lg shadow-md p-4 animate-pulse w-1/4 mb-3"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(count)].map((_, index) => (
          <div
            key={index}
            className="rounded-lg shadow-md p-4 animate-pulse bg-gray-900"
          >
            {/* Image placeholder */}
            <div className="h-48 bg-gray-800 rounded-md mb-4"></div>

            {/* Title placeholder */}
            <div className="h-6 bg-gray-800 rounded w-3/4 mb-2"></div>

            {/* Date/Location placeholder */}
            <div className="h-4 bg-gray-800 rounded w-1/2 mb-2"></div>

            {/* Description placeholder */}
            <div className="h-4 bg-gray-800 rounded w-full"></div>
            <div className="h-4 bg-gray-800 rounded w-5/6 mt-2"></div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EventsSkeleton;
