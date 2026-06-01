import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

console.log("Connecting to:", process.env.MONGO_URI);

try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("SUCCESS: Connected to MongoDB");
    process.exit(0);
} catch (err) {
    console.error("FAILURE: Could not connect to MongoDB");
    console.error(err);
    process.exit(1);
}
