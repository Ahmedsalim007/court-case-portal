import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoUrl = process.env.MONGO_URL;

export const dbConnection = async () => {
  try {
    await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`DB is connected successfully`);
  } catch (err) {
    console.error('DB connection failed:', err.message);
    process.exit(1);
  }
};
