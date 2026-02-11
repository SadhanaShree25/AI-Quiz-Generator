import express from "express";
import protect from "../middleware/authMiddleware.js";
import QuizResult from "../models/QuizResult.js";

const router = express.Router();

router.get("/dashboard", protect, async (req, res) => {
  const results = await QuizResult.find({ userId: req.user });

  const total = results.length;
  const best = Math.max(...results.map(r => r.score), 0);
  const avg =
    total === 0
      ? 0
      : results.reduce((a, b) => a + b.score, 0) / total;

  res.json({ total, best, average: avg.toFixed(2), results });
});

export default router;
