import mongoose from "mongoose";

const connectDB = async () => {
    try{
        mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to database successfully");
    }
    catch(error){
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
}

export default connectDB;