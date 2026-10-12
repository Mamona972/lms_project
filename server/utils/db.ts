
import mongoose from "mongoose";
import "dotenv/config";

const dbUrl = process.env.DB_URI;

let connectionPromise: Promise<typeof mongoose> | null = null;

const connectDB = async (): Promise<typeof mongoose> => {
  if (!dbUrl) {
    throw new Error("DB_URI is missing in Vercel environment variables");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(dbUrl, {
        serverSelectionTimeoutMS: 10000,
      })
      .then(() => {
        console.log(
          "MongoDB connected:",
          mongoose.connection.host
        );
        return mongoose;
      })
      .catch((error) => {
        connectionPromise = null;
        console.error("MongoDB connection failed:", error.message);
        throw error;
      });
  }

  return connectionPromise;
};

export default connectDB;