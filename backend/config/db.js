import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();

// Use Google's DNS servers for MongoDB Atlas SRV lookup
dns.setServers(['8.8.8.8', '8.8.4.4']);

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000,
        });

        console.log("Database connected successfully");
    } catch (error) {
        console.log("Database connection failed:", error.message);
    }
};