import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// 1. ROBUST DOTENV CONFIGURATION
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

const isGroqLoaded = !!process.env.GROQ_API_KEY;

console.log("-----------------------------------------");
console.log(`Groq API Key Loaded: ${isGroqLoaded ? "✅ Yes" : "❌ No"}`);
if (!isGroqLoaded) {
  console.log("⚠️  Action Required: Add GROQ_API_KEY to your .env file");
  console.log("   Get a free key at: https://console.groq.com");
}
console.log("-----------------------------------------");

// 6. START SERVER
app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);