import express from "express";
const router = express.Router();

import authMiddleware from "../middleware/authMiddleware.js";
import {
  generateQuiz,
  saveQuizResult,
  getQuizHistory,
  getQuizStats,
  getLeaderboard,
} from "../controllers/quizController.js";

router.post("/generate-quiz", authMiddleware, generateQuiz);
router.post("/save-result", authMiddleware, saveQuizResult);
router.get("/history", authMiddleware, getQuizHistory);
router.get("/stats", authMiddleware, getQuizStats);
router.get("/leaderboard", getLeaderboard);

export default router;
