import express from "express";
import OpenAI from "openai";

const router = express.Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post("/generate-quiz", async (req, res) => {
  try {
    const { topic, numQuestions, difficulty } = req.body;

    if (!topic) return res.status(400).json({ error: "Topic is required" });
    if (!numQuestions || numQuestions < 1) return res.status(400).json({ error: "Number of questions is required" });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful quiz generator." },
        {
          role: "user",
          content: `Generate exactly ${numQuestions} quiz questions on "${topic}" with 4 options each (A-D). Format each question like this:

1. Question text
A) option
B) option
C) option
D) option
Correct answer: <full option text>`
        }
      ]
    });

    res.json({ quizText: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate quiz" });
  }
});

export default router;