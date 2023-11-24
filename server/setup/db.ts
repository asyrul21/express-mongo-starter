import * as mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const setupDb = async (env?: string) => {
  try {
    if (!env || env !== "test") {
      await mongoose.connect(process.env.MONGO_URL);
    }
  } catch (error) {
    console.error("Failed connecting to DB:", error);
    throw error;
  }
};
