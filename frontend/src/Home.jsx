import React, { useState, useEffect } from "react";

export default function Home({ onStart }) {
  const [topScores, setTopScores] = useState([]);

  useEffect(() => {
    const scores = JSON.parse(localStorage.getItem("quizScores")) || [];
    const sortedScores = scores.sort((a, b) => b.score - a.score).slice(0, 5);
    setTopScores(sortedScores);
  }, []);

  return (
    <div className="p-10 text-center">
      <h1 className="text-4xl font-black text-zinc-100 mb-4">AI Quiz Generator</h1>
      <p className="text-zinc-500 mb-8">Generate quizzes on any topic with AI</p>
      <button
        onClick={onStart}
        className="px-10 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-500 transition-colors"
      >
        Generate Quiz
      </button>

      {topScores.length > 0 && (
        <div className="mt-12 bg-[#18181f] rounded-2xl border border-zinc-800 p-6 max-w-md mx-auto text-left">
          <h3 className="text-lg font-bold text-zinc-100 mb-4">Recent Scores</h3>
          <ol className="space-y-2">
            {topScores.map((entry, index) => (
              <li key={index} className="text-zinc-400">
                {entry.score}/{entry.total} - {entry.date}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
