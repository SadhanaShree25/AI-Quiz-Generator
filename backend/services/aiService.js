import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

export async function generateQuizFromAI(topic, numQuestions, difficulty) {
  const url =
    "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" +
    process.env.GEMINI_API_KEY;

  const prompt = `
Generate a ${difficulty}-level quiz on "${topic}" with ${numQuestions} questions.

Return ONLY valid JSON:
{
  "questions": [
    {
      "question": "text",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A"
    }
  ]
}
`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    }),
  });

  const data = await response.json();

  if (!data.candidates || !data.candidates.length) {
    throw new Error("Gemini API failed to return content");
  }

  const text = data.candidates[0].content.parts[0].text;

  try {
    const json = JSON.parse(
      text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1)
    );
    return json.questions || [];
  } catch (err) {
    throw new Error("AI returned invalid JSON");
  }
}
