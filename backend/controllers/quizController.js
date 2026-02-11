import axios from "axios";
import QuizResult from "../models/QuizResult.js";

/* =======================
   1. GENERATE QUIZ (AI)
======================= */
export const generateQuiz = async (req, res) => {
  try {
    const { topic, difficulty = "easy", numQuestions = 5 } = req.body;

    if (!topic) {
      return res.status(400).json({ message: "Topic is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: "Gemini API key missing" });
    }

    const n = Math.min(Math.max(parseInt(numQuestions) || 5, 1), 20);

    const prompt = `
Generate ${n} ${difficulty} multiple choice questions on "${topic}".

Return ONLY a valid JSON array:
[
  {
    "question": "Question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answerText": "Correct option exactly as written above"
  }
]
`;

    
const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const aiResponse = await axios.post(
      url,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 15000,
      }
    );

    const rawText =
      aiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return res.status(500).json({ message: "Empty AI response" });
    }

    let questions;
    try {
      const match = rawText.match(/\[[\s\S]*\]/);
      if (!match) throw new Error("JSON not found");
      questions = JSON.parse(match[0]);
    } catch (err) {
      return res.status(500).json({
        message: "AI response format error",
        raw: rawText.substring(0, 500),
      });
    }

    const formatted = questions.map((q, i) => ({
      question: q.question || `Question ${i + 1}`,
      options: q.options || [],
      correctAnswer: q.answerText || "",
    }));

    res.status(200).json(formatted);
  } catch (error) {
    res.status(502).json({
      message: "AI service failed",
      error: error.response?.data || error.message,
    });
  }
};

/* =======================
   2. SAVE QUIZ RESULT
======================= */
export const saveQuizResult = async (req, res) => {
  try {
    const { topic, difficulty, score, totalQuestions } = req.body;

    const result = new QuizResult({
      userId: req.user.id,
      topic,
      difficulty,
      score,
      totalQuestions,
    });

    await result.save();
    res.status(201).json({ message: "Quiz result saved" });
  } catch (error) {
    res.status(500).json({ message: "Failed to save quiz result" });
  }
};

/* =======================
   3. QUIZ HISTORY
======================= */
export const getQuizHistory = async (req, res) => {
  try {
    const history = await QuizResult.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch history" });
  }
};

/* =======================
   4. QUIZ STATS
======================= */
export const getQuizStats = async (req, res) => {
  try {
    const quizzes = await QuizResult.find({ userId: req.user.id });

    const totalQuizzes = quizzes.length;
    const avgScore =
      totalQuizzes > 0
        ? Math.round(
            quizzes.reduce((sum, q) => sum + q.score, 0) / totalQuizzes
          )
        : 0;

    res.json({
      totalQuizzes,
      avgScore,
      accuracy: avgScore,
      streak: totalQuizzes > 0 ? 5 : 0,
      recommendedTopic: quizzes[0]?.topic || "General Knowledge",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};

/* =======================
   5. LEADERBOARD
======================= */
export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await QuizResult.aggregate([
      {
        $group: {
          _id: "$userId",
          avgScore: { $avg: "$score" },
          totalQuizzes: { $sum: 1 },
        },
      },
      { $sort: { avgScore: -1 } },
      { $limit: 10 },
    ]);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: "Failed to load leaderboard" });
  }
};
