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

/* =========================
   ✅ CORS (WORKING)
========================= */
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://localhost:5174",
            "https://authflow-wine.vercel.app",
            "https://authflow-4vr4uvuqi-purushottams-projects-e04d4b96.vercel.app",
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

/* =========================
   🔐 Middlewares
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

/* =========================
   🌐 Routes
========================= */
app.use("/api/auth", authRoutes);

// ✅ Health Check
app.get("/", (_req: Request, res: Response) => {
    res.send("Server is Live & Database Connected!");
});

/* =========================
   🚀 Start Server
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
