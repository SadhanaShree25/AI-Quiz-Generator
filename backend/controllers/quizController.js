import axios from "axios";
import QuizResult from "../models/QuizResult.js";

/* =======================
   1. GENERATE QUIZ
======================= */
export const generateQuiz = async (req, res) => {
  try {
    const { topic, difficulty = "easy", numQuestions = 5 } = req.body;

    if (!topic) {
      return res.status(400).json({ message: "Topic is required" });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ message: "Groq API key missing" });
    }

    const n = Math.min(Math.max(parseInt(numQuestions) || 5, 1), 20);

    const prompt = `Generate ${n} ${difficulty} multiple choice questions about "${topic}".

Return ONLY valid JSON array:
[
  {
    "question": "Question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answerText": "Correct option exactly as written"
  }
]`;

    const aiResponse = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are a quiz generator. Always respond with valid JSON arrays only."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        }
      }
    );

    const rawText = aiResponse.data?.choices?.[0]?.message?.content;

    if (!rawText) {
      return res.status(500).json({ message: "Empty AI response" });
    }

    let cleaned = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let questions = null;
    const arrayMatch = cleaned.match(/\[[\s\S]*\]/);
    const objectMatch = cleaned.match(/\{[\s\S]*\}/);

    if (arrayMatch) {
      questions = JSON.parse(arrayMatch[0]);
    } else if (objectMatch) {
      const obj = JSON.parse(objectMatch[0]);
      questions = obj.questions || obj.questionsArray;
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(500).json({ message: "Invalid AI format - no questions array" });
    }

    const formatted = questions.map((q, i) => {
      const options = Array.isArray(q.options) ? q.options : [];
      let correctAnswer = q.answerText || q.answer || q.correctAnswer || "";

      if (!correctAnswer && options.length > 0) {
        correctAnswer = options[0];
      } else if (typeof correctAnswer === "number" && options[correctAnswer]) {
        correctAnswer = options[correctAnswer];
      } else if (/^[A-D]$/i.test(String(correctAnswer).trim()) && options.length >= 4) {
        const idx = "ABCD".indexOf(String(correctAnswer).toUpperCase());
        if (idx >= 0 && options[idx]) correctAnswer = options[idx];
      }

      return {
        question: q.question || `Question ${i + 1}`,
        options,
        correctAnswer: String(correctAnswer || ""),
      };
    });

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

    if (!req.user?.id) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    if (!topic || score === undefined || !totalQuestions) {
      return res.status(400).json({ message: "Topic, score, and totalQuestions are required" });
    }

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
    if (!req.user?.id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const history = await QuizResult.find({ userId: req.user.id }).sort({ createdAt: -1 });
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
    if (!req.user?.id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const quizzes = await QuizResult.find({ userId: req.user.id });
    const totalQuizzes = quizzes.length;

    const totalAttempts = totalQuizzes;
    const lastQuiz = quizzes[0];

    res.json({
      totalQuizzes,
      totalAttempts,
      lastTopic: lastQuiz?.topic || "None",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};


/* =======================
   5. DELETE ALL HISTORY
======================= */
export const deleteAllHistory = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    await QuizResult.deleteMany({ userId: req.user.id });
    res.json({ message: "All quiz history deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete history" });
  }
};


/* =======================
   6. LEADERBOARD
======================= */
export const getLeaderboard = async (req, res) => {
  try {
    const User = (await import("../models/User.js")).default;
    const agg = await QuizResult.aggregate([
      {
        $group: {
          _id: "$userId",
          totalQuizzes: { $sum: 1 },
          totalScore: { $sum: "$score" },
          totalQuestions: { $sum: "$totalQuestions" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          name: "$user.name",
          totalQuizzes: 1,
          avgScore: {
            $cond: [
              { $gt: ["$totalQuestions", 0] },
              { $multiply: [{ $divide: ["$totalScore", "$totalQuestions"] }, 100] },
              0,
            ],
          },
        },
      },
      { $sort: { avgScore: -1 } },
      { $limit: 20 },
    ]);
    res.json(agg);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
};
