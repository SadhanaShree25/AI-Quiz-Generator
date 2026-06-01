import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import dns from "dns";

// Fix for ECONNREFUSED on some networks (forces IPv4)
dns.setDefaultResultOrder("ipv4first");

import express from "express";
import cors from "cors";

// 1. ROBUST DOTENV CONFIGURATION
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import quizRoutes from "./routes/quizRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import connectDB from "./config/db.js";

const app = express();

// 2. DATABASE CONNECTION
connectDB();

// 3. MIDDLEWARE
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ai-quiz-generator-plum.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

// 4. ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/quiz", quizRoutes);

// 5. DEBUGGING & STATUS
const PORT = process.env.PORT || 5000;

console.log("-----------------------------------------");
if (process.env.GROQ_API_KEY) {
  console.log(`✅ Groq API Key Loaded: ${process.env.GROQ_API_KEY.slice(0, 10)}...`);
} else {
  console.log("❌ Groq API Key NOT Loaded");
  console.log("⚠️  Action Required: Add GROQ_API_KEY to your .env file");
}
console.log("-----------------------------------------");

// 6. START SERVER
app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);