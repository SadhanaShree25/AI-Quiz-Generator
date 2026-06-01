import express from "express";
import multer from "multer";

const router = express.Router();

// Increased file limit to 20MB so large textbooks don't crash the server
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 } 
});

import authMiddleware from "../middleware/authMiddleware.js";
import {
  generateQuiz,
  saveQuizResult,
  getQuizHistory,
  getQuizStats,
  deleteAllHistory,
  getLeaderboard,
} from "../controllers/quizController.js";

router.post("/generate-quiz", authMiddleware, upload.single("file"), generateQuiz);
router.post("/save-result", authMiddleware, saveQuizResult);
router.get("/history", authMiddleware, getQuizHistory);
router.get("/stats", authMiddleware, getQuizStats);
router.delete("/history/all", authMiddleware, deleteAllHistory);
router.get("/leaderboard", getLeaderboard);

export default router;