import React, { useState } from "react";
import { FaHome } from "react-icons/fa";
import "./App.css";

export default function Quiz({ quiz, onBack }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // 🔹 Normalize text for accurate comparison
  const normalize = (text = "") =>
    text.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();

  const handleSelect = (qIndex, option) => {
    setAnswers({ ...answers, [qIndex]: option });
  };

  const handleSubmit = () => {
    setSubmitted(true);

    // 🔹 Calculate score using normalized answers
    const score = quiz.reduce(
      (acc, q, i) =>
        normalize(answers[i]) === normalize(q.answerText) ? acc + 1 : acc,
      0
    );

    // 🔹 Save score history in localStorage
    const scoreEntry = {
      date: new Date().toLocaleString(),
      score,
      total: quiz.length,
    };
    const prevScores = JSON.parse(localStorage.getItem("quizScores")) || [];
    localStorage.setItem("quizScores", JSON.stringify([...prevScores, scoreEntry]));
  };

  // 🔹 Real-time score calculation (after submit)
  const score = quiz.reduce(
    (acc, q, i) =>
      normalize(answers[i]) === normalize(q.answerText) ? acc + 1 : acc,
    0
  );

  return (
    <div className="quiz-container">
      {/* 🏠 Home Icon */}
      <FaHome
        className="home-icon"
        onClick={onBack}
        title="Go Home"
      />

      {!submitted ? (
        <>
          {quiz.map((q, i) => (
            <div key={i} className="question">
              <h3>
                {i + 1}. {q.question}
              </h3>
              {q.options.map((opt, idx) => (
                <label key={idx} className="option">
                  <input
                    type="radio"
                    name={`q${i}`}
                    value={opt}
                    checked={answers[i] === opt}
                    onChange={() => handleSelect(i, opt)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}

          <button className="submit-btn" onClick={handleSubmit}>
            Submit
          </button>
        </>
      ) : (
        <div className="results">
          <h2>
            Your Score: {score}/{quiz.length}
          </h2>
          {quiz.map((q, i) => (
            <div key={i} className="question-result">
              <h3>
                {i + 1}. {q.question}
              </h3>
              <p>
                Your answer:{" "}
                <span
                  className={
                    normalize(answers[i]) === normalize(q.answerText)
                      ? "correct"
                      : "wrong"
                  }
                >
                  {answers[i] || "No answer"}
                </span>
              </p>
              <p>
                Correct answer: <span className="correct">{q.answerText}</span>
              </p>
            </div>
          ))}
          <button className="back-btn" onClick={onBack}>
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
}
