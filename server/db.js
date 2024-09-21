import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectToDatabase = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB", connection.connection.host);
  } catch (err) {
    console.log(err);
  }
};

export default connectToDatabase;