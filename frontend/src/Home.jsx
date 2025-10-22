import React from "react";

export default function Home({ onStart }) {
  return (
    <div className="home-container">
      <h1>🧠 AI Quiz Generator</h1>
      <p>
        Welcome! Generate smart AI-powered quizzes on any topic — choose your difficulty,
        number of questions, and test your knowledge instantly.
      </p>

      <button className="start-btn" onClick={onStart}>
        🚀 Start Quiz
      </button>
    </div>
  );
}
