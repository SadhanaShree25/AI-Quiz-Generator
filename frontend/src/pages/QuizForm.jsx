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

    if (!topic.trim()) {
      alert("Please enter a topic");
      return;
    }

    setLoading(true);

    try {
      const count = numQuestions ? Number(numQuestions) : 5;

      // ✅ THIS LINE WAS MISSING IN YOUR CODE
      const res = await api.post("/quiz/generate-quiz", {
        topic: topic.trim(),
        difficulty,
        numQuestions: count,
      });

      if (Array.isArray(res.data) && res.data.length > 0) {
        onQuizGenerated({ questions: res.data, topic: topic.trim(), difficulty });
      } else {
        alert("No questions received from server.");
      }

    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Quiz generation failed.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-[#18181f] p-12 rounded-3xl border border-zinc-800 mt-10 shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-8">
        <h1 className="text-4xl font-bold text-center text-zinc-100 mb-2">
          AI Quiz Generator
        </h1>
        <p className="text-center text-zinc-400 text-lg mb-6">
          Create personalized quizzes on any topic
        </p>

        <div>
          <label className="block text-sm font-bold text-zinc-400 uppercase tracking-widest mb-3">
            Topic
          </label>
          <input
            type="text"
            placeholder="Enter topic (e.g. JavaScript, World History, Science)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-5 bg-[#1e1e28] border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none text-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-zinc-400 uppercase tracking-widest mb-3">
            Difficulty Level
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full p-5 bg-[#1e1e28] border border-zinc-800 rounded-xl text-zinc-100 focus:border-indigo-500 focus:outline-none text-lg"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-zinc-400 uppercase tracking-widest mb-3">
            Number of Questions
          </label>
          <input
            type="number"
            placeholder="Number of questions (1-20)"
            value={numQuestions}
            onChange={(e) => setNumQuestions(e.target.value)}
            min={1}
            max={20}
            className="w-full p-5 bg-[#1e1e28] border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none text-lg"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-5 rounded-xl font-bold hover:bg-indigo-500 transition-colors disabled:opacity-70 text-lg"
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
