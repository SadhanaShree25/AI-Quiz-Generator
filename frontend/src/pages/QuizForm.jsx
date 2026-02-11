import React, { useState } from "react";
import api from "../services/api";
import { ClipLoader } from "react-spinners";

export default function QuizForm({ onQuizGenerated }) {
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    try {
      const count = Number(numQuestions) > 0 ? Number(numQuestions) : 5;

      const res = await api.post(
        "/quiz/generate-quiz",
        {
          topic: topic.trim(),
          numQuestions: count,
          difficulty,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // ✅ BACKEND RETURNS ARRAY DIRECTLY
      onQuizGenerated(res.data);
    } catch (err) {
      console.error("Generation Error:", err);
      alert(
        err.response?.data?.message ||
          "Quiz generation failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-10 rounded-xl shadow-xl mt-10">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h1 className="text-3xl font-bold text-center">
          AI Quiz Generator
        </h1>

        <input
          type="text"
          placeholder="Enter topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full p-4 border rounded"
          required
        />

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="w-full p-4 border rounded"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <input
          type="number"
          placeholder="Number of questions"
          value={numQuestions}
          onChange={(e) => setNumQuestions(e.target.value)}
          min={1}
          max={10}
          className="w-full p-4 border rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-4 rounded font-bold"
        >
          {loading ? (
            <div className="flex justify-center items-center gap-3">
              <ClipLoader size={20} color="#fff" />
              Generating...
            </div>
          ) : (
            "Generate Quiz"
          )}
        </button>
      </form>
    </div>
  );
}
