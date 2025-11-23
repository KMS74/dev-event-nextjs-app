import mongoose from "mongoose";

/**
 * MongoDB Connection URI
 * Retrieves the connection string from environment variables
 * Throws an error if MONGODB_URI is not defined
 */
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

/**
 * Global type declaration for mongoose connection caching
 * This prevents TypeScript errors when accessing global.mongoose
 */
declare global {
  var mongooseCache: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

/**
 * Cached connection object
 * In development, Next.js hot reloading can cause multiple connections
 * This cache ensures we reuse the existing connection instead of creating new ones
 */
let mongooseCache = global.mongooseCache;

if (!mongooseCache) {
  mongooseCache = global.mongooseCache = { conn: null, promise: null };
}

/**
 * Establishes and returns a MongoDB connection using Mongoose
 *
 * Features:
 * - Connection caching to prevent multiple connections in development
 * - Proper TypeScript typing without using 'any'
 * - Error handling for connection failures
 * - Optimized connection options for production use
 *
 * @returns {Promise<mongoose.Connection>} The active MongoDB connection
 * @throws {Error} If connection to MongoDB fails
 */
async function connectToDatabase(): Promise<mongoose.Connection> {
  // Return cached connection if it exists
  if (mongooseCache.conn) {
    return mongooseCache.conn;
  }

  // If no cached promise exists, create a new connection
  if (!mongooseCache.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false, // Disable mongoose buffering for better error handling
    };

    // Create connection promise and cache it
    mongooseCache.promise = mongoose
      .connect(MONGODB_URI as string, opts)
      .then((mongooseInstance) => {
        return mongooseInstance.connection;
      });
  }

  try {
    // Wait for the connection promise to resolve
    mongooseCache.conn = await mongooseCache.promise;
  } catch (error) {
    // Clear the cached promise on error to allow retry
    mongooseCache.promise = null;
    throw error;
  }

  return mongooseCache.conn;
}

export default connectToDatabase;
