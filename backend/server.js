import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// 1. ROBUST DOTENV CONFIGURATION
// This ensures the .env is found regardless of where you start the terminal
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

import quizRoutes from "./routes/quizRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import connectDB from "./config/db.js";

const app = express();

// 2. DATABASE CONNECTION
connectDB();

// 3. MIDDLEWARE
app.use(cors({ origin: "*" }));
app.use(express.json());

// 4. ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/quiz", quizRoutes);

// 5. DEBUGGING & STATUS
const PORT = process.env.PORT || 5000;

// Log key status to terminal
const isGeminiLoaded = !!process.env.GEMINI_API_KEY;
console.log("-----------------------------------------");
console.log(`Gemini API Key Loaded: ${isGeminiLoaded ? "✅ Yes" : "❌ No"}`);
if (!isGeminiLoaded) {
  console.log("⚠️  Action Required: Check if GEMINI_API_KEY exists in your .env file");
}
console.log("-----------------------------------------");

// 6. START SERVER
app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);