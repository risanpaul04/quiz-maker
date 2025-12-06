import mongoose from "mongoose";
import { MONGO_URI } from "./env.js";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGO_URI);
        console.log(`Successfully connected to mongoDB.\n${conn.connection.host}`)
    } catch (error) {
        console.log(`Error connecting to mongoDB\n${error}`);
    }
}

export default connectDB;