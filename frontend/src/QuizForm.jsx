import React, { useState } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";


export default function QuizForm({ onQuizGenerated }) {
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(""); // user input
  const [loading, setLoading] = useState(false);
  const [difficulty, setDifficulty] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);

    try {
      // Convert input to number and default to 5 if empty/invalid
      const count = Number(numQuestions) > 0 ? Number(numQuestions) : 5;

      const res = await axios.post(
        "https://ai-quiz-generator-rutu.vercel.app/api/generate-quiz",
        {
          topic,
          numQuestions: count,
          difficulty,
        }
      );

      // Convert AI response to structured quiz
      const quiz = parseQuizText(res.data.quizText);
      onQuizGenerated(quiz);
    } catch (err) {
      console.error("Failed to generate quiz", err);
      alert("Failed to generate quiz. Please try again.");
    }

    setLoading(false);
  };

  // Parse raw AI text into structured quiz array
  const parseQuizText = (text) => {
    const lines = text.split("\n").filter(Boolean);
    const quiz = [];
    let i = 0;

    while (i < lines.length) {
      if (/^\d+\./.test(lines[i])) {
        const question = lines[i].replace(/^\d+\.\s*/, "");
        const options = [];
        for (let j = 1; j <= 4; j++) {
          if (lines[i + j]) options.push(lines[i + j].trim());
        }
        const ansLine = lines[i + 5] || "";
        const answerMatch = ansLine.match(/([A-D])\)?\s*(.*)/i);
        const answerText = answerMatch
          ? options[answerMatch[1].toUpperCase().charCodeAt(0) - 65]
          : "";
        quiz.push({ question, options, answerText });
        i += 6;
      } else {
        i++;
      }
    }

    return quiz;
  };

  return (
    <form onSubmit={handleSubmit} className="quiz-form">
      <h1>AI QUIZ <br></br> GENERATOR</h1>
      <div className="input-group">
        <input
          type="text"
          placeholder="Enter topic (e.g., Java, Python)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          required
          className="input-field"
        />
      </div>
      <div className="input-group">
  <select
    value={difficulty}
    onChange={(e) => setDifficulty(e.target.value)}
    className="input-field"
  >
     <option value="" disabled>
      Select difficulty level
    </option>
    <option value="easy">Easy</option>
    <option value="medium">Medium</option>
    <option value="hard">Hard</option>
  </select>
</div>


      <div className="input-group">
        <input
          type="number"
          placeholder="Number of questions (default 5)"
          value={numQuestions}
          onChange={(e) => setNumQuestions(e.target.value)}
          min={1}
          max={20}
          className="input-field"
        />
      </div>

      <button type="submit" className="generate-btn" disabled={loading}>
       {loading ? (
    <ClipLoader color="#ffffff" size={25} />   // Spinner
  ) : (
    "Generate Quiz"
  )}
      </button>
    </form>
  );
}
