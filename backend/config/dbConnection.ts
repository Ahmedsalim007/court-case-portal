import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoUrl: string | undefined = process.env.MONGO_URL;

export const dbConnection = async (): Promise<void> => {
  if (!mongoUrl) {
    console.error('MONGO_URL is not defined');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`DB is connected successfully`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('DB connection failed:', message);
    process.exit(1);
  }
};
