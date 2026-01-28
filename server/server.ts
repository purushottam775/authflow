import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./configs/db";
import authRoutes from "./routes/auth.routes";

dotenv.config();

// 🔗 Connect MongoDB
connectDB();

const app = express();

// 🔐 Middlewares
const allowedOrigins = [
    process.env.CLIENT_URL || "http://localhost:5173",
    "http://localhost:5173",
    "http://localhost:5174",
];
const corsOptions = {
    origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
        // Allow requests with no origin (mobile apps, Postman, etc)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(null, true); // Allow all in dev, change for production
        }
    },
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// 🌐 Routes
app.use("/api/auth", authRoutes);

// ✅ Health Check
app.get("/", (_req: Request, res: Response) => {
    res.send("Server is Live & Database Connected!");
});

// 🌍 Port
const PORT = process.env.PORT || 5000;

// 🚀 Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
