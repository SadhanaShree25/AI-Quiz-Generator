import React, { useState, useEffect } from "react";

export default function Home({ onStart }) {
  const [topScores, setTopScores] = useState([]);

  useEffect(() => {
    const scores = JSON.parse(localStorage.getItem("quizScores")) || [];
    const sortedScores = scores.sort((a, b) => b.score - a.score).slice(0, 5);
    setTopScores(sortedScores);
  }, []);

  return (
    <div className="home-container">
      <h1>Welcome to AI Quiz Generator</h1>
      <p>Challenge yourself and see your scores!</p>
      <button className="start-btn" onClick={onStart}>Start Quiz</button>

      <div className="leaderboard">
        <h3>Top Scores</h3>
        {topScores.length === 0 ? (
          <p>No scores yet. Play a quiz!</p>
        ) : (
          <ol>
            {topScores.map((entry, index) => (
              <li key={index}>
                {entry.score}/{entry.total} - {entry.date}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
