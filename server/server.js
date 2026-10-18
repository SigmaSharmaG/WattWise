import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import morgan from 'morgan';
import authRoutes from "./routes/auth.routes.js"
import connectDB from './config/db.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'))

// Routes
app.get("/api/v1/health", (req, res) => {
    res.json({ message: "WattWise API is running" });
});

app.use("/api/v1/auth",authRoutes);



// Server
const PORT = process.env.PORT || 5000;

// Connecting to database
await connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});