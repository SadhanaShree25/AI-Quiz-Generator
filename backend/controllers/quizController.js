import axios from "axios";
import QuizResult from "../models/QuizResult.js";

// Workaround to use CommonJS pdf-parse inside ES Modules
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { PDFParse } = require("pdf-parse");

/* =======================
   1. GENERATE QUIZ
======================= */
export const generateQuiz = async (req, res) => {
  try {
    const { topic, difficulty = "medium", numQuestions = 5, quizType = "Multiple Choice" } = req.body;
    const file = req.file;

    if (!topic && !file) {
      return res.status(400).json({ message: "A topic or PDF file is required to generate questions." });
    }

    if (!process.env.GROQ_API_KEY) {
      console.error("CRITICAL: Missing GROQ_API_KEY in .env file.");
      return res.status(500).json({ message: "Server configuration error: Missing AI API Key." });
    }

    const n = Math.min(Math.max(parseInt(numQuestions) || 5, 1), 20);

    // 1. Context Extraction (PDF Handling)
    let contextText = "";
    if (file) {
      try {
        if (!file.buffer) {
           return res.status(400).json({ message: "File upload failed. Ensure multer is using memoryStorage." });
        }
        const parser = new PDFParse(new Uint8Array(file.buffer));
        const pdfData = await parser.getText();
        contextText = pdfData.text;
        await parser.destroy();
        
        if (!contextText || contextText.trim().length === 0) {
           return res.status(400).json({ message: "Could not extract text from this PDF. It may be scanned images." });
        }

        // Truncate to avoid exceeding AI token limits (roughly 20,000 characters)
        if (contextText.length > 20000) {
          contextText = contextText.slice(0, 20000); 
        }
      } catch (err) {
        console.error("PDF Parsing Error:", err);
        return res.status(400).json({ message: "Failed to parse document. Ensure it is a valid text-readable PDF." });
      }
    }

    // 2. Build the AI Formatting Instructions
    let formatInstruction = "";
    const typeLower = String(quizType).toLowerCase();
    
    if (typeLower.includes("true/false") || typeLower.includes("true / false")) {
       formatInstruction = "Generate True or False questions. The options array MUST contain exactly two strings: ['True', 'False'].";
    } else if (typeLower.includes("mixed")) {
       formatInstruction = "Generate a mix of standard Multiple Choice (4 options) and True/False questions.";
    } else {
       formatInstruction = "Generate standard multiple choice questions with exactly 4 options each.";
    }

    const promptTopic = topic || "the provided document content";

    // 3. Construct the Prompt
    let prompt = `Based strictly on the provided context, generate ${n} ${difficulty}-level questions about "${promptTopic}".\n`;
    prompt += `${formatInstruction}\n\n`;
    
    if (contextText) {
      prompt += `Context Text:\n${contextText}\n\n`;
    }

    prompt += `Return ONLY a valid, raw JSON array. Do not include markdown code blocks (like \`\`\`json). The JSON must have exactly this structure:
[
  {
    "question": "Question text here",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "answerText": "Correct option exactly as written in the options array",
    "explanation": "Brief explanation for why the answer is correct"
  }
]

CRITICAL RULES:
1. The correct option text in "answerText" MUST match one of the options inside the "options" array exactly (case, spaces, punctuation).
2. The correct option and explanation must be 100% factually accurate.`;

    // 4. Call Groq AI
    const aiResponse = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are an expert AI quiz generator. You output ONLY valid JSON arrays. No explanations, no markdown blocks."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3, // Lower temperature makes JSON formatting much more reliable
        max_tokens: 3000,
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
      return res.status(502).json({ message: "Received empty response from AI engine." });
    }

    // 5. Bulletproof JSON Extraction
    let questions;
    try {
      let cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
      
      const firstBracket = cleaned.indexOf('[');
      const lastBracket = cleaned.lastIndexOf(']');
      
      if (firstBracket !== -1 && lastBracket !== -1) {
        cleaned = cleaned.substring(firstBracket, lastBracket + 1);
      }
      
      questions = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("AI JSON Parse Error. Raw Output:", rawText);
      return res.status(502).json({ message: "The AI failed to format the questions correctly. Please try generating again." });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(502).json({ message: "No questions were generated by the AI." });
    }

    // 6. Format and validate data for the frontend
    const formatted = questions.map((q, i) => {
      const options = Array.isArray(q.options) ? q.options : [];
      let correctAnswer = q.answerText || q.answer || q.correctAnswer || "";

      // Fallback if AI forgets to explicitly name the correct answer
      if (!correctAnswer && options.length > 0) {
        correctAnswer = options[0];
      }

      // Ensure correctAnswer exactly matches one of the options (case-insensitive find, then set to exact case string)
      let matchedOption = options.find(
        (opt) => String(opt).trim().toLowerCase() === String(correctAnswer).trim().toLowerCase()
      );

      // Fallback: search for option containing correctAnswer, or option contained in correctAnswer
      if (!matchedOption && options.length > 0) {
        matchedOption = options.find(
          (opt) =>
            String(opt).trim().toLowerCase().includes(String(correctAnswer).trim().toLowerCase()) ||
            String(correctAnswer).trim().toLowerCase().includes(String(opt).trim().toLowerCase())
        );
      }

      // Final fallback: use the first option if nothing matches
      if (matchedOption) {
        correctAnswer = matchedOption;
      } else if (options.length > 0) {
        correctAnswer = options[0];
      }

      return {
        question: q.question || `Question ${i + 1}`,
        options,
        correctAnswer: String(correctAnswer).trim(),
        explanation: q.explanation || "No explanation provided.",
      };
    });

    res.status(200).json(formatted);

  } catch (error) {
    console.error("AI Route Error:", error.response?.data || error.message);
    res.status(502).json({
      message: "AI service generation failed.",
      error: error.message,
    });
  }
};


/* =======================
   2. SAVE QUIZ RESULT
======================= */
export const saveQuizResult = async (req, res) => {
  try {
    const { topic, difficulty, score, totalQuestions, questions } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    if (!topic || score === undefined || !totalQuestions) {
      return res.status(400).json({ message: "Topic, score, and totalQuestions are required" });
    }

    const result = new QuizResult({
      userId: req.user.id,
      topic,
      difficulty: difficulty || "medium",
      score,
      totalQuestions,
      questions: questions || [],
    });

    await result.save();
    res.status(201).json({ message: "Quiz result saved successfully" });
  } catch (error) {
    console.error("Save Result Error:", error);
    res.status(500).json({ message: "Failed to save quiz result" });
  }
};


/* =======================
   3. QUIZ HISTORY
======================= */
export const getQuizHistory = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ message: "Not authenticated" });

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
    if (!req.user || !req.user.id) return res.status(401).json({ message: "Not authenticated" });

    const quizzes = await QuizResult.find({ userId: req.user.id }).sort({ createdAt: -1 });
    const totalQuizzes = quizzes.length;

    let totalScore = 0;
    let totalPossible = 0;
    
    quizzes.forEach(q => {
      totalScore += q.score || 0;
      totalPossible += q.totalQuestions || 1;
    });

    const avgScore = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;
    const streak = quizzes.length > 0 ? 1 : 0;

    res.json({
      totalQuizzes,
      totalAttempts: totalQuizzes, 
      lastTopic: quizzes.length > 0 ? quizzes[0].topic : "None",
      avgScore,
      streak
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stats matrix" });
  }
};


/* =======================
   5. DELETE ALL HISTORY
======================= */
export const deleteAllHistory = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ message: "Not authenticated" });
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
    res.status(500).json({ message: "Failed to fetch leaderboard matrix" });
  }
};