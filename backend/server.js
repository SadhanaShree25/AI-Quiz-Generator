import 'dotenv/config'; // load .env for ES modules
import express from "express";
import cors from "cors";
import quizRoutes from "./quizRoutes.js";

const app = express();
app.use(cors({
    origin: "*"
}));
app.use(express.json());

app.use("/api", quizRoutes);

const PORT = process.env.PORT || 5000;
console.log("OpenAI Key Loaded:", process.env.OPENAI_API_KEY ? "✅ Yes" : "❌ No");

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));