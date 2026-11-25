import mongoose from 'mongoose';

type Cache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
const globalForMongoose = globalThis as typeof globalThis & { mongooseCache?: Cache };
const cache = globalForMongoose.mongooseCache ?? { conn: null, promise: null };
globalForMongoose.mongooseCache = cache;

export async function connectDB() {
  if (cache.conn) return cache.conn;
  const URI = process.env.MONGODB_URI;
  if (!URI) throw new Error('MONGODB_URI is not configured');
  if (!cache.promise) cache.promise = mongoose.connect(URI, { bufferCommands: false });
  cache.conn = await cache.promise;
  return cache.conn;
}
